import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Catalog" };

const links = [
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/subcategories", "Subcategories"],
  ["/admin/collections", "Collections"],
  ["/admin/banners", "Featured Banners"],
  ["/admin/inventory", "Inventory"],
] as const;

export default function AdminCatalogPage() {
  return (
    <AdminShell title="Catalog">
      <div className="grid gap-4 md:grid-cols-3">
        {links.map(([href, label]) => (
          <Card key={href}>
            <Link className="text-xl font-semibold text-[#241820]" href={href}>{label}</Link>
            <p className="mt-2 text-sm text-[#756871]">Manage {label.toLowerCase()}.</p>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
