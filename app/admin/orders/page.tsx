import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/features/orders/data";
import { formatMoney } from "@/features/checkout/price-engine";
import { adminOrderFlow, orderStatusLabels } from "@/features/orders/status";

export const metadata = { title: "Admin Orders" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const orders = await getAdminOrders(params);

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold text-[#c21874]">Admin</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Order Management</h1>
      </div>
      <form className="flex flex-col gap-3 rounded-3xl border border-[#eadde6] bg-white p-4 shadow-sm md:flex-row">
        <input className="h-12 flex-1 rounded-full border border-[#eadde6] px-4" name="q" placeholder="Search order, customer, email" />
        <select className="h-12 rounded-full border border-[#eadde6] px-4" name="status">
          <option value="">All statuses</option>
          {adminOrderFlow.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}
        </select>
        <Button type="submit">Filter</Button>
      </form>
      <div className="overflow-hidden rounded-3xl border border-[#eadde6] bg-white shadow-sm">
        <div className="grid gap-3 p-4">
          {orders.map((order) => (
            <article className="grid gap-3 border-b border-[#f4eaf0] p-4 last:border-0 md:grid-cols-[1fr_auto]" key={order.id}>
              <div>
                <Link className="font-semibold text-[#241820]" href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                <p className="mt-1 text-sm text-[#756871]">{order.user.name} · {order.user.email} · {order.items.length} items</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{orderStatusLabels[order.status]}</span>
                <span className="font-bold text-[#241820]">{formatMoney(order.grandTotal)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
