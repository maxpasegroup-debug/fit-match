import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Sizes" };

export default function AdminSizesPage() {
  return <AdminShell title="Sizes"><Card><p className="text-sm leading-6 text-[#756871]">Supported sizes: XS, S, M, L, XL, XXL, 3XL, Custom Fit. Manage availability per product.</p></Card></AdminShell>;
}
