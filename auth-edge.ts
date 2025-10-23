import NextAuth, { type NextAuthConfig } from "next-auth";

/**
 * Minimal Auth.js config for Edge runtime (Middleware).
 * - No providers
 * - No database adapter
 * - JWT strategy only
 * - Reads secret directly from process.env to avoid importing the full env parser.
 */
const edgeAuthConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET as string,
  session: { strategy: "jwt" },
  // Explicit empty providers list to satisfy NextAuthConfig typing in v5
  providers: [],
};

export const { auth } = NextAuth(edgeAuthConfig);
