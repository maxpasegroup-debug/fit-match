"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import type { Category, Collection, Occasion, Season, SubCategory, Supplier } from "@prisma/client";
import { saveProductAction } from "@/features/admin/actions";
import { productEditorSchema, type ProductEditorInput } from "@/features/admin/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

type ProductEditorValues = ProductEditorInput & {
  id?: string;
};

const initialState = { ok: false, message: "" };

export function ProductEditorForm({
  values,
  categories,
  subCategories,
  collections,
  suppliers,
  seasons,
  occasions,
}: {
  values: ProductEditorValues;
  categories: Category[];
  subCategories: SubCategory[];
  collections: Collection[];
  suppliers: Supplier[];
  seasons: Season[];
  occasions: Occasion[];
}) {
  const [state, formAction] = useActionState(saveProductAction, initialState);
  const { register, formState: { errors } } = useForm<ProductEditorInput>({
    resolver: zodResolver(productEditorSchema) as Resolver<ProductEditorInput>,
    defaultValues: values,
  });

  return (
    <form action={formAction} className="grid gap-5 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input type="hidden" {...register("id")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Product Name" error={errors.name?.message} {...register("name")} />
        <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
        <Input label="SKU" error={errors.sku?.message} {...register("sku")} />
        <Input label="Base Price" inputMode="decimal" error={errors.price?.message} {...register("price")} />
        <Input label="Offer Price" inputMode="decimal" error={errors.offerPrice?.message} {...register("offerPrice")} />
        <Input label="Discount %" inputMode="numeric" error={errors.discountPercent?.message} {...register("discountPercent")} />
        <Select label="Category" error={errors.categoryId?.message} {...register("categoryId")}>
          <option value="">Select category</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Subcategory" error={errors.subCategoryId?.message} {...register("subCategoryId")}>
          <option value="">None</option>
          {subCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Collection" error={errors.collectionId?.message} {...register("collectionId")}>
          <option value="">None</option>
          {collections.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Supplier" error={errors.supplierId?.message} {...register("supplierId")}>
          <option value="">None</option>
          {suppliers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Season" error={errors.seasonId?.message} {...register("seasonId")}>
          <option value="">None</option>
          {seasons.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select label="Occasion" error={errors.occasionId?.message} {...register("occasionId")}>
          <option value="">None</option>
          {occasions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Input label="Estimated Stitching Time" error={errors.estimatedStitchingTime?.message} {...register("estimatedStitchingTime")} />
        <Input label="Estimated Delivery" error={errors.estimatedDelivery?.message} {...register("estimatedDelivery")} />
        <Input label="Primary Image URL" error={errors.primaryImage?.message} {...register("primaryImage")} />
        <Input label="Primary Media Asset ID" error={errors.primaryMediaAssetId?.message} {...register("primaryMediaAssetId")} />
        <Input label="Primary Image Alt Text" error={errors.primaryImageAlt?.message} {...register("primaryImageAlt")} />
        <Select label="Product Status" error={errors.status?.message} {...register("status")}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
          <option value="DELETED">Deleted</option>
        </Select>
        <Input label="Sort Order" inputMode="numeric" error={errors.sortOrder?.message} {...register("sortOrder")} />
      </div>
      <Input label="Short Description" error={errors.shortDescription?.message} {...register("shortDescription")} />
      <Textarea label="Long Description" error={errors.longDescription?.message} {...register("longDescription")} />
      <div className="grid gap-3 md:grid-cols-3">
        <Checkbox label="Published" {...register("published")} />
        <Checkbox label="Available" defaultChecked {...register("available")} />
        <Checkbox label="Featured" {...register("featured")} />
        <Checkbox label="Trending" {...register("trending")} />
        <Checkbox label="Best Seller" {...register("bestSeller")} />
        <Checkbox label="New Arrival" {...register("newArrival")} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="SEO Title" error={errors.seoTitle?.message} {...register("seoTitle")} />
        <Input label="SEO Keywords" error={errors.seoKeywords?.message} {...register("seoKeywords")} />
        <Input label="SEO Description" error={errors.seoDescription?.message} {...register("seoDescription")} />
      </div>
      <SubmitButton>Save product</SubmitButton>
    </form>
  );
}
