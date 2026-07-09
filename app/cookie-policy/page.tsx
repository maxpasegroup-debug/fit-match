import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return <PolicyPage title="Cookie Policy" updated="July 9, 2026" sections={[
    { title: "Essential cookies", body: "We use essential cookies for authentication, session security, checkout continuity, and account protection." },
    { title: "Analytics", body: "Analytics is provider-agnostic and used to understand page views, searches, product views, and platform performance. Non-essential providers can be controlled through future consent settings." },
    { title: "Security", body: "Security cookies and related signals help protect sessions, reduce abuse, and maintain application reliability." },
    { title: "Control", body: "Browser settings can block or delete cookies, but some account and checkout features may not work without essential cookies." },
  ]} />;
}
