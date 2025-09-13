"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { consume } from "@/lib/rate-limit";

export type ResendVerificationState = Readonly<{
  success?: string;
  error?: string;
}>;

const EmailSchema = z.object({
  email: z.string().email(),
});

/**
 * Resend a verification email for an unverified user.
 */
export async function resendVerification(
  _prev: ResendVerificationState,
  formData: FormData,
): Promise<ResendVerificationState> {
  const parsed = EmailSchema.safeParse({ email: String(formData.get("resend_email") ?? "") });
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }
  const { email } = parsed.data;

  // Rate limit: max 5 requests per 10 minutes per email
  const rl = consume({ key: `resend-verify:${email}`, windowMs: 10 * 60 * 1000, max: 5 });
  if (!rl.allowed) {
    return { error: "Too many requests. Please try again later." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // Avoid user enumeration; return a neutral message
    return { success: "If an account exists, a verification email has been sent." };
  }
  if (user.emailVerified) {
    return { success: "This email is already verified. You can sign in." };
  }

  const token = await generateVerificationToken(email);
  await sendVerificationEmail(token.identifier, token.token);
  return { success: "Verification email sent. Please check your inbox (and spam folder)." };
}
