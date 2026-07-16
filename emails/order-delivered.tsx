import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OrderDeliveredEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order was delivered." title="Order Delivered">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Order {orderNumber} is marked as delivered. Thank you for choosing FIT & MATCH.</Text>
    </EmailShell>
  );
}
