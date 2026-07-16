import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" updated="July 9, 2026" sections={[
    { title: "Information we collect", body: "We collect account details, contact information, addresses, measurements, fit preferences, orders, payments, reviews, referrals, and support-related data needed to operate FIT & MATCH." },
    { title: "How we use information", body: "We use data to authenticate customers, personalize fit and style experiences, process checkout, communicate order and promotional updates, prevent fraud, and improve service quality." },
    { title: "Data sharing", body: "We share information only with service providers required for email, payments, media storage, analytics, monitoring, logistics, and legal compliance. We do not sell customer personal data." },
    { title: "Your choices", body: "Customers can update profile information, notification preferences, saved addresses, measurements, and reviews from their account. Legal deletion requests can be submitted through support." },
  ]} />;
}
