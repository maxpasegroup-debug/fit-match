import { NextResponse } from "next/server";
import { getCustomerOrder } from "@/features/orders/data";
import { invoiceText } from "@/features/orders/invoice";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await getCustomerOrder(orderId);
  return new NextResponse(invoiceText(order), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${order.orderNumber}-invoice.txt"`,
    },
  });
}
