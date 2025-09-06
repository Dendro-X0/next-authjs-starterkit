"use server";

import { authenticator } from "otplib";
import QRCode from "qrcode";
import { z } from "zod";

import { auth } from "../../auth";
import { db } from "@/lib/db";
import { TwoFactorVerificationSchema } from "@/schemas";

// TOTP tolerance: accept one step before and after to handle clock skew
authenticator.options = { ...authenticator.options, window: [1, 1] };

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};

export const generateTwoFactorSecret = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to set up 2FA." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.email) {
    return { error: "User not found or email missing." };
  }

  // If 2FA is already enabled, do not regenerate a new secret
  if (user.isTwoFactorEnabled) {
    return { error: "Two-factor authentication is already enabled." };
  }

  // Idempotent behavior:
  // - If a secret already exists (from a prior generation) and 2FA is not enabled yet,
  //   reuse it to avoid mismatches caused by multiple generate calls (e.g., React Strict Mode).
  const secret = user.twoFactorSecret ?? authenticator.generateSecret();

  const otpAuthUrl = authenticator.keyuri(
    user.email,
    process.env.TWO_FACTOR_ISSUER ?? "AuthKit",
    secret
  );

  const qrCode = await QRCode.toDataURL(otpAuthUrl);

  // DEBUG: trace generated/returned secret
  console.debug("[2FA] generateTwoFactorSecret", {
    userId: session.user.id,
    hasExistingSecret: Boolean(user.twoFactorSecret),
    returnedSecret: secret,
  });

  // Only persist the secret if it was newly generated.
  if (!user.twoFactorSecret) {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorSecret: secret,
        isTwoFactorEnabled: false,
      },
    });
  } else if (user.isTwoFactorEnabled !== false) {
    // Ensure the flag is explicitly false until verified
    await db.user.update({
      where: { id: session.user.id },
      data: { isTwoFactorEnabled: false },
    });
  }

  return { qrCode, secret, success: "QR code and secret generated." };
};

export const verifyTwoFactorCode = async (
  values: z.infer<typeof TwoFactorVerificationSchema>
) => {
  const validatedFields = TwoFactorVerificationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid verification code format." };
  }

  const { code } = validatedFields.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized. Please log in again." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found." };
  }

  if (!user.twoFactorSecret) {
    return { error: "2FA secret not found. Please try setting up 2FA again." };
  }

  // DEBUG: trace verification inputs
  console.debug("[2FA] verifyTwoFactorCode", {
    userId: user.id,
    providedCode: code.trim(),
    storedSecret: user.twoFactorSecret,
  });

  // DEBUG: compute current server token for comparison
  const serverEpochNow = Math.floor(Date.now() / 1000);
  const serverOptions = authenticator.options;
  const serverTokenNow = authenticator.generate(user.twoFactorSecret);
  // Also compute tokens for prev/next step for better diagnostics (no side effects)
  const step = (serverOptions as { step?: number }).step ?? 30;
  const prevOptions = { ...serverOptions };
  // prev token
  authenticator.options = { ...serverOptions, epoch: (serverEpochNow - step) * 1000 };
  const serverTokenPrev = authenticator.generate(user.twoFactorSecret);
  // next token
  authenticator.options = { ...serverOptions, epoch: (serverEpochNow + step) * 1000 };
  const serverTokenNext = authenticator.generate(user.twoFactorSecret);
  // restore options
  authenticator.options = prevOptions;
  console.debug("[2FA] server tokens", {
    userId: user.id,
    serverEpochNow,
    serverOptions,
    serverTokenPrev,
    serverTokenNow,
    serverTokenNext,
  });

  // Temporarily widen window in development to tolerate local clock skew discovered during debugging
  const originalOptionsForVerify = { ...authenticator.options };
  if (process.env.NODE_ENV !== "production") {
    authenticator.options = { ...authenticator.options, window: [10, 10] };
  }
  const isValid = authenticator.verify({
    token: code.trim(),
    secret: user.twoFactorSecret,
  });
  // Restore options
  authenticator.options = originalOptionsForVerify;

  if (!isValid) {
    const devHint = process.env.NODE_ENV !== "production"
      ? ` (server token prev: ${serverTokenPrev}; now: ${serverTokenNow}; next: ${serverTokenNext}; epoch: ${serverEpochNow}; storedSecret: ${user.twoFactorSecret.slice(0, 8)}...)`
      : "";
    return { error: `Invalid verification code. Please check your authenticator app and try again.${devHint}` };
  }

  // If code is valid, enable 2FA for the user
  await db.user.update({
    where: { id: user.id },
    data: { isTwoFactorEnabled: true }, 
  });

  return { success: "Two-factor authentication enabled successfully!" };
};
