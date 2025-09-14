# Changelog

All notable changes to this project will be documented in this file.

## 2025-09-14

### Added
- Username support in the data model: added optional unique `username` field to `prisma/schema.prisma` `User` model.
- Credentials login now supports signing in with either `email` or `username` plus password.
- Profile page now allows users to edit their `username` with uniqueness validation.

### Changed
- `LoginSchema` now uses `identifier` (email or username) instead of `email`.
- `RegisterSchema` includes `username`. `name` in registration is now optional and can be set later in Profile.
- `ProfileSchema` now includes `username` validation.
- NextAuth Credentials `authorize()` updated to look up users by `email` or `username`.
- `src/actions/login.ts` and UI `login-form.tsx` updated for `identifier`.
- `src/actions/register.ts` updated to persist `username` and only persist `name` if provided.
- Profile UI updated to include `username` field; signup form no longer asks for `name`.
- Documentation updated in `README.md` and `docs/overview.md` to reflect username/email login and migration note.

### Migration
- Run the following after pulling changes to update your database and regenerate types:
  - `pnpm prisma migrate dev -n "add-username-to-user"`
  - `pnpm prisma generate`
- Temporary `// @ts-expect-error` comments are present where `username` is referenced in code until Prisma Client types are regenerated. They can be removed after the migration/generate steps.

### Notes
- Email verification and 2FA flows remain email-based; `username` is for login/profile convenience.

## 2025-09-12

### Added
- Documentation: Added a "Resend Verification Email" subsection to `docs/getting-started.md` describing a minimal server action approach and where to mount a compact form in the UI.
- Documentation: Clarified email provider configuration and casing (`MAIL_PROVIDER=RESEND | SMTP`) and development guidance for SMTP/MailHog.

### Changed
- Configuration guidance in `docs/configuration.md` expanded with explicit provider expectations and environment notes (e.g., `NEXT_PUBLIC_APP_URL` should match the running origin; recommend setting `EMAIL_FROM` in production).

### Notes
- No code changes were required in this repository for the resend feature; this update focuses on guidance so teams can enable the flow consistently across projects.
- In development, using SMTP (MailHog) is recommended for quick testing. In production, use Resend or a production SMTP provider with a verified sender for `EMAIL_FROM`.
