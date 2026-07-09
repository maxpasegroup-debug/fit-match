import type { AnalyticsProvider } from "@/lib/analytics/types";
import { NoopAnalyticsProvider } from "@/lib/analytics/providers";

const providers = new Map<string, AnalyticsProvider>([["noop", new NoopAnalyticsProvider()]]);

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  providers.set(provider.name, provider);
}

export function getAnalyticsProvider(name = "noop") {
  const provider = providers.get(name);
  if (!provider) throw new Error(`Analytics provider '${name}' is not registered.`);
  return provider;
}
