import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { requireUserId } from "@/features/profile/data";

export async function getFitProfileData() {
  const userId = await requireUserId();
  const [profile, measurements] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        profile: true,
        fitProfiles: {
          include: { measurementProfile: true, stylePreference: true, colorPreferences: true, fabricPreferences: true, occasionPreferences: true },
          orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        },
      },
    }),
    prisma.measurementProfile.findMany({ where: { userId, archivedAt: null }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] }),
  ]);
  return { profile, measurements };
}

export async function getAdminFitData() {
  await requireAdmin();
  const [rules, charts, categories] = await prisma.$transaction([
    prisma.fitRule.findMany({ orderBy: [{ type: "asc" }, { priority: "asc" }] }),
    prisma.sizeChart.findMany({ include: { category: true, mappings: { orderBy: { sortOrder: "asc" } } }, orderBy: { updatedAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { rules, charts, categories };
}
