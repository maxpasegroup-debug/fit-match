import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function AbandonedCartReminderEmail({ cartUrl }: { cartUrl: string }) {
  return <EmailShell preview="Your selected styles are waiting." title="Complete your selection"><Text style={paragraph}>Your cart is saved, including fit and style choices. Review it when you are ready.</Text><EmailButton href={cartUrl}>Return to cart</EmailButton></EmailShell>;
}

export default AbandonedCartReminderEmail;
