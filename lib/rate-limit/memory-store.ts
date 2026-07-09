import type { RateLimitStore } from "@/lib/rate-limit/types";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export class MemoryRateLimitStore implements RateLimitStore {
  async increment(key: string, windowMs: number): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      const resetAt = now + windowMs;
      buckets.set(key, { count: 1, resetAt });
      return { count: 1, resetAt };
    }

    current.count += 1;
    buckets.set(key, current);
    return current;
  }
}
