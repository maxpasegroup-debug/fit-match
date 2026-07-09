import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

function forwardedIdentifier(headerList: Headers): string {
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown"
  );
}

export async function rateLimitServerAction(
  scope: string,
  options: { limit: number; windowMs: number },
): Promise<boolean> {
  const headerList = await headers();
  const result = await rateLimit(
    { scope, identifier: forwardedIdentifier(headerList) },
    options,
  );

  return result.success;
}
