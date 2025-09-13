# Changelog

All notable changes to this project will be documented in this file.

## 2025-09-12

### Added
- Documentation: Added a "Resend Verification Email" subsection to `docs/getting-started.md` describing a minimal server action approach and where to mount a compact form in the UI.
- Documentation: Clarified email provider configuration and casing (`MAIL_PROVIDER=RESEND | SMTP`) and development guidance for SMTP/MailHog.

### Changed
- Configuration guidance in `docs/configuration.md` expanded with explicit provider expectations and environment notes (e.g., `NEXT_PUBLIC_APP_URL` should match the running origin; recommend setting `EMAIL_FROM` in production).

### Notes
- No code changes were required in this repository for the resend feature; this update focuses on guidance so teams can enable the flow consistently across projects.
- In development, using SMTP (MailHog) is recommended for quick testing. In production, use Resend or a production SMTP provider with a verified sender for `EMAIL_FROM`.
