"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { DeliveryFailedEmail } from "@/emails/delivery-failed";
import { OrderDeliveredEmail } from "@/emails/order-delivered";
import { OrderDispatchedEmail } from "@/emails/order-dispatched";
import { OutForDeliveryEmail } from "@/emails/out-for-delivery";
import { ShipmentCreatedEmail } from "@/emails/shipment-created";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { getCourierProviderAdapter } from "@/lib/shipping/provider";
import { auditLog } from "@/features/admin/audit";
import {
  createShipmentSchema,
  deliveryAttemptSchema,
  dispatchSchema,
  shipmentIdSchema,
  shippingRateSchema,
  trackingUpdateSchema,
  warehouseSchema,
} from "@/features/shipping/schemas";
import { shipmentStatusLabels } from "@/features/shipping/status";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value.length > 0 ? value : undefined;
}

function shipmentIds(formData: FormData) {
  return formData.getAll("shipmentIds").filter((value): value is string => typeof value === "string");
}

async function appendTracking(shipmentId: string, status: keyof typeof shipmentStatusLabels, message: string, location?: string) {
  await prisma.$transaction([
    prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status,
        shippedAt: status === "DISPATCHED" ? new Date() : undefined,
        deliveredAt: status === "DELIVERED" ? new Date() : undefined,
      },
    }),
    prisma.shipmentTracking.create({ data: { shipmentId, status, message, location } }),
  ]);
}

export async function createShipmentAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = createShipmentSchema.parse({
    orderId: text(formData, "orderId"),
    courierProviderId: text(formData, "courierProviderId"),
    warehouseId: optionalText(formData, "warehouseId"),
    packageCount: text(formData, "packageCount") || "1",
  });
  const [order, provider] = await Promise.all([
    prisma.order.findUniqueOrThrow({ where: { id: input.orderId }, include: { user: true } }),
    prisma.courierProvider.findUniqueOrThrow({ where: { id: input.courierProviderId } }),
  ]);
  const adapter = getCourierProviderAdapter();
  const created = await adapter.createShipment({ orderNumber: order.orderNumber, courierCode: provider.code, packageCount: input.packageCount });
  const existingShipment = await prisma.shipment.findFirst({ where: { orderId: order.id, status: "PENDING" } });
  const shipment = existingShipment
    ? await prisma.shipment.update({
        where: { id: existingShipment.id },
        data: {
          courierProviderId: provider.id,
          warehouseId: input.warehouseId,
          status: created.status,
          carrierName: provider.name,
          trackingNumber: created.trackingNumber,
          trackingUrl: created.trackingUrl,
          packages: { create: Array.from({ length: input.packageCount }, (_, index) => ({ label: `Package ${index + 1}` })) },
          trackingEvents: { create: { status: created.status, message: "Shipment created and packed." } },
        },
      })
    : await prisma.shipment.create({
        data: {
          orderId: order.id,
      courierProviderId: provider.id,
      warehouseId: input.warehouseId,
      status: created.status,
      carrierName: provider.name,
      trackingNumber: created.trackingNumber,
      trackingUrl: created.trackingUrl,
      packages: { create: Array.from({ length: input.packageCount }, (_, index) => ({ label: `Package ${index + 1}` })) },
      trackingEvents: { create: { status: created.status, message: "Shipment created and packed." } },
        },
      });
  await auditLog({ admin, action: "SHIPMENT_CREATED", entityType: "Shipment", entityId: shipment.id, message: `Shipment created for ${order.orderNumber}` });
  await sendEmail({ to: order.user.email, subject: "SIGN SILKS shipment created", react: ShipmentCreatedEmail({ name: order.user.name, orderNumber: order.orderNumber, trackingNumber: shipment.trackingNumber ?? "Pending" }) });
  revalidatePath("/admin/shipping");
}

export async function generateShippingLabelAction(formData: FormData) {
  const admin = await requireAdmin();
  const { shipmentId } = shipmentIdSchema.parse({ shipmentId: text(formData, "shipmentId") });
  const shipment = await prisma.shipment.findUniqueOrThrow({ where: { id: shipmentId }, include: { courierProvider: true } });
  const adapter = getCourierProviderAdapter();
  const label = await adapter.generateLabel({ shipmentId, trackingNumber: shipment.trackingNumber ?? shipment.id });
  await prisma.shippingLabel.upsert({
    where: { shipmentId },
    create: { shipmentId, labelNumber: label.labelNumber, labelUrl: label.labelUrl },
    update: { labelNumber: label.labelNumber, labelUrl: label.labelUrl, generatedAt: new Date() },
  });
  await appendTracking(shipmentId, "LABEL_GENERATED", "Shipping label generated.");
  await auditLog({ admin, action: "SHIPPING_LABEL_GENERATED", entityType: "Shipment", entityId: shipmentId, message: label.labelNumber });
  revalidatePath(`/admin/shipping/${shipmentId}`);
  revalidatePath("/admin/shipping");
}

