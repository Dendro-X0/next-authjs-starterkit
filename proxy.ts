import { auth } from "~/auth-edge";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const proxy = auth((req) => {
  const t0: number = Date.now();
  const { nextUrl } = req;
  const isLoggedIn: boolean = !!req.auth;
  const isApiAuthRoute: boolean = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute: boolean = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute: boolean = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoute) {
    const res: NextResponse = NextResponse.next();
    res.headers.set("Server-Timing", `mw;desc=auth;dur=${Date.now() - t0}`);
    return res;
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    const res: NextResponse = NextResponse.next();
    res.headers.set("Server-Timing", `mw;desc=auth;dur=${Date.now() - t0}`);
    return res;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  const res: NextResponse = NextResponse.next();
  res.headers.set("Server-Timing", `mw;desc=auth;dur=${Date.now() - t0}`);
  return res;
});

export default proxy;

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  // Only run on page routes; skip _next assets and all API routes to reduce latency
  matcher: ["/((?!.+\\.[\\w]+$|_next|api).*)", "/"],
};
