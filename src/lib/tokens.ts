import "server-only";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { getTwoFactorTokenByEmail } from '@/actions/2fa';

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { identifier: email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { 
        identifier_token: {
          identifier: existingToken.identifier,
          token: existingToken.token,
        }
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  const existingToken = await db.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
