"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveAddressAction } from "@/features/profile/actions";
import { addressSchema, type AddressFormInput } from "@/features/profile/schemas";
import { addressTypeOptions } from "@/features/profile/options";
import type { AddressFormValues } from "@/features/profile/view-models";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function AddressForm({ values }: { values: AddressFormValues }) {
  const [state, formAction] = useActionState(saveAddressAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<AddressFormInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: values as AddressFormInput,
  });

  return (
    <form action={formAction} className="grid gap-4">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input type="hidden" value={values.id} {...register("id")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Full name" error={errors.fullName?.message} {...register("fullName")} />
        <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
        <Input label="House / Flat" error={errors.house?.message} {...register("house")} />
        <Input label="Street" error={errors.street?.message} {...register("street")} />
        <Input label="Landmark" error={errors.landmark?.message} {...register("landmark")} />
        <Input label="City" error={errors.city?.message} {...register("city")} />
        <Input label="District" error={errors.district?.message} {...register("district")} />
        <Input label="State" error={errors.state?.message} {...register("state")} />
        <Input label="Country" error={errors.country?.message} {...register("country")} />
        <Input label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
        <Select label="Address type" error={errors.type?.message} {...register("type")}>
          {addressTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <Checkbox label="Make this my default address" defaultChecked={values.isDefault} {...register("isDefault")} />
      <SubmitButton>{values.id ? "Update address" : "Add address"}</SubmitButton>
    </form>
  );
}
