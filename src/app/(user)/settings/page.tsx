import type { Metadata } from "next"
import { SettingsPage } from "@/components/settings/settings-page"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
}

export default function Settings() {
  return <SettingsPage />
}
