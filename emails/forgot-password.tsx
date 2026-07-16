import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function ForgotPasswordEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  return (
    <EmailShell preview="Reset your FIT & MATCH password." title="Reset your password">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Use this secure link to create a new password. The link expires soon.
      </Text>
      <EmailButton href={resetUrl}>Reset password</EmailButton>
    </EmailShell>
  );
}
