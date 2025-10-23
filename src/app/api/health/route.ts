import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/health
 * Add ?db=1 to include a short DB ping with timeout.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const withDb: boolean = url.searchParams.get("db") === "1";
  const startedAt: number = Date.now();

  const result: { ok: boolean; uptimeMs: number; region?: string; dbOk?: boolean; dbMs?: number; error?: string } = {
    ok: true,
    uptimeMs: process.uptime() * 1000,
    region: process.env.VERCEL_REGION ?? process.env.FLY_REGION ?? undefined,
  };

  if (withDb) {
    const t0: number = Date.now();
    try {
      const ping = db.$queryRawUnsafe("SELECT 1");
      const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("DB ping timeout")), 1500));
      await Promise.race([ping, timeout]);
      result.dbOk = true;
      result.dbMs = Date.now() - t0;
    } catch (err) {
      result.dbOk = false;
      result.error = (err as Error).message;
    }
  }

  // Include total handler time to spot cold starts or stalls
  const totalMs: number = Date.now() - startedAt;
  return NextResponse.json({ ...result, totalMs });
}
