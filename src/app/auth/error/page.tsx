import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "Authentication error page",
}

export default function AuthErrorPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-muted-foreground">There was an error during the authentication process.</p>
      </div>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error occurred during authentication. Please try again.</AlertDescription>
      </Alert>

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  )
}