export async function updateShipmentTrackingAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = trackingUpdateSchema.parse({
    shipmentId: text(formData, "shipmentId"),
    status: text(formData, "status"),
    location: optionalText(formData, "location"),
    message: text(formData, "message"),
  });
  const shipment = await prisma.shipment.findUniqueOrThrow({ where: { id: input.shipmentId }, include: { order: { include: { user: true } } } });
  await appendTracking(input.shipmentId, input.status, input.message, input.location);
  if (input.status === "OUT_FOR_DELIVERY") {
    await sendEmail({ to: shipment.order.user.email, subject: "SIGN SILKS out for delivery", react: OutForDeliveryEmail({ name: shipment.order.user.name, orderNumber: shipment.order.orderNumber }) });
  }
  if (input.status === "DELIVERED") {
    await sendEmail({ to: shipment.order.user.email, subject: "SIGN SILKS delivered", react: OrderDeliveredEmail({ name: shipment.order.user.name, orderNumber: shipment.order.orderNumber }) });
  }
  if (input.status === "DELIVERY_FAILED") {
    await sendEmail({ to: shipment.order.user.email, subject: "SIGN SILKS delivery failed", react: DeliveryFailedEmail({ name: shipment.order.user.name, orderNumber: shipment.order.orderNumber }) });
  }
  await auditLog({ admin, action: "SHIPMENT_TRACKING_UPDATED", entityType: "Shipment", entityId: input.shipmentId, message: input.message });
  revalidatePath(`/admin/shipping/${input.shipmentId}`);
}

export async function recordDeliveryAttemptAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = deliveryAttemptSchema.parse({
    shipmentId: text(formData, "shipmentId"),
    reason: text(formData, "reason"),
    agentRemarks: optionalText(formData, "agentRemarks"),
    rescheduleDate: optionalText(formData, "rescheduleDate"),
  });
  const count = await prisma.deliveryAttempt.count({ where: { shipmentId: input.shipmentId } });
  await prisma.deliveryAttempt.create({
    data: {
      shipmentId: input.shipmentId,
      attemptNumber: count + 1,
      reason: input.reason,
      agentRemarks: input.agentRemarks,
      rescheduleDate: input.rescheduleDate ? new Date(input.rescheduleDate) : undefined,
      recordedById: admin.id,
    },
  });
  await appendTracking(input.shipmentId, "DELIVERY_FAILED", input.reason);
  await auditLog({ admin, action: "DELIVERY_ATTEMPT_RECORDED", entityType: "Shipment", entityId: input.shipmentId, message: input.reason });
  revalidatePath(`/admin/shipping/${input.shipmentId}`);
}

export async function createDispatchBatchAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = dispatchSchema.parse({ warehouseId: optionalText(formData, "warehouseId"), shipmentIds: shipmentIds(formData) });
  const batch = await prisma.dispatchBatch.create({
    data: {
      batchNumber: `DSP-${Date.now()}`,
      warehouseId: input.warehouseId,
      createdById: admin.id,
      dispatchedAt: new Date(),
      status: "DISPATCHED",
      shipments: { connect: input.shipmentIds.map((id) => ({ id })) },
    },
  });
  await prisma.shipment.updateMany({ where: { id: { in: input.shipmentIds } }, data: { status: "DISPATCHED", shippedAt: new Date() } });
  await prisma.shipmentTracking.createMany({ data: input.shipmentIds.map((shipmentId) => ({ shipmentId, status: "DISPATCHED", message: `Dispatched in batch ${batch.batchNumber}.` })) });
  const shipments = await prisma.shipment.findMany({ where: { id: { in: input.shipmentIds } }, include: { order: { include: { user: true } } } });
  await Promise.all(shipments.map((shipment) => sendEmail({ to: shipment.order.user.email, subject: "SIGN SILKS order dispatched", react: OrderDispatchedEmail({ name: shipment.order.user.name, orderNumber: shipment.order.orderNumber }) })));
  await auditLog({ admin, action: "DISPATCH_BATCH_CREATED", entityType: "DispatchBatch", entityId: batch.id, message: batch.batchNumber });
  revalidatePath("/admin/dispatch");
  revalidatePath("/admin/shipping");
}

