import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LuxuryProductPage } from "@/components/catalog/luxury-product-page";
import { BreadcrumbStructuredData, ProductStructuredData } from "@/components/seo/structured-data";
import { recordRecentlyViewed } from "@/features/catalog/actions";
import { getProductBySlug, getRelatedProducts, getWishlistProductIds } from "@/features/catalog/data";
import { getProductFitRecommendation } from "@/features/fit/recommendations";
import { trackServerEvent } from "@/lib/analytics/server";
import { env } from "@/lib/config/env";
import { mediaUrl } from "@/lib/media/asset";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return { title: "Product" };
  const image = mediaUrl(product.images[0]);
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `${env.APP_URL}/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${env.APP_URL}/products/${product.slug}`,
      images: [{ url: image, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  await recordRecentlyViewed(product.id);
  await trackServerEvent("product_view", { productId: product.id, path: `/products/${product.slug}` });
  const [related, wishlistIds, fitRecommendation] = await Promise.all([
    getRelatedProducts(product),
    getWishlistProductIds(),
    getProductFitRecommendation(product.id),
  ]);
  const primaryImage = mediaUrl(product.images[0]);

  return (
    <>
      <ProductStructuredData
        name={product.name}
        description={product.shortDescription}
        slug={product.slug}
        image={primaryImage}
        price={Number(product.offerPrice ?? product.price)}
        availability={product.available ? "InStock" : "OutOfStock"}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: env.APP_URL },
          { name: "Products", url: `${env.APP_URL}/search` },
          { name: product.name, url: `${env.APP_URL}/products/${product.slug}` },
        ]}
      />
      <LuxuryProductPage product={product} related={related} wishlistIds={wishlistIds} fitRecommendation={fitRecommendation} />
    </>
  );
}
