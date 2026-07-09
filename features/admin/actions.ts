"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { auditLog } from "@/features/admin/audit";
import {
  bannerSchema,
  inventoryMovementSchema,
  lookupSchema,
  productEditorSchema,
  supplierSchema,
  variantSchema,
} from "@/features/admin/schemas";
import { boolValue, slugify, textValue } from "@/features/admin/utils";

type ActionState = { ok: boolean; message: string };
const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

function decimal(value?: number): Prisma.Decimal | undefined {
  return value === undefined ? undefined : new Prisma.Decimal(value);
}

function productPayload(formData: FormData) {
  const name = textValue(formData, "name");
  return {
    id: textValue(formData, "id"),
    name,
    slug: textValue(formData, "slug") || slugify(name),
    sku: textValue(formData, "sku"),
    shortDescription: textValue(formData, "shortDescription"),
    longDescription: textValue(formData, "longDescription"),
    categoryId: textValue(formData, "categoryId"),
    subCategoryId: textValue(formData, "subCategoryId"),
    collectionId: textValue(formData, "collectionId"),
    supplierId: textValue(formData, "supplierId"),
    seasonId: textValue(formData, "seasonId"),
    occasionId: textValue(formData, "occasionId"),
    price: textValue(formData, "price"),
    offerPrice: textValue(formData, "offerPrice"),
    discountPercent: textValue(formData, "discountPercent") || "0",
    featured: boolValue(formData, "featured"),
    trending: boolValue(formData, "trending"),
    bestSeller: boolValue(formData, "bestSeller"),
    newArrival: boolValue(formData, "newArrival"),
    available: boolValue(formData, "available"),
    published: boolValue(formData, "published"),
    status: textValue(formData, "status") || "DRAFT",
    sortOrder: textValue(formData, "sortOrder") || "0",
    estimatedStitchingTime: textValue(formData, "estimatedStitchingTime"),
    estimatedDelivery: textValue(formData, "estimatedDelivery"),
    seoTitle: textValue(formData, "seoTitle"),
    seoDescription: textValue(formData, "seoDescription"),
    seoKeywords: textValue(formData, "seoKeywords"),
    primaryImage: textValue(formData, "primaryImage"),
    primaryMediaAssetId: textValue(formData, "primaryMediaAssetId"),
    primaryImageAlt: textValue(formData, "primaryImageAlt"),
  };
}

