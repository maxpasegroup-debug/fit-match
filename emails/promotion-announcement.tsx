import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function PromotionAnnouncementEmail({ title, message, href }: { title: string; message: string; href: string }) {
  return <EmailShell preview={title} title={title}><Text style={paragraph}>{message}</Text><EmailButton href={href}>Explore now</EmailButton></EmailShell>;
}

export default PromotionAnnouncementEmail;
