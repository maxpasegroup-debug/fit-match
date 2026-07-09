import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPromotionPanel } from "@/components/engagement/admin-panels";
import { getAdminPromotions } from "@/features/engagement/data";

export const metadata = { title: "Promotions" };
export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const data = await getAdminPromotions();
  return <AdminShell title="Promotions"><AdminPromotionPanel data={data} /></AdminShell>;
}
