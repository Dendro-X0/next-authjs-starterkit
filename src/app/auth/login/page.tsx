import type { Metadata } from "next"
import { Suspense } from 'react';
import { LoginForm } from "@/components/auth/login-form"
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6">
        <LoginForm />
        <ResendVerificationForm />
      </div>
    </Suspense>
  );
}
