import { Text } from "@react-email/components";
import { EmailButton, EmailShell, paragraph } from "@/emails/components";

export function WishlistReminderEmail({ productName, wishlistUrl }: { productName: string; wishlistUrl: string }) {
  return <EmailShell preview="Your wishlist is waiting." title="Still thinking about it?"><Text style={paragraph}>{productName} is still saved in your wishlist.</Text><EmailButton href={wishlistUrl}>View wishlist</EmailButton></EmailShell>;
}

export default WishlistReminderEmail;
