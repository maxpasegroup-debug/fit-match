import type { Metadata } from "next";
import { Box, PackageCheck, ShieldCheck, Warehouse } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();
  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Products" value={data.products} icon={Box} />
        <Metric title="Published" value={data.published} icon={PackageCheck} />
        <Metric title="Low Stock" value={data.lowStock} icon={Warehouse} />
        <Metric title="Suppliers" value={data.suppliers} icon={ShieldCheck} />
      </div>
    </AdminShell>
  );
}

function Metric({ title, value, icon: Icon }: { title: string; value: number; icon: typeof Box }) {
  return (
    <Card>
      <Icon className="mb-4 h-6 w-6 text-[#c21874]" />
      <p className="text-3xl font-semibold text-[#241820]">{value}</p>
      <p className="text-sm text-[#756871]">{title}</p>
    </Card>
  );
}
