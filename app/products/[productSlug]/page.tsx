import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart, Ruler, Share2, ShoppingBag, Truck } from "lucide-react";
import { ProductSection } from "@/components/catalog/product-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recordRecentlyViewed, toggleWishlistAction } from "@/features/catalog/actions";
import { getProductBySlug, getRelatedProducts, getWishlistProductIds } from "@/features/catalog/data";
import { addToCartAction } from "@/features/checkout/actions";
import { siteConfig } from "@/lib/config/site";
import { mediaUrl } from "@/lib/media/asset";
import { getProductFitRecommendation } from "@/features/fit/recommendations";
import { FitRecommendationPanel } from "@/components/fit/fit-recommendation-panel";
import { trackServerEvent } from "@/lib/analytics/server";
import { BreadcrumbStructuredData, ProductStructuredData } from "@/components/seo/structured-data";
import { env } from "@/lib/config/env";

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

function money(value: unknown): string {
  return `₹${Number(value).toLocaleString("en-IN")}`;
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
    <main className="py-10 md:py-14">
      <ProductStructuredData name={product.name} description={product.shortDescription} slug={product.slug} image={primaryImage} price={Number(product.offerPrice ?? product.price)} availability={product.available ? "InStock" : "OutOfStock"} />
      <BreadcrumbStructuredData items={[{ name: "Home", url: env.APP_URL }, { name: "Products", url: `${env.APP_URL}/search` }, { name: product.name, url: `${env.APP_URL}/products/${product.slug}` }]} />
      <div className={`${siteConfig.maxWidthClass} grid gap-10`}>
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#fffafd]">
              <Image alt={product.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src={primaryImage} />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image) => (
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#fffafd]" key={image.id}>
                  <Image alt={image.alt ?? product.name} className="object-cover" fill sizes="20vw" src={mediaUrl(image)} />
                </div>
              ))}
            </div>
          </div>
          <Card className="grid gap-5">
            <div>
              <p className="text-sm font-semibold text-[#c21874]">{product.brand}</p>
              <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{product.name}</h1>
              <p className="mt-3 text-sm leading-6 text-[#756871]">{product.shortDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-[#241820]">{money(product.offerPrice ?? product.price)}</span>
              {product.offerPrice ? <span className="text-lg text-[#756871] line-through">{money(product.price)}</span> : null}
              {product.discountPercent > 0 ? <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-sm font-bold text-[#9f125d]">{product.discountPercent}% OFF</span> : null}
            </div>
            <FitRecommendationPanel data={fitRecommendation} />
            <Info title="Available colors">
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#eadde6] px-3 py-2 text-sm" key={color.id}>
                    <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hexCode }} />
                    {color.name}
                  </span>
                ))}
              </div>
            </Info>
            <Info title="Available sizes">
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => <span className="rounded-full border border-[#eadde6] px-4 py-2 text-sm font-semibold" key={size.id}>{size.name}</span>)}
              </div>
            </Info>
            <Info title="Fabric information">
              <div className="grid gap-3">
                {product.fabrics.map((fabric) => (
                  <div className="rounded-2xl bg-[#fffafd] p-4" key={fabric.id}>
                    <p className="font-semibold text-[#241820]">{fabric.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[#756871]">{fabric.description ?? "Premium fabric selected by SIGN SILKS."}</p>
                    <p className="mt-1 text-xs font-semibold text-[#756871]">{fabric.careInstructions ?? "Care instructions will be shared with product data."}</p>
                  </div>
                ))}
              </div>
            </Info>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#fffafd] p-4">
                <Ruler className="mb-2 h-5 w-5 text-[#c21874]" />
                <p className="font-semibold text-[#241820]">Measurement Profile</p>
                <p className="text-sm text-[#756871]">Read-only selector coming soon</p>
              </div>
              <div className="rounded-2xl bg-[#fffafd] p-4">
                <Truck className="mb-2 h-5 w-5 text-[#c21874]" />
                <p className="font-semibold text-[#241820]">{product.estimatedDelivery ?? "Delivery estimate pending"}</p>
                <p className="text-sm text-[#756871]">{product.estimatedStitchingTime ?? "Stitching estimate pending"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <form action={addToCartAction}>
                <input name="productId" type="hidden" value={product.id} />
                <input name="quantity" type="hidden" value="1" />
                {fitRecommendation?.recommendedVariant?.id ? <input name="productVariantId" type="hidden" value={fitRecommendation.recommendedVariant.id} /> : null}
                {fitRecommendation?.fitProfile.measurementProfileId ? <input name="measurementProfileId" type="hidden" value={fitRecommendation.fitProfile.measurementProfileId} /> : null}
                <Button className="w-full sm:w-auto" type="submit">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </form>
              <form action={toggleWishlistAction}>
                <input name="productId" type="hidden" value={product.id} />
                <Button className="w-full sm:w-auto" type="submit" variant="secondary">
                  <Heart className={`mr-2 h-5 w-5 ${wishlistIds.has(product.id) ? "fill-white" : ""}`} />
                  Wishlist
                </Button>
              </form>
              <Button type="button" variant="secondary">
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
            </div>
          </Card>
        </section>
        <ProductSection title="Related Products" products={related} wishlistIds={wishlistIds} />
      </div>
    </main>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold text-[#241820]">{title}</h2>
      {children}
    </section>
  );
}
