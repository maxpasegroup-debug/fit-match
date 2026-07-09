import type { ShipmentStatus } from "@prisma/client";

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  PENDING: "Pending",
  PACKED: "Packed",
  LABEL_GENERATED: "Label Generated",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In Transit",
  REACHED_HUB: "Reached Hub",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  DELIVERY_FAILED: "Delivery Failed",
  RETURNED_TO_ORIGIN: "Returned to Origin",
  LOST: "Lost",
};

export const shipmentFlow: ShipmentStatus[] = [
  "PENDING",
  "PACKED",
  "LABEL_GENERATED",
  "DISPATCHED",
  "IN_TRANSIT",
  "REACHED_HUB",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "RETURNED_TO_ORIGIN",
  "LOST",
];
