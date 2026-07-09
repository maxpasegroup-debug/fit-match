import { ReferralPanel } from "@/components/engagement/customer-panels";
import { getReferralData } from "@/features/engagement/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Referrals" };
export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const data = await getReferralData();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}><div><p className="text-sm font-semibold text-[#c21874]">Invite friends</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Referrals</h1></div><ReferralPanel data={data} /></div></main>;
}
