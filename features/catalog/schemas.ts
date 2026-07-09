import { z } from "zod";

export const catalogSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  subcategory: z.string().trim().max(120).optional(),
  collection: z.string().trim().max(120).optional(),
  color: z.string().trim().max(80).optional(),
  fabric: z.string().trim().max(80).optional(),
  size: z.string().trim().max(40).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  available: z.coerce.boolean().optional(),
  trending: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  newArrival: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "popularity", "featured"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
});

export type CatalogSearchInput = z.infer<typeof catalogSearchSchema>;
