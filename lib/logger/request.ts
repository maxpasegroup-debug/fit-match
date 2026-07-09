import type { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export function logRequest(request: NextRequest, status: number): void {
  logger.info(
    {
      method: request.method,
      path: request.nextUrl.pathname,
      status,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    },
    "request completed",
  );
}
