import type { Metadata } from "next";
import Link from "next/link";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Pagination } from "@/components/catalog/pagination";
import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCatalogProducts, getCategories, getWishlistProductIds } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";
import { Grid2X2 } from "lucide-react";

export const metadata: Metadata = { title: "Category" };
export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ categorySlug }, query, categories, wishlistIds] = await Promise.all([
    params,
    searchParams,
    getCategories(),
    getWishlistProductIds(),
  ]);
  const category = categories.find((item) => item.slug === categorySlug);
  const { products, total, page, pageSize } = await getCatalogProducts({ ...query, category: categorySlug });

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <p className="text-sm font-semibold text-[#c21874]">Category</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{category?.name ?? "Category"}</h1>
          <p className="mt-2 text-sm text-[#756871]">{total} products</p>
        </div>
        {category ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {category.subCategories.map((item) => (
              <Link className="shrink-0 rounded-full bg-[#fde8f3] px-4 py-2 text-sm font-semibold text-[#9f125d]" href={`/categories/${category.slug}?subcategory=${item.slug}`} key={item.id}>
                {item.name}
              </Link>
            ))}
          </div>
        ) : null}
        <CatalogFilters category={categorySlug} defaultQuery={typeof query.q === "string" ? query.q : ""} />
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} wished={wishlistIds.has(product.id)} />)}
            </div>
            <Pagination basePath={`/categories/${categorySlug}`} page={page} pageSize={pageSize} total={total} />
          </>
        ) : (
          <EmptyState title="No products in this category" description="Published products will appear here." icon={Grid2X2} />
        )}
      </div>
    </main>
  );
}
