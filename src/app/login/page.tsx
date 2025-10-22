"use client";
import { login, signup } from "@/app/auth/actions";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { useSearchParams, usePathname } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="flex-1 flex flex-col w-full px-8 justify-center items-center gap-2">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col items-center pb-2">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-default-500">Sign in or create an account</p>
        </CardHeader>
        <CardBody>
          <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
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

            <div className="flex flex-col gap-2 mt-2">
              <Button formAction={login} color="primary" type="submit">
                Sign In
              </Button>
              <Button formAction={signup} variant="bordered" type="submit">
                Sign Up
              </Button>
            </div>

            {message && (
              <p className="mt-4 p-4 bg-danger-50 text-danger-600 text-center rounded-lg border border-danger-200">
                {message}
              </p>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
