"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to The AI Qualifier</h1>
      <p className="text-xl text-default-700 mb-8">
        Generate your Ideal Customer Profile and qualify prospects instantly.
      </p>
      <Button as={Link} href="/login" color="primary" size="lg">
        Get Started
      </Button>
    </div>
  );
}
