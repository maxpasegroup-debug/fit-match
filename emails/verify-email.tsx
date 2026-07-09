import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function VerifyEmail({ name, verifyUrl }: { name: string; verifyUrl: string }) {
  return (
    <EmailShell preview="Verify your FIT & Match email." title="Verify your email">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Confirm your email address to finish setting up your SIGN SILKS account.
      </Text>
      <EmailButton href={verifyUrl}>Verify email</EmailButton>
    </EmailShell>
  );
}
