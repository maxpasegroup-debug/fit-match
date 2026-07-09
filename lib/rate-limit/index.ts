import { MemoryRateLimitStore } from "@/lib/rate-limit/memory-store";
import type { RateLimitKey, RateLimitResult, RateLimitStore } from "@/lib/rate-limit/types";

let store: RateLimitStore = new MemoryRateLimitStore();

export function setRateLimitStore(nextStore: RateLimitStore): void {
  store = nextStore;
}

export async function rateLimit(
  key: RateLimitKey,
  options: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const storeKey = `${key.scope}:${key.identifier}`;
  const bucket = await store.increment(storeKey, options.windowMs);
  const remaining = Math.max(options.limit - bucket.count, 0);

  return {
    success: bucket.count <= options.limit,
    limit: options.limit,
    remaining,
    resetAt: bucket.resetAt,
  };
}
