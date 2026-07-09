import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { catalogSearchSchema } from "@/features/catalog/schemas";

export const productInclude = {
  category: true,
  subCategory: true,
  collection: true,
  variants: true,
  images: { include: { mediaAsset: true }, orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }] },
  fabrics: true,
  colors: true,
  sizes: { orderBy: { sortOrder: "asc" } },
  tags: true,
} satisfies Prisma.ProductInclude;

const pageSize = 12;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

type SearchParamsInput = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseCatalogInput(input: SearchParamsInput) {
  return catalogSearchSchema.parse({
    q: firstValue(input.q),
    category: firstValue(input.category),
    subcategory: firstValue(input.subcategory),
    collection: firstValue(input.collection),
    color: firstValue(input.color),
    fabric: firstValue(input.fabric),
    size: firstValue(input.size),
    minPrice: firstValue(input.minPrice),
    maxPrice: firstValue(input.maxPrice),
    available: firstValue(input.available),
    trending: firstValue(input.trending),
    featured: firstValue(input.featured),
    newArrival: firstValue(input.newArrival),
    sort: firstValue(input.sort),
    page: firstValue(input.page),
  });
}

function productWhere(input: SearchParamsInput): Prisma.ProductWhereInput {
  const parsed = parseCatalogInput(input);

  return {
    published: true,
    ...(parsed.available === undefined ? {} : { available: parsed.available }),
    ...(parsed.trending ? { trending: true } : {}),
    ...(parsed.featured ? { featured: true } : {}),
    ...(parsed.newArrival ? { newArrival: true } : {}),
    ...(parsed.category ? { category: { slug: parsed.category } } : {}),
    ...(parsed.subcategory ? { subCategory: { slug: parsed.subcategory } } : {}),
    ...(parsed.collection ? { collection: { slug: parsed.collection } } : {}),
    ...(parsed.color ? { colors: { some: { name: { contains: parsed.color, mode: "insensitive" } } } } : {}),
    ...(parsed.fabric ? { fabrics: { some: { name: { contains: parsed.fabric, mode: "insensitive" } } } } : {}),
    ...(parsed.size ? { sizes: { some: { name: parsed.size, available: true } } } : {}),
    ...(parsed.minPrice || parsed.maxPrice
      ? {
          price: {
            ...(parsed.minPrice ? { gte: parsed.minPrice } : {}),
            ...(parsed.maxPrice ? { lte: parsed.maxPrice } : {}),
          },
        }
      : {}),
    ...(parsed.q
      ? {
          OR: [
            { name: { contains: parsed.q, mode: "insensitive" } },
            { shortDescription: { contains: parsed.q, mode: "insensitive" } },
            { category: { name: { contains: parsed.q, mode: "insensitive" } } },
            { collection: { name: { contains: parsed.q, mode: "insensitive" } } },
            { colors: { some: { name: { contains: parsed.q, mode: "insensitive" } } } },
            { fabrics: { some: { name: { contains: parsed.q, mode: "insensitive" } } } },
            { tags: { some: { name: { contains: parsed.q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };
}

function productOrderBy(sort: string | string[] | undefined): Prisma.ProductOrderByWithRelationInput[] {
  const parsed = catalogSearchSchema.shape.sort.catch("newest").parse(firstValue(sort));
  if (parsed === "price-asc") return [{ price: "asc" }];
  if (parsed === "price-desc") return [{ price: "desc" }];
  if (parsed === "popularity") return [{ popularity: "desc" }, { createdAt: "desc" }];
  if (parsed === "featured") return [{ featured: "desc" }, { sortOrder: "asc" }];
  return [{ createdAt: "desc" }];
}

export async function getCatalogProducts(input: SearchParamsInput) {
  const parsed = parseCatalogInput(input);
  const where = productWhere(input);
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: productOrderBy(input.sort),
      skip: (parsed.page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page: parsed.page, pageSize };
}

export async function getDiscoveryHomeData() {
  const user = await getCurrentUser();
  const [banners, collections, trending, newArrivals, wedding, office, festival, premium] =
    await prisma.$transaction([
      prisma.featuredBanner.findMany({
        where: { published: true, OR: [{ activeAt: null }, { activeAt: { lte: new Date() } }], AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] }] },
        include: { desktopMediaAsset: true, tabletMediaAsset: true, mobileMediaAsset: true },
        orderBy: { sortOrder: "asc" },
        take: 5,
      }),
      prisma.collection.findMany({ where: { published: true, featured: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
      prisma.product.findMany({ where: { published: true, trending: true }, include: productInclude, take: 8 }),
      prisma.product.findMany({ where: { published: true, newArrival: true }, include: productInclude, take: 8 }),
      prisma.product.findMany({ where: { published: true, collection: { slug: "wedding" } }, include: productInclude, take: 8 }),
      prisma.product.findMany({ where: { published: true, collection: { slug: "office" } }, include: productInclude, take: 8 }),
      prisma.product.findMany({ where: { published: true, collection: { slug: "festival" } }, include: productInclude, take: 8 }),
      prisma.product.findMany({ where: { published: true, tags: { some: { slug: "premium" } } }, include: productInclude, take: 8 }),
    ]);
  const recently = user
    ? await prisma.recentlyViewed.findMany({
        where: { userId: user.id },
        include: { product: { include: productInclude } },
        orderBy: { viewedAt: "desc" },
        take: 8,
      })
    : [];

  return { banners, collections, trending, newArrivals, wedding, office, festival, premium, recently };
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { published: true },
    include: { subCategories: { where: { published: true }, orderBy: { sortOrder: "asc" } }, _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCollections() {
  return prisma.collection.findMany({
    where: { published: true },
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, published: true },
    include: { ...productInclude, reviews: { where: { published: true }, take: 5 } },
  });
}

export async function getRelatedProducts(product: ProductCardData) {
  const relatedConditions: Prisma.ProductWhereInput[] = [{ categoryId: product.categoryId }];
  if (product.collectionId) {
    relatedConditions.push({ collectionId: product.collectionId });
  }

  return prisma.product.findMany({
    where: {
      id: { not: product.id },
      published: true,
      OR: relatedConditions,
    },
    include: productInclude,
    take: 8,
  });
}

export async function getWishlistProducts() {
  const user = await getCurrentUser();
  if (!user) return [];
  return prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: { include: productInclude } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWishlistProductIds() {
  const user = await getCurrentUser();
  if (!user) return new Set<string>();
  const rows = await prisma.wishlist.findMany({ where: { userId: user.id }, select: { productId: true } });
  return new Set(rows.map((row) => row.productId));
}

export async function getWishlistCount(userId: string) {
  return prisma.wishlist.count({ where: { userId } });
}
