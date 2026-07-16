import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";
import { formatMoney } from "@/features/checkout/price-engine";

export function PaymentSuccessEmail({
  name,
  total,
  transactionId,
}: {
  name: string;
  total: number;
  transactionId: string;
}) {
  return (
    <EmailShell preview="Your FIT & MATCH payment was successful." title="Payment Successful">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        We received your payment of {formatMoney(total)}. Transaction ID: {transactionId}.
      </Text>
      <Text style={paragraph}>Your order draft is safely stored for the next phase.</Text>
    </EmailShell>
  );
}
