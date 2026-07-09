import Link from "next/link";
import type { Metadata } from "next";
import { Grid2X2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCategories } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <div>
          <Grid2X2 className="mb-4 h-7 w-7 text-[#c21874]" />
          <h1 className="text-3xl font-semibold text-[#241820]">Categories</h1>
          <p className="mt-2 text-sm text-[#756871]">Browse SIGN SILKS by style family.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <Link className="text-xl font-semibold text-[#241820]" href={`/categories/${category.slug}`}>{category.name}</Link>
              <p className="mt-2 text-sm text-[#756871]">{category._count.products} products</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.subCategories.map((subCategory) => (
                  <Link className="rounded-full bg-[#fde8f3] px-3 py-2 text-xs font-semibold text-[#9f125d]" href={`/categories/${category.slug}?subcategory=${subCategory.slug}`} key={subCategory.id}>
                    {subCategory.name}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
