import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function PasswordChangedEmail({ name }: { name: string }) {
  return (
    <EmailShell preview="Your FIT & Match password was changed." title="Password changed">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Your password was updated successfully. If this was not you, please
        contact SIGN SILKS support immediately.
      </Text>
    </EmailShell>
  );
}
