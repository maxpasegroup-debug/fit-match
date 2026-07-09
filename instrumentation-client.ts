import * as Sentry from "@sentry/nextjs";
import { clientEnv } from "@/lib/config/client-env";

Sentry.init({
  dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(clientEnv.NEXT_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
