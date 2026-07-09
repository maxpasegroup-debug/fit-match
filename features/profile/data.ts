import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function requireUserId(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user.id;
}

export async function getProfileDashboardData() {
  const userId = await requireUserId();
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      profile: true,
      addresses: { orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] },
      measurements: {
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
        include: { history: { orderBy: { createdAt: "desc" }, take: 5 } },
      },
      wishlist: true,
      recentlyViewed: { orderBy: { viewedAt: "desc" }, take: 8 },
    },
  });
}

export async function getMeasurementHistory(measurementProfileId: string) {
  const userId = await requireUserId();
  const profile = await prisma.measurementProfile.findFirstOrThrow({
    where: { id: measurementProfileId, userId },
    select: { id: true },
  });

  return prisma.measurementHistory.findMany({
    where: { measurementProfileId: profile.id, userId },
    orderBy: { createdAt: "desc" },
  });
}
