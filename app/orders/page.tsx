import Link from "next/link";
import { PackageCheck, Search } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { getCustomerOrders } from "@/features/orders/data";
import { formatMoney } from "@/features/checkout/price-engine";
import { orderStatusLabels } from "@/features/orders/status";
import { repeatOrderAction } from "@/features/orders/actions";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "My Orders" };
export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orders = await getCustomerOrders(params);

  return (
    <main className="py-8 md:py-12">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <p className="text-sm font-semibold text-[#c21874]">SIGN SILKS</p>
          <h1 className="text-3xl font-semibold text-[#241820]">My Orders</h1>
        </div>
        <form className="flex flex-col gap-3 rounded-3xl border border-[#eadde6] bg-white p-4 shadow-sm sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756871]" />
            <input className="h-12 w-full rounded-full border border-[#eadde6] pl-11 pr-4 outline-none focus:border-[#c21874] focus:ring-4 focus:ring-[#fde8f3]" name="q" placeholder="Search by order number" />
          </label>
          <Button type="submit">Search</Button>
        </form>
        {orders.length === 0 ? (
          <div className="grid place-items-center gap-3 rounded-3xl border border-[#eadde6] bg-white py-12 text-center shadow-sm">
            <PackageCheck className="h-8 w-8 text-[#c21874]" />
            <h2 className="text-lg font-semibold text-[#241820]">No orders yet</h2>
            <p className="max-w-sm text-sm text-[#756871]">Paid order drafts will appear here after checkout.</p>
            <ButtonLink href="/search">Continue Shopping</ButtonLink>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article className="rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" key={order.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link className="text-lg font-semibold text-[#241820]" href={`/orders/${order.id}`}>{order.orderNumber}</Link>
                    <p className="mt-1 text-sm text-[#756871]">{order.items.length} items · {order.createdAt.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{orderStatusLabels[order.status]}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-[#241820]">{formatMoney(order.grandTotal)}</p>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href={`/orders/${order.id}`} variant="secondary">View Details</ButtonLink>
                    <a className="inline-flex h-11 items-center justify-center rounded-full border border-[#eadde6] px-5 text-sm font-semibold text-[#241820]" href={`/orders/${order.id}/invoice`}>Invoice</a>
                    <form action={repeatOrderAction}>
                      <input name="orderId" type="hidden" value={order.id} />
                      <Button type="submit" variant="secondary">Repeat</Button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
