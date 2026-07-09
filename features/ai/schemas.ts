import { z } from "zod";

export const chatSchema = z.object({
  conversationId: z.string().cuid().optional(),
  message: z.string().trim().min(1).max(1500),
});

export const measurementSchema = z.object({
  frontFilename: z.string().trim().min(1).max(240),
  frontMimeType: z.string().regex(/^image\/(jpeg|png|webp)$/),
  frontSize: z.coerce.number().int().positive().max(8 * 1024 * 1024),
  sideFilename: z.string().trim().min(1).max(240),
  sideMimeType: z.string().regex(/^image\/(jpeg|png|webp)$/),
  sideSize: z.coerce.number().int().positive().max(8 * 1024 * 1024),
});

export const tryOnSchema = z.object({
  productId: z.string().cuid(),
  filename: z.string().trim().min(1).max(240),
  mimeType: z.string().regex(/^image\/(jpeg|png|webp)$/),
  fileSize: z.coerce.number().int().positive().max(8 * 1024 * 1024),
});

export const aiConfigurationSchema = z.object({
  feature: z.enum(["STYLIST", "MEASUREMENT", "VIRTUAL_TRY_ON", "STYLE_SUGGESTION", "WEATHER"]),
  provider: z.string().trim().min(2).max(80),
  dailyUserLimit: z.coerce.number().int().min(1).max(10000),
  enabled: z.boolean(),
});

export const promptSchema = z.object({
  key: z.string().trim().min(2).max(80).regex(/^[a-z0-9_-]+$/),
  feature: z.enum(["STYLIST", "MEASUREMENT", "VIRTUAL_TRY_ON", "STYLE_SUGGESTION", "WEATHER"]),
  name: z.string().trim().min(2).max(120),
  template: z.string().trim().min(10).max(10000),
  active: z.boolean(),
});
