'use client'

import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Toaster } from 'sonner'
import { Button } from '@heroui/react'
import { signOut } from '../../auth/actions'
import { Providers } from '../../providers'

function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type='submit' variant='ghost' color='default'>
        Sign Out
      </Button>
    </form>
  )
}

export function Layout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User | null
}) {
  return (
    <Providers>
      <nav className='w-full flex justify-center border-b border-divider h-16'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
          <Link href='/' className='text-lg font-bold'>
            The AI Qualifier
          </Link>
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-default-600'>{user.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <Button as={Link} href='/login' color='primary' variant='light'>
                Login
              </Button>
              <Button as={Link} href='/login' color='primary' variant='light'>
                Signup
              </Button>
            </div>
          )}
        </div>
      </nav>

      <main className='mx-auto w-full max-w-4xl p-3 py-6'>{children}</main>
      <Toaster position='top-right' theme='dark' />
    </Providers>
  )
}
