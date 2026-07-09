import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getRazorpayClient, isRazorpayConfigured } from "@/lib/payments/razorpay";
import { calculatePriceSummary } from "@/features/checkout/price-engine";
import { logCustomerAudit } from "@/features/checkout/audit";
import { razorpayOrderSchema } from "@/features/checkout/schemas";

type RazorpayOrderResult = {
  id: string;
  amount: number;
  currency: string;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = razorpayOrderSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
  }

  const checkout = await prisma.checkoutSession.findFirst({
    where: { id: parsed.data.checkoutSessionId, userId: user.id },
    include: {
      cart: { include: { coupon: true, items: { where: { status: "ACTIVE" } } } },
      orderDraft: true,
    },
  });
  if (!checkout || checkout.cart.items.length === 0) {
    return NextResponse.json({ error: "Checkout session was not found" }, { status: 404 });
  }
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payment gateway is not configured." }, { status: 503 });
  }

  const price = calculatePriceSummary(checkout.cart.items, checkout.cart.coupon);
  const order = (await getRazorpayClient().orders.create({
    amount: Math.round(price.grandTotal * 100),
    currency: "INR",
    receipt: checkout.id,
    notes: { checkoutSessionId: checkout.id, userId: user.id },
  })) as RazorpayOrderResult;

  const payment = await prisma.payment.upsert({
    where: { checkoutSessionId: checkout.id },
    update: {
      razorpayOrderId: order.id,
      amount: price.grandTotal,
      status: "PENDING",
      failureReason: null,
    },
    create: {
      userId: user.id,
      checkoutSessionId: checkout.id,
      orderDraftId: checkout.orderDraft?.id,
      razorpayOrderId: order.id,
      amount: price.grandTotal,
      status: "PENDING",
    },
  });
  await prisma.paymentAttempt.create({
    data: { paymentId: payment.id, razorpayOrderId: order.id, status: "CREATED" },
  });
  await prisma.checkoutSession.update({
    where: { id: checkout.id },
    data: { status: "PAYMENT_PENDING", ...price },
  });
  await logCustomerAudit({ action: "PAYMENT_ATTEMPT_CREATED", entityType: "Payment", entityId: payment.id, message: "Razorpay order created." });

  return NextResponse.json({
    checkoutSessionId: checkout.id,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
