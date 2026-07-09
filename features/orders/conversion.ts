import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { logCustomerAudit } from "@/features/checkout/audit";
import { trackServerEvent } from "@/lib/analytics/server";

type Tx = Prisma.TransactionClient;

function orderNumber(paymentId: string) {
  return `SS-${new Date().getFullYear()}-${paymentId.slice(-8).toUpperCase()}`;
}

function invoiceNumber(paymentId: string) {
  return `INV-${new Date().getFullYear()}-${paymentId.slice(-8).toUpperCase()}`;
}

function snapshot(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === null || value === undefined) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export async function convertPaidDraftToOrder(paymentId: string) {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      order: true,
      checkoutSession: {
        include: {
          cart: {
            include: {
              items: {
                where: { status: "ACTIVE" },
                include: { product: true, productVariant: true, measurementProfile: true },
              },
            },
          },
          deliveryAddress: true,
          billingAddress: true,
          measurementProfile: true,
          giftNote: true,
          orderDraft: true,
        },
      },
    },
  });
  if (payment.order) return payment.order;
  if (payment.status !== "PAID" || !payment.orderDraftId || !payment.checkoutSession.orderDraft) {
    throw new Error("Only paid order drafts can be converted.");
  }

  const created = await prisma.$transaction(async (tx) => createOrder(tx, payment));
  await logCustomerAudit({ action: "ORDER_CREATED", entityType: "Order", entityId: created.id, message: `Created order ${created.orderNumber}.` });
  await trackServerEvent("order", { value: Number(created.grandTotal), metadata: { orderId: created.id, orderNumber: created.orderNumber } });
  return created;
}

async function createOrder(
  tx: Tx,
  payment: Prisma.PaymentGetPayload<{
    include: {
      checkoutSession: {
        include: {
          cart: { include: { items: { include: { product: true; productVariant: true; measurementProfile: true } } } };
          deliveryAddress: true;
          billingAddress: true;
          measurementProfile: true;
          giftNote: true;
          orderDraft: true;
        };
      };
    };
  }>,
) {
  const checkout = payment.checkoutSession;
  const draft = checkout.orderDraft;
  if (!draft) throw new Error("Order draft missing.");

  const order = await tx.order.create({
    data: {
      orderNumber: orderNumber(payment.id),
      userId: payment.userId,
      checkoutSessionId: checkout.id,
      orderDraftId: draft.id,
      paymentId: payment.id,
      status: "PAID",
      subtotal: draft.subtotal,
      discount: draft.discount,
      couponDiscount: draft.couponDiscount,
      deliveryCharge: draft.deliveryCharge,
      tax: draft.tax,
      grandTotal: draft.grandTotal,
      currency: payment.currency,
      deliveryAddressSnapshot: snapshot(checkout.deliveryAddress) ?? {},
      billingAddressSnapshot: snapshot(checkout.billingAddress),
      measurementSnapshot: snapshot(checkout.measurementProfile),
      giftNoteSnapshot: snapshot(checkout.giftNote),
      items: {
        create: checkout.cart.items.map((item) => ({
          productId: item.productId,
          productSnapshot: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            sku: item.product.sku,
            brand: item.product.brand,
            shortDescription: item.product.shortDescription,
          },
          variantSnapshot: snapshot(item.productVariant),
          priceSnapshot: {
            unitPrice: Number(item.unitPrice),
            quantity: item.quantity,
            lineTotal: Number(item.unitPrice) * item.quantity,
          },
          measurementSnapshot: snapshot(item.measurementProfile ?? checkout.measurementProfile),
          giftNoteSnapshot: snapshot(checkout.giftNote),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: Number(item.unitPrice) * item.quantity,
        })),
      },
      timeline: {
        create: [
          { status: "PAID", message: "Payment received and order created." },
          { status: "CONFIRMED", message: "SIGN SILKS is reviewing your order for stitching." },
        ],
      },
      statusHistory: {
        create: { fromStatus: null, toStatus: "PAID", message: "Order created after successful payment." },
      },
      invoice: { create: { invoiceNumber: invoiceNumber(payment.id) } },
      shipments: { create: { status: "PENDING" } },
    },
  });

  await tx.cartItem.deleteMany({ where: { cartId: checkout.cartId, status: "ACTIVE" } });
  await tx.cart.update({ where: { id: checkout.cartId }, data: { couponId: null } });
  return order;
}
