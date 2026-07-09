import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const policies = [
  { route: "/login", methods: ["POST"], limit: 8, windowMs: 15 * 60_000 },
  { route: "/register", methods: ["POST"], limit: 5, windowMs: 60 * 60_000 },
  { route: "/forgot-password", methods: ["POST"], limit: 4, windowMs: 60 * 60_000 },
  { route: "/reset-password", methods: ["POST"], limit: 5, windowMs: 60 * 60_000 },
  { route: "/verify-email", methods: ["GET"], limit: 10, windowMs: 15 * 60_000 },
] as const;

function clientIdentifier(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function applyRateLimit(request: NextRequest) {
  const policy = policies.find(
    (item) =>
      request.nextUrl.pathname.startsWith(item.route) &&
      item.methods.includes(request.method as never),
  );

  if (!policy) {
    return null;
  }

  const result = await rateLimit(
    {
      scope: `${policy.route}:${request.method}`,
      identifier: clientIdentifier(request),
    },
    { limit: policy.limit, windowMs: policy.windowMs },
  );

  return { policy, result };
}
