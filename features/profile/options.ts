import type { AddressType, BodyType, Gender, HeightUnit, SkinTone, WeightUnit } from "@prisma/client";

export const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
  { value: "OTHER", label: "Other" },
];

export const bodyTypeOptions: Array<{ value: BodyType; label: string }> = [
  { value: "PEAR", label: "Pear" },
  { value: "APPLE", label: "Apple" },
  { value: "HOURGLASS", label: "Hourglass" },
  { value: "RECTANGLE", label: "Rectangle" },
  { value: "INVERTED_TRIANGLE", label: "Inverted Triangle" },
  { value: "OTHER", label: "Other" },
];

export const skinToneOptions: Array<{ value: SkinTone; label: string }> = [
  { value: "VERY_FAIR", label: "Very Fair" },
  { value: "FAIR", label: "Fair" },
  { value: "MEDIUM", label: "Medium" },
  { value: "WHEATISH", label: "Wheatish" },
  { value: "BROWN", label: "Brown" },
  { value: "DARK", label: "Dark" },
];

export const heightUnitOptions: Array<{ value: HeightUnit; label: string }> = [
  { value: "CM", label: "Centimeters" },
  { value: "FT_IN", label: "Feet/Inches" },
];

export const weightUnitOptions: Array<{ value: WeightUnit; label: string }> = [
  { value: "KG", label: "Kilograms" },
  { value: "LB", label: "Pounds" },
];

export const addressTypeOptions: Array<{ value: AddressType; label: string }> = [
  { value: "HOME", label: "Home" },
  { value: "OFFICE", label: "Office" },
  { value: "OTHER", label: "Other" },
];
