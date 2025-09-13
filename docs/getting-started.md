# Getting Started

Follow these steps to get the project up and running on your local machine.

## Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [pnpm](https://pnpm.io/installation)

## 1. Clone the Repository

```bash
git clone https://github.com/Dendro-X0/next-authjs-starter.git
cd next-authjs-starter
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Set Up Environment Variables

Copy the example environment file and fill in the required variables.

```bash
cp .env.example .env
```

You will need to provide credentials for your database, authentication providers (Google, GitHub), email service (e.g., Resend), and Vercel Blob.

## 4. Set Up the Database

Push the Prisma schema to your database and generate the Prisma Client.

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

For production/CI, use:

```bash
pnpm prisma migrate deploy
```

## 5. Run the Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser to see the application.

## Resend Verification Email

If a user did not receive the initial verification email or it expired, you can implement a small server action to resend it using the existing utilities in this starter kit.

High‑level approach:

- Generate a fresh token with `generateVerificationToken(email)` from `src/lib/tokens.ts`.
- Send the email with `sendVerificationEmail(email, token)` from `src/lib/mail.ts`.
- Mount a compact form (e.g., on the login page) that posts an email address to the server action.

Example (server action):

```ts
"use server";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function resendVerification(_: unknown, formData: FormData) {
  const email = String(formData.get("resend_email") ?? "").trim();
  if (!email) return { error: "Please enter an email." } as const;
  const token = await generateVerificationToken(email);
  await sendVerificationEmail(token.identifier, token.token);
  return { success: "Verification email sent." } as const;
}
```

Tip: In development, you can use SMTP with MailHog. See `docs/configuration.md` for `MAIL_PROVIDER` and SMTP settings.
