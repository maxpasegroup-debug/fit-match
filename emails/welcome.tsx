import { Text } from "@react-email/components";
import { EmailShell, paragraph } from "@/emails/components";

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailShell preview="Welcome to FIT & Match." title="Welcome to FIT & Match">
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Your SIGN SILKS account is ready. We are delighted to help you discover
        a cleaner, more personal way to shop beautifully.
      </Text>
    </EmailShell>
  );
}
