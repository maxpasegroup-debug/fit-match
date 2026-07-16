import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OrderCancelledEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order was cancelled." title="Order Cancelled">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Your cancellation request for order {orderNumber} has been recorded.</Text>
    </EmailShell>
  );
}
