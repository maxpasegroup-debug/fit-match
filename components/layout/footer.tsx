import { siteConfig } from "@/lib/config/site";
import { Logo } from "@/components/layout/logo";
import Link from "next/link";

const legalLinks = [
  ["/privacy-policy", "Privacy"],
  ["/terms-and-conditions", "Terms"],
  ["/return-policy", "Returns"],
  ["/refund-policy", "Refunds"],
  ["/shipping-policy", "Shipping"],
  ["/cookie-policy", "Cookies"],
  ["/disclaimer", "Disclaimer"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[#eadde6] bg-white pb-24 pt-10 md:pb-10">
      <div className={`${siteConfig.maxWidthClass} grid gap-6 md:grid-cols-[1fr_auto]`}>
        <Logo />
        <p className="max-w-xl text-sm leading-6 text-[#756871]">
          Premium style infrastructure for FIT & MATCH. Clean, secure, and ready
          for the next phase of commerce features.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[#756871] md:col-span-2" aria-label="Legal">
          {legalLinks.map(([href, label]) => <Link className="hover:text-[#c21874]" href={href} key={href}>{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
