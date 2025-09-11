import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Lock, Mail, Users, ShieldCheck, KeyRound, Settings } from "lucide-react";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container max-w-4xl py-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Next.js Auth Starter Kit
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            A production-ready authentication boilerplate built with Next.js 15,
            NextAuth.js v5, Prisma, and Shadcn UI. Get started with secure user
            authentication in minutes.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/Dendro-X0/next-authjs-starter" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2" aria-label="Open the project on GitHub (opens in a new tab)">
              <Github className="h-5 w-5" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email & Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Secure email and password authentication with password hashing and validation.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Social Logins</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Integrate popular social login providers like Google and GitHub with ease.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Verification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verify user emails to ensure a valid user base and enable password resets.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Password Reset</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Allow users to securely reset their passwords if they forget them.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Two-Factor Auth</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Add an extra layer of security with two-factor authentication using authenticator apps.
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>And More...</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Includes user profiles, settings management, and a clean, modern UI.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
