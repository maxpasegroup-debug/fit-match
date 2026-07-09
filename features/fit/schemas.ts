import { BodyType, FitFeedbackType, FitRuleType, PreferredFit, SkinTone } from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().optional().transform((value) => value || undefined);

export const fitProfileSchema = z.object({
  measurementProfileId: z.string().cuid(),
  name: z.string().trim().min(2).max(120),
  bodyType: z.nativeEnum(BodyType).optional(),
  skinTone: z.nativeEnum(SkinTone).optional(),
  preferredFit: z.nativeEnum(PreferredFit),
  preferredSleeve: optionalText,
  preferredLength: optionalText,
  preferredNeckStyle: optionalText,
  preferredSilhouette: optionalText,
  weatherPreference: optionalText,
  comfortLevel: z.coerce.number().int().min(1).max(5),
  maintenanceLevel: z.coerce.number().int().min(1).max(5),
  colors: optionalText,
  avoidedColors: optionalText,
  fabrics: optionalText,
  avoidedFabrics: optionalText,
  occasions: optionalText,
  isDefault: z.boolean().default(false),
});

export const fitRuleSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(2).max(140),
  code: z.string().trim().min(2).max(80).regex(/^[A-Z0-9_]+$/),
  type: z.nativeEnum(FitRuleType),
  description: optionalText,
  conditions: z.string().trim().min(2),
  outcomes: z.string().trim().min(2),
  priority: z.coerce.number().int().min(0).max(1000),
  weight: z.coerce.number().int().min(0).max(100),
  active: z.boolean().default(true),
});

export const sizeChartSchema = z.object({
  id: z.string().cuid().optional(),
  brand: z.string().trim().min(2).max(100),
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().cuid().optional(),
  garmentEaseCm: z.coerce.number().min(0).max(30),
  toleranceCm: z.coerce.number().min(0).max(10),
  active: z.boolean().default(true),
});

export const sizeMappingSchema = z.object({
  sizeChartId: z.string().cuid(),
  sizeName: z.string().trim().min(1).max(30),
  sortOrder: z.coerce.number().int().min(0),
  bustMin: z.coerce.number().min(0).optional(),
  bustMax: z.coerce.number().min(0).optional(),
  waistMin: z.coerce.number().min(0).optional(),
  waistMax: z.coerce.number().min(0).optional(),
  hipMin: z.coerce.number().min(0).optional(),
  hipMax: z.coerce.number().min(0).optional(),
  shoulderMin: z.coerce.number().min(0).optional(),
  shoulderMax: z.coerce.number().min(0).optional(),
});

export const recommendationFeedbackSchema = z.object({
  recommendationId: z.string().cuid().optional(),
  orderItemId: z.string().cuid().optional(),
  feedback: z.nativeEnum(FitFeedbackType),
  notes: optionalText,
});
