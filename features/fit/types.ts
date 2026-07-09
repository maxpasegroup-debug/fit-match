import type { getProductFitRecommendation } from "@/features/fit/recommendations";

export type AwaitedProductFitRecommendation = Awaited<ReturnType<typeof getProductFitRecommendation>>;
