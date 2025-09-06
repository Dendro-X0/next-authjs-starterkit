import type { Metadata } from "next"
import { TwoFactorRecovery } from "@/components/auth/two-factor-recovery"

export const metadata: Metadata = {
  title: "Account Recovery",
  description: "Recover your account using backup codes",
}

export default function TwoFactorRecoveryPage() {
  return <TwoFactorRecovery />
}
