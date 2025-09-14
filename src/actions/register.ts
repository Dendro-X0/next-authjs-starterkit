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

  const { email, username, name, password } = validatedFields.data;

  // Rate limit: max 3 registrations per email per 10 minutes
  const rl = consume({ key: `register:${email}`, windowMs: 10 * 60 * 1000, max: 3 });
  if (!rl.allowed) {
    return { error: 'Too many attempts. Please try again later.' };
  }

  // Check if user already exists
  const emailTaken = await db.user.findUnique({ where: { email } });
  // Check username via raw SQL to avoid type mismatch if client types lag behind
  const usernameRows = await db.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "User" WHERE "username" = ${username} LIMIT 1
  `;
  const usernameTaken = usernameRows.length > 0;
  if (emailTaken) {
    return { error: "Email is already in use" };
  }
  if (usernameTaken) {
    return { error: "Username is already taken" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const created = await db.user.create({
    data: {
      email,
      ...(name ? { name } : {}),
      password: hashedPassword,
    },
    select: { id: true },
  });

  // Set username via raw SQL (post-create) to avoid Prisma type mismatch
  await db.$executeRawUnsafe(
    'UPDATE "User" SET "username" = $1 WHERE "id" = $2',
    username,
    created.id,
  );

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

  return { success: 'Confirmation email sent!' };
}
