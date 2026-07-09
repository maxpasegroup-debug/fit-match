import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { InventoryMovementForm } from "@/components/admin/admin-forms";
import { Card } from "@/components/ui/card";
import { getInventoryData } from "@/features/admin/data";

export const metadata: Metadata = { title: "Admin Inventory" };
export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const inventory = await getInventoryData();
  return (
    <AdminShell title="Inventory">
      <Card className="grid gap-4">
        {inventory.map((item) => (
          <div className="grid gap-4 border-b border-[#eadde6] pb-4 last:border-0" key={item.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div><p className="font-semibold text-[#241820]">{item.product.name}</p><p className="text-sm text-[#756871]">Reserved {item.reservedStock}</p></div>
              <div className="text-right"><p className="text-2xl font-bold text-[#c21874]">{item.currentStock}</p><p className="text-sm text-[#756871]">{item.currentStock <= item.lowStockAt ? "Low stock" : "In stock"}</p></div>
            </div>
            <InventoryMovementForm inventoryId={item.id} />
            <div className="grid gap-2">
              {item.movements.map((movement) => <p className="text-sm text-[#756871]" key={movement.id}>{movement.type}: {movement.quantity} by {movement.adminUser?.email ?? "Admin"}</p>)}
            </div>
          </div>
        ))}
      </Card>
    </AdminShell>
  );
}
