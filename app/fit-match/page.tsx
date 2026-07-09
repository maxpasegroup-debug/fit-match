import Link from "next/link";
import { Camera, MessageCircle, Shirt, Sparkles, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";
import { requireUserId } from "@/features/profile/data";

export const metadata = { title: "FIT & Match" };

const experiences = [
  { href: "/fit-match/stylist", title: "AI Stylist", text: "Discuss occasions, colors, fabrics, budgets, and accessories.", icon: MessageCircle, ready: true },
  { href: "/fit-match/measurements", title: "Photo Measurement", text: "Prepare front and side photos for provider-based measurement estimates.", icon: Camera, ready: true },
  { href: "/fit-match/virtual-try-on", title: "Virtual Try-On", text: "Choose a product and prepare a personal preview workflow.", icon: Shirt, ready: true },
  { href: "/fit-match/style-suggestions", title: "Style Suggestions", text: "Create daily, weekly, occasion, office, and travel looks.", icon: WandSparkles, ready: true },
  { href: "/profile", title: "Deterministic FIT", text: "Manage your measured fit, color, fabric, and occasion preferences.", icon: Sparkles, ready: true },
] as const;

export default async function FitMatchPage() {
  await requireUserId();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}>
    <div><p className="text-sm font-semibold text-[#c21874]">Personal experience</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">FIT & Match</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#756871]">Your styling, fit, and preview tools in one private workspace.</p></div>
    <section className="grid gap-4 sm:grid-cols-2" aria-label="FIT and Match experiences">{experiences.map(({ href, title, text, icon: Icon }) => <Link className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c21874]" href={href} key={href}><Card className="h-full transition hover:border-[#c21874]"><Icon className="h-7 w-7 text-[#c21874]" /><h2 className="mt-5 text-xl font-semibold text-[#241820]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#756871]">{text}</p></Card></Link>)}</section>
    <div className="rounded-3xl bg-[#fff5fa] p-5"><WandSparkles className="h-5 w-5 text-[#c21874]" /><p className="mt-3 text-sm leading-6 text-[#3a2c34]">AI providers are currently in preview mode. Recommendations and generated results are clearly identified and should be reviewed before use.</p></div>
  </div></main>;
}
