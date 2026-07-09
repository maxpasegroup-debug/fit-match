import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemView } from "@/features/checkout/data";
import { formatMoney } from "@/features/checkout/price-engine";
import {
  moveCartItemToWishlistAction,
  removeCartItemAction,
  restoreSavedItemAction,
  saveForLaterAction,
  updateCartQuantityAction,
} from "@/features/checkout/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mediaUrl } from "@/lib/media/asset";

export function CartItemRow({ item, saved = false }: { item: CartItemView; saved?: boolean }) {
  const image = mediaUrl(item.product.images[0]);
  return (
    <Card className="grid gap-4 p-4 sm:grid-cols-[112px_1fr]">
      <Link className="relative aspect-square overflow-hidden rounded-2xl bg-[#fffafd]" href={`/products/${item.product.slug}`}>
        <Image alt={item.product.name} className="object-cover" fill sizes="112px" src={image} />
      </Link>
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link className="font-semibold text-[#241820]" href={`/products/${item.product.slug}`}>
              {item.product.name}
            </Link>
            <p className="mt-1 text-sm text-[#756871]">
              {item.productVariant?.colorName ?? "Standard"} · {item.productVariant?.sizeName ?? "Fit selected at checkout"}
            </p>
          </div>
          <p className="font-bold text-[#241820]">{formatMoney(Number(item.unitPrice) * item.quantity)}</p>
        </div>
        {item.measurementProfile ? (
          <p className="rounded-2xl bg-[#fffafd] px-3 py-2 text-sm text-[#756871]">
            Measurement: {item.measurementProfile.profileName}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {!saved ? (
            <div className="flex items-center rounded-full border border-[#eadde6] bg-white">
              <QuantityButton itemId={item.id} quantity={Math.max(1, item.quantity - 1)} label="Decrease quantity">
                <Minus className="h-4 w-4" />
              </QuantityButton>
              <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
              <QuantityButton itemId={item.id} quantity={Math.min(10, item.quantity + 1)} label="Increase quantity">
                <Plus className="h-4 w-4" />
              </QuantityButton>
            </div>
          ) : null}
          <ItemAction action={saved ? restoreSavedItemAction : saveForLaterAction} itemId={item.id} label={saved ? "Restore" : "Save for later"} />
          <ItemAction action={moveCartItemToWishlistAction} itemId={item.id} label="Wishlist" icon={<Heart className="h-4 w-4" />} />
          <ItemAction action={removeCartItemAction} itemId={item.id} label="Remove" icon={<Trash2 className="h-4 w-4" />} />
        </div>
      </div>
    </Card>
  );
}

function QuantityButton({
  itemId,
  quantity,
  label,
  children,
}: {
  itemId: string;
  quantity: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <form action={updateCartQuantityAction}>
      <input name="itemId" type="hidden" value={itemId} />
      <input name="quantity" type="hidden" value={quantity} />
      <button aria-label={label} className="grid h-10 w-10 place-items-center text-[#241820]" type="submit">
        {children}
      </button>
    </form>
  );
}

function ItemAction({
  action,
  itemId,
  label,
  icon,
}: {
  action: (formData: FormData) => Promise<void>;
  itemId: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input name="itemId" type="hidden" value={itemId} />
      <Button size="md" type="submit" variant="secondary">
        {icon ? <span className="mr-2">{icon}</span> : null}
        {label}
      </Button>
    </form>
  );
}
