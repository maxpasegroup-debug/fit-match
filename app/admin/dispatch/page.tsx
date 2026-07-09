import { Button } from "@/components/ui/button";
import { createDispatchBatchAction } from "@/features/shipping/actions";
import { getDispatchData } from "@/features/shipping/data";
import { shipmentStatusLabels } from "@/features/shipping/status";

export const metadata = { title: "Admin Dispatch" };
export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const { batches, shipments, warehouses } = await getDispatchData();

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold text-[#c21874]">Logistics</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Dispatch</h1>
      </div>
      <form action={createDispatchBatchAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#241820]">Bulk Dispatch</h2>
        <select className="h-12 rounded-full border border-[#eadde6] px-4" name="warehouseId">
          <option value="">Warehouse optional</option>
          {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
        </select>
        <div className="grid gap-3">
          {shipments.map((shipment) => (
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-[#f4eaf0] p-4" key={shipment.id}>
              <span className="flex items-center gap-3">
                <input name="shipmentIds" type="checkbox" value={shipment.id} />
                <span>
                  <strong className="block text-[#241820]">{shipment.order.orderNumber}</strong>
                  <span className="text-sm text-[#756871]">{shipment.courierProvider?.name ?? "Courier"} · {shipment.trackingNumber ?? "Tracking pending"}</span>
                </span>
              </span>
              <span className="text-xs font-bold text-[#9f125d]">{shipmentStatusLabels[shipment.status]}</span>
            </label>
          ))}
        </div>
        <Button type="submit">Create Dispatch Batch</Button>
      </form>
      <section className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#241820]">Recent Batches</h2>
        {batches.map((batch) => (
          <article className="rounded-2xl bg-[#fffafd] p-4" key={batch.id}>
            <p className="font-semibold text-[#241820]">{batch.batchNumber}</p>
            <p className="text-sm text-[#756871]">{batch.warehouse?.name ?? "No warehouse"} · {batch.shipments.length} shipments · {batch.status}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
