import { UserRole } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role: UserRole;
      id: string;
      /**
       * By default, TypeScript merges new interface properties.
       * Overwrite the default session user properties with the ones we are adding
       */
    } & DefaultSession["user"];
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's role. */
    role?: UserRole;
  }
}
