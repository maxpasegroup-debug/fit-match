import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { requireUserId } from "@/features/profile/data";
import { productInclude } from "@/features/catalog/data";
import { calculatePriceSummary } from "@/features/checkout/price-engine";

export const cartItemInclude = {
  product: { include: productInclude },
  productVariant: true,
  measurementProfile: true,
} satisfies Prisma.CartItemInclude;

export type CartItemView = Prisma.CartItemGetPayload<{ include: typeof cartItemInclude }>;

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

export async function getCartCount(userId: string): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { items: { where: { status: "ACTIVE" }, select: { quantity: true } } },
  });
  return cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
}

export async function getCartView() {
  const userId = await requireUserId();
  const cart = await getOrCreateCart(userId);
  const cartWithItems = await prisma.cart.findUniqueOrThrow({
    where: { id: cart.id },
    include: {
      coupon: true,
      items: { include: cartItemInclude, orderBy: { updatedAt: "desc" } },
    },
  });
  const activeItems = cartWithItems.items.filter((item) => item.status === "ACTIVE");
  const savedItems = cartWithItems.items.filter((item) => item.status === "SAVED_FOR_LATER");
  const price = calculatePriceSummary(activeItems, cartWithItems.coupon);

  return { cart: cartWithItems, activeItems, savedItems, price };
}

export async function getCheckoutView() {
  const userId = await requireUserId();
  const [cartView, addresses, measurements] = await Promise.all([
    getCartView(),
    prisma.address.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] }),
    prisma.measurementProfile.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    }),
  ]);

  const existingSession = await prisma.checkoutSession.findFirst({
    where: { userId, cartId: cartView.cart.id, status: { in: ["ACTIVE", "PAYMENT_PENDING", "FAILED"] } },
    include: {
      deliveryAddress: true,
      billingAddress: true,
      measurementProfile: true,
      payment: true,
      giftNote: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return { ...cartView, addresses, measurements, checkoutSession: existingSession };
}

export async function getLatestCheckoutSession() {
  const user = await getCurrentUser();
  if (!user) return null;
  return prisma.checkoutSession.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAYMENT_PENDING", "FAILED"] } },
    orderBy: { updatedAt: "desc" },
  });
}
