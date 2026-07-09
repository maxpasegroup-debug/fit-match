import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/homepage", "Homepage Builder"],
  ["/admin/catalog", "Catalog"],
  ["/admin/products", "Products"],
  ["/admin/categories", "Categories"],
  ["/admin/subcategories", "Subcategories"],
  ["/admin/collections", "Collections"],
  ["/admin/fabrics", "Fabrics"],
  ["/admin/colors", "Colors"],
  ["/admin/sizes", "Sizes"],
  ["/admin/tags", "Tags"],
  ["/admin/banners", "Banners"],
  ["/admin/media", "Media"],
  ["/admin/fit", "FIT Engine"],
  ["/admin/ai", "AI Experience"],
  ["/admin/reviews", "Reviews"],
  ["/admin/loyalty", "Loyalty"],
  ["/admin/referrals", "Referrals"],
  ["/admin/promotions", "Promotions"],
  ["/admin/notifications", "Notifications"],
  ["/admin/campaigns", "Campaigns"],
  ["/admin/system", "System"],
  ["/admin/inventory", "Inventory"],
  ["/admin/shipping", "Shipping"],
  ["/admin/warehouses", "Warehouses"],
  ["/admin/dispatch", "Dispatch"],
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="py-8 md:py-10">
      <div className={`${siteConfig.maxWidthClass} grid gap-6 lg:grid-cols-[240px_1fr]`}>
        <Card className="h-fit p-3">
          <nav className="grid gap-1" aria-label="Admin navigation">
            {links.map(([href, label]) => (
              <Link className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#3a2c34] hover:bg-[#fff5fa] hover:text-[#c21874]" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
        </Card>
        <section className="grid gap-5">
          <div>
            <p className="text-sm font-semibold text-[#c21874]">Admin Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{title}</h1>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
