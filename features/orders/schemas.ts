import { OrderStatus, TailoringStageName } from "@prisma/client";
import { z } from "zod";

export const orderIdSchema = z.object({
  orderId: z.string().cuid(),
});

export const orderSearchSchema = z.object({
  q: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export const cancellationSchema = orderIdSchema.extend({
  reason: z.string().trim().min(5).max(500),
});

export const returnRequestSchema = orderIdSchema.extend({
  reason: z.string().trim().min(5).max(500),
});

export const adminStatusSchema = orderIdSchema.extend({
  status: z.nativeEnum(OrderStatus),
  message: z.string().trim().max(500).optional(),
});

export const tailoringAssignmentSchema = orderIdSchema.extend({
  assignedTailorName: z.string().trim().min(2).max(120),
  estimatedCompletion: z.string().optional(),
});

export const tailoringStageSchema = orderIdSchema.extend({
  stage: z.nativeEnum(TailoringStageName),
  remarks: z.string().trim().max(500).optional(),
});

export const qualityCheckSchema = orderIdSchema.extend({
  passed: z.coerce.boolean(),
  remarks: z.string().trim().max(500).optional(),
});
