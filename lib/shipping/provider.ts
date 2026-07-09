import type { ShipmentStatus } from "@prisma/client";

export type CreateShipmentInput = {
  orderNumber: string;
  courierCode: string;
  packageCount: number;
};

export type ProviderShipment = {
  trackingNumber: string;
  trackingUrl?: string;
  status: ShipmentStatus;
};

export type ProviderTrackingEvent = {
  status: ShipmentStatus;
  location?: string;
  message: string;
  occurredAt: Date;
};

export interface CourierProviderAdapter {
  createShipment(input: CreateShipmentInput): Promise<ProviderShipment>;
  generateLabel(input: { shipmentId: string; trackingNumber: string }): Promise<{ labelNumber: string; labelUrl?: string }>;
  track(input: { trackingNumber: string }): Promise<ProviderTrackingEvent[]>;
}

export class LocalCourierProvider implements CourierProviderAdapter {
  async createShipment(input: CreateShipmentInput): Promise<ProviderShipment> {
    return {
      trackingNumber: `SS${input.orderNumber.replace(/\D/g, "").slice(-8)}${input.courierCode.slice(0, 3).toUpperCase()}`,
      status: "PACKED",
    };
  }

  async generateLabel(input: { shipmentId: string; trackingNumber: string }) {
    return {
      labelNumber: `LBL-${input.trackingNumber}`,
      labelUrl: `/shipping-labels/${input.shipmentId}.pdf`,
    };
  }

  async track(input: { trackingNumber: string }): Promise<ProviderTrackingEvent[]> {
    return [{
      status: "IN_TRANSIT",
      message: `Tracking sync placeholder for ${input.trackingNumber}.`,
      occurredAt: new Date(),
    }];
  }
}

export function getCourierProviderAdapter(): CourierProviderAdapter {
  return new LocalCourierProvider();
}
