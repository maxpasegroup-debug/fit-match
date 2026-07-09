import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { ProductCardData } from "@/features/catalog/data";
import { toggleWishlistAction } from "@/features/catalog/actions";
import { addToCartAction } from "@/features/checkout/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mediaUrl } from "@/lib/media/asset";

function money(value: unknown): string {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export function ProductCard({
  product,
  wished,
}: {
  product: ProductCardData;
  wished: boolean;
}) {
  const primaryImage = mediaUrl(product.images[0]);

  return (
    <Card className="grid gap-3 p-3">
      <Link className="group block overflow-hidden rounded-2xl bg-[#fffafd]" href={`/products/${product.slug}`}>
        <div className="relative aspect-[4/5]">
          <Image
            alt={product.images[0]?.alt ?? product.name}
            className="object-cover transition duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            src={primaryImage}
          />
          {product.discountPercent > 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#c21874] px-3 py-1 text-xs font-bold text-white">
              {product.discountPercent}% OFF
            </span>
          ) : null}
        </div>
      </Link>
      <div className="grid gap-2">
        <Link className="font-semibold leading-5 text-[#241820]" href={`/products/${product.slug}`}>
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm leading-5 text-[#756871]">{product.shortDescription}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#241820]">{money(product.offerPrice ?? product.price)}</span>
          {product.offerPrice ? (
            <span className="text-sm text-[#756871] line-through">{money(product.price)}</span>
          ) : null}
        </div>
        <div className="flex gap-2">
          <form action={toggleWishlistAction}>
            <input name="productId" type="hidden" value={product.id} />
            <Button aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} size="icon" type="submit" variant="secondary">
              <Heart className={`h-5 w-5 ${wished ? "fill-[#c21874] text-[#c21874]" : ""}`} />
            </Button>
          </form>
          <Button aria-label="Quick view coming soon" className="flex-1" type="button" variant="secondary">
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
          <form action={addToCartAction}>
            <input name="productId" type="hidden" value={product.id} />
            <input name="quantity" type="hidden" value="1" />
            <Button aria-label="Add to cart" size="icon" type="submit">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
