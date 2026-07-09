import { ShipmentStatus, ShippingServiceLevel } from "@prisma/client";
import { z } from "zod";

export const shipmentIdSchema = z.object({ shipmentId: z.string().cuid() });

export const createShipmentSchema = z.object({
  orderId: z.string().cuid(),
  courierProviderId: z.string().cuid(),
  warehouseId: z.string().cuid().optional(),
  packageCount: z.coerce.number().int().min(1).max(20).default(1),
});

export const trackingUpdateSchema = shipmentIdSchema.extend({
  status: z.nativeEnum(ShipmentStatus),
  location: z.string().trim().max(120).optional(),
  message: z.string().trim().min(3).max(500),
});

export const deliveryAttemptSchema = shipmentIdSchema.extend({
  reason: z.string().trim().min(3).max(300),
  agentRemarks: z.string().trim().max(500).optional(),
  rescheduleDate: z.string().optional(),
});

export const warehouseSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().min(2).max(20).transform((value) => value.toUpperCase()),
  phone: z.string().trim().max(20).optional(),
  address: z.string().trim().min(5).max(240),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().min(4).max(12),
  active: z.coerce.boolean().default(true),
});

export const shippingRateSchema = z.object({
  zoneId: z.string().cuid(),
  serviceLevel: z.nativeEnum(ShippingServiceLevel),
  minWeightGrams: z.coerce.number().int().min(0),
  maxWeightGrams: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  freeShippingThreshold: z.coerce.number().min(0).optional(),
  estimatedDaysMin: z.coerce.number().int().min(1),
  estimatedDaysMax: z.coerce.number().int().min(1),
});

export const dispatchSchema = z.object({
  warehouseId: z.string().cuid().optional(),
  shipmentIds: z.array(z.string().cuid()).min(1),
});
