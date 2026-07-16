import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";
import { formatMoney } from "@/features/checkout/price-engine";

export function CheckoutStartedEmail({ name, total }: { name: string; total: number }) {
  return (
    <EmailShell preview="Your FIT & MATCH checkout is ready." title="Checkout Started">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Your FIT & MATCH checkout has been prepared. The payable total is {formatMoney(total)}.
      </Text>
    </EmailShell>
  );
}
