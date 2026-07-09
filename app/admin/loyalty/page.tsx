import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLoyaltyPanel } from "@/components/engagement/admin-panels";
import { getAdminLoyalty } from "@/features/engagement/data";

export const metadata = { title: "Loyalty" };
export const dynamic = "force-dynamic";

export default async function AdminLoyaltyPage() {
  const data = await getAdminLoyalty();
  return <AdminShell title="Sign Rewards"><AdminLoyaltyPanel data={data} /></AdminShell>;
}
