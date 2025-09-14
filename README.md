# Next.js Auth Starter Kit

![CI](https://github.com/Dendro-X0/next-authjs-starter/actions/workflows/ci.yml/badge.svg)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dendro-X0/next-authjs-starter&project-name=next-authjs-starter&repository-name=next-authjs-starter&env=DATABASE_URL,AUTH_SECRET,NEXT_PUBLIC_APP_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,RESEND_API_KEY,EMAIL_FROM,MAIL_PROVIDER,SMTP_HOST,SMTP_PORT,SMTP_SECURE,SMTP_USER,SMTP_PASS,TWO_FACTOR_ISSUER)
 
## Introduction

Next.js Auth Starter Kit is a batteries‑included authentication template for modern web apps. It ships with credentials and OAuth (Google, GitHub), email verification, secure password reset, and optional 2FA — all wired end‑to‑end with Auth.js v5 and Prisma. The UI is mobile‑first and accessible by default using Tailwind CSS and shadcn/ui, so you can focus on product instead of plumbing.

## ✨ Features

- **Credentials-Based Authentication**: Secure login with email or username + password.
- **Social Logins**: Integrated with Google and GitHub for easy sign-in.
- **Email Verification**: Ensure users have a valid email address.
- **Password Reset**: Secure flow for users to reset their password.
- **Two-Factor Authentication (2FA)**: Add an extra layer of security with TOTP.
- **User Profile Management**: Users can view and update their personal information.
- **Avatar Uploads**: Local file uploads for profile pictures, powered by Vercel Blob.
- **Account Settings**: Manage security, notifications, and privacy settings.
- **Secure Server Actions**: All authentication and user management logic is handled securely on the server.
- **Validation**: End-to-end type-safe validation with Zod.
 - **Magic Links**: Passwordless sign-in via verified email links.
 - **Mobile-First & A11y-Ready UI**: Landmarks, skip links, live regions, and keyboard-accessible components out of the box.

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

Open http://localhost:3000 in your browser. For full setup, see `docs/getting-started.md` and `docs/configuration.md`.
 
Note: A unique optional `username` field was added to `prisma/schema.prisma` to support username login. Ensure you run `pnpm prisma migrate dev` after pulling changes to update your database.

## Documentation

Topic-focused guides live in `docs/`:

- Overview: [docs/overview.md](docs/overview.md)
- Getting Started: [docs/getting-started.md](docs/getting-started.md)
- Configuration (env vars): [docs/configuration.md](docs/configuration.md)
- Mobile & Accessibility: [docs/a11y-mobile.md](docs/a11y-mobile.md)
- Deployment: [docs/deployment.md](docs/deployment.md)
- Troubleshooting: [docs/troubleshooting.md](docs/troubleshooting.md)
- Acknowledgments: [docs/acknowledgments.md](docs/acknowledgments.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
