'use client'

import { useRouter } from 'next/navigation'
import { HeroUIProvider } from '@heroui/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
}
