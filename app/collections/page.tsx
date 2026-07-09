import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getCollections } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Collections" };
export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <p className="text-sm font-semibold text-[#c21874]">SIGN SILKS</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#241820]">Collections</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((collection) => (
            <Card key={collection.id}>
              <Link className="text-xl font-semibold text-[#241820]" href={`/collections/${collection.slug}`}>{collection.name}</Link>
              <p className="mt-2 text-sm leading-6 text-[#756871]">{collection.description ?? "Curated SIGN SILKS edit."}</p>
              <p className="mt-3 text-sm font-semibold text-[#c21874]">{collection._count.products} products</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
