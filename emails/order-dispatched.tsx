import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function OrderDispatchedEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH order has been dispatched." title="Order Dispatched">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Order {orderNumber} has left our warehouse. Tracking will continue to update in your account.</Text>
    </EmailShell>
  );
}
