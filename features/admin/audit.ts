import { prisma } from "@/lib/db/prisma";
import type { AuthUser } from "@/types/auth";

export async function auditLog(input: {
  admin: AuthUser;
  action: string;
  entityType: string;
  entityId?: string;
  message: string;
  productId?: string;
  categoryId?: string;
  subCategoryId?: string;
  collectionId?: string;
  featuredBannerId?: string;
}) {
  await prisma.auditLog.create({
    data: {
      adminUserId: input.admin.id,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      message: input.message,
      productId: input.productId,
      categoryId: input.categoryId,
      subCategoryId: input.subCategoryId,
      collectionId: input.collectionId,
      featuredBannerId: input.featuredBannerId,
    },
  });
}
