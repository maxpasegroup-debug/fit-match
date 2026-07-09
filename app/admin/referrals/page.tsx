import { AdminShell } from "@/components/admin/admin-shell";
import { AdminReferralPanel } from "@/components/engagement/admin-panels";
import { getAdminReferrals } from "@/features/engagement/data";

export const metadata = { title: "Referrals Admin" };
export const dynamic = "force-dynamic";

export default async function AdminReferralsPage() {
  const programs = await getAdminReferrals();
  return <AdminShell title="Referrals"><AdminReferralPanel programs={programs} /></AdminShell>;
}
