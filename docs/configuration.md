# Configuration

Configure the following environment variables in your `.env` file.

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
 - MAIL_PROVIDER values are uppercase: `RESEND` or `SMTP`.
