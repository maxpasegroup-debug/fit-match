import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Fabrics" };

export default function AdminFabricsPage() {
  return <AdminShell title="Fabrics"><LookupNotice label="fabrics" /></AdminShell>;
}

function LookupNotice({ label }: { label: string }) {
  return <Card><p className="text-sm leading-6 text-[#756871]">Manage {label} through product variants and product fabric records in the product editor. Global lookup normalization can be added without changing the customer catalog API.</p></Card>;
}
