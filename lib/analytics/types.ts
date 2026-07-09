export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "search"
  | "wishlist"
  | "cart"
  | "checkout"
  | "order"
  | "fit_recommendation"
  | "ai_usage";

export type AnalyticsPayload = {
  path?: string;
  productId?: string;
  query?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean | null>;
};

export interface AnalyticsProvider {
  readonly name: string;
  track(event: AnalyticsEventName, payload: AnalyticsPayload): Promise<void>;
}
