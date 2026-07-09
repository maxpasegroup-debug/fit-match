"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { OrderCancelledEmail } from "@/emails/order-cancelled";
import { OrderDeliveredEmail } from "@/emails/order-delivered";
import { OrderShippedEmail } from "@/emails/order-shipped";
import { requireAdmin } from "@/lib/admin/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { auditLog } from "@/features/admin/audit";
import {
  adminStatusSchema,
  cancellationSchema,
  orderIdSchema,
  qualityCheckSchema,
  returnRequestSchema,
  tailoringAssignmentSchema,
  tailoringStageSchema,
} from "@/features/orders/schemas";
import { customerCancelableStatuses, orderStatusLabels } from "@/features/orders/status";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function addTimeline(orderId: string, status: OrderStatus, message: string, changedById?: string) {
  const current = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, select: { status: true } });
  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status } }),
    prisma.orderTimeline.create({ data: { orderId, status, message } }),
    prisma.orderStatusHistory.create({
      data: { orderId, fromStatus: current.status, toStatus: status, changedById, message },
    }),
  ]);
}

export async function cancelOrderAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const input = cancellationSchema.parse({ orderId: text(formData, "orderId"), reason: text(formData, "reason") });
  const order = await prisma.order.findFirstOrThrow({ where: { id: input.orderId, userId: user.id } });
  if (!customerCancelableStatuses.includes(order.status)) {
    throw new Error("This order can no longer be cancelled because tailoring has started.");
  }
  await prisma.$transaction([
    prisma.cancellationRequest.upsert({
      where: { orderId: order.id },
      create: { orderId: order.id, userId: user.id, reason: input.reason },
      update: { reason: input.reason, status: "PENDING" },
    }),
    prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } }),
    prisma.orderTimeline.create({ data: { orderId: order.id, status: "CANCELLED", message: "Cancellation request recorded." } }),
    prisma.orderStatusHistory.create({ data: { orderId: order.id, fromStatus: order.status, toStatus: "CANCELLED", message: input.reason } }),
  ]);
  await sendEmail({ to: user.email, subject: "SIGN SILKS order cancelled", react: OrderCancelledEmail({ name: user.name, orderNumber: order.orderNumber }) });
  revalidatePath("/orders");
  revalidatePath(`/orders/${order.id}`);
}

export async function requestReturnAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const input = returnRequestSchema.parse({ orderId: text(formData, "orderId"), reason: text(formData, "reason") });
  const order = await prisma.order.findFirstOrThrow({ where: { id: input.orderId, userId: user.id } });
  await prisma.returnRequest.create({ data: { orderId: order.id, userId: user.id, reason: input.reason, photos: [] } });
  await prisma.orderTimeline.create({ data: { orderId: order.id, status: order.status, message: "Return request received. Photos upload is reserved for a later phase." } });
  revalidatePath(`/orders/${order.id}`);
}

