import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OutForDeliveryEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order is out for delivery." title="Out for Delivery">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Order {orderNumber} is out for delivery today.</Text>
    </EmailShell>
  );
}
