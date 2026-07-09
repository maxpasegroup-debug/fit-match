import type { AIFeature } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const defaultLimit = 50;

export async function getFeatureConfiguration(feature: AIFeature) {
  return prisma.aIConfiguration.upsert({
    where: { feature },
    create: { feature, provider: "mock", enabled: true, dailyUserLimit: defaultLimit },
    update: {},
  });
}

export async function assertFeatureAvailable(userId: string, feature: AIFeature) {
  const configuration = await getFeatureConfiguration(feature);
  if (!configuration.enabled) throw new Error("This experience is temporarily unavailable.");
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const used = await prisma.aIUsageLog.count({ where: { userId, feature, createdAt: { gte: since } } });
  if (used >= configuration.dailyUserLimit) throw new Error("Your daily usage limit has been reached.");
  return configuration;
}
