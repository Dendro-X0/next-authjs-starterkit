"use server";

import * as z from 'zod';
import { db } from '@/lib/db';
import { ResetSchema } from '@/schemas';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mail';
import { consume } from '@/lib/rate-limit';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  // Rate limit: max 3 reset requests per email per 15 minutes
  const rl = consume({ key: `reset:${email}` , windowMs: 15 * 60 * 1000, max: 3 });
  if (!rl.allowed) {
    return { error: 'Too many attempts. Please try again later.' };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: 'Reset email sent!' };
};
