import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { archiveProductAction, duplicateProductAction, publishProductAction, restoreProductAction, softDeleteProductAction, unpublishProductAction } from "@/features/admin/actions";
import { getAdminProducts } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const products = await getAdminProducts(params);
  return (
    <AdminShell title="Products">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form className="flex gap-2">
          <input className="h-11 rounded-2xl border border-[#eadde6] px-4" name="q" placeholder="Search product, SKU, category" />
          <Button type="submit">Search</Button>
        </form>
        <div className="flex gap-2">
          <ButtonLink href="/admin/products/export.csv" variant="secondary">Export CSV</ButtonLink>
          <ButtonLink href="/admin/products/new">Create Product</ButtonLink>
        </div>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-[#756871]">
            <tr><th className="p-3">Product</th><th>SKU</th><th>Status</th><th>Category</th><th>Stock</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr className="border-t border-[#eadde6]" key={product.id}>
                <td className="p-3"><Link className="font-semibold text-[#241820]" href={`/admin/products/${product.id}`}>{product.name}</Link></td>
                <td>{product.sku}</td>
                <td>{product.status}</td>
                <td>{product.category.name}</td>
                <td>{product.inventory?.currentStock ?? 0}</td>
                <td className="flex flex-wrap gap-2 py-2">
                  <MiniAction action={publishProductAction} id={product.id} label="Publish" />
                  <MiniAction action={unpublishProductAction} id={product.id} label="Unpublish" />
                  <MiniAction action={archiveProductAction} id={product.id} label="Archive" />
                  <MiniAction action={duplicateProductAction} id={product.id} label="Duplicate" />
                  {product.status === "DELETED" ? <MiniAction action={restoreProductAction} id={product.id} label="Restore" /> : <MiniAction action={softDeleteProductAction} id={product.id} label="Delete" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}

function MiniAction({ action, id, label }: { action: (formData: FormData) => Promise<void>; id: string; label: string }) {
  return <form action={action}><input name="id" type="hidden" value={id} /><Button size="md" type="submit" variant="secondary">{label}</Button></form>;
}
