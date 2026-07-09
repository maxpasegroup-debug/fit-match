import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CatalogFilters({
  defaultQuery = "",
  category,
  collection,
}: {
  defaultQuery?: string;
  category?: string;
  collection?: string;
}) {
  return (
    <form className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-4 shadow-sm" role="search">
      {category ? <input name="category" type="hidden" value={category} /> : null}
      {collection ? <input name="collection" type="hidden" value={collection} /> : null}
      <label className="grid gap-2 text-sm font-semibold text-[#241820]">
        Search
        <span className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#756871]" />
          <input
            className="h-12 w-full rounded-2xl border border-[#eadde6] bg-white pl-12 pr-4 outline-none focus:border-[#c21874] focus:ring-4 focus:ring-[#c21874]/10"
            defaultValue={defaultQuery}
            name="q"
            placeholder="Search styles, colors, fabrics"
          />
        </span>
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <input className="h-12 rounded-2xl border border-[#eadde6] px-4" name="minPrice" placeholder="Min price" />
        <input className="h-12 rounded-2xl border border-[#eadde6] px-4" name="maxPrice" placeholder="Max price" />
        <input className="h-12 rounded-2xl border border-[#eadde6] px-4" name="color" placeholder="Color" />
        <input className="h-12 rounded-2xl border border-[#eadde6] px-4" name="fabric" placeholder="Fabric" />
        <select className="h-12 rounded-2xl border border-[#eadde6] px-4" name="size" defaultValue="">
          <option value="">Any size</option>
          {["XS", "S", "M", "L", "XL", "XXL", "3XL", "Custom Fit"].map((size) => <option key={size} value={size}>{size}</option>)}
        </select>
        <select className="h-12 rounded-2xl border border-[#eadde6] px-4" name="sort" defaultValue="newest">
          <option value="newest">Newest</option>
          <option value="price-asc">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
          <option value="popularity">Popularity</option>
          <option value="featured">Featured</option>
        </select>
        {["available", "trending", "featured", "newArrival"].map((item) => (
          <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#eadde6] px-4 text-sm font-semibold" key={item}>
            <input name={item} type="checkbox" value="true" />
            {item === "newArrival" ? "New Arrival" : item.charAt(0).toUpperCase() + item.slice(1)}
          </label>
        ))}
      </div>
      <Button type="submit">Apply filters</Button>
    </form>
  );
}
