import { getAnalyticsProvider } from "@/lib/analytics/registry";
import type { AnalyticsEventName, AnalyticsPayload } from "@/lib/analytics/types";

export async function trackServerEvent(event: AnalyticsEventName, payload: AnalyticsPayload) {
  await getAnalyticsProvider().track(event, payload);
}
