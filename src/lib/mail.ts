import "server-only";
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { env } from '~/env';

// Compute a robust domain for email links.
// Prefer explicit NEXT_PUBLIC_APP_URL; fall back to Vercel-provided host; finally localhost.
const vercelHost: string | undefined = process.env.VERCEL_URL;
const defaultDomain: string = vercelHost ? `https://${vercelHost}` : 'http://localhost:3000';
const domain: string = env.NEXT_PUBLIC_APP_URL ?? defaultDomain;
const provider: "RESEND" | "SMTP" = env.MAIL_PROVIDER;
const fromAddress: string = env.EMAIL_FROM ?? 'onboarding@resend.dev';
const secure: boolean = env.SMTP_SECURE ?? false;

// Initialize transports lazily to avoid accessing providers we don't use.
const resend = provider === "RESEND" && env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

const smtpTransporter = provider === "SMTP"
  ? nodemailer.createTransport({
      host: env.SMTP_HOST ?? 'localhost',
      port: env.SMTP_PORT ?? 1025,
      secure,
      auth: env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
      // Improve MailHog/local SMTP compatibility by skipping TLS when not secure
      ignoreTLS: secure ? undefined : true,
      tls: secure ? undefined : { rejectUnauthorized: false },
    })
  : null;

/**
 * Send an email verification link to the provided address.
 * @param email Recipient email
 * @param token Verification token appended to `${domain}/auth/new-verification`
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const confirmLink: string = `${domain}/auth/new-verification?token=${token}`;

  if (provider === "SMTP" && smtpTransporter) {
    await smtpTransporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
    return;
  }

  if (resend) {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
    });
  }
};

/**
 * Send a password reset link to the provided address.
 * @param email Recipient email
 * @param token Reset token appended to `${domain}/auth/reset-password`
 */
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetLink: string = `${domain}/auth/reset-password?token=${token}`;

  if (provider === "SMTP" && smtpTransporter) {
    await smtpTransporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
    return;
  }

  if (resend) {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  }
};

/**
 * Send a 2FA one-time token via email.
 * @param email Recipient email
 * @param token One-time 2FA code
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string): Promise<void> => {
  if (provider === "SMTP" && smtpTransporter) {
    await smtpTransporter.sendMail({
      from: fromAddress,
      to: email,
      subject: '2FA Code',
      html: `<p>Your 2FA code is: ${token}</p>`,
    });
    return;
  }

  if (resend) {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: '2FA Code',
      html: `<p>Your 2FA code is: ${token}</p>`,
    });
  }
};
