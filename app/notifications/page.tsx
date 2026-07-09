import { NotificationCenter } from "@/components/engagement/customer-panels";
import { getNotificationData } from "@/features/engagement/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const data = await getNotificationData();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-8`}><div><p className="text-sm font-semibold text-[#c21874]">Updates</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Notifications</h1></div><NotificationCenter data={data} /></div></main>;
}
