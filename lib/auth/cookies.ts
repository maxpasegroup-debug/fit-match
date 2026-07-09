import { env } from "@/lib/config/env";
import { sessionDurations } from "@/lib/auth/session-options";

export const sessionCookieName = "__Host-fit_match_session";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: sessionDurations.standard,
} as const;
