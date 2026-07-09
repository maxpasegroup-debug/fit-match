import { PolicyPage } from "@/components/legal/policy-page";

export const metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return <PolicyPage title="Terms and Conditions" updated="July 9, 2026" sections={[
    { title: "Use of service", body: "FIT & Match is provided for customers to browse SIGN SILKS collections, maintain fit profiles, purchase products, and manage account services." },
    { title: "Account responsibility", body: "Customers are responsible for keeping login credentials secure and ensuring account, measurement, delivery, and payment details are accurate." },
    { title: "Product information", body: "We aim to keep product, fabric, color, price, and delivery information accurate. Minor visual differences may occur due to screen settings and handcrafted production." },
    { title: "Limitations", body: "The platform must not be used for abuse, fraud, scraping, unauthorized access, or actions that disrupt service availability." },
  ]} />;
}
