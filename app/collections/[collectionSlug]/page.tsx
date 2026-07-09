import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalogProducts, getCollections, getWishlistProductIds } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Collection" };
export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collectionSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ collectionSlug }, query, collections, wishlistIds] = await Promise.all([
    params,
    searchParams,
    getCollections(),
    getWishlistProductIds(),
  ]);
  const collection = collections.find((item) => item.slug === collectionSlug);
  const { products, total, page, pageSize } = await getCatalogProducts({ ...query, collection: collectionSlug });

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <p className="text-sm font-semibold text-[#c21874]">Collection</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{collection?.name ?? "Collection"}</h1>
          <p className="mt-2 text-sm text-[#756871]">{collection?.description ?? `${total} curated styles`}</p>
        </div>
        <CatalogFilters collection={collectionSlug} defaultQuery={typeof query.q === "string" ? query.q : ""} />
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} wished={wishlistIds.has(product.id)} />)}
            </div>
            <Pagination basePath={`/collections/${collectionSlug}`} page={page} pageSize={pageSize} total={total} />
          </>
        ) : (
          <EmptyState title="No products in this collection" description="Published products will appear here." icon={Sparkles} />
        )}
      </div>
    </main>
  );
}
