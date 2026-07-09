import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

const staticRoutes = ["", "/search", "/categories", "/collections", "/fit-match", "/engagement", "/privacy-policy", "/terms-and-conditions", "/return-policy", "/refund-policy", "/shipping-policy", "/cookie-policy", "/disclaimer"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticRoutes.map((route) => ({ url: `${env.APP_URL}${route}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.7 }));
  try {
    const [products, categories, collections] = await Promise.all([
      prisma.product.findMany({ where: { published: true, deletedAt: null }, select: { slug: true, updatedAt: true }, take: 5000 }),
      prisma.category.findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, take: 1000 }),
      prisma.collection.findMany({ where: { published: true }, select: { slug: true, updatedAt: true }, take: 1000 }),
    ]);

    return [
      ...staticEntries,
      ...products.map((product) => ({ url: `${env.APP_URL}/products/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "daily" as const, priority: 0.8 })),
      ...categories.map((category) => ({ url: `${env.APP_URL}/categories/${category.slug}`, lastModified: category.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
      ...collections.map((collection) => ({ url: `${env.APP_URL}/collections/${collection.slug}`, lastModified: collection.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    ];
  } catch {
    return staticEntries;
  }
}
