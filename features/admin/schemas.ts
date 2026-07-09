import { z } from "zod";

const optionalText = z.string().trim().optional().transform((value) => value || undefined);
const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? Number(value) : undefined))
  .pipe(z.number().min(0).optional());

export const productEditorSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().trim().min(2).max(80),
  shortDescription: z.string().trim().min(4).max(280),
  longDescription: optionalText,
  categoryId: z.string().min(1),
  subCategoryId: optionalText,
  collectionId: optionalText,
  supplierId: optionalText,
  seasonId: optionalText,
  occasionId: optionalText,
  price: z.coerce.number().min(0),
  offerPrice: optionalNumber,
  discountPercent: z.coerce.number().int().min(0).max(95).default(0),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  available: z.boolean().default(true),
  published: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED", "DELETED"]).default("DRAFT"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  estimatedStitchingTime: optionalText,
  estimatedDelivery: optionalText,
  seoTitle: optionalText,
  seoDescription: optionalText,
  seoKeywords: optionalText,
  primaryImage: optionalText,
  primaryMediaAssetId: optionalText,
  primaryImageAlt: optionalText,
});

export const variantSchema = z.object({
  id: optionalText,
  productId: z.string().min(1),
  sku: z.string().trim().min(2).max(80),
  colorName: optionalText,
  sizeName: optionalText,
  fabricName: optionalText,
  stock: z.coerce.number().int().min(0).default(0),
  price: optionalNumber,
  offerPrice: optionalNumber,
  available: z.boolean().default(true),
});

export const inventoryMovementSchema = z.object({
  inventoryId: z.string().min(1),
  type: z.enum(["INITIAL_STOCK", "STOCK_ADDED", "STOCK_REMOVED", "MANUAL_ADJUSTMENT"]),
  quantity: z.coerce.number().int().positive(),
  reason: optionalText,
});

export const lookupSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2).max(120),
  slug: optionalText,
  description: optionalText,
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const supplierSchema = z.object({
  id: optionalText,
  name: z.string().trim().min(2).max(120),
  contactPerson: optionalText,
  phone: optionalText,
  email: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)),
  address: optionalText,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const bannerSchema = z.object({
  id: optionalText,
  title: z.string().trim().min(2).max(140),
  subtitle: optionalText,
  image: optionalText,
  desktopMediaAssetId: optionalText,
  tabletMediaAssetId: optionalText,
  mobileMediaAssetId: optionalText,
  activeAt: optionalText,
  expiresAt: optionalText,
  href: optionalText,
  collectionId: optionalText,
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type ProductEditorInput = z.input<typeof productEditorSchema>;
export type VariantInput = z.input<typeof variantSchema>;
export type InventoryMovementInput = z.input<typeof inventoryMovementSchema>;
export type LookupInput = z.input<typeof lookupSchema>;
export type SupplierInput = z.input<typeof supplierSchema>;
export type BannerInput = z.input<typeof bannerSchema>;
