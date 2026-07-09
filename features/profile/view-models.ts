import type {
  Address,
  MeasurementHistory,
  MeasurementProfile,
  User,
  UserProfile,
} from "@prisma/client";
import { profileCompletion } from "@/features/profile/completion";

function stringValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

export type ProfileFormValues = {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  preferredLanguage: string;
  preferredMeasurementUnit: string;
  bodyType: string;
  skinTone: string;
  completion: number;
};

export type AddressFormValues = {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  type: string;
  isDefault: boolean;
};

export type MeasurementFormValues = {
  id: string;
  profileName: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  armLength: string;
  sleeveLength: string;
  kurtiLength: string;
  topLength: string;
  blouseLength: string;
  neck: string;
  thigh: string;
  calf: string;
  height: string;
  weight: string;
  heightUnit: string;
  weightUnit: string;
  notes: string;
  isDefault: boolean;
  archivedAt: string;
  updatedAt: string;
};

export type MeasurementHistoryView = {
  id: string;
  previousValues: string;
  updatedValues: string;
  createdAt: string;
};

export function profileValues(user: User & { profile: UserProfile | null }): ProfileFormValues {
  return {
    name: user.name,
    email: user.email,
    emailVerified: Boolean(user.emailVerified),
    phone: user.profile?.phone ?? "",
    dateOfBirth: stringValue(user.profile?.dateOfBirth),
    gender: user.profile?.gender ?? "",
    height: stringValue(user.profile?.height),
    heightUnit: user.profile?.heightUnit ?? "CM",
    weight: stringValue(user.profile?.weight),
    weightUnit: user.profile?.weightUnit ?? "KG",
    preferredLanguage: user.profile?.preferredLanguage ?? "English",
    preferredMeasurementUnit: user.profile?.preferredMeasurementUnit ?? "CM",
    bodyType: user.profile?.bodyType ?? "",
    skinTone: user.profile?.skinTone ?? "",
    completion: profileCompletion(user, user.profile),
  };
}

export function addressValues(address?: Address): AddressFormValues {
  return {
    id: address?.id ?? "",
    fullName: address?.fullName ?? "",
    phone: address?.phone ?? "",
    house: address?.house ?? "",
    street: address?.street ?? "",
    landmark: address?.landmark ?? "",
    city: address?.city ?? "",
    district: address?.district ?? "",
    state: address?.state ?? "",
    country: address?.country ?? "India",
    pincode: address?.pincode ?? "",
    type: address?.type ?? "HOME",
    isDefault: address?.isDefault ?? false,
  };
}

export function measurementValues(profile?: MeasurementProfile): MeasurementFormValues {
  return {
    id: profile?.id ?? "",
    profileName: profile?.profileName ?? "",
    bust: stringValue(profile?.bust),
    waist: stringValue(profile?.waist),
    hip: stringValue(profile?.hip),
    shoulder: stringValue(profile?.shoulder),
    armLength: stringValue(profile?.armLength),
    sleeveLength: stringValue(profile?.sleeveLength),
    kurtiLength: stringValue(profile?.kurtiLength),
    topLength: stringValue(profile?.topLength),
    blouseLength: stringValue(profile?.blouseLength),
    neck: stringValue(profile?.neck),
    thigh: stringValue(profile?.thigh),
    calf: stringValue(profile?.calf),
    height: stringValue(profile?.height),
    weight: stringValue(profile?.weight),
    heightUnit: profile?.heightUnit ?? "CM",
    weightUnit: profile?.weightUnit ?? "KG",
    notes: profile?.notes ?? "",
    isDefault: profile?.isDefault ?? false,
    archivedAt: profile?.archivedAt ? profile.archivedAt.toISOString() : "",
    updatedAt: profile?.updatedAt ? profile.updatedAt.toLocaleDateString("en-IN") : "",
  };
}

export function historyValues(history: MeasurementHistory[]): MeasurementHistoryView[] {
  return history.map((item) => ({
    id: item.id,
    previousValues: JSON.stringify(item.previousValues, null, 2),
    updatedValues: JSON.stringify(item.updatedValues, null, 2),
    createdAt: item.createdAt.toLocaleString("en-IN"),
  }));
}
