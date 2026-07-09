import Link from "next/link";
import { Search } from "lucide-react";
import type { ProductCardData } from "@/features/catalog/data";
import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";

export function ProductSection({
  title,
  href,
  products,
  wishlistIds,
}: {
  title: string;
  href?: string;
  products: ProductCardData[];
  wishlistIds: Set<string>;
}) {
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[#241820]">{title}</h2>
        {href ? <Link className="text-sm font-semibold text-[#c21874]" href={href}>View all</Link> : null}
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} wished={wishlistIds.has(product.id)} />
          ))}
        </div>
      ) : (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Published styles will appear here." icon={Search} />
      )}
    </section>
  );
}
