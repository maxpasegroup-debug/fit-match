"use client";

import { useActionState } from "react";
import type { Category, SizeChart } from "@prisma/client";
import { saveFitRuleAction, saveSizeChartAction, saveSizeMappingAction } from "@/features/fit/actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function FitRuleForm() {
  const [state, action] = useActionState(saveFitRuleAction, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <h2 className="text-lg font-semibold text-[#241820]">Recommendation Rule</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" name="name" />
        <Input label="Code" name="code" placeholder="WHEATISH_COLOR_RULE" />
        <Select label="Type" name="type">
          {["SIZE", "COLOR", "FABRIC", "STYLE", "OCCASION", "PRODUCT"].map((type) => <option key={type} value={type}>{type}</option>)}
        </Select>
        <Input label="Priority" name="priority" defaultValue="100" />
        <Input label="Weight" name="weight" defaultValue="10" />
        <Input label="Description" name="description" />
      </div>
      <Textarea label="Conditions JSON" name="conditions" defaultValue='{"skinTone":"WHEATISH"}' />
      <Textarea label="Outcomes JSON" name="outcomes" defaultValue='{"bestColors":["Magenta","Wine"]}' />
      <Checkbox label="Active" name="active" defaultChecked />
      <SubmitButton>Save Rule</SubmitButton>
    </form>
  );
}

export function SizeChartForm({ categories }: { categories: Category[] }) {
  const [state, action] = useActionState(saveSizeChartAction, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <h2 className="text-lg font-semibold text-[#241820]">Size Chart</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Brand" name="brand" defaultValue="FIT & MATCH" />
        <Input label="Chart Name" name="name" />
        <Select label="Category" name="categoryId"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
        <Input label="Garment Ease CM" name="garmentEaseCm" defaultValue="4" />
        <Input label="Tolerance CM" name="toleranceCm" defaultValue="2" />
      </div>
      <Checkbox label="Active" name="active" defaultChecked />
      <SubmitButton>Save Size Chart</SubmitButton>
    </form>
  );
}

export function SizeMappingForm({ charts }: { charts: SizeChart[] }) {
  const [state, action] = useActionState(saveSizeMappingAction, initialState);
  return (
    <form action={action} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <h2 className="text-lg font-semibold text-[#241820]">Brand Size Mapping</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Size Chart" name="sizeChartId">{charts.map((chart) => <option key={chart.id} value={chart.id}>{chart.brand} · {chart.name}</option>)}</Select>
        <Input label="Size" name="sizeName" placeholder="M" />
        <Input label="Sort Order" name="sortOrder" defaultValue="0" />
        {["bustMin", "bustMax", "waistMin", "waistMax", "hipMin", "hipMax", "shoulderMin", "shoulderMax"].map((field) => (
          <Input label={field.replace(/([A-Z])/g, " $1")} name={field} key={field} />
        ))}
      </div>
      <SubmitButton>Save Mapping</SubmitButton>
    </form>
  );
}
