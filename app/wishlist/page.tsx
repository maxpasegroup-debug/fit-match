import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getWishlistProductIds, getWishlistProducts } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Wishlist" };
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const [wishlist, wishlistIds] = await Promise.all([getWishlistProducts(), getWishlistProductIds()]);

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <Heart className="mb-4 h-7 w-7 text-[#c21874]" />
          <h1 className="text-3xl font-semibold text-[#241820]">Wishlist</h1>
          <p className="mt-2 text-sm text-[#756871]">{wishlist.length} saved styles</p>
        </div>
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {wishlist.map((item) => <ProductCard key={item.id} product={item.product} wished={wishlistIds.has(item.productId)} />)}
          </div>
        ) : (
          <EmptyState title="No wishlist items" description="Tap the heart on any product to save it here." icon={Heart} />
        )}
      </div>
    </main>
  );
}