export async function saveProductAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = productEditorSchema.safeParse(productPayload(formData));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid product");

  const productData = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    sku: parsed.data.sku,
    shortDescription: parsed.data.shortDescription,
    longDescription: parsed.data.longDescription,
    categoryId: parsed.data.categoryId,
    subCategoryId: parsed.data.subCategoryId,
    collectionId: parsed.data.collectionId,
    supplierId: parsed.data.supplierId,
    seasonId: parsed.data.seasonId,
    occasionId: parsed.data.occasionId,
    price: new Prisma.Decimal(parsed.data.price),
    offerPrice: decimal(parsed.data.offerPrice),
    discountPercent: parsed.data.discountPercent,
    featured: parsed.data.featured,
    trending: parsed.data.trending,
    bestSeller: parsed.data.bestSeller,
    newArrival: parsed.data.newArrival,
    available: parsed.data.available,
    published: parsed.data.published,
    status: parsed.data.published ? "PUBLISHED" : parsed.data.status,
    sortOrder: parsed.data.sortOrder,
    estimatedStitchingTime: parsed.data.estimatedStitchingTime,
    estimatedDelivery: parsed.data.estimatedDelivery,
    archivedAt: parsed.data.status === "ARCHIVED" ? new Date() : null,
    deletedAt: parsed.data.status === "DELETED" ? new Date() : null,
  };

  const product = await prisma.$transaction(async (tx) => {
    const saved = parsed.data.id
      ? await tx.product.update({ where: { id: parsed.data.id }, data: productData })
      : await tx.product.create({ data: productData });

    await tx.productSEO.upsert({
      where: { productId: saved.id },
      create: {
        productId: saved.id,
        title: parsed.data.seoTitle,
        description: parsed.data.seoDescription,
        keywords: parsed.data.seoKeywords,
      },
      update: {
        title: parsed.data.seoTitle,
        description: parsed.data.seoDescription,
        keywords: parsed.data.seoKeywords,
      },
    });

    const primaryMediaAsset = parsed.data.primaryMediaAssetId
      ? await tx.mediaAsset.findFirst({ where: { id: parsed.data.primaryMediaAssetId, deletedAt: null } })
      : null;

    const primaryImageUrl = primaryMediaAsset?.secureUrl ?? parsed.data.primaryImage;
    if (primaryImageUrl) {
      await tx.productImage.upsert({
        where: { id: `${saved.id}-primary` },
        create: {
          id: `${saved.id}-primary`,
          productId: saved.id,
          mediaAssetId: primaryMediaAsset?.id,
          url: primaryImageUrl,
          alt: parsed.data.primaryImageAlt,
          isPrimary: true,
          displayOrder: 0,
        },
        update: { mediaAssetId: primaryMediaAsset?.id, url: primaryImageUrl, alt: parsed.data.primaryImageAlt, isPrimary: true },
      });
      if (primaryMediaAsset) {
        await tx.mediaUsage.upsert({
          where: {
            assetId_usageType_entityType_entityId_fieldName: {
              assetId: primaryMediaAsset.id,
              usageType: "PRODUCT_PRIMARY",
              entityType: "Product",
              entityId: saved.id,
              fieldName: "primaryImage",
            },
          },
          create: { assetId: primaryMediaAsset.id, usageType: "PRODUCT_PRIMARY", entityType: "Product", entityId: saved.id, fieldName: "primaryImage" },
          update: {},
        });
      }
    }

    await tx.inventory.upsert({
      where: { productId: saved.id },
      create: { productId: saved.id, currentStock: 0, reservedStock: 0 },
      update: {},
    });

    return saved;
  });

  await auditLog({
    admin,
    action: parsed.data.id ? "PRODUCT_UPDATED" : "PRODUCT_CREATED",
    entityType: "Product",
    entityId: product.id,
    productId: product.id,
    message: `${admin.email} saved product ${product.name}`,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  return ok("Product saved.");
}

async function setProductLifecycle(formData: FormData, action: string, data: Prisma.ProductUpdateInput) {
  const admin = await requireAdmin();
  const id = textValue(formData, "id");
  const product = await prisma.product.update({ where: { id }, data });
  await auditLog({ admin, action, entityType: "Product", entityId: id, productId: id, message: `${action}: ${product.name}` });
  revalidatePath("/admin/products");
}

export async function publishProductAction(formData: FormData): Promise<void> {
  await setProductLifecycle(formData, "PRODUCT_PUBLISHED", { published: true, status: "PUBLISHED", archivedAt: null, deletedAt: null });
}

export async function unpublishProductAction(formData: FormData): Promise<void> {
  await setProductLifecycle(formData, "PRODUCT_UNPUBLISHED", { published: false, status: "DRAFT" });
}

export async function archiveProductAction(formData: FormData): Promise<void> {
  await setProductLifecycle(formData, "PRODUCT_ARCHIVED", { published: false, status: "ARCHIVED", archivedAt: new Date() });
}

export async function softDeleteProductAction(formData: FormData): Promise<void> {
  await setProductLifecycle(formData, "PRODUCT_DELETED", { published: false, status: "DELETED", deletedAt: new Date() });
}

export async function restoreProductAction(formData: FormData): Promise<void> {
  await setProductLifecycle(formData, "PRODUCT_RESTORED", { status: "DRAFT", deletedAt: null, archivedAt: null });
}

export async function duplicateProductAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const source = await prisma.product.findUniqueOrThrow({
    where: { id: textValue(formData, "id") },
    include: { seo: true, images: true, variants: true, fabrics: true, colors: true, sizes: true, tags: true },
  });
  const copy = await prisma.product.create({
    data: {
      categoryId: source.categoryId,
      subCategoryId: source.subCategoryId,
      collectionId: source.collectionId,
      supplierId: source.supplierId,
      seasonId: source.seasonId,
      occasionId: source.occasionId,
      name: `${source.name} Copy`,
      slug: `${source.slug}-copy-${Date.now()}`,
      sku: `${source.sku}-COPY-${Date.now()}`,
      shortDescription: source.shortDescription,
      longDescription: source.longDescription,
      price: source.price,
      offerPrice: source.offerPrice,
      discountPercent: source.discountPercent,
      sortOrder: source.sortOrder,
      estimatedStitchingTime: source.estimatedStitchingTime,
      estimatedDelivery: source.estimatedDelivery,
      images: { create: source.images.map(({ mediaAssetId, url, alt, caption, isPrimary, displayOrder }) => ({ mediaAssetId, url, alt, caption, isPrimary, displayOrder })) },
      variants: { create: source.variants.map(({ sku, colorName, sizeName, fabricName, price, offerPrice, available, stockLabel }) => ({ sku: `${sku}-COPY-${Date.now()}`, colorName, sizeName, fabricName, price, offerPrice, available, stockLabel })) },
      fabrics: { create: source.fabrics.map(({ name, description, careInstructions }) => ({ name, description, careInstructions })) },
      colors: { create: source.colors.map(({ name, hexCode, preview, available }) => ({ name, hexCode, preview, available })) },
      sizes: { create: source.sizes.map(({ name, available, sortOrder }) => ({ name, available, sortOrder })) },
      tags: { create: source.tags.map(({ name, slug }) => ({ name, slug })) },
      seo: source.seo ? { create: { title: source.seo.title, description: source.seo.description, keywords: source.seo.keywords } } : undefined,
      inventory: { create: { currentStock: 0, reservedStock: 0 } },
    },
  });
  await auditLog({ admin, action: "PRODUCT_DUPLICATED", entityType: "Product", entityId: copy.id, productId: copy.id, message: `Duplicated ${source.name}` });
  revalidatePath("/admin/products");
}

