import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function RewardEarnedEmail({ points, rewardsUrl }: { points: number; rewardsUrl: string }) {
  return <EmailShell preview="You earned Sign Rewards points." title="Reward earned"><Text style={paragraph}>You earned {points} Sign Rewards points. Your balance is ready in your account.</Text><EmailButton href={rewardsUrl}>View rewards</EmailButton></EmailShell>;
}

export default RewardEarnedEmail;
