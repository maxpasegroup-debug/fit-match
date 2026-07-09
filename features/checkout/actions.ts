"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { CheckoutStartedEmail } from "@/emails/checkout-started";
import { getCurrentUser } from "@/lib/auth/session";
import { requireUserId } from "@/features/profile/data";
import { calculatePriceSummary } from "@/features/checkout/price-engine";
import { logCustomerAudit } from "@/features/checkout/audit";
import {
  addToCartSchema,
  cartItemIdSchema,
  checkoutAddressSchema,
  couponSchema,
  updateCartQuantitySchema,
} from "@/features/checkout/schemas";
import { getOrCreateCart } from "@/features/checkout/data";
import { trackServerEvent } from "@/lib/analytics/server";

function optionalFormValue(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

async function requireCartItem(userId: string, itemId: string) {
  return prisma.cartItem.findFirstOrThrow({
    where: { id: itemId, cart: { userId } },
    include: { cart: true, product: true },
  });
}

export async function addToCartAction(formData: FormData) {
  const userId = await requireUserId();
  const input = addToCartSchema.parse({
    productId: formData.get("productId"),
    productVariantId: optionalFormValue(formData, "productVariantId"),
    measurementProfileId: optionalFormValue(formData, "measurementProfileId"),
    quantity: formData.get("quantity") ?? 1,
  });

  if (input.measurementProfileId) {
    await prisma.measurementProfile.findFirstOrThrow({
      where: { id: input.measurementProfileId, userId, archivedAt: null },
      select: { id: true },
    });
  }

  const product = await prisma.product.findFirstOrThrow({
    where: { id: input.productId, published: true, available: true },
    include: { variants: true },
  });
  const variant = input.productVariantId
    ? product.variants.find((item) => item.id === input.productVariantId && item.available)
    : null;
  if (input.productVariantId && !variant) {
    throw new Error("Selected product option is unavailable.");
  }

  const cart = await getOrCreateCart(userId);
  const unitPrice = variant?.offerPrice ?? variant?.price ?? product.offerPrice ?? product.price;
  const existing = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: product.id,
      productVariantId: variant?.id ?? null,
      measurementProfileId: input.measurementProfileId ?? null,
      status: "ACTIVE",
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: Math.min(existing.quantity + input.quantity, 10), unitPrice },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        productVariantId: variant?.id,
        measurementProfileId: input.measurementProfileId,
        quantity: input.quantity,
        unitPrice,
      },
    });
  }

  await logCustomerAudit({ action: "CART_ITEM_ADDED", entityType: "Cart", entityId: cart.id, message: `Added ${product.name} to cart.` });
  await trackServerEvent("cart", { productId: product.id, metadata: { action: "add", quantity: input.quantity } });
  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateCartQuantityAction(formData: FormData) {
  const userId = await requireUserId();
  const input = updateCartQuantitySchema.parse({ itemId: formData.get("itemId"), quantity: formData.get("quantity") });
  await requireCartItem(userId, input.itemId);
  await prisma.cartItem.update({ where: { id: input.itemId }, data: { quantity: input.quantity } });
  await logCustomerAudit({ action: "CART_QUANTITY_UPDATED", entityType: "CartItem", entityId: input.itemId, message: "Cart quantity updated." });
  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const userId = await requireUserId();
  const input = cartItemIdSchema.parse({ itemId: formData.get("itemId") });
  await requireCartItem(userId, input.itemId);
  await prisma.cartItem.delete({ where: { id: input.itemId } });
  await logCustomerAudit({ action: "CART_ITEM_REMOVED", entityType: "CartItem", entityId: input.itemId, message: "Cart item removed." });
  revalidatePath("/cart");
}