export async function saveVariantAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = variantSchema.safeParse({
    id: textValue(formData, "id"),
    productId: textValue(formData, "productId"),
    sku: textValue(formData, "sku"),
    colorName: textValue(formData, "colorName"),
    sizeName: textValue(formData, "sizeName"),
    fabricName: textValue(formData, "fabricName"),
    stock: textValue(formData, "stock") || "0",
    price: textValue(formData, "price"),
    offerPrice: textValue(formData, "offerPrice"),
    available: boolValue(formData, "available"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid variant");
  const variant = parsed.data.id
    ? await prisma.productVariant.update({ where: { id: parsed.data.id }, data: { ...parsed.data, id: undefined, stockLabel: `${parsed.data.stock} in stock`, price: decimal(parsed.data.price), offerPrice: decimal(parsed.data.offerPrice) } })
    : await prisma.productVariant.create({ data: { ...parsed.data, id: undefined, stockLabel: `${parsed.data.stock} in stock`, price: decimal(parsed.data.price), offerPrice: decimal(parsed.data.offerPrice) } });
  await auditLog({ admin, action: "VARIANT_SAVED", entityType: "ProductVariant", entityId: variant.id, productId: variant.productId, message: `Saved variant ${variant.sku}` });
  revalidatePath(`/admin/products/${variant.productId}`);
  return ok("Variant saved.");
}

export async function deleteVariantAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const variant = await prisma.productVariant.delete({ where: { id: textValue(formData, "id") } });
  revalidatePath(`/admin/products/${variant.productId}`);
}

export async function saveInventoryMovementAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = inventoryMovementSchema.safeParse({
    inventoryId: textValue(formData, "inventoryId"),
    type: textValue(formData, "type"),
    quantity: textValue(formData, "quantity"),
    reason: textValue(formData, "reason"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid inventory movement");
  const direction = parsed.data.type === "STOCK_REMOVED" ? -1 : 1;
  await prisma.$transaction([
    prisma.inventory.update({
      where: { id: parsed.data.inventoryId },
      data: { currentStock: { increment: parsed.data.quantity * direction } },
    }),
    prisma.inventoryMovement.create({
      data: { ...parsed.data, adminUserId: admin.id },
    }),
  ]);
  await auditLog({ admin, action: "INVENTORY_CHANGED", entityType: "Inventory", entityId: parsed.data.inventoryId, message: parsed.data.reason ?? "Inventory updated" });
  revalidatePath("/admin/inventory");
  return ok("Inventory updated.");
}

export async function saveLookupAction(kind: "category" | "subcategory" | "collection" | "season" | "occasion", _previousState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const name = textValue(formData, "name");
  const parsed = lookupSchema.safeParse({
    id: textValue(formData, "id"),
    name,
    slug: textValue(formData, "slug") || slugify(name),
    description: textValue(formData, "description"),
    sortOrder: textValue(formData, "sortOrder") || "0",
    published: boolValue(formData, "published"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid lookup");
  const data = parsed.data;
  const saved = await saveLookupByKind(kind, data, textValue(formData, "categoryId"));
  await auditLog({ admin, action: `${kind.toUpperCase()}_SAVED`, entityType: kind, entityId: saved.id, message: `Saved ${kind} ${data.name}` });
  revalidatePath("/admin");
  return ok("Saved.");
}

async function saveLookupByKind(kind: string, data: { id?: string; name: string; slug?: string; description?: string; sortOrder: number; published: boolean }, categoryId: string) {
  const payload = { ...data, slug: data.slug ?? slugify(data.name) };
  if (kind === "category") return data.id ? prisma.category.update({ where: { id: data.id }, data: payload }) : prisma.category.create({ data: payload });
  if (kind === "subcategory") {
    const subCategoryPayload = { ...payload, categoryId };
    return data.id ? prisma.subCategory.update({ where: { id: data.id }, data: subCategoryPayload }) : prisma.subCategory.create({ data: subCategoryPayload });
  }
  if (kind === "collection") return data.id ? prisma.collection.update({ where: { id: data.id }, data: payload }) : prisma.collection.create({ data: payload });
  if (kind === "season") return data.id ? prisma.season.update({ where: { id: data.id }, data: payload }) : prisma.season.create({ data: payload });
  return data.id ? prisma.occasion.update({ where: { id: data.id }, data: payload }) : prisma.occasion.create({ data: payload });
}

export async function saveSupplierAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = supplierSchema.safeParse({
    id: textValue(formData, "id"),
    name: textValue(formData, "name"),
    contactPerson: textValue(formData, "contactPerson"),
    phone: textValue(formData, "phone"),
    email: textValue(formData, "email"),
    address: textValue(formData, "address"),
    status: textValue(formData, "status") || "ACTIVE",
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid supplier");
  const supplier = parsed.data.id
    ? await prisma.supplier.update({ where: { id: parsed.data.id }, data: { ...parsed.data, id: undefined } })
    : await prisma.supplier.create({ data: { ...parsed.data, id: undefined } });
  await auditLog({ admin, action: "SUPPLIER_SAVED", entityType: "Supplier", entityId: supplier.id, message: `Saved supplier ${supplier.name}` });
  revalidatePath("/admin");
  return ok("Supplier saved.");
}

export async function saveBannerAction(_previousState: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = bannerSchema.safeParse({
    id: textValue(formData, "id"),
    title: textValue(formData, "title"),
    subtitle: textValue(formData, "subtitle"),
    image: textValue(formData, "image"),
    desktopMediaAssetId: textValue(formData, "desktopMediaAssetId"),
    tabletMediaAssetId: textValue(formData, "tabletMediaAssetId"),
    mobileMediaAssetId: textValue(formData, "mobileMediaAssetId"),
    activeAt: textValue(formData, "activeAt"),
    expiresAt: textValue(formData, "expiresAt"),
    href: textValue(formData, "href"),
    collectionId: textValue(formData, "collectionId"),
    published: boolValue(formData, "published"),
    sortOrder: textValue(formData, "sortOrder") || "0",
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid banner");
  const banner = parsed.data.id
    ? await prisma.featuredBanner.update({
        where: { id: parsed.data.id },
        data: {
          ...parsed.data,
          id: undefined,
          activeAt: parsed.data.activeAt ? new Date(parsed.data.activeAt) : null,
          expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        },
      })
    : await prisma.featuredBanner.create({
        data: {
          ...parsed.data,
          id: undefined,
          activeAt: parsed.data.activeAt ? new Date(parsed.data.activeAt) : null,
          expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
        },
      });
  await auditLog({ admin, action: "BANNER_SAVED", entityType: "FeaturedBanner", entityId: banner.id, featuredBannerId: banner.id, message: `Saved banner ${banner.title}` });
  revalidatePath("/admin/banners");
  return ok("Banner saved.");
}