export async function repeatOrderAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { orderId } = orderIdSchema.parse({ orderId: text(formData, "orderId") });
  const order = await prisma.order.findFirstOrThrow({ where: { id: orderId, userId: user.id }, include: { items: true } });
  const cart = await prisma.cart.upsert({ where: { userId: user.id }, create: { userId: user.id }, update: {} });
  await prisma.cartItem.createMany({
    data: order.items
      .filter((item) => item.productId)
      .map((item) => ({
        cartId: cart.id,
        productId: item.productId as string,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
  });
  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateOrderStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = adminStatusSchema.parse({
    orderId: text(formData, "orderId"),
    status: text(formData, "status"),
    message: text(formData, "message") || undefined,
  });
  const message = input.message ?? `Order moved to ${orderStatusLabels[input.status]}.`;
  await addTimeline(input.orderId, input.status, message, admin.id);
  const order = await prisma.order.findUniqueOrThrow({ where: { id: input.orderId }, include: { user: true } });
  if (input.status === "SHIPPED") {
    await sendEmail({ to: order.user.email, subject: "SIGN SILKS order shipped", react: OrderShippedEmail({ name: order.user.name, orderNumber: order.orderNumber }) });
  }
  if (input.status === "DELIVERED") {
    await sendEmail({ to: order.user.email, subject: "SIGN SILKS order delivered", react: OrderDeliveredEmail({ name: order.user.name, orderNumber: order.orderNumber }) });
  }
  await auditLog({ admin, action: "ORDER_STATUS_CHANGED", entityType: "Order", entityId: input.orderId, message });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${input.orderId}`);
}

export async function assignTailorAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = tailoringAssignmentSchema.parse({
    orderId: text(formData, "orderId"),
    assignedTailorName: text(formData, "assignedTailorName"),
    estimatedCompletion: text(formData, "estimatedCompletion") || undefined,
  });
  await prisma.tailoringJob.upsert({
    where: { orderId: input.orderId },
    create: {
      orderId: input.orderId,
      assignedTailorName: input.assignedTailorName,
      assignedById: admin.id,
      assignedAt: new Date(),
      estimatedCompletion: input.estimatedCompletion ? new Date(input.estimatedCompletion) : undefined,
      currentStage: "CUTTING",
    },
    update: {
      assignedTailorName: input.assignedTailorName,
      assignedById: admin.id,
      assignedAt: new Date(),
      estimatedCompletion: input.estimatedCompletion ? new Date(input.estimatedCompletion) : undefined,
    },
  });
  await addTimeline(input.orderId, "ASSIGNED_TO_TAILOR", `Assigned to ${input.assignedTailorName}.`, admin.id);
  await auditLog({ admin, action: "TAILOR_ASSIGNED", entityType: "Order", entityId: input.orderId, message: `Assigned tailor ${input.assignedTailorName}` });
  revalidatePath(`/admin/orders/${input.orderId}`);
}

export async function updateTailoringStageAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = tailoringStageSchema.parse({ orderId: text(formData, "orderId"), stage: text(formData, "stage"), remarks: text(formData, "remarks") || undefined });
  const job = await prisma.tailoringJob.upsert({
    where: { orderId: input.orderId },
    create: { orderId: input.orderId, assignedById: admin.id, currentStage: input.stage },
    update: { currentStage: input.stage },
  });
  await prisma.tailoringStage.create({ data: { tailoringJobId: job.id, stage: input.stage, startedAt: new Date(), completedAt: input.stage === "COMPLETED" ? new Date() : undefined, remarks: input.remarks } });
  await addTimeline(input.orderId, input.stage === "COMPLETED" ? "QUALITY_CHECK" : "STITCHING_STARTED", `Tailoring stage: ${input.stage}.`, admin.id);
  await auditLog({ admin, action: "TAILORING_STAGE_UPDATED", entityType: "Order", entityId: input.orderId, message: input.stage });
  revalidatePath(`/admin/orders/${input.orderId}`);
}

export async function recordQualityCheckAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = qualityCheckSchema.parse({ orderId: text(formData, "orderId"), passed: text(formData, "passed") === "true", remarks: text(formData, "remarks") || undefined });
  await prisma.qualityCheck.create({ data: { orderId: input.orderId, inspectorId: admin.id, passed: input.passed, remarks: input.remarks } });
  await addTimeline(input.orderId, input.passed ? "PACKING" : "QUALITY_CHECK", input.passed ? "Quality check passed. Moving to packing." : "Quality check failed. Rework required.", admin.id);
  await auditLog({ admin, action: "QUALITY_CHECK_RECORDED", entityType: "Order", entityId: input.orderId, message: input.remarks ?? "Quality check recorded" });
  revalidatePath(`/admin/orders/${input.orderId}`);
}

export async function generateInvoiceAction(formData: FormData) {
  const admin = await requireAdmin();
  const { orderId } = orderIdSchema.parse({ orderId: text(formData, "orderId") });
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  await prisma.invoice.upsert({
    where: { orderId },
    create: { orderId, invoiceNumber: `INV-${order.orderNumber}` },
    update: { issuedAt: new Date() },
  });
  await auditLog({ admin, action: "INVOICE_GENERATED", entityType: "Order", entityId: orderId, message: `Invoice generated for ${order.orderNumber}` });
  revalidatePath(`/admin/orders/${orderId}`);
}
