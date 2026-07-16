import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ExecutiveDashboard } from "@/components/admin/executive-dashboard";
import { getAdminDashboardData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  return (
    <AdminShell title="Business OS">
      <ExecutiveDashboard data={data} />
    </AdminShell>
  );
}
