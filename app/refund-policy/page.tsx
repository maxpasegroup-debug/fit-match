import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return <PolicyPage title="Refund Policy" updated="July 9, 2026" sections={[
    { title: "Refund method", body: "Approved refunds are processed to the original payment method or another approved method according to payment provider and banking rules." },
    { title: "Timeline", body: "Refund timelines depend on inspection, approval, payment provider processing, and bank settlement windows." },
    { title: "Deductions", body: "Shipping, handling, customization, or promotional deductions may apply where disclosed and legally permitted." },
    { title: "Failed payments", body: "Failed or duplicate payment attempts are reviewed using payment gateway records before any correction or refund is issued." },
  ]} />;
}
