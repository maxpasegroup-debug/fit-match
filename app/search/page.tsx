import type { Metadata } from "next";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";
import { getCatalogProducts, getWishlistProductIds } from "@/features/catalog/data";
import { trackServerEvent } from "@/lib/analytics/server";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (typeof params.q === "string" && params.q.trim()) {
    await trackServerEvent("search", { query: params.q.trim(), path: "/search" });
  }
  const [{ products, total, page, pageSize }, wishlistIds] = await Promise.all([
    getCatalogProducts(params),
    getWishlistProductIds(),
  ]);

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <p className="text-sm font-semibold text-[#c21874]">FIT & MATCH</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">Search collections</h1>
          <p className="mt-2 text-sm text-[#756871]">{total} styles found</p>
        </div>
        <CatalogFilters defaultQuery={typeof params.q === "string" ? params.q : ""} />
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} wished={wishlistIds.has(product.id)} />)}
            </div>
            <Pagination basePath="/search" page={page} pageSize={pageSize} total={total} />
          </>
        ) : (
          <EmptyState title="No results" description="Try a different category, fabric, color, or price range." icon={Search} />
        )}
      </div>
    </main>
  );
}
