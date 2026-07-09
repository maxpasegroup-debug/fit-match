import type { AnalyticsEventName, AnalyticsPayload, AnalyticsProvider } from "@/lib/analytics/types";
import { logger } from "@/lib/logger";

export class NoopAnalyticsProvider implements AnalyticsProvider {
  readonly name = "noop";

  async track(event: AnalyticsEventName, payload: AnalyticsPayload): Promise<void> {
    logger.debug({ event, payload, provider: this.name }, "analytics event captured");
  }
}
