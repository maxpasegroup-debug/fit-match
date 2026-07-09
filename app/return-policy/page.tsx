import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Return Policy" };

export default function ReturnPolicyPage() {
  return <PolicyPage title="Return Policy" updated="July 9, 2026" sections={[
    { title: "Eligibility", body: "Return eligibility depends on product type, condition, hygiene requirements, customization, and the return window shown at purchase." },
    { title: "Custom fit items", body: "Custom-fit and altered garments may have limited return eligibility unless there is a confirmed defect, wrong item, or fulfillment error." },
    { title: "Condition", body: "Returned items must be unused, unwashed, undamaged, and include original packaging and tags where applicable." },
    { title: "Review process", body: "Return requests are reviewed before approval. Photos and inspection may be required before final acceptance." },
  ]} />;
}
