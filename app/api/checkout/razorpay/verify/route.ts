import { NextResponse } from "next/server";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import { OrderConfirmedEmail } from "@/emails/order-confirmed";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { logCustomerAudit } from "@/features/checkout/audit";
import { razorpayVerifySchema } from "@/features/checkout/schemas";
import { convertPaidDraftToOrder } from "@/features/orders/conversion";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = razorpayVerifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
  }
  const input = parsed.data;
  const payment = await prisma.payment.findFirst({
    where: {
      userId: user.id,
      checkoutSessionId: input.checkoutSessionId,
      razorpayOrderId: input.razorpay_order_id,
    },
    include: { checkoutSession: true },
  });
  if (!payment) {
    return NextResponse.json({ error: "Payment was not found" }, { status: 404 });
  }

  const valid = verifyRazorpaySignature({
    razorpayOrderId: input.razorpay_order_id,
    razorpayPaymentId: input.razorpay_payment_id,
    razorpaySignature: input.razorpay_signature,
  });
  if (!valid) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", failureReason: "Payment signature verification failed" },
    });
    await prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        razorpayOrderId: input.razorpay_order_id,
        razorpayPaymentId: input.razorpay_payment_id,
        status: "FAILED",
        errorDescription: "Signature verification failed",
      },
    });
    await prisma.checkoutSession.update({ where: { id: input.checkoutSessionId }, data: { status: "FAILED" } });
    await logCustomerAudit({ action: "PAYMENT_FAILED", entityType: "Payment", entityId: payment.id, message: "Payment signature verification failed." });
    await sendEmail({ to: user.email, subject: "SIGN SILKS payment failed", react: PaymentFailedEmail({ name: user.name, reason: "signature verification failed" }) });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: input.razorpay_payment_id,
        razorpaySignature: input.razorpay_signature,
        transactionId: input.razorpay_payment_id,
      },
    }),
    prisma.paymentAttempt.create({
      data: {
        paymentId: payment.id,
        razorpayOrderId: input.razorpay_order_id,
        razorpayPaymentId: input.razorpay_payment_id,
        status: "PAID",
      },
    }),
    prisma.checkoutSession.update({ where: { id: input.checkoutSessionId }, data: { status: "COMPLETED" } }),
    ...(payment.checkoutSession.couponId
      ? [
          prisma.couponUsage.create({
            data: { couponId: payment.checkoutSession.couponId, userId: user.id, paymentId: payment.id },
          }),
        ]
      : []),
  ]);
  const order = await convertPaidDraftToOrder(payment.id);
  await logCustomerAudit({ action: "PAYMENT_SUCCESS", entityType: "Payment", entityId: payment.id, message: "Razorpay payment verified." });
  await sendEmail({
    to: user.email,
    subject: "SIGN SILKS payment successful",
    react: PaymentSuccessEmail({ name: user.name, total: Number(payment.amount), transactionId: input.razorpay_payment_id }),
  });
  await sendEmail({
    to: user.email,
    subject: "SIGN SILKS order confirmed",
    react: OrderConfirmedEmail({ name: user.name, orderNumber: order.orderNumber }),
  });

  return NextResponse.json({ status: "PAID" });
}
