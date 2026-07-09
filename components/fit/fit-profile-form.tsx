"use client";

import { useActionState } from "react";
import type { BodyType, MeasurementProfile, SkinTone } from "@prisma/client";
import { saveFitProfileAction } from "@/features/fit/actions";
import { bodyTypeOptions, skinToneOptions } from "@/features/profile/options";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function FitProfileForm({
  measurements,
  defaults,
}: {
  measurements: MeasurementProfile[];
  defaults?: {
    measurementProfileId?: string;
    name?: string;
    bodyType?: BodyType | null;
    skinTone?: SkinTone | null;
    preferredFit?: string;
    colors?: string;
    avoidedColors?: string;
    fabrics?: string;
    avoidedFabrics?: string;
    occasions?: string;
  };
}) {
  const [state, action] = useActionState(saveFitProfileAction, initialState);
  return (
    <form action={action} className="grid gap-4">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Measurement Profile" name="measurementProfileId" defaultValue={defaults?.measurementProfileId ?? measurements[0]?.id}>
          {measurements.map((measurement) => <option key={measurement.id} value={measurement.id}>{measurement.profileName}</option>)}
        </Select>
        <Input label="FIT Profile Name" name="name" defaultValue={defaults?.name ?? "My Style"} />
        <Select label="Body Type" name="bodyType" defaultValue={defaults?.bodyType ?? ""}>
          <option value="">Use account preference</option>
          {bodyTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select label="Skin Tone" name="skinTone" defaultValue={defaults?.skinTone ?? ""}>
          <option value="">Use account preference</option>
          {skinToneOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Select label="Preferred Fit" name="preferredFit" defaultValue={defaults?.preferredFit ?? "REGULAR"}>
          <option value="SLIM">Slim</option>
          <option value="REGULAR">Regular</option>
          <option value="RELAXED">Relaxed</option>
          <option value="OVERSIZED">Oversized</option>
          <option value="CUSTOM">Custom</option>
        </Select>
        <Input label="Preferred Sleeve" name="preferredSleeve" placeholder="Three Quarter" />
        <Input label="Preferred Length" name="preferredLength" placeholder="Knee, calf, long" />
        <Input label="Preferred Neck Style" name="preferredNeckStyle" placeholder="V Neck" />
        <Input label="Preferred Silhouette" name="preferredSilhouette" placeholder="A-line" />
        <Input label="Weather Preference" name="weatherPreference" placeholder="Summer, winter" />
        <Select label="Comfort Preference" name="comfortLevel" defaultValue="3">
          {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Maintenance Preference" name="maintenanceLevel" defaultValue="3">
          {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Input label="Favorite Colors" name="colors" defaultValue={defaults?.colors} placeholder="Magenta, Navy, Emerald" />
        <Input label="Colors to Avoid" name="avoidedColors" defaultValue={defaults?.avoidedColors} placeholder="Pale Beige" />
        <Input label="Favorite Fabrics" name="fabrics" defaultValue={defaults?.fabrics} placeholder="Silk, Cotton, Linen" />
        <Input label="Fabrics to Avoid" name="avoidedFabrics" defaultValue={defaults?.avoidedFabrics} placeholder="Velvet" />
        <Input label="Favorite Occasions" name="occasions" defaultValue={defaults?.occasions} placeholder="Wedding, Office, Festival" />
      </div>
      <Checkbox label="Default FIT profile" name="isDefault" defaultChecked />
      <SubmitButton>Save Style Preferences</SubmitButton>
    </form>
  );
}
