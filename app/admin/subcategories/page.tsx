import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { LookupForm } from "@/components/admin/admin-forms";
import { Card } from "@/components/ui/card";
import { getLookupData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin Subcategories" };
export const dynamic = "force-dynamic";

export default async function AdminSubcategoriesPage() {
  const { categories, subCategories } = await getLookupData();
  return (
    <AdminShell title="Subcategories">
      <LookupForm kind="subcategory" categories={categories} />
      <Card>{subCategories.map((item) => <div className="flex justify-between border-b border-[#eadde6] py-3 last:border-0" key={item.id}><span className="font-semibold">{item.name}</span><span className="text-sm text-[#756871]">{item.category.name}</span></div>)}</Card>
    </AdminShell>
  );
}
