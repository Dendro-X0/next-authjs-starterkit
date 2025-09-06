"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Settings } from "lucide-react"
import { ModeToggle } from "./theme/mode-toggle"

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith("/auth")
  const isProfilePage = pathname.startsWith("/profile") || pathname.startsWith("/settings")

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-semibold">
            Auth Boilerplate
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {!isAuthPage && !isProfilePage && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile" prefetch={false}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/settings" prefetch={false}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
