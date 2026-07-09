import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export async function getAdminShippingData() {
  await requireAdmin();
  const [shipments, providers, warehouses, readyOrders] = await prisma.$transaction([
    prisma.shipment.findMany({
      include: { order: { include: { user: true } }, courierProvider: true, trackingEvents: { orderBy: { occurredAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    prisma.courierProvider.findMany({ orderBy: { name: "asc" } }),
    prisma.warehouse.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.order.findMany({
      where: {
        status: { in: ["PACKING", "READY_TO_SHIP"] },
        OR: [{ shipments: { none: {} } }, { shipments: { some: { status: "PENDING" } } }],
      },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
  ]);
  return { shipments, providers, warehouses, readyOrders };
}

export async function getAdminShipment(shipmentId: string) {
  await requireAdmin();
  return prisma.shipment.findUniqueOrThrow({
    where: { id: shipmentId },
    include: {
      order: { include: { user: true, items: true } },
      courierProvider: true,
      warehouse: true,
      packages: true,
      shippingLabel: true,
      trackingEvents: { orderBy: { occurredAt: "desc" } },
      deliveryAttempts: { include: { recordedBy: true }, orderBy: { createdAt: "desc" } },
      deliveryProof: true,
    },
  });
}

export async function getWarehousesData() {
  await requireAdmin();
  const [warehouses, products, zones] = await prisma.$transaction([
    prisma.warehouse.findMany({
      include: { inventory: { include: { product: true }, orderBy: { availableStock: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" }, take: 100 }),
    prisma.shippingZone.findMany({ include: { rates: true }, orderBy: { name: "asc" } }),
  ]);
  return { warehouses, products, zones };
}

export async function getDispatchData() {
  await requireAdmin();
  const [batches, shipments, warehouses] = await prisma.$transaction([
    prisma.dispatchBatch.findMany({ include: { warehouse: true, shipments: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.shipment.findMany({ where: { status: { in: ["LABEL_GENERATED", "PACKED"] } }, include: { order: true, courierProvider: true }, orderBy: { updatedAt: "desc" } }),
    prisma.warehouse.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);
  return { batches, shipments, warehouses };
}
