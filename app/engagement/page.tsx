import { EngagementDashboard } from "@/components/engagement/customer-panels";
import { getEngagementDashboard } from "@/features/engagement/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Engagement" };
export const dynamic = "force-dynamic";

export default async function EngagementPage() {
  const data = await getEngagementDashboard();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}><div><p className="text-sm font-semibold text-[#c21874]">Customer benefits</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">FIT & MATCH engagement</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#756871]">Reviews, rewards, referrals, offers, and personal notifications in one clean space.</p></div><EngagementDashboard data={data} /></div></main>;
}
