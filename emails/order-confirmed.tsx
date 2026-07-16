import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OrderConfirmedEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order is confirmed." title="Order Confirmed">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Your order {orderNumber} is confirmed and ready for the FIT & MATCH workflow.</Text>
    </EmailShell>
  );
}