export async function saveForLaterAction(formData: FormData) {
  const userId = await requireUserId();
  const input = cartItemIdSchema.parse({ itemId: formData.get("itemId") });
  await requireCartItem(userId, input.itemId);
  await prisma.cartItem.update({ where: { id: input.itemId }, data: { status: "SAVED_FOR_LATER" } });
  await logCustomerAudit({ action: "CART_ITEM_SAVED_FOR_LATER", entityType: "CartItem", entityId: input.itemId, message: "Cart item saved for later." });
  revalidatePath("/cart");
}

export async function restoreSavedItemAction(formData: FormData) {
  const userId = await requireUserId();
  const input = cartItemIdSchema.parse({ itemId: formData.get("itemId") });
  await requireCartItem(userId, input.itemId);
  await prisma.cartItem.update({ where: { id: input.itemId }, data: { status: "ACTIVE" } });
  await logCustomerAudit({ action: "CART_ITEM_RESTORED", entityType: "CartItem", entityId: input.itemId, message: "Saved item restored to cart." });
  revalidatePath("/cart");
}

export async function moveCartItemToWishlistAction(formData: FormData) {
  const userId = await requireUserId();
  const input = cartItemIdSchema.parse({ itemId: formData.get("itemId") });
  const item = await requireCartItem(userId, input.itemId);
  await prisma.wishlist.upsert({
    where: { userId_productId: { userId, productId: item.productId } },
    update: {},
    create: { userId, productId: item.productId },
  });
  await prisma.cartItem.delete({ where: { id: item.id } });
  await logCustomerAudit({ action: "CART_ITEM_MOVED_TO_WISHLIST", entityType: "CartItem", entityId: item.id, message: `${item.product.name} moved to wishlist.` });
  revalidatePath("/cart");
  revalidatePath("/wishlist");
}

export async function clearCartAction() {
  const userId = await requireUserId();
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, status: "ACTIVE" } });
  await logCustomerAudit({ action: "CART_CLEARED", entityType: "Cart", entityId: cart.id, message: "Active cart cleared." });
  revalidatePath("/cart");
}

export async function applyCouponAction(formData: FormData) {
  const userId = await requireUserId();
  const { code } = couponSchema.parse({ code: formData.get("code") });
  const cart = await getOrCreateCart(userId);
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) throw new Error("Coupon is not valid.");
  const now = new Date();
  if ((coupon.startsAt && coupon.startsAt > now) || (coupon.expiresAt && coupon.expiresAt < now)) {
    throw new Error("Coupon is not active.");
  }
  const [totalUsage, userUsage, items] = await Promise.all([
    prisma.couponUsage.count({ where: { couponId: coupon.id } }),
    prisma.couponUsage.count({ where: { couponId: coupon.id, userId } }),
    prisma.cartItem.findMany({ where: { cartId: cart.id, status: "ACTIVE" } }),
  ]);
  if (coupon.usageLimit && totalUsage >= coupon.usageLimit) throw new Error("Coupon usage limit reached.");
  if (coupon.perUserLimit && userUsage >= coupon.perUserLimit) throw new Error("You have already used this coupon.");
  const price = calculatePriceSummary(items, coupon);
  if (price.couponDiscount <= 0) throw new Error("Cart does not qualify for this coupon.");
  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });
  await logCustomerAudit({ action: "COUPON_APPLIED", entityType: "Coupon", entityId: coupon.id, message: `Coupon ${coupon.code} applied.` });
  revalidatePath("/cart");
}

export async function removeCouponAction() {
  const userId = await requireUserId();
  const cart = await getOrCreateCart(userId);
  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });
  await logCustomerAudit({ action: "COUPON_REMOVED", entityType: "Cart", entityId: cart.id, message: "Coupon removed from cart." });
  revalidatePath("/cart");
}

