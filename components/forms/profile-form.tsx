"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { updateProfileAction } from "@/features/profile/actions";
import { profileSchema, type ProfileFormInput } from "@/features/profile/schemas";
import {
  bodyTypeOptions,
  genderOptions,
  heightUnitOptions,
  skinToneOptions,
  weightUnitOptions,
} from "@/features/profile/options";
import type { ProfileFormValues } from "@/features/profile/view-models";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function ProfileForm({ values }: { values: ProfileFormValues }) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormInput>,
    defaultValues: {
      name: values.name,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth,
      gender: (values.gender || undefined) as ProfileFormInput["gender"],
      height: values.height,
      heightUnit: values.heightUnit as ProfileFormInput["heightUnit"],
      weight: values.weight,
      weightUnit: values.weightUnit as ProfileFormInput["weightUnit"],
      preferredLanguage: values.preferredLanguage,
      preferredMeasurementUnit: values.preferredMeasurementUnit as ProfileFormInput["preferredMeasurementUnit"],
      bodyType: values.bodyType as ProfileFormInput["bodyType"],
      skinTone: values.skinTone as ProfileFormInput["skinTone"],
    },
  });

  return (
    <form action={formAction} className="grid gap-4">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Name" error={errors.name?.message} {...register("name")} />
        <Input label="Email" value={values.email} readOnly aria-describedby="email-status" />
        <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
        <Input label="Date of birth" type="date" error={errors.dateOfBirth?.message} {...register("dateOfBirth")} />
        <Select label="Gender" error={errors.gender?.message} {...register("gender")}>
          <option value="">Select gender</option>
          {genderOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Input label="Preferred language" error={errors.preferredLanguage?.message} {...register("preferredLanguage")} />
        <Input label="Height" inputMode="decimal" error={errors.height?.message} {...register("height")} />
        <Select label="Height unit" error={errors.heightUnit?.message} {...register("heightUnit")}>
          {heightUnitOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Input label="Weight" inputMode="decimal" error={errors.weight?.message} {...register("weight")} />
        <Select label="Weight unit" error={errors.weightUnit?.message} {...register("weightUnit")}>
          {weightUnitOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select label="Preferred measurement unit" error={errors.preferredMeasurementUnit?.message} {...register("preferredMeasurementUnit")}>
          {heightUnitOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select label="Body type" error={errors.bodyType?.message} {...register("bodyType")}>
          <option value="">Select body type</option>
          {bodyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select label="Skin tone" error={errors.skinTone?.message} {...register("skinTone")}>
          <option value="">Select skin tone</option>
          {skinToneOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <p id="email-status" className="text-sm text-[#756871]">
        {values.emailVerified ? "Email verified" : "Email verification pending"}
      </p>
      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}
