import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function DeliveryFailedEmail({ name, orderNumber }: { name: string; orderNumber: string }) {
  return (
    <EmailShell preview="Delivery attempt failed." title="Delivery Failed">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>Delivery for order {orderNumber} could not be completed. Rescheduling support is reserved for the courier integration phase.</Text>
    </EmailShell>
  );
}
