import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import { Layout as ClientLayout } from './components/layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The AI Qualifier',
  description: 'Generate ICPs and qualify prospects.',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang='en' className='dark'>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ClientLayout user={user}>{children}</ClientLayout>
      </body>
    </html>
  )
}