export async function saveWarehouseAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = warehouseSchema.parse({
    id: optionalText(formData, "id"),
    name: text(formData, "name"),
    code: text(formData, "code"),
    phone: optionalText(formData, "phone"),
    address: text(formData, "address"),
    city: text(formData, "city"),
    state: text(formData, "state"),
    pincode: text(formData, "pincode"),
    active: formData.get("active") === "on",
  });
  const warehouse = parsed.id
    ? await prisma.warehouse.update({ where: { id: parsed.id }, data: { ...parsed, id: undefined } })
    : await prisma.warehouse.create({ data: { ...parsed, id: undefined } });
  await auditLog({ admin, action: "WAREHOUSE_SAVED", entityType: "Warehouse", entityId: warehouse.id, message: warehouse.name });
  revalidatePath("/admin/warehouses");
}

export async function saveWarehouseInventoryAction(formData: FormData) {
  const admin = await requireAdmin();
  const warehouseId = text(formData, "warehouseId");
  const productId = text(formData, "productId");
  const availableStock = Number(text(formData, "availableStock") || 0);
  const lowStockAt = Number(text(formData, "lowStockAt") || 5);
  await prisma.warehouseInventory.upsert({
    where: { warehouseId_productId: { warehouseId, productId } },
    create: { warehouseId, productId, availableStock, lowStockAt, updatedById: admin.id },
    update: { availableStock, lowStockAt, updatedById: admin.id },
  });
  await auditLog({ admin, action: "WAREHOUSE_INVENTORY_UPDATED", entityType: "Warehouse", entityId: warehouseId, message: `Inventory updated for product ${productId}` });
  revalidatePath("/admin/warehouses");
}

export async function saveShippingRateAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = shippingRateSchema.parse({
    zoneId: text(formData, "zoneId"),
    serviceLevel: text(formData, "serviceLevel"),
    minWeightGrams: text(formData, "minWeightGrams"),
    maxWeightGrams: text(formData, "maxWeightGrams"),
    price: text(formData, "price"),
    freeShippingThreshold: optionalText(formData, "freeShippingThreshold"),
    estimatedDaysMin: text(formData, "estimatedDaysMin"),
    estimatedDaysMax: text(formData, "estimatedDaysMax"),
  });
  await prisma.shippingRate.create({
    data: { ...input, price: new Prisma.Decimal(input.price), freeShippingThreshold: input.freeShippingThreshold ? new Prisma.Decimal(input.freeShippingThreshold) : undefined },
  });
  await auditLog({ admin, action: "SHIPPING_RATE_CREATED", entityType: "ShippingRate", entityId: input.zoneId, message: `${input.serviceLevel} rate created` });
  revalidatePath("/admin/shipping");
}

export async function saveCourierProviderAction(formData: FormData) {
  const admin = await requireAdmin();
  const name = text(formData, "name");
  const code = text(formData, "code").toUpperCase();
  const provider = await prisma.courierProvider.upsert({
    where: { code },
    create: {
      name,
      code,
      status: formData.get("status") === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      contactEmail: optionalText(formData, "contactEmail"),
      contactPhone: optionalText(formData, "contactPhone"),
      trackingUrlTemplate: optionalText(formData, "trackingUrlTemplate"),
    },
    update: {
      name,
      status: formData.get("status") === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      contactEmail: optionalText(formData, "contactEmail"),
      contactPhone: optionalText(formData, "contactPhone"),
      trackingUrlTemplate: optionalText(formData, "trackingUrlTemplate"),
    },
  });
  await auditLog({ admin, action: "COURIER_PROVIDER_SAVED", entityType: "CourierProvider", entityId: provider.id, message: provider.name });
  revalidatePath("/admin/shipping");
}

export async function saveShippingZoneAction(formData: FormData) {
  const admin = await requireAdmin();
  const name = text(formData, "name");
  const code = text(formData, "code").toUpperCase();
  const states = text(formData, "states").split(",").map((value) => value.trim()).filter(Boolean);
  const zone = await prisma.shippingZone.upsert({
    where: { code },
    create: { name, code, states, active: formData.get("active") === "on" },
    update: { name, states, active: formData.get("active") === "on" },
  });
  await auditLog({ admin, action: "SHIPPING_ZONE_SAVED", entityType: "ShippingZone", entityId: zone.id, message: zone.name });
  revalidatePath("/admin/warehouses");
}
