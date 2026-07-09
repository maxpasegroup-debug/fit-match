import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditorForm } from "@/components/admin/product-editor-form";
import { getProductEditorData } from "@/features/admin/data";

export const metadata: Metadata = { title: "New Product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const data = await getProductEditorData();
  return (
    <AdminShell title="Create Product">
      <ProductEditorForm
        values={{ name: "", slug: "", sku: "", shortDescription: "", categoryId: "", price: 0, discountPercent: 0, status: "DRAFT", sortOrder: 0, available: true, published: false }}
        {...data}
      />
    </AdminShell>
  );
}
