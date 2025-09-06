import type { Metadata } from "next"
import { TwoFactorVerify } from "@/components/auth/two-factor-verify"

export const metadata: Metadata = {
  title: "Two-Factor Authentication",
  description: "Enter your two-factor authentication code",
}

export default function TwoFactorVerifyPage() {
  return <TwoFactorVerify />
}
