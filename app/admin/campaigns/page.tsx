import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCampaignMetrics, AdminEngagementOverview } from "@/components/engagement/admin-panels";
import { getAdminCampaignMetrics, getAdminEngagementOverview } from "@/features/engagement/data";

export const metadata = { title: "Campaigns" };
export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const [overview, metrics] = await Promise.all([getAdminEngagementOverview(), getAdminCampaignMetrics()]);
  return <AdminShell title="Campaigns"><AdminEngagementOverview data={overview} /><AdminCampaignMetrics metrics={metrics} /></AdminShell>;
}
