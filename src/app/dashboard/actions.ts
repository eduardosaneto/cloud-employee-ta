'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import { revalidatePath } from 'next/cache'
import { Database } from '@/lib/supabase/database.types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type Icp = Database['public']['Tables']['icps']['Row'] & {
  buyer_personas: Database['public']['Tables']['buyer_personas']['Row'][]
}

async function processQualification(
  prospect: Database['public']['Tables']['prospects']['Row'],
  qualification: Database['public']['Tables']['qualifications']['Row'],
  icp: Icp
) {
  const supabase = await createClient()
  const { domain } = prospect
  const url = `https://${domain.replace(/^https?:\/\//, '')}`

  try {
    let scrapedText = ''
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (!response.ok)
        throw new Error(`Failed to fetch. Status: ${response.status}`)
      const html = await response.text()
      const $ = cheerio.load(html)
      scrapedText = $('h1, h2, h3, p, title, meta[name="description"]')
        .text()
        .replace(/\s\s+/g, ' ')
        .trim()
        .slice(0, 4000)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (scrapeError: any) {
      throw new Error(`Scraping failed: ${scrapeError.message}`)
    }

    if (!scrapedText) {
      throw new Error('Could not extract text from domain.')
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert B2B sales analyst. Your job is to qualify a prospect company against an Ideal Customer Profile (ICP).
          Respond *only* with a JSON object in this exact format: { "score": number, "reasoning": string }`,
        },
        {
          role: 'user',
          content: `Here is my ICP:
          ---
          ${JSON.stringify(icp)}
          ---
          Here is the scraped text from the prospect's website (${domain}):
          ---
          ${scrapedText}
          ---
          Please qualify this prospect. Provide a score from 0 (terrible fit) to 100 (perfect fit) and a concise, 2-3 sentence reasoning.`,
        },
      ],
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    const { score, reasoning } = result

    if (typeof score !== 'number' || typeof reasoning !== 'string') {
      throw new Error('AI returned an invalid JSON format.')
    }

    await supabase
      .from('qualifications')
      .update({
        status: 'completed',
        score: score,
        reasoning: reasoning,
        generated_at: new Date().toISOString(),
      })
      .eq('id', qualification.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to process ${domain}:`, error.message)
    await supabase
      .from('qualifications')
      .update({
        status: 'failed',
        reasoning: error.message,
        generated_at: new Date().toISOString(),
      })
      .eq('id', qualification.id)
  }
  revalidatePath('/dashboard')
}

export async function qualifyProspects(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
): Promise<{ message: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const domainsRaw = formData.get('domains') as string
  const icpId = formData.get('icpId') as string
  if (!domainsRaw || !icpId) return { message: 'Missing form data.' }

  const { data: icpData } = await supabase
    .from('icps')
    .select('*, buyer_personas (*)')
    .eq('id', icpId)
    .single()

  if (!icpData) return { message: 'ICP not found.' }
  const icp = icpData as Icp

  const domains = [
    ...new Set(
      domainsRaw
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean)
    ),
  ]

  const newProspects = domains.map((domain) => ({
    user_id: user.id,
    domain: domain,
  }))

  const { data: prospects, error: prospectError } = await supabase
    .from('prospects')
    .upsert(newProspects, { onConflict: 'user_id, domain' })
    .select()

  if (prospectError) return { message: `DB error: ${prospectError.message}` }
  if (!prospects) return { message: 'Could not create prospects.' }

  const newQualifications = prospects.map((prospect) => ({
    prospect_id: prospect.id,
    icp_id: icp.id,
    user_id: user.id,
    status: 'pending',
  }))

  const { data: qualifications, error: qualError } = await supabase
    .from('qualifications')
    .insert(newQualifications)
    .select()

  if (qualError) return { message: `DB error: ${qualError.message}` }
  if (!qualifications) return { message: 'Could not create qualifications.' }

  qualifications.forEach((qual, index) => {
    const prospect = prospects[index]
    processQualification(prospect, qual, icp)
  })

  revalidatePath('/dashboard')
  return { message: 'success' }
}
