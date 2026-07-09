import pino from "pino";
import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/config/env";

export const logger = pino({
  level: env.isProduction ? "info" : "debug",
  base: env.isProduction ? undefined : { env: env.NODE_ENV },
  redact: {
    paths: [
      "password",
      "passwordHash",
      "token",
      "tokenHash",
      "authorization",
      "cookie",
      "headers.cookie",
      "headers.authorization",
    ],
    censor: "[redacted]",
  },
});

export function logError(error: unknown, message = "Unhandled error"): void {
  logger.error({ error }, message);
  Sentry.captureException(error);
}
