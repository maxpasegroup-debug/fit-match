"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { trackServerEvent } from "@/lib/analytics/server";

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function toggleWishlistAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const productId = formValue(formData, "productId");
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    await trackServerEvent("wishlist", { productId, metadata: { action: "remove" } });
  } else {
    await prisma.wishlist.create({ data: { userId: user.id, productId } });
    await trackServerEvent("wishlist", { productId, metadata: { action: "add" } });
  }

  revalidatePath("/");
  revalidatePath("/home");
  revalidatePath("/wishlist");
  revalidatePath("/profile");
}

export async function recordRecentlyViewed(productId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.recentlyViewed.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    create: { userId: user.id, productId },
    update: { viewedAt: new Date() },
  });
}
