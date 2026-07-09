import { Button } from "@/components/ui/button";
import { saveShippingRateAction, saveShippingZoneAction, saveWarehouseAction, saveWarehouseInventoryAction } from "@/features/shipping/actions";
import { getWarehousesData } from "@/features/shipping/data";
import { formatMoney } from "@/features/checkout/price-engine";

export const metadata = { title: "Admin Warehouses" };
export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  const { warehouses, products, zones } = await getWarehousesData();

  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold text-[#c21874]">Logistics</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Warehouses</h1>
      </div>
      <section className="grid gap-4 lg:grid-cols-2">
        <form action={saveWarehouseAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Warehouse CRUD</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="name" placeholder="Name" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="code" placeholder="Code" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="phone" placeholder="Phone" />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="address" placeholder="Address" required />
          <div className="grid gap-3 sm:grid-cols-3">
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="city" placeholder="City" required />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="state" placeholder="State" required />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="pincode" placeholder="Pincode" required />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[#241820]"><input name="active" type="checkbox" defaultChecked /> Active</label>
          <Button type="submit">Save Warehouse</Button>
        </form>
        <form action={saveWarehouseInventoryAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Inventory Allocation</h2>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="warehouseId" required>
            <option value="">Warehouse</option>
            {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
          </select>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="productId" required>
            <option value="">Product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="availableStock" placeholder="Available stock" type="number" min="0" />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="lowStockAt" placeholder="Low stock alert" type="number" min="0" defaultValue="5" />
          <Button type="submit" variant="secondary">Save Inventory</Button>
        </form>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <form action={saveShippingZoneAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Shipping Zone</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="name" placeholder="Zone name" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="code" placeholder="Zone code" required />
          <textarea className="min-h-24 rounded-3xl border border-[#eadde6] p-4" name="states" placeholder="States, comma separated" required />
          <label className="flex items-center gap-2 text-sm font-semibold text-[#241820]"><input name="active" type="checkbox" defaultChecked /> Active</label>
          <Button type="submit" variant="secondary">Save Zone</Button>
        </form>
        <form action={saveShippingRateAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Shipping Rate</h2>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="zoneId" required>
            <option value="">Zone</option>
            {zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}
          </select>
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="serviceLevel"><option value="STANDARD">Standard</option><option value="EXPRESS">Express</option></select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="minWeightGrams" placeholder="Min grams" type="number" required />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="maxWeightGrams" placeholder="Max grams" type="number" required />
          </div>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="price" placeholder="Price" type="number" step="0.01" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="freeShippingThreshold" placeholder="Free shipping threshold" type="number" step="0.01" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="estimatedDaysMin" placeholder="Min days" type="number" required />
            <input className="h-12 rounded-full border border-[#eadde6] px-4" name="estimatedDaysMax" placeholder="Max days" type="number" required />
          </div>
          <Button type="submit" variant="secondary">Save Rate</Button>
        </form>
      </section>
      <section className="grid gap-4">
        {warehouses.map((warehouse) => (
          <article className="rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" key={warehouse.id}>
            <h2 className="text-lg font-semibold text-[#241820]">{warehouse.name}</h2>
            <p className="text-sm text-[#756871]">{warehouse.city}, {warehouse.state} · {warehouse.pincode}</p>
            <div className="mt-4 grid gap-2">
              {warehouse.inventory.map((item) => (
                <p className={`rounded-2xl p-3 text-sm ${item.availableStock <= item.lowStockAt ? "bg-[#fde8f3] text-[#9f125d]" : "bg-[#fffafd] text-[#756871]"}`} key={item.id}>
                  {item.product.name}: {item.availableStock} available, {item.allocatedStock} allocated · low at {item.lowStockAt}
                </p>
              ))}
            </div>
          </article>
        ))}
        {zones.map((zone) => (
          <article className="rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" key={zone.id}>
            <h2 className="text-lg font-semibold text-[#241820]">{zone.name}</h2>
            {zone.rates.map((rate) => <p className="text-sm text-[#756871]" key={rate.id}>{rate.serviceLevel}: {rate.minWeightGrams}-{rate.maxWeightGrams}g · {formatMoney(rate.price)}</p>)}
          </article>
        ))}
      </section>
    </main>
  );
}
