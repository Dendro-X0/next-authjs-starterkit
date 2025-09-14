import * as z from "zod";

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: 'Please enter your email or username' })
    .max(100, { message: 'Identifier is too long' })
    .refine(
      (val) => {
        const isEmail = /.+@.+\..+/.test(val);
        const isUsername = /^[a-zA-Z0-9._-]{3,30}$/.test(val);
        return isEmail || isUsername;
      },
      { message: 'Enter a valid email or username' },
    ),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  code: z.optional(z.string()),
  rememberMe: z.optional(z.boolean()),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be at most 30 characters' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'Username can only contain letters, numbers, dots, underscores, and hyphens',
    }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms of Service.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export const TwoFactorVerificationSchema = z.object({
  code: z.string().min(6, { message: "Code must be 6 digits" }).max(6, { message: "Code must be 6 digits" }),
});

// Schema for updating profile
export const ProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be at most 30 characters' })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: 'Username can only contain letters, numbers, dots, underscores, and hyphens',
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  bio: z.string().max(160, { message: "Bio must be less than 160 characters" }).optional(),
  location: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
});

// Schema for updating settings
export const SettingsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  profileVisibility: z.boolean().optional(),
});

// Schema for changing password
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});