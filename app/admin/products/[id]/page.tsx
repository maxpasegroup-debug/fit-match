import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { VariantForm } from "@/components/admin/admin-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteVariantAction } from "@/features/admin/actions";
import { getProductEditorData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Edit Product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProductEditorData(id);
  if (!data.product) notFound();
  const product = data.product;
  return (
    <AdminShell title={`Edit ${product.name}`}>
      <ProductEditorForm
        values={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription ?? "",
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId ?? "",
          collectionId: product.collectionId ?? "",
          supplierId: product.supplierId ?? "",
          seasonId: product.seasonId ?? "",
          occasionId: product.occasionId ?? "",
          price: Number(product.price),
          offerPrice: product.offerPrice ? String(product.offerPrice) : undefined,
          discountPercent: product.discountPercent,
          featured: product.featured,
          trending: product.trending,
          bestSeller: product.bestSeller,
          newArrival: product.newArrival,
          available: product.available,
          published: product.published,
          status: product.status,
          sortOrder: product.sortOrder,
          estimatedStitchingTime: product.estimatedStitchingTime ?? "",
          estimatedDelivery: product.estimatedDelivery ?? "",
          seoTitle: product.seo?.title ?? "",
          seoDescription: product.seo?.description ?? "",
          seoKeywords: product.seo?.keywords ?? "",
          primaryImage: product.images[0]?.url ?? "",
          primaryMediaAssetId: product.images[0]?.mediaAssetId ?? "",
          primaryImageAlt: product.images[0]?.alt ?? "",
        }}
        {...data}
      />
      <Card>
        <h2 className="mb-4 text-xl font-semibold text-[#241820]">Product Variants</h2>
        <VariantForm productId={product.id} />
        <div className="mt-5 grid gap-3">
          {product.variants.map((variant) => (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fffafd] p-4" key={variant.id}>
              <span className="font-semibold text-[#241820]">{variant.sku} - {variant.colorName ?? "Any color"} - {variant.sizeName ?? "Any size"}</span>
              <form action={deleteVariantAction}><input name="id" type="hidden" value={variant.id} /><Button type="submit" variant="secondary">Delete</Button></form>
            </div>
          ))}
        </div>
      </Card>
    </AdminShell>
  );
}
