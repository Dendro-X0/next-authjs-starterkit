import "server-only";

/**
 * Simple in-memory rate limiter for server actions.
 * For production, back with Redis/Upstash. This is a safe default.
 */

export type ConsumeInput = Readonly<{
  key: string;
  windowMs?: number; // default 60_000
  max?: number; // default 5
}>;

export type ConsumeResult = Readonly<{
  allowed: boolean;
  retryAfterMs: number;
}>;

type Bucket = {
  readonly resetAt: number;
  count: number;
};

const buckets: Map<string, Bucket> = new Map();
const DEFAULT_WINDOW = 60_000 as const;
const DEFAULT_MAX = 5 as const;

/**
 * Consume a single token for the given key.
 */
export function consume({ key, windowMs = DEFAULT_WINDOW, max = DEFAULT_MAX }: ConsumeInput): ConsumeResult {
  const now: number = Date.now();
  const bucket: Bucket | undefined = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    const resetAt: number = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, retryAfterMs: 0 } as const;
  }
  if (bucket.count < max) {
    bucket.count += 1;
    return { allowed: true, retryAfterMs: 0 } as const;
  }
  return { allowed: false, retryAfterMs: Math.max(0, bucket.resetAt - now) } as const;
}
