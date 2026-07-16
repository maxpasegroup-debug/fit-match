import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function PaymentFailedEmail({ name, reason }: { name: string; reason?: string }) {
  return (
    <EmailShell preview="Your FIT & MATCH payment could not be completed." title="Payment Failed">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Your payment could not be completed{reason ? `: ${reason}` : "."} You can return to checkout and retry securely.
      </Text>
    </EmailShell>
  );
}
