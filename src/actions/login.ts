"use server";

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { LoginSchema } from '@/schemas';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getTwoFactorTokenByEmail } from '@/actions/2fa';
import { sendTwoFactorTokenEmail } from '@/lib/mail';
import { generateTwoFactorToken } from '@/lib/tokens';
import { getTwoFactorConfirmationByUserId } from '@/actions/2fa';
import { consume } from '@/lib/rate-limit';

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { identifier, password, code } = validatedFields.data;

  type UserRow = {
    id: string;
    email: string | null;
    password: string | null;
    emailVerified: Date | null;
    isTwoFactorEnabled: boolean;
  };
  const rows = await db.$queryRaw<UserRow[]>`
    SELECT "id", "email", "password", "emailVerified", "isTwoFactorEnabled"
    FROM "User"
    WHERE "email" = ${identifier} OR "username" = ${identifier}
    LIMIT 1
  `;
  const existingUser = rows[0];

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Invalid credentials!' };
  }

  if (!existingUser.emailVerified) {
    // Rate limit verification resend to prevent abuse
    const rl = consume({ key: `verify-resend:${existingUser.email}`, windowMs: 10 * 60 * 1000, max: 3 });
    if (!rl.allowed) {
      return { error: 'Too many attempts. Please try again later.' };
    }
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return { success: 'Confirmation email sent!' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: 'Invalid code!' };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: 'Code expired!' };
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      // Rate limit 2FA code emails per email address
      const rl2 = consume({ key: `2fa:${existingUser.email}`, windowMs: 15 * 60 * 1000, max: 5 });
      if (!rl2.allowed) {
        return { error: 'Too many attempts. Please try again later.' };
      }
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      identifier,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }

    throw error;
  }
}
