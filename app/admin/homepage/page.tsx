import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { HomepageBuilder } from "@/components/admin/homepage-builder";

export const metadata: Metadata = { title: "Homepage Builder" };

export default function AdminHomepagePage() {
  return (
    <AdminShell title="Homepage Builder">
      <HomepageBuilder />
    </AdminShell>
  );
}
