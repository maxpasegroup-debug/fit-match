import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function ShipmentCreatedEmail({ name, orderNumber, trackingNumber }: { name: string; orderNumber: string; trackingNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH shipment is ready." title="Shipment Created">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Shipment for order {orderNumber} has been created. Tracking number: {trackingNumber}.</Text>
    </EmailShell>
  );
}
