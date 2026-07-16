import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function BirthdayGreetingEmail({ rewardsUrl }: { rewardsUrl: string }) {
  return <EmailShell preview="A little birthday note from FIT & MATCH." title="Happy birthday"><Text style={paragraph}>Wishing you a beautiful year ahead, filled with comfort, confidence, and truly stylish moments.</Text><EmailButton href={rewardsUrl}>Open Sign Rewards</EmailButton></EmailShell>;
}

export default BirthdayGreetingEmail;
