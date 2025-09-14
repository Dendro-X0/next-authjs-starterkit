# Overview

Next.js Auth Starter Kit is a batteries‑included authentication template for modern web apps. It ships with credentials and OAuth (Google, GitHub), email verification, secure password reset, and optional 2FA — all wired end‑to‑end with Auth.js v5 and Prisma. The UI is mobile‑first and accessible by default using Tailwind CSS and shadcn/ui, so you can focus on product instead of plumbing.

Credentials login supports signing in with either a verified email address or a unique username, paired with your password.

## Tech Stack

- Framework: [Next.js](https://nextjs.org/) 15
- Authentication: [NextAuth.js (Auth.js v5)](https://authjs.dev/)
- ORM: [Prisma](https://www.prisma.io/)
- UI: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- Validation: [Zod](https://zod.dev/)
- File Storage: [Vercel Blob](https://vercel.com/storage/blob)
- Package Manager: [pnpm](https://pnpm.io/)

## Project Structure

```
.
├── src
│   ├── app         # App Router pages and layouts
│   ├── actions     # Server-side actions for auth and user management
│   ├── components  # Reusable UI components
│   ├── lib         # Library functions (db, mail, etc.)
│   └── schemas     # Zod validation schemas
├── prisma          # Prisma schema and migrations
└── ...
```
