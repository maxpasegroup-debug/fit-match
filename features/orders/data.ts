import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { requireUserId } from "@/features/profile/data";

export const orderInclude = {
  items: true,
  timeline: { orderBy: { createdAt: "desc" } },
  invoice: true,
  cancellationRequest: true,
  returnRequests: { orderBy: { createdAt: "desc" } },
  refundRequests: { orderBy: { createdAt: "desc" } },
  tailoringJob: { include: { stages: { orderBy: { createdAt: "desc" } } } },
  qualityChecks: { include: { inspector: true }, orderBy: { createdAt: "desc" } },
  shipments: {
    include: {
      packages: true,
      courierProvider: true,
      trackingEvents: { orderBy: { occurredAt: "desc" } },
      deliveryAttempts: { orderBy: { createdAt: "desc" } },
      deliveryProof: true,
      shippingLabel: true,
    },
  },
} satisfies Prisma.OrderInclude;

export type OrderView = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export async function getCustomerOrders(searchParams: Record<string, string | string[] | undefined>) {
  const userId = await requireUserId();
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  return prisma.order.findMany({
    where: {
      userId,
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ orderNumber: { contains: q, mode: "insensitive" } }] } : {}),
    },
    include: { items: true, invoice: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getCustomerOrder(orderId: string) {
  const userId = await requireUserId();
  return prisma.order.findFirstOrThrow({ where: { id: orderId, userId }, include: orderInclude });
}

export async function getAdminOrders(searchParams: Record<string, string | string[] | undefined>) {
  await requireAdmin();
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  return prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: "insensitive" } },
              { user: { email: { contains: q, mode: "insensitive" } } },
              { user: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { user: true, items: true, invoice: true, tailoringJob: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminOrder(orderId: string) {
  await requireAdmin();
  return prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { ...orderInclude, user: true, statusHistory: { include: { changedBy: true }, orderBy: { createdAt: "desc" } }, notes: true },
  });
}
