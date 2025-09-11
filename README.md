# Next.js Auth Starter Kit

![CI](https://github.com/Dendro-X0/next-authjs-starter/actions/workflows/ci.yml/badge.svg)

Next.js Auth Starter Kit is a batteries‑included authentication template for modern web apps. It ships with credentials and OAuth (Google, GitHub), email verification, secure password reset, and optional 2FA — all wired end‑to‑end with Auth.js v5 and Prisma. The UI is mobile‑first and accessible by default using Tailwind CSS and shadcn/ui, so you can focus on product instead of plumbing.

## ✨ Features

- **Credentials-Based Authentication**: Secure email and password login.
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

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15
- **Authentication**: [NextAuth.js (Auth.js v5)](https://authjs.dev/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/)
- **File Storage**: [Vercel Blob](https://vercel.com/storage/blob)
- **Package Manager**: [pnpm](https://pnpm.io/)

## ♿ Mobile & Accessibility (A11y)

This template includes sensible defaults to ensure a great experience on mobile devices and for keyboard and screen‑reader users.

- **Skip to content**: A visually hidden link is injected in `src/app/layout.tsx`. Give each page or segment layout a unique main landmark, e.g. `<main id="main-content" tabIndex={-1}>…</main>`, to enable fast navigation.
- **Landmarks & nav**: `src/components/header.tsx` wraps top‑level actions in a `<nav aria-label="Primary">` and sets `aria-current="page"` on active links.
- **Forms**:
  - `src/components/ui/form.tsx` associates labels, controls, and messages via `aria-*` and `id` attributes automatically.
  - `FormError` and `FormSuccess` use live regions (`role="alert"` / `role="status"`) for timely announcements.
  - Inputs use helpful `autoComplete` and `inputMode` hints (e.g. `email`, `current-password`, `new-password`, `one-time-code`, `numeric`).
- **Focus visibility**: All interactive components include strong `:focus-visible` styles using Tailwind/shadcn tokens.
- **Keyboard access**: Custom click targets like the avatar uploader expose `role="button"`, proper `tabIndex`, labels, and Space/Enter activation.
- **Mobile viewport**: `export const viewport` is declared in `src/app/layout.tsx` for correct device scaling.

When adding new pages or forms:

1. Wrap your main content with a unique main landmark and ensure there’s a skip target.
2. Use the `ui/form` primitives so labels and errors are announced correctly.
3. Add `autoComplete` and `inputMode` on inputs to improve mobile keyboards and autofill.
4. Prefer buttons over links for actions; reserve links for navigation.
5. Keep focus states obvious and consistent with existing components.

## 🏁 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [pnpm](https://pnpm.io/installation)

### 1. Clone the Repository

```bash
git clone https://github.com/Dendro-X0/next-authjs-starter.git
cd next-authjs-starter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment file and fill in the required variables.

```bash
cp .env.example .env
```

You will need to provide credentials for your database, authentication providers (Google, GitHub), email service (e.g., Resend), and Vercel Blob.

### 4. Set Up the Database

Push the Prisma schema to your database and generate the Prisma Client.

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

For production/CI, use:

```bash
pnpm prisma migrate deploy
```

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

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

## 🔧 Troubleshooting

### Common Issues

#### 1. **pnpm Virtual Store Issues**
If you encounter virtual store location conflicts:
```bash
pnpm config set virtual-store-dir "node_modules/.pnpm"
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 2. **Missing Shadcn UI Dependencies**
The UI components require additional Radix UI dependencies. Install them as needed:
```bash
pnpm add @radix-ui/react-accordion @radix-ui/react-aspect-ratio @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-hover-card @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

#### 3. **TypeScript Path Resolution**
If you encounter path alias issues when running `tsc` directly, use Next.js build instead:
```bash
pnpm build
```

#### 4. **Prisma Client Generation**
If you get Prisma client errors:
```bash
pnpm prisma generate
```

### Environment Variables

Make sure all required environment variables are set in your `.env` file:

```env
# Database
DATABASE_URL="your-database-url"

# Authentication
AUTH_SECRET="your-auth-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Service
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@example.com" # optional in development; defaults to onboarding@resend.dev if omitted

# Two-Factor Authentication
TWO_FACTOR_ISSUER="AuthKit" # optional in development
```

Notes
- EMAIL_FROM and TWO_FACTOR_ISSUER are optional for local development to simplify setup. In production, set both explicitly.
- When EMAIL_FROM is not provided, the app uses the placeholder `onboarding@resend.dev`. Configure a verified sender in Resend and set EMAIL_FROM for production.
- To use SMTP locally (e.g., MailHog), set `MAIL_PROVIDER=SMTP` and configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`.
- Ensure `NEXT_PUBLIC_APP_URL` matches your deployment URL (HTTPS in production).

## 🚀 Deployment

### Vercel (Recommended)

Deploy with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dendro-X0/next-authjs-starter&project-name=next-authjs-starter&repository-name=next-authjs-starter&env=DATABASE_URL,AUTH_SECRET,NEXT_PUBLIC_APP_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,RESEND_API_KEY,EMAIL_FROM,MAIL_PROVIDER,SMTP_HOST,SMTP_PORT,SMTP_SECURE,SMTP_USER,SMTP_PASS,TWO_FACTOR_ISSUER)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NextAuth.js](https://authjs.dev/) for the authentication framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Prisma](https://www.prisma.io/) for the database toolkit
