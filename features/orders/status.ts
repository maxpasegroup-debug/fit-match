import type { OrderStatus } from "@prisma/client";

export const orderStatusLabels: Record<OrderStatus, string> = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_FAILED: "Payment Failed",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  ASSIGNED_TO_TAILOR: "Assigned to Tailor",
  STITCHING_STARTED: "Stitching Started",
  QUALITY_CHECK: "Quality Check",
  PACKING: "Packing",
  READY_TO_SHIP: "Ready to Ship",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUND_INITIATED: "Refund Initiated",
  REFUNDED: "Refunded",
  RETURNED: "Returned",
};

export const customerCancelableStatuses: OrderStatus[] = ["PAID", "CONFIRMED"];

export const adminOrderFlow: OrderStatus[] = [
  "PAID",
  "CONFIRMED",
  "ASSIGNED_TO_TAILOR",
  "STITCHING_STARTED",
  "QUALITY_CHECK",
  "PACKING",
  "READY_TO_SHIP",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUND_INITIATED",
  "REFUNDED",
  "RETURNED",
];
