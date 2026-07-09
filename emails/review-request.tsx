import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function ReviewRequestEmail({ reviewUrl }: { reviewUrl: string }) {
  return <EmailShell preview="Tell us how your Sign Silks outfit felt." title="How did your outfit feel?"><Text style={paragraph}>Your experience helps other customers choose the right fabric, fit, and style.</Text><EmailButton href={reviewUrl}>Write a review</EmailButton></EmailShell>;
}

export default ReviewRequestEmail;
