'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { qualifyProspects } from '../../dashboard/actions'
import { Textarea, Button } from '@heroui/react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type='submit'
      color='primary'
      isLoading={pending}
      variant='shadow'
      className='border-primary-300 shadow-primary/30 w-full border-2 font-medium shadow-lg hover:-translate-y-px sm:w-auto'
    >
      {pending ? 'Qualifying...' : 'Start Qualification'}
    </Button>
  )
}

export default function QualificationForm({ icpId }: { icpId: string }) {
  const initialState = { message: '' }
  const [state, formAction] = useFormState(qualifyProspects, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.message === 'success') {
      toast.success('Qualification started!', {
        description: 'Your new prospects will appear in the list below.',
      })
      formRef.current?.reset()
    } else if (state.message) {
      toast.error('Error', { description: state.message })
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className='space-y-4'>
      <input type='hidden' name='icpId' value={icpId} />
      <Textarea
        name='domains'
        label='Domains'
        placeholder='e.g., acme.com, notion.so, stripe.com'
        isRequired
        minRows={4}
      />
      <SubmitButton />
    </form>
  )
}
