import { ShoppingBag } from "lucide-react";
import { CartItemRow } from "@/components/checkout/cart-item-row";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button, ButtonLink } from "@/components/ui/button";
import { applyCouponAction, clearCartAction, removeCouponAction } from "@/features/checkout/actions";
import { getCartView } from "@/features/checkout/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Cart" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const { activeItems, savedItems, price, cart } = await getCartView();

  return (
    <main className="py-8 md:py-12">
      <div className={`${siteConfig.maxWidthClass} grid gap-8 lg:grid-cols-[1fr_360px]`}>
        <section className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#c21874]">FIT & MATCH</p>
              <h1 className="text-3xl font-semibold text-[#241820]">Shopping Cart</h1>
            </div>
            {activeItems.length > 0 ? (
              <form action={clearCartAction}>
                <Button type="submit" variant="secondary">Clear Cart</Button>
              </form>
            ) : null}
          </div>
          {activeItems.length === 0 ? (
            <div className="grid place-items-center gap-3 rounded-3xl border border-[#eadde6] bg-white py-12 text-center shadow-sm">
              <ShoppingBag className="h-8 w-8 text-[#c21874]" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-[#241820]">Your cart is empty</h2>
              <p className="max-w-sm text-sm leading-6 text-[#756871]">Explore collections and add styles you love.</p>
              <ButtonLink href="/search">Continue Shopping</ButtonLink>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeItems.map((item) => <CartItemRow item={item} key={item.id} />)}
            </div>
          )}
          <section className="grid gap-4">
            <h2 className="text-xl font-semibold text-[#241820]">Save for Later</h2>
            {savedItems.length === 0 ? (
              <p className="rounded-3xl border border-[#eadde6] bg-white p-5 text-sm text-[#756871]">Saved items will appear here.</p>
            ) : (
              savedItems.map((item) => <CartItemRow saved item={item} key={item.id} />)
            )}
          </section>
        </section>
        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
            <form action={applyCouponAction}>
              <label className="text-sm font-semibold text-[#241820]" htmlFor="coupon">Coupon</label>
              <div className="mt-3 flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-full border border-[#eadde6] px-4 py-3 text-sm outline-none focus:border-[#c21874] focus:ring-4 focus:ring-[#fde8f3]"
                  id="coupon"
                  name="code"
                  placeholder="Enter code"
                />
                <Button type="submit">Apply</Button>
              </div>
            </form>
            {cart.coupon ? (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#fffafd] p-3 text-sm">
                <span className="font-semibold text-[#241820]">{cart.coupon.code}</span>
                <form action={removeCouponAction}>
                  <Button size="md" type="submit" variant="secondary">Remove</Button>
                </form>
              </div>
            ) : null}
          </div>
          <OrderSummary checkoutHref={activeItems.length > 0 ? "/checkout" : undefined} price={price} />
        </aside>
      </div>
    </main>
  );
}
