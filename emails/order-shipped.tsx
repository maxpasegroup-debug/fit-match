import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OrderShippedEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order has shipped." title="Order Shipped">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Order {orderNumber} is marked as shipped. Courier integration will be connected in a later phase.</Text>
    </EmailShell>
  );
}
