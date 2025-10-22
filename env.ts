import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(1),
    // NextAuth v5 server URL and proxy trust settings
    // If deploying behind a proxy (e.g., Netlify, Vercel, Cloudflare), set one of these:
    // - AUTH_URL / NEXTAUTH_URL to your public base URL
    // - AUTH_TRUST_HOST=true to trust the forwarded host header
    AUTH_URL: z.string().url().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH_TRUST_HOST: z
      .preprocess((val) => {
        if (typeof val === "boolean") return val;
        if (typeof val === "number") return val !== 0;
        if (typeof val === "string") {
          const v = val.trim().toLowerCase();
          if (["1", "true", "yes", "on"].includes(v)) return true;
          if (["0", "false", "no", "off", ""].includes(v)) return false;
        }
        return val;
      }, z.boolean())
      .optional(),
    RESEND_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    TWO_FACTOR_ISSUER: z.string().optional(),
    EMAIL_FROM: z.string().min(1).optional(),
    MAIL_PROVIDER: z.enum(["RESEND", "SMTP"]).default("RESEND"),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_SECURE: z
      .preprocess((val) => {
        if (typeof val === "boolean") return val;
        if (typeof val === "number") return val !== 0;
        if (typeof val === "string") {
          const v = val.trim().toLowerCase();
          if (["1", "true", "yes", "on"].includes(v)) return true;
          if (["0", "false", "no", "off", ""].includes(v)) return false;
        }
        return val;
      }, z.boolean())
      .optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  // For Next.js >= 13.4.4, you need to destructure the process.env variables manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    TWO_FACTOR_ISSUER: process.env.TWO_FACTOR_ISSUER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    MAIL_PROVIDER: process.env.MAIL_PROVIDER,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // You can't destructure `process.env` as a regular object in the Next.js edge runtimes (e.g. middlewares)
  // So you have to pass it manually
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  // },
});

