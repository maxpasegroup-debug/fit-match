import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return <PolicyPage title="Shipping Policy" updated="July 9, 2026" sections={[
    { title: "Coverage", body: "SIGN SILKS prepares for shipping across serviceable locations in India through courier partners and internal logistics workflows." },
    { title: "Delivery estimates", body: "Delivery estimates include stitching, packing, dispatch, and courier transit time. Estimates may vary by location, product, and seasonal demand." },
    { title: "Tracking", body: "Customers can view shipment status and tracking timelines from the order details page once a shipment is created." },
    { title: "Delays", body: "Weather, public holidays, courier constraints, remote locations, or incorrect address details may affect delivery timelines." },
  ]} />;
}
