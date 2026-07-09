import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { BannerForm } from "@/components/admin/admin-forms";
import { Card } from "@/components/ui/card";
import { getLookupData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin Banners" };
export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const { banners, collections } = await getLookupData();
  return (
    <AdminShell title="Featured Banners">
      <BannerForm collections={collections} />
      <Card>{banners.map((item) => <div className="flex justify-between border-b border-[#eadde6] py-3 last:border-0" key={item.id}><span className="font-semibold">{item.title}</span><span className="text-sm text-[#756871]">{item.collection?.name ?? "No collection"}</span></div>)}</Card>
    </AdminShell>
  );
}
