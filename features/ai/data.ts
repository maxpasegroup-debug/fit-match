import { requireAdmin } from "@/lib/admin/auth";
import { requireUserId } from "@/features/profile/data";
import { prisma } from "@/lib/db/prisma";

export async function getStylistData() {
  const userId = await requireUserId();
  return prisma.aIConversation.findMany({ where: { userId, archivedAt: null }, include: { messages: { orderBy: { createdAt: "asc" } } }, orderBy: { updatedAt: "desc" }, take: 10 });
}

export async function getMeasurementSessions() {
  const userId = await requireUserId();
  return prisma.aIMeasurementSession.findMany({ where: { userId }, include: { images: true }, orderBy: { createdAt: "desc" }, take: 10 });
}

export async function getTryOnData() {
  const userId = await requireUserId();
  const [products, sessions] = await Promise.all([
    prisma.product.findMany({ where: { published: true, available: true, deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 100 }),
    prisma.virtualTryOnSession.findMany({ where: { userId }, include: { product: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 12 }),
  ]);
  return { products, sessions };
}

export async function getStyleSuggestions() {
  const userId = await requireUserId();
  return prisma.styleSuggestion.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}

export async function getAdminAIData() {
  await requireAdmin();
  const [configurations, prompts] = await prisma.$transaction([
    prisma.aIConfiguration.findMany({ orderBy: { feature: "asc" } }),
    prisma.aIPromptTemplate.findMany({ orderBy: [{ feature: "asc" }, { key: "asc" }] }),
  ]);
  const usage = await prisma.aIUsageLog.groupBy({
    by: ["provider", "feature", "failed"],
    orderBy: [{ feature: "asc" }, { provider: "asc" }],
    _count: { _all: true },
    _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
    _avg: { latencyMs: true },
  });
  return { configurations, prompts, usage };
}
