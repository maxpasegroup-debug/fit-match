import { RewardsPanel } from "@/components/engagement/customer-panels";
import { getRewardsData } from "@/features/engagement/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Sign Rewards" };
export const dynamic = "force-dynamic";

export default async function RewardsPage() {
  const data = await getRewardsData();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}><div><p className="text-sm font-semibold text-[#c21874]">Loyalty</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Sign Rewards</h1></div><RewardsPanel data={data} /></div></main>;
}
