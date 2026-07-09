"use client";

import { useActionState } from "react";
import type { Category, Collection } from "@prisma/client";
import { saveBannerAction, saveInventoryMovementAction, saveLookupAction, saveSupplierAction, saveVariantAction } from "@/features/admin/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function LookupForm({ kind, categories }: { kind: "category" | "subcategory" | "collection" | "season" | "occasion"; categories?: Category[] }) {
  const [state, formAction] = useActionState(saveLookupAction.bind(null, kind), initialState);
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      {kind === "subcategory" ? (
        <Select label="Parent category" name="categoryId">
          <option value="">Select category</option>
          {(categories ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
      ) : null}
      <Input label="Name" name="name" />
      <Input label="Slug" name="slug" />
      <Textarea label="Description" name="description" />
      <Input label="Sort Order" name="sortOrder" inputMode="numeric" defaultValue="0" />
      <Checkbox label="Published" name="published" defaultChecked />
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}

export function SupplierForm() {
  const [state, formAction] = useActionState(saveSupplierAction, initialState);
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" name="name" />
        <Input label="Contact Person" name="contactPerson" />
        <Input label="Phone" name="phone" />
        <Input label="Email" name="email" />
        <Select label="Status" name="status"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select>
      </div>
      <Textarea label="Address" name="address" />
      <SubmitButton>Save supplier</SubmitButton>
    </form>
  );
}

export function BannerForm({ collections }: { collections: Collection[] }) {
  const [state, formAction] = useActionState(saveBannerAction, initialState);
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Title" name="title" />
        <Input label="Subtitle" name="subtitle" />
        <Input label="Image" name="image" />
        <Input label="Desktop Media Asset ID" name="desktopMediaAssetId" />
        <Input label="Tablet Media Asset ID" name="tabletMediaAssetId" />
        <Input label="Mobile Media Asset ID" name="mobileMediaAssetId" />
        <Input label="Href" name="href" />
        <Input label="Active Date" name="activeAt" type="datetime-local" />
        <Input label="Expiry Date" name="expiresAt" type="datetime-local" />
        <Input label="Sort Order" name="sortOrder" defaultValue="0" />
        <Select label="Collection" name="collectionId">
          <option value="">None</option>
          {collections.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
      </div>
      <Checkbox label="Published" name="published" defaultChecked />
      <SubmitButton>Save banner</SubmitButton>
    </form>
  );
}

export function VariantForm({ productId }: { productId: string }) {
  const [state, formAction] = useActionState(saveVariantAction, initialState);
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input name="productId" type="hidden" value={productId} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Variant SKU" name="sku" />
        <Input label="Color" name="colorName" />
        <Input label="Fabric" name="fabricName" />
        <Input label="Size" name="sizeName" />
        <Input label="Stock" name="stock" defaultValue="0" />
        <Input label="Price Override" name="price" />
        <Input label="Offer Price Override" name="offerPrice" />
      </div>
      <Checkbox label="Available" name="available" defaultChecked />
      <SubmitButton>Add variant</SubmitButton>
    </form>
  );
}

export function InventoryMovementForm({ inventoryId }: { inventoryId: string }) {
  const [state, formAction] = useActionState(saveInventoryMovementAction, initialState);
  return (
    <form action={formAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input name="inventoryId" type="hidden" value={inventoryId} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Movement Type" name="type">
          <option value="INITIAL_STOCK">Initial Stock</option>
          <option value="STOCK_ADDED">Stock Added</option>
          <option value="STOCK_REMOVED">Stock Removed</option>
          <option value="MANUAL_ADJUSTMENT">Manual Adjustment</option>
        </Select>
        <Input label="Quantity" name="quantity" inputMode="numeric" />
        <Input label="Reason" name="reason" />
      </div>
      <SubmitButton>Record movement</SubmitButton>
    </form>
  );
}
