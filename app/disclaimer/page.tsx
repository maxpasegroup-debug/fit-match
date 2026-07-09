import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return <PolicyPage title="Disclaimer" updated="July 9, 2026" sections={[
    { title: "Fit guidance", body: "FIT & Match recommendations are guidance based on saved measurements, preferences, deterministic rules, and future provider integrations. Customers should review measurements before ordering." },
    { title: "Color and fabric", body: "Colors, textures, and fabric appearance may vary due to lighting, photography, screen settings, and natural material variation." },
    { title: "Availability", body: "Product availability, promotions, delivery dates, and service coverage can change based on stock, operations, and courier constraints." },
    { title: "No professional advice", body: "Style and fit suggestions are informational and do not replace personal judgement or professional tailoring assessment." },
  ]} />;
}
