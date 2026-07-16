import { NextResponse } from "next/server";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { logCustomerAudit } from "@/features/checkout/audit";
import { razorpayFailureSchema } from "@/features/checkout/schemas";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = razorpayFailureSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid failure payload" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: { checkoutSessionId: parsed.data.checkoutSessionId, userId: user.id },
  });
  if (!payment) {
    return NextResponse.json({ error: "Payment was not found" }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED", failureReason: parsed.data.errorDescription ?? "Payment failed" },
  });
  await prisma.paymentAttempt.create({
    data: {
      paymentId: payment.id,
      razorpayOrderId: parsed.data.razorpay_order_id ?? payment.razorpayOrderId,
      status: "FAILED",
      errorCode: parsed.data.errorCode,
      errorDescription: parsed.data.errorDescription,
    },
  });
  await prisma.checkoutSession.update({ where: { id: parsed.data.checkoutSessionId }, data: { status: "FAILED" } });
  await logCustomerAudit({ action: "PAYMENT_FAILED", entityType: "Payment", entityId: payment.id, message: parsed.data.errorDescription ?? "Razorpay payment failed." });
  await sendEmail({ to: user.email, subject: "FIT & MATCH payment failed", react: PaymentFailedEmail({ name: user.name, reason: parsed.data.errorDescription }) });

  return NextResponse.json({ status: "FAILED" });
}
