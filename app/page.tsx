import type { Metadata } from "next";
import { PremiumLanding } from "@/components/home/premium-landing";
import { StructuredData } from "@/components/seo/structured-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Your Perfect Dress. Made Just for You.",
  description:
    "Take your measurements with AI, choose your favourite design, customise every detail, and receive a beautifully stitched dress delivered anywhere in India.",
};

export default function LandingPage() {
  return (
    <main>
      <StructuredData />
      <PremiumLanding />
    </main>
  );
}
