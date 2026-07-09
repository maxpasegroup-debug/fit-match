import { z } from "zod";

export const cartItemIdSchema = z.object({
  itemId: z.string().cuid(),
});

export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  productVariantId: z.string().cuid().optional(),
  measurementProfileId: z.string().cuid().optional(),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
});

export const updateCartQuantitySchema = cartItemIdSchema.extend({
  quantity: z.coerce.number().int().min(1).max(10),
});

export const couponSchema = z.object({
  code: z.string().trim().min(2).max(40).transform((value) => value.toUpperCase()),
});

export const checkoutAddressSchema = z.object({
  deliveryAddressId: z.string().cuid(),
  billingSameAsDelivery: z.coerce.boolean().default(true),
  billingFullName: z.string().trim().min(2).max(100).optional(),
  billingPhone: z.string().trim().min(8).max(20).optional(),
  billingHouse: z.string().trim().min(2).max(120).optional(),
  billingStreet: z.string().trim().min(2).max(160).optional(),
  billingLandmark: z.string().trim().max(120).optional(),
  billingCity: z.string().trim().min(2).max(80).optional(),
  billingDistrict: z.string().trim().min(2).max(80).optional(),
  billingState: z.string().trim().min(2).max(80).optional(),
  billingCountry: z.string().trim().min(2).max(80).default("India"),
  billingPincode: z.string().trim().min(4).max(12).optional(),
  measurementProfileId: z.string().cuid().optional(),
  giftMessage: z.string().trim().max(280).optional(),
  giftFromName: z.string().trim().max(80).optional(),
  giftToName: z.string().trim().max(80).optional(),
});

export const razorpayOrderSchema = z.object({
  checkoutSessionId: z.string().cuid(),
});

export const razorpayVerifySchema = z.object({
  checkoutSessionId: z.string().cuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const razorpayFailureSchema = z.object({
  checkoutSessionId: z.string().cuid(),
  razorpay_order_id: z.string().min(1).optional(),
  errorCode: z.string().max(120).optional(),
  errorDescription: z.string().max(500).optional(),
});
