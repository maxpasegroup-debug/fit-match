import type { Coupon, Prisma } from "@prisma/client";

export type PriceLineItem = {
  quantity: number;
  unitPrice: Prisma.Decimal | number | string;
};

export type PriceSummary = {
  subtotal: number;
  discount: number;
  couponDiscount: number;
  deliveryCharge: number;
  tax: number;
  grandTotal: number;
};

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: Prisma.Decimal | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function calculatePriceSummary(items: PriceLineItem[], coupon?: Coupon | null): PriceSummary {
  const subtotal = roundMoney(
    items.reduce((total, item) => total + toNumber(item.unitPrice) * item.quantity, 0),
  );
  const discount = 0;
  let couponDiscount = 0;

  if (coupon && coupon.active) {
    const minimumOrder = toNumber(coupon.minimumOrder);
    if (!minimumOrder || subtotal >= minimumOrder) {
      couponDiscount =
        coupon.type === "PERCENTAGE"
          ? subtotal * (toNumber(coupon.value) / 100)
          : toNumber(coupon.value);
      const maximumDiscount = toNumber(coupon.maximumDiscount);
      if (maximumDiscount > 0) {
        couponDiscount = Math.min(couponDiscount, maximumDiscount);
      }
    }
  }

  couponDiscount = roundMoney(Math.min(couponDiscount, subtotal));
  const deliveryCharge = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const tax = 0;
  const grandTotal = roundMoney(Math.max(subtotal - discount - couponDiscount + deliveryCharge + tax, 0));

  return { subtotal, discount, couponDiscount, deliveryCharge, tax, grandTotal };
}

export function formatMoney(value: Prisma.Decimal | number | string): string {
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
