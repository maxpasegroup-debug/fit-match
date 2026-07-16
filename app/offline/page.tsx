import { WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return <main className="py-16"><div className={`${siteConfig.maxWidthClass} grid place-items-center`}><Card className="max-w-lg text-center"><WifiOff className="mx-auto h-10 w-10 text-[#c21874]" /><h1 className="mt-5 text-2xl font-semibold text-[#241820]">You are offline</h1><p className="mt-3 text-sm leading-6 text-[#756871]">FIT & MATCH saved the app shell. Reconnect to browse products, sync account data, or complete checkout.</p><ButtonLink className="mt-6" href="/" variant="secondary">Back home</ButtonLink></Card></div></main>;
}
