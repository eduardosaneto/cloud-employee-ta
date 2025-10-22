'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { completeOnboarding } from './actions'
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      color='primary'
      isLoading={pending}
      variant='shadow'
      className='border-primary-300 shadow-primary/30 mt-4 border-2 font-medium shadow-lg hover:-translate-y-px'
    >
      {pending ? 'Generating ICP...' : 'Generate My ICP'}
    </Button>
  )
}

export default function OnboardingPage() {
  const initialState = { message: '' }
  const [state, formAction] = useFormState(completeOnboarding, initialState)

  return (
    <div className='flex flex-1 flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md p-4'>
        <CardHeader className='text-center flex flex-col'>
          <h1 className='mb-2 text-3xl font-bold'>
            Welcome to The AI Qualifier
          </h1>
          <p className='text-default-600'>
            Let&apos;s generate your Ideal Customer Profile (ICP).
          </p>
        </CardHeader>
        <CardBody>
          <form action={formAction} className='flex flex-col'>
            <Input
              id='domain'
              name='domain'
              label='Your company domain'
              placeholder='e.g., yourcompany.com'
              isRequired
              description="We'll analyze your site to understand what you do."
            />
            <SubmitButton />
            {state?.message && (
              <p className='text-danger-600 bg-danger-50 border-danger-200 mt-4 rounded-lg border p-3 text-center'>
                {state.message}
              </p>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
