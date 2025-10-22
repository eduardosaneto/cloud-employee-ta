'use client'
import { login, signup } from '@/app/auth/actions'
import {
  Button,
  Card,
  CardBody,
  Input,
  Tab,
  Tabs,
} from '@heroui/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [selectedTab, setSelectedTab] = useState('login')

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2">
      <Card className="max-w-md w-full">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab key="login" title="Sign In">
              <form
                action={login}
                className="flex flex-col gap-4 pt-4"
              >
                <Input
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  isRequired
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  isRequired
                />
                <Button color="primary" type="submit" className="mt-2">
                  Sign In
                </Button>
              </form>
            </Tab>
            <Tab key="signup" title="Sign Up">
              <form
                action={signup}
                className="flex flex-col gap-4 pt-4"
              >
                <Input
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  isRequired
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  isRequired
                />
                <Button variant="bordered" type="submit" className="mt-2">
                  Sign Up
                </Button>
              </form>
            </Tab>
          </Tabs>
          {message && (
            <p className="mt-4 p-4 bg-danger-50 text-danger-600 text-center rounded-lg border border-danger-200">
              {message}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}