import Link from "next/link";
import { cancelOrderAction, requestReturnAction } from "@/features/orders/actions";
import { getCustomerOrder } from "@/features/orders/data";
import { formatMoney } from "@/features/checkout/price-engine";
import { customerCancelableStatuses, orderStatusLabels } from "@/features/orders/status";
import { shipmentStatusLabels } from "@/features/shipping/status";
import { saveRecommendationFeedbackAction } from "@/features/fit/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Order Details" };
export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getCustomerOrder(orderId);
  const canCancel = customerCancelableStatuses.includes(order.status);

  return (
    <main className="py-8 md:py-12">
      <div className={`${siteConfig.maxWidthClass} grid gap-6 lg:grid-cols-[1fr_360px]`}>
        <section className="grid gap-5">
          <div>
            <Link className="text-sm font-semibold text-[#c21874]" href="/orders">Back to orders</Link>
            <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{order.orderNumber}</h1>
            <p className="text-sm text-[#756871]">{orderStatusLabels[order.status]}</p>
          </div>
          <Card className="grid gap-4 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">Items</h2>
            {order.items.map((item) => (
              <div className="grid gap-3 border-b border-[#f4eaf0] py-3 last:border-0 md:grid-cols-[1fr_auto]" key={item.id}>
                <div>
                  <p className="font-semibold text-[#241820]">{(item.productSnapshot as { name?: string }).name ?? "Product"}</p>
                  <p className="text-sm text-[#756871]">Qty {item.quantity} · Locked price {formatMoney(item.unitPrice)}</p>
                  <form action={saveRecommendationFeedbackAction} className="mt-3 flex flex-wrap gap-2">
                    <input name="orderItemId" type="hidden" value={item.id} />
                    <select className="h-10 rounded-full border border-[#eadde6] px-3 text-sm" name="feedback">
                      <option value="TOO_TIGHT">Too Tight</option>
                      <option value="PERFECT_FIT">Perfect Fit</option>
                      <option value="TOO_LOOSE">Too Loose</option>
                      <option value="TOO_LONG">Too Long</option>
                      <option value="TOO_SHORT">Too Short</option>
                      <option value="LOVED_IT">Loved It</option>
                    </select>
                    <Button size="md" type="submit" variant="secondary">Save Fit Feedback</Button>
                  </form>
                </div>
                <p className="font-bold text-[#241820]">{formatMoney(item.lineTotal)}</p>
              </div>
            ))}
          </Card>
          <Card className="grid gap-4 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">Timeline</h2>
            <div className="grid gap-4">
              {order.timeline.map((event) => (
                <div className="grid grid-cols-[12px_1fr] gap-3" key={event.id}>
                  <span className="mt-2 h-3 w-3 rounded-full bg-[#c21874]" />
                  <div>
                    <p className="font-semibold text-[#241820]">{orderStatusLabels[event.status]}</p>
                    <p className="text-sm text-[#756871]">{event.message}</p>
                    <p className="mt-1 text-xs text-[#756871]">{event.createdAt.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="grid gap-4 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">Shipment</h2>
            {order.shipments.length === 0 ? (
              <p className="text-sm text-[#756871]">Shipment details will appear after packing.</p>
            ) : (
              order.shipments.map((shipment) => (
                <div className="grid gap-4" key={shipment.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#241820]">{shipment.courierProvider?.name ?? shipment.carrierName ?? "Courier pending"}</p>
                      <p className="text-sm text-[#756871]">Tracking: {shipment.trackingNumber ?? "Pending"}</p>
                      <p className="text-sm text-[#756871]">Estimated delivery: {shipment.estimatedDelivery ? shipment.estimatedDelivery.toLocaleDateString("en-IN") : "To be updated"}</p>
                    </div>
                    <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{shipmentStatusLabels[shipment.status]}</span>
                  </div>
                  <div className="grid gap-3">
                    {shipment.trackingEvents.map((event) => (
                      <div className="rounded-2xl bg-[#fffafd] p-4" key={event.id}>
                        <p className="font-semibold text-[#241820]">{shipmentStatusLabels[event.status]}</p>
                        <p className="text-sm text-[#756871]">{event.message}</p>
                        <p className="text-xs text-[#756871]">{event.location ? `${event.location} · ` : ""}{event.occurredAt.toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#756871]">Delivery proof placeholders: photo, signature, OTP, and geo-location.</p>
                </div>
              ))
            )}
          </Card>
        </section>
        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <Card className="grid gap-3 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">Summary</h2>
            <Line label="Subtotal" value={formatMoney(order.subtotal)} />
            <Line label="Discount" value={formatMoney(Number(order.discount) + Number(order.couponDiscount))} />
            <Line label="Delivery" value={formatMoney(order.deliveryCharge)} />
            <Line label="Grand Total" value={formatMoney(order.grandTotal)} strong />
            <a className="inline-flex h-11 items-center justify-center rounded-full bg-[#c21874] px-5 text-sm font-semibold text-white" href={`/orders/${order.id}/invoice`}>Download Invoice</a>
          </Card>
          {canCancel ? (
            <Card className="grid gap-3 p-5">
              <h2 className="text-lg font-semibold text-[#241820]">Cancel Order</h2>
              <form action={cancelOrderAction} className="grid gap-3">
                <input name="orderId" type="hidden" value={order.id} />
                <textarea className="min-h-24 rounded-3xl border border-[#eadde6] p-4" name="reason" placeholder="Reason for cancellation" required />
                <Button type="submit" variant="secondary">Request Cancellation</Button>
              </form>
            </Card>
          ) : null}
          <Card className="grid gap-3 p-5">
            <h2 className="text-lg font-semibold text-[#241820]">Return Request</h2>
            <form action={requestReturnAction} className="grid gap-3">
              <input name="orderId" type="hidden" value={order.id} />
              <textarea className="min-h-24 rounded-3xl border border-[#eadde6] p-4" name="reason" placeholder="Reason for return" required />
              <Button type="submit" variant="secondary">Request Return</Button>
            </form>
            <p className="text-xs text-[#756871]">Photo upload is a placeholder for a later phase.</p>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function Line({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between gap-3 ${strong ? "font-bold text-[#241820]" : "text-sm text-[#756871]"}`}><span>{label}</span><span>{value}</span></div>;
}
