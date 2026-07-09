import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Colors" };

export default function AdminColorsPage() {
  return <AdminShell title="Colors"><Card><p className="text-sm leading-6 text-[#756871]">Manage colors through product variants and product color records in the product editor.</p></Card></AdminShell>;
}
