'use client'

import Link from 'next/link'
import { Button } from '@heroui/react'

export default function Home() {
  return (
    <div className='mt-20 flex flex-col items-center justify-center text-center'>
      <h1 className='mb-4 text-4xl font-bold'>Welcome to The AI Qualifier</h1>
      <p className='text-default-700 mb-8 text-xl'>
        Generate your Ideal Customer Profile and qualify prospects instantly.
      </p>
      <Button as={Link} href='/login' color='primary' size='lg'>
        Get Started
      </Button>
    </div>
  )
}
