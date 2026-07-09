import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Tags" };

export default function AdminTagsPage() {
  return <AdminShell title="Tags"><Card><p className="text-sm leading-6 text-[#756871]">Tags such as Trending, Premium, Wedding, Office Wear, Casual, Festival, Summer, Winter, Handmade, and Limited Edition are managed on products.</p></Card></AdminShell>;
}
