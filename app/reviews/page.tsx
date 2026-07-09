import { ReviewCenter } from "@/components/engagement/customer-panels";
import { getReviewData } from "@/features/engagement/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "My Reviews" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const data = await getReviewData();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}><div><p className="text-sm font-semibold text-[#c21874]">Product feedback</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">My reviews</h1></div><ReviewCenter data={data} /></div></main>;
}
