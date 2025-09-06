"use server";

import { z } from 'zod';
import { RegisterSchema } from '@/schemas';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import { consume } from '@/lib/rate-limit';

export async function register(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, name, password } = validatedFields.data;

  // Rate limit: max 3 registrations per email per 10 minutes
  const rl = consume({ key: `register:${email}`, windowMs: 10 * 60 * 1000, max: 3 });
  if (!rl.allowed) {
    return { error: 'Too many attempts. Please try again later.' };
  }

  // Check if user already exists
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email is already in use" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

  return { success: 'Confirmation email sent!' };
}
