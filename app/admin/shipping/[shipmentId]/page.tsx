import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateShippingLabelAction, recordDeliveryAttemptAction, updateShipmentTrackingAction } from "@/features/shipping/actions";
import { getAdminShipment } from "@/features/shipping/data";
import { shipmentFlow, shipmentStatusLabels } from "@/features/shipping/status";

export const metadata = { title: "Shipment Detail" };
export const dynamic = "force-dynamic";

export default async function AdminShipmentPage({ params }: { params: Promise<{ shipmentId: string }> }) {
  const { shipmentId } = await params;
  const shipment = await getAdminShipment(shipmentId);

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-5">
        <div>
          <Link className="text-sm font-semibold text-[#c21874]" href="/admin/shipping">Back to shipping</Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{shipment.order.orderNumber}</h1>
          <p className="text-sm text-[#756871]">{shipment.courierProvider?.name ?? shipment.carrierName ?? "Courier pending"} · {shipment.trackingNumber ?? "Tracking pending"}</p>
        </div>
        <div className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Tracking Timeline</h2>
          {shipment.trackingEvents.map((event) => (
            <div className="rounded-2xl bg-[#fffafd] p-4" key={event.id}>
              <p className="font-semibold text-[#241820]">{shipmentStatusLabels[event.status]}</p>
              <p className="text-sm text-[#756871]">{event.message}</p>
              <p className="text-xs text-[#756871]">{event.location ? `${event.location} · ` : ""}{event.occurredAt.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Delivery Attempts</h2>
          {shipment.deliveryAttempts.length === 0 ? <p className="text-sm text-[#756871]">No failed attempts recorded.</p> : null}
          {shipment.deliveryAttempts.map((attempt) => <p className="text-sm text-[#756871]" key={attempt.id}>Attempt {attempt.attemptNumber}: {attempt.reason} · {attempt.agentRemarks ?? "No remarks"}</p>)}
        </div>
      </section>
      <aside className="grid content-start gap-4 lg:sticky lg:top-24">
        <form action={generateShippingLabelAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Shipping Label</h2>
          <input name="shipmentId" type="hidden" value={shipment.id} />
          <p className="text-sm text-[#756871]">{shipment.shippingLabel?.labelNumber ?? "No label generated"}</p>
          <Button type="submit">Generate Label</Button>
          <p className="text-xs text-[#756871]">Print label is a PDF placeholder.</p>
        </form>
        <form action={updateShipmentTrackingAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Update Tracking</h2>
          <input name="shipmentId" type="hidden" value={shipment.id} />
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="status" defaultValue={shipment.status}>
            {shipmentFlow.map((status) => <option key={status} value={status}>{shipmentStatusLabels[status]}</option>)}
          </select>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="location" placeholder="Location" />
          <textarea className="min-h-24 rounded-3xl border border-[#eadde6] p-4" name="message" placeholder="Tracking message" required />
          <Button type="submit">Append Event</Button>
        </form>
        <form action={recordDeliveryAttemptAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Delivery Attempt</h2>
          <input name="shipmentId" type="hidden" value={shipment.id} />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="reason" placeholder="Failure reason" required />
          <textarea className="min-h-20 rounded-3xl border border-[#eadde6] p-4" name="agentRemarks" placeholder="Agent remarks" />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="rescheduleDate" type="date" />
          <Button type="submit" variant="secondary">Record Attempt</Button>
        </form>
      </aside>
    </main>
  );
}
