"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { saveMeasurementAction } from "@/features/profile/actions";
import { measurementSchema, type MeasurementFormInput } from "@/features/profile/schemas";
import { heightUnitOptions, weightUnitOptions } from "@/features/profile/options";
import type { MeasurementFormValues } from "@/features/profile/view-models";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };
const fields = [
  ["bust", "Bust"],
  ["waist", "Waist"],
  ["hip", "Hip"],
  ["shoulder", "Shoulder"],
  ["armLength", "Arm Length"],
  ["sleeveLength", "Sleeve Length"],
  ["kurtiLength", "Kurti Length"],
  ["topLength", "Top Length"],
  ["blouseLength", "Blouse Length"],
  ["neck", "Neck"],
  ["thigh", "Thigh"],
  ["calf", "Calf"],
] as const;

export function MeasurementForm({ values }: { values: MeasurementFormValues }) {
  const [state, formAction] = useActionState(saveMeasurementAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<MeasurementFormInput>({
    resolver: zodResolver(measurementSchema) as Resolver<MeasurementFormInput>,
    defaultValues: {
      ...values,
      heightUnit: values.heightUnit as MeasurementFormInput["heightUnit"],
      weightUnit: values.weightUnit as MeasurementFormInput["weightUnit"],
    },
  });

  return (
    <form action={formAction} className="grid gap-4">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input type="hidden" value={values.id} {...register("id")} />
      <Input label="Profile name" error={errors.profileName?.message} {...register("profileName")} />
      <div className="grid gap-4 md:grid-cols-3">
        {fields.map(([name, label]) => (
          <Input key={name} label={label} inputMode="decimal" error={errors[name]?.message} {...register(name)} />
        ))}
        <Input label="Height" inputMode="decimal" error={errors.height?.message} {...register("height")} />
        <Select label="Height unit" error={errors.heightUnit?.message} {...register("heightUnit")}>
          {heightUnitOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Input label="Weight" inputMode="decimal" error={errors.weight?.message} {...register("weight")} />
        <Select label="Weight unit" error={errors.weightUnit?.message} {...register("weightUnit")}>
          {weightUnitOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <Textarea label="Notes" error={errors.notes?.message} {...register("notes")} />
      <Checkbox label="Make this my default measurement profile" defaultChecked={values.isDefault} {...register("isDefault")} />
      <SubmitButton>{values.id ? "Update measurements" : "Create measurements"}</SubmitButton>
    </form>
  );
}
