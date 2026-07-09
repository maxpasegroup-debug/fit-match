import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  await requireAdmin();
  const products = await prisma.product.findMany({ include: { category: true, collection: true, supplier: true }, orderBy: { updatedAt: "desc" } });
  const rows = [
    ["Name", "SKU", "Status", "Category", "Collection", "Supplier", "Price", "Published"],
    ...products.map((item) => [
      item.name,
      item.sku,
      item.status,
      item.category.name,
      item.collection?.name ?? "",
      item.supplier?.name ?? "",
      String(item.price),
      String(item.published),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=sign-silks-products.csv",
    },
  });
}
