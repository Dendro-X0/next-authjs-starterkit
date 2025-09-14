"use server";

import { z } from "zod";
import bcrypt from 'bcryptjs';
import { auth } from '../../auth';
import { db } from "@/lib/db";
import { ProfileSchema, SettingsSchema, ChangePasswordSchema } from "@/schemas";

// Get current user
export async function getUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      sessions: {
        orderBy: {
          expires: 'desc',
        },
        take: 1,
      },
    },
  });

  return user;
}

// Update user profile
export async function updateProfile(values: z.infer<typeof ProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ProfileSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, username, email, bio, location, website } = validatedFields.data as {
    name: string;
    username: string;
    email: string;
    bio?: string;
    location?: string;
    website?: string;
  };

  try {
    // Check username uniqueness if changed (raw SQL to avoid type drift)
    const current = await db.user.findUnique({ where: { id: session.user.id } });
    if (!current) {
      return { error: "User not found" };
    }
    const currentUsername = (current as unknown as { username?: string }).username || "";
    if (username && username !== currentUsername) {
      const rows = await db.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "User" WHERE "username" = ${username} AND "id" <> ${current.id} LIMIT 1
      `;
      if (rows.length > 0) {
        return { error: "Username is already taken" };
      }
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        bio,
        location,
        website,
      },
    });

    // Update username separately via raw SQL to avoid client type mismatch
    if (username && username !== currentUsername) {
      await db.$executeRawUnsafe(
        'UPDATE "User" SET "username" = $1 WHERE "id" = $2',
        username,
        session.user.id,
      );
    }

    return { success: "Profile updated successfully!" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Something went wrong!" };
  }
}

// Update user settings
export async function updateSettings(values: z.infer<typeof SettingsSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = SettingsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: values,
    });

    return { success: "Settings updated successfully!" };
  } catch (error) {
    console.error("Settings update error:", error);
    return { error: "Something went wrong!" };
  }
}

// Change user password
export async function changePassword(values: z.infer<typeof ChangePasswordSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const validatedFields = ChangePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) {
    return { error: "User not found!" };
  }

  const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return { error: "Incorrect current password!" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: "Password updated successfully!" };
  } catch (error) {
    console.error("Password change error:", error);
    return { error: "Something went wrong!" };
  }
}

// Delete user account
export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.user.delete({
      where: { id: session.user.id },
    });

    // Note: You might want to handle sign-out logic here as well
    return { success: "Account deleted successfully!" };
  } catch (error) {
    console.error("Account deletion error:", error);
    return { error: "Something went wrong!" };
  }
}

// Update user profile image
export async function updateProfileImage(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (typeof imageUrl !== 'string') {
    return { error: "Invalid image URL" };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image: imageUrl,
      },
    });

    return { success: "Profile image updated successfully!" };
  } catch (error) {
    console.error("Profile image update error:", error);
    return { error: "Something went wrong!" };
  }
}
