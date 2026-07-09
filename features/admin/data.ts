import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export async function getAdminDashboardData() {
  await requireAdmin();
  const [products, published, lowStock, suppliers] = await prisma.$transaction([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.product.count({ where: { published: true, deletedAt: null } }),
    prisma.inventory.count({ where: { currentStock: { lte: 5 } } }),
    prisma.supplier.count({ where: { status: "ACTIVE" } }),
  ]);
  return { products, published, lowStock, suppliers };
}

export async function getProductEditorData(id?: string) {
  await requireAdmin();
  const [categories, subCategories, collections, suppliers, seasons, occasions] =
    await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.subCategory.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.supplier.findMany({ orderBy: { name: "asc" } }),
      prisma.season.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.occasion.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  const product = id
    ? await prisma.product.findUnique({
        where: { id },
        include: { seo: true, images: { include: { mediaAsset: true }, orderBy: { displayOrder: "asc" } }, variants: true, inventory: true },
      })
    : null;
  return { product, categories, subCategories, collections, suppliers, seasons, occasions };
}

export async function getAdminProducts(searchParams: Record<string, string | string[] | undefined>) {
  await requireAdmin();
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  return prisma.product.findMany({
    where: {
      ...(status ? { status: status as never } : { deletedAt: null }),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } },
              { collection: { name: { contains: q, mode: "insensitive" } } },
              { supplier: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { category: true, collection: true, supplier: true, inventory: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
}

export async function getLookupData() {
  await requireAdmin();
  const [categories, subCategories, collections, suppliers, seasons, occasions, banners] =
    await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.subCategory.findMany({ include: { category: true }, orderBy: { sortOrder: "asc" } }),
      prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.supplier.findMany({ orderBy: { name: "asc" } }),
      prisma.season.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.occasion.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.featuredBanner.findMany({ include: { collection: true, desktopMediaAsset: true, tabletMediaAsset: true, mobileMediaAsset: true }, orderBy: { sortOrder: "asc" } }),
    ]);
  return { categories, subCategories, collections, suppliers, seasons, occasions, banners };
}

export async function getInventoryData() {
  await requireAdmin();
  return prisma.inventory.findMany({
    include: { product: true, movements: { include: { adminUser: true }, orderBy: { createdAt: "desc" }, take: 8 } },
    orderBy: [{ currentStock: "asc" }, { updatedAt: "desc" }],
    take: 100,
  });
}
