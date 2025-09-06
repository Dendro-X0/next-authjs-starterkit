import type { Metadata } from "next"
import { ProfilePage } from "@/components/profile/profile-page"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile information",
}

export default function Profile() {
  return <ProfilePage />
}
