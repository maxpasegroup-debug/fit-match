import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  assignTailorAction,
  generateInvoiceAction,
  recordQualityCheckAction,
  updateOrderStatusAction,
  updateTailoringStageAction,
} from "@/features/orders/actions";
import { getAdminOrder } from "@/features/orders/data";
import { formatMoney } from "@/features/checkout/price-engine";
import { adminOrderFlow, orderStatusLabels } from "@/features/orders/status";

export const metadata = { title: "Admin Order Detail" };
export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-5">
        <div>
          <Link className="text-sm font-semibold text-[#c21874]" href="/admin/orders">Back to orders</Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{order.orderNumber}</h1>
          <p className="text-sm text-[#756871]">{order.user.name} · {order.user.email}</p>
        </div>
        <Card className="grid gap-4 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Items</h2>
          {order.items.map((item) => (
            <div className="flex justify-between gap-3 border-b border-[#f4eaf0] py-3 last:border-0" key={item.id}>
              <div>
                <p className="font-semibold text-[#241820]">{(item.productSnapshot as { name?: string }).name ?? "Product"}</p>
                <p className="text-sm text-[#756871]">Qty {item.quantity} · immutable snapshot</p>
              </div>
              <p className="font-bold text-[#241820]">{formatMoney(item.lineTotal)}</p>
            </div>
          ))}
        </Card>
        <Card className="grid gap-4 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Timeline</h2>
          {order.timeline.map((event) => (
            <div className="grid grid-cols-[12px_1fr] gap-3" key={event.id}>
              <span className="mt-2 h-3 w-3 rounded-full bg-[#c21874]" />
              <div>
                <p className="font-semibold text-[#241820]">{orderStatusLabels[event.status]}</p>
                <p className="text-sm text-[#756871]">{event.message}</p>
                <p className="text-xs text-[#756871]">{event.createdAt.toLocaleString("en-IN")}</p>
              </div>
            </div>
          ))}
        </Card>
        <Card className="grid gap-4 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Quality Checks</h2>
          {order.qualityChecks.length === 0 ? <p className="text-sm text-[#756871]">No quality checks yet.</p> : null}
          {order.qualityChecks.map((check) => (
            <p className="text-sm text-[#756871]" key={check.id}>{check.passed ? "Passed" : "Failed"} by {check.inspector?.email ?? "Inspector"} · {check.remarks ?? "No remarks"}</p>
          ))}
        </Card>
      </section>
      <aside className="grid content-start gap-4 lg:sticky lg:top-24">
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Status</h2>
          <form action={updateOrderStatusAction} className="grid gap-3">
            <input name="orderId" type="hidden" value={order.id} />
            <select className="h-12 rounded-full border border-[#eadde6] px-4" defaultValue={order.status} name="status">
              {adminOrderFlow.map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}
            </select>
            <textarea className="min-h-20 rounded-3xl border border-[#eadde6] p-4" name="message" placeholder="Timeline message" />
            <Button type="submit">Update Status</Button>
          </form>
        </Card>
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Tailoring</h2>
          <form action={assignTailorAction} className="grid gap-3">
            <input name="orderId" type="hidden" value={order.id} />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="assignedTailorName" placeholder="Tailor name" />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="estimatedCompletion" type="date" />
            <Button type="submit" variant="secondary">Assign Tailor</Button>
          </form>
          <form action={updateTailoringStageAction} className="grid gap-3">
            <input name="orderId" type="hidden" value={order.id} />
            <select className="h-12 rounded-full border border-[#eadde6] px-4" name="stage">
              {["CUTTING", "STITCHING", "FINISHING", "IRONING", "COMPLETED"].map((stage) => <option key={stage} value={stage}>{stage}</option>)}
            </select>
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="remarks" placeholder="Remarks" />
            <Button type="submit" variant="secondary">Update Stage</Button>
          </form>
        </Card>
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Quality Check</h2>
          <form action={recordQualityCheckAction} className="grid gap-3">
            <input name="orderId" type="hidden" value={order.id} />
            <select className="h-12 rounded-full border border-[#eadde6] px-4" name="passed">
              <option value="true">Passed</option>
              <option value="false">Failed</option>
            </select>
            <textarea className="min-h-20 rounded-3xl border border-[#eadde6] p-4" name="remarks" placeholder="Inspection remarks" />
            <Button type="submit" variant="secondary">Record QC</Button>
          </form>
        </Card>
        <Card className="grid gap-3 p-5">
          <h2 className="text-lg font-semibold text-[#241820]">Invoice</h2>
          <p className="text-sm text-[#756871]">{order.invoice?.invoiceNumber ?? "No invoice yet"}</p>
          <form action={generateInvoiceAction}>
            <input name="orderId" type="hidden" value={order.id} />
            <Button type="submit" variant="secondary">Generate Invoice</Button>
          </form>
        </Card>
      </aside>
    </main>
  );
}
