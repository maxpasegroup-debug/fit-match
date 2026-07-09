import { formatMoney } from "@/features/checkout/price-engine";
import type { OrderView } from "@/features/orders/data";

export function invoiceText(order: OrderView): string {
  const lines = [
    "SIGN SILKS",
    "FIT & Match Invoice",
    `Invoice: ${order.invoice?.invoiceNumber ?? "Pending"}`,
    `Order: ${order.orderNumber}`,
    `Date: ${order.createdAt.toISOString()}`,
    "",
    ...order.items.map((item) => `${item.quantity} x ${(item.productSnapshot as { name?: string }).name ?? "Product"} - ${formatMoney(item.lineTotal)}`),
    "",
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Discount: ${formatMoney(Number(order.discount) + Number(order.couponDiscount))}`,
    `Delivery: ${formatMoney(order.deliveryCharge)}`,
    `Tax: ${formatMoney(order.tax)}`,
    `Grand Total: ${formatMoney(order.grandTotal)}`,
    "",
    "PDF rendering is reserved for the document generation phase.",
  ];
  return lines.join("\n");
}
