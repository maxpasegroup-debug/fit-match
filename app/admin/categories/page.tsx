import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { LookupForm } from "@/components/admin/admin-forms";
import { Card } from "@/components/ui/card";
import { getLookupData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin Categories" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { categories } = await getLookupData();
  return (
    <AdminShell title="Categories">
      <LookupForm kind="category" />
      <Card>{categories.map((item) => <Row key={item.id} title={item.name} meta={item.published ? "Visible" : "Hidden"} />)}</Card>
    </AdminShell>
  );
}

function Row({ title, meta }: { title: string; meta: string }) {
  return <div className="flex justify-between border-b border-[#eadde6] py-3 last:border-0"><span className="font-semibold">{title}</span><span className="text-sm text-[#756871]">{meta}</span></div>;
}
