'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'
import * as cheerio from 'cheerio'
import { revalidatePath } from 'next/cache'

interface GeneratedIcp {
  title: string
  description: string
  buyerPersonas: {
    role: string
    department: string
    pain_points: string[]
  }[]
  company_size: string[]
  revenue_range: string[]
  industries: string[]
  geographic_regions: string[]
  funding_stages: string[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function completeOnboarding(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login?message=User not authenticated')
  }

  const domain = formData.get('domain') as string
  if (!domain) {
    return { message: 'Domain is required' }
  }
  try {
    const url = `https://www.${domain.replace(/^https?:\/\/(www\.)?/, '')}`
    let scrapedText = ''

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch domain. Status: ${response.status}`)
      }

      const html = await response.text()
      const $ = cheerio.load(html)
      scrapedText = $('h1, h2, h3, p, title, meta[name="description"]')
        .text()
        .replace(/\s\s+/g, ' ')
        .trim()
        .slice(0, 4000)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (fetchError: any) {
      console.error('Scraping error:', fetchError.message)
      if (fetchError.name === 'AbortError') {
        return {
          message: `Could not analyze domain: The request timed out after 15 seconds.`,
        }
      }
      return { message: `Could not analyze domain: ${fetchError.message}` }
    }

    if (!scrapedText) {
      return { message: 'Could not extract any text from the domain.' }
    }

    const summaryCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analyst.',
        },
        {
          role: 'user',
          content: `Based on the following website content, please provide a concise one-paragraph summary of what this company does and who its customers are.
          \n\nWebsite Content:\n"""\n${scrapedText}\n"""`,
        },
      ],
      temperature: 0.2,
    })
    const summary = summaryCompletion.choices[0].message.content

    if (!summary) {
      return { message: 'AI failed to generate a summary.' }
    }

    const icpSchema = {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        buyerPersonas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string' },
              department: { type: 'string' },
              pain_points: { type: 'array', items: { type: 'string' } },
            },
            required: ['role', 'department', 'pain_points'],
          },
        },
        company_size: { type: 'array', items: { type: 'string' } },
        revenue_range: { type: 'array', items: { type: 'string' } },
        industries: { type: 'array', items: { type: 'string' } },
        geographic_regions: { type: 'array', items: { type: 'string' } },
        funding_stages: { type: 'array', items: { type: 'string' } },
      },
      required: [
        'title',
        'description',
        'buyerPersonas',
        'company_size',
        'revenue_range',
        'industries',
        'geographic_regions',
        'funding_stages',
      ],
    }

    const icpCompletion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert B2B marketing strategist. Based on the company summary, generate a detailed Ideal Customer Profile (ICP). Respond *only* with a JSON object matching this schema: ${JSON.stringify(
            icpSchema
          )}`,
        },
        {
          role: 'user',
          content: `Company Summary: "${summary}"`,
        },
      ],
    })

    const icpData = JSON.parse(
      icpCompletion.choices[0].message.content || '{}'
    ) as GeneratedIcp

    const cleanDomain = domain.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        domain: cleanDomain,
        summary: summary,
        name: cleanDomain.split('.')[0],
      })
      .select('id')
      .single()

    if (companyError) throw companyError

    const { data: icp, error: icpError } = await supabase
      .from('icps')
      .insert({
        company_id: company.id,
        user_id: user.id,
        title: icpData.title,
        description: icpData.description,
        company_size: icpData.company_size,
        revenue_range: icpData.revenue_range,
        industries: icpData.industries,
        geographic_regions: icpData.geographic_regions,
        funding_stages: icpData.funding_stages,
      })
      .select('id')
      .single()

    if (icpError) throw icpError

    const personaInserts = icpData.buyerPersonas.map((persona) => ({
      icp_id: icp.id,
      user_id: user.id,
      role: persona.role,
      department: persona.department,
      pain_points: persona.pain_points,
    }))

    const { error: personasError } = await supabase
      .from('buyer_personas')
      .insert(personaInserts)

    if (personasError) throw personasError

    revalidatePath('/dashboard', 'layout')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Onboarding failed:', error)
    return {
      message: `Onboarding failed: ${error.message || 'Unknown error'}`,
    }
  }
  redirect('/dashboard')
}
