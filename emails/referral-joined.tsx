import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function ReferralJoinedEmail({ referralsUrl }: { referralsUrl: string }) {
  return <EmailShell preview="Your referral joined FIT & MATCH." title="Your referral joined"><Text style={paragraph}>A friend joined with your referral. We will update your reward history as soon as the referral qualifies.</Text><EmailButton href={referralsUrl}>View referrals</EmailButton></EmailShell>;
}

export default ReferralJoinedEmail;
