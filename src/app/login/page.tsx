'use client'
import { login, signup } from '@/app/auth/actions'
import { Button, Card, CardBody, Input, Tab, Tabs } from '@heroui/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [selectedTab, setSelectedTab] = useState('login')

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-2 px-8'>
      <Card className='w-full max-w-md'>
        <CardBody className='p-4'>
          <Tabs
            fullWidth
            size='md'
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key='login' title='Sign In'>
              <form action={login} className='flex flex-col gap-4 pt-4'>
                <Input
                  name='email'
                  label='Email'
                  placeholder='you@example.com'
                  type='email'
                  isRequired
                />
                <Input
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='••••••••'
                  isRequired
                />
                <Button
                  color='primary'
                  type='submit'
                  variant='bordered'
                  className='border-default-400 mt-2 border-2 font-medium shadow-sm hover:-translate-y-px hover:shadow-md'
                >
                  Sign In
                </Button>
              </form>
            </Tab>
            <Tab key='signup' title='Sign Up'>
              <form action={signup} className='flex flex-col gap-4 pt-4'>
                <Input
                  name='email'
                  label='Email'
                  placeholder='you@example.com'
                  type='email'
                  isRequired
                />
                <Input
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='••••••••'
                  isRequired
                />
                <Button
                  color='primary'
                  variant='bordered'
                  type='submit'
                  className='border-default-400 mt-2 border-2 font-medium shadow-sm hover:-translate-y-px hover:shadow-md'
                >
                  Sign Up
                </Button>
              </form>
            </Tab>
          </Tabs>
          {message && (
            <p className='bg-danger-50 text-danger-600 border-danger-200 mt-4 rounded-lg border p-4 text-center'>
              {message}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