export async function createCheckoutSessionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const input = checkoutAddressSchema.parse({
    deliveryAddressId: formData.get("deliveryAddressId"),
    billingSameAsDelivery: formData.get("billingSameAsDelivery") === "on",
    billingFullName: optionalFormValue(formData, "billingFullName"),
    billingPhone: optionalFormValue(formData, "billingPhone"),
    billingHouse: optionalFormValue(formData, "billingHouse"),
    billingStreet: optionalFormValue(formData, "billingStreet"),
    billingLandmark: optionalFormValue(formData, "billingLandmark"),
    billingCity: optionalFormValue(formData, "billingCity"),
    billingDistrict: optionalFormValue(formData, "billingDistrict"),
    billingState: optionalFormValue(formData, "billingState"),
    billingCountry: optionalFormValue(formData, "billingCountry"),
    billingPincode: optionalFormValue(formData, "billingPincode"),
    measurementProfileId: optionalFormValue(formData, "measurementProfileId"),
    giftMessage: optionalFormValue(formData, "giftMessage"),
    giftFromName: optionalFormValue(formData, "giftFromName"),
    giftToName: optionalFormValue(formData, "giftToName"),
  });
  const cart = await getOrCreateCart(user.id);
  const [deliveryAddress, measurementProfile, cartWithItems] = await Promise.all([
    prisma.address.findFirstOrThrow({ where: { id: input.deliveryAddressId, userId: user.id } }),
    input.measurementProfileId
      ? prisma.measurementProfile.findFirstOrThrow({ where: { id: input.measurementProfileId, userId: user.id, archivedAt: null } })
      : Promise.resolve(null),
    prisma.cart.findUniqueOrThrow({
      where: { id: cart.id },
      include: { coupon: true, items: { where: { status: "ACTIVE" }, include: { product: true, productVariant: true } } },
    }),
  ]);
  if (cartWithItems.items.length === 0) throw new Error("Cart is empty.");
  const price = calculatePriceSummary(cartWithItems.items, cartWithItems.coupon);
  const billingAddress = input.billingSameAsDelivery
    ? null
    : await prisma.billingAddress.create({
        data: {
          userId: user.id,
          fullName: input.billingFullName ?? deliveryAddress.fullName,
          phone: input.billingPhone ?? deliveryAddress.phone,
          house: input.billingHouse ?? deliveryAddress.house,
          street: input.billingStreet ?? deliveryAddress.street,
          landmark: input.billingLandmark,
          city: input.billingCity ?? deliveryAddress.city,
          district: input.billingDistrict ?? deliveryAddress.district,
          state: input.billingState ?? deliveryAddress.state,
          country: input.billingCountry,
          pincode: input.billingPincode ?? deliveryAddress.pincode,
        },
      });
  const snapshot = {
    items: cartWithItems.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      sku: item.product.sku,
      variantSku: item.productVariant?.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
    deliveryAddressId: deliveryAddress.id,
    billingAddressId: billingAddress?.id ?? null,
    measurementProfileId: measurementProfile?.id ?? null,
  };
  const session = await prisma.checkoutSession.create({
    data: {
      userId: user.id,
      cartId: cart.id,
      deliveryAddressId: deliveryAddress.id,
      billingAddressId: billingAddress?.id,
      measurementProfileId: measurementProfile?.id,
      couponId: cartWithItems.couponId,
      status: "PAYMENT_PENDING",
      ...price,
      giftNote: input.giftMessage
        ? { create: { message: input.giftMessage, fromName: input.giftFromName, toName: input.giftToName } }
        : undefined,
      orderDraft: {
        create: {
          userId: user.id,
          deliveryAddressId: deliveryAddress.id,
          billingAddressId: billingAddress?.id,
          measurementProfileId: measurementProfile?.id,
          snapshot,
          ...price,
        },
      },
    },
  });
  await logCustomerAudit({ action: "CHECKOUT_CREATED", entityType: "CheckoutSession", entityId: session.id, message: "Checkout session created." });
  await trackServerEvent("checkout", { value: Number(price.grandTotal), metadata: { checkoutSessionId: session.id } });
  await sendEmail({
    to: user.email,
    subject: "Your SIGN SILKS checkout is ready",
    react: CheckoutStartedEmail({ name: user.name, total: price.grandTotal }),
  });
  revalidatePath("/checkout");
}
