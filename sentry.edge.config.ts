import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/config/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  enabled: Boolean(env.SENTRY_DSN),
  tracesSampleRate: env.isProduction ? 0.1 : 1,
});
