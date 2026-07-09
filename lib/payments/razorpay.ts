import crypto from "node:crypto";
import Razorpay from "razorpay";
import { env } from "@/lib/config/env";

export function isRazorpayConfigured(): boolean {
  return Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
}

export function getRazorpayClient(): Razorpay {
  if (!isRazorpayConfigured()) {
    throw new Error("Razorpay is not configured.");
  }
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export function verifyRazorpaySignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (!env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured.");
  }
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(input.razorpaySignature);
  return expectedBuffer.length === providedBuffer.length && crypto.timingSafeEqual(expectedBuffer, providedBuffer);
}
