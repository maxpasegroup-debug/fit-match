import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createShipmentAction, saveCourierProviderAction } from "@/features/shipping/actions";
import { getAdminShippingData } from "@/features/shipping/data";
import { shipmentStatusLabels } from "@/features/shipping/status";

export const metadata = { title: "Admin Shipping" };
export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const { shipments, providers, warehouses, readyOrders } = await getAdminShippingData();

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold text-[#c21874]">Logistics</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Shipping Management</h1>
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <form action={createShipmentAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Generate Shipment</h2>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="orderId" required>
            <option value="">Ready order</option>
            {readyOrders.map((order) => <option key={order.id} value={order.id}>{order.orderNumber} · {order.user.email}</option>)}
          </select>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="courierProviderId" required>
            <option value="">Courier</option>
            {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
          </select>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="warehouseId">
            <option value="">Warehouse optional</option>
            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </select>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="packageCount" placeholder="Package count" type="number" min="1" defaultValue="1" />
          <Button type="submit">Create Shipment</Button>
        </form>
        <form action={saveCourierProviderAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Courier Provider</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="name" placeholder="Provider name" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="code" placeholder="Code e.g. SHIPROCKET" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="trackingUrlTemplate" placeholder="Tracking URL template placeholder" />
          <Button type="submit" variant="secondary">Save Provider</Button>
        </form>
      </section>
      <section className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#241820]">Shipments</h2>
        {shipments.map((shipment) => (
          <Link className="grid gap-2 rounded-2xl border border-[#f4eaf0] p-4 md:grid-cols-[1fr_auto]" href={`/admin/shipping/${shipment.id}`} key={shipment.id}>
            <span>
              <strong className="block text-[#241820]">{shipment.order.orderNumber}</strong>
              <span className="text-sm text-[#756871]">{shipment.order.user.email} · {shipment.courierProvider?.name ?? shipment.carrierName ?? "Courier pending"} · {shipment.trackingNumber ?? "No tracking"}</span>
            </span>
            <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{shipmentStatusLabels[shipment.status]}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
