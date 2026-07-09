"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { AnalyticsEventName, AnalyticsPayload } from "@/lib/analytics/types";

function send(event: AnalyticsEventName, payload: AnalyticsPayload) {
  const body = JSON.stringify({ event, payload });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}

export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const query = window.location.search.replace(/^\?/, "");
    send("page_view", { path: query ? `${pathname}?${query}` : pathname });
  }, [pathname]);

  return null;
}
