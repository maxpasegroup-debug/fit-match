import type { AIFeature, Prisma } from "@prisma/client";
import type { ProviderResult } from "@/features/ai/types";
import { prisma } from "@/lib/db/prisma";
import { trackServerEvent } from "@/lib/analytics/server";

export async function recordUsage<T>(input: {
  userId?: string;
  feature: AIFeature;
  result: ProviderResult<T>;
  conversationId?: string;
  measurementSessionId?: string;
  virtualTryOnSessionId?: string;
}) {
  const { usage } = input.result;
  await prisma.aIUsageLog.create({
    data: {
      userId: input.userId,
      feature: input.feature,
      provider: input.result.provider,
      model: input.result.model,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      latencyMs: usage.latencyMs,
      estimatedCost: usage.estimatedCost,
      conversationId: input.conversationId,
      measurementSessionId: input.measurementSessionId,
      virtualTryOnSessionId: input.virtualTryOnSessionId,
    },
  });
  await trackServerEvent("ai_usage", { metadata: { feature: input.feature, provider: input.result.provider, failed: false, latencyMs: usage.latencyMs } });
}

export async function recordFailure(input: { userId?: string; feature: AIFeature; provider: string; startedAt: number; error: unknown }) {
  await prisma.aIUsageLog.create({
    data: {
      userId: input.userId,
      feature: input.feature,
      provider: input.provider,
      latencyMs: Date.now() - input.startedAt,
      failed: true,
      errorCode: input.error instanceof Error ? input.error.name : "UNKNOWN",
      estimatedCost: 0 as Prisma.Decimal | number,
    },
  });
  await trackServerEvent("ai_usage", { metadata: { feature: input.feature, provider: input.provider, failed: true, latencyMs: Date.now() - input.startedAt } });
}
