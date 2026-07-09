import { z } from "zod";

const optionalText = z.string().trim().optional().transform((value) => value || undefined);
const optionalNumber = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? Number(value) : undefined))
  .pipe(z.number().positive().max(999).optional());

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: optionalText.pipe(z.string().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone").optional()),
  dateOfBirth: optionalText,
  gender: z.enum(["FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY", "OTHER"]).optional(),
  height: optionalNumber,
  heightUnit: z.enum(["CM", "FT_IN"]),
  weight: optionalNumber,
  weightUnit: z.enum(["KG", "LB"]),
  preferredLanguage: z.string().trim().min(2).max(40),
  preferredMeasurementUnit: z.enum(["CM", "FT_IN"]),
  bodyType: z.enum(["PEAR", "APPLE", "HOURGLASS", "RECTANGLE", "INVERTED_TRIANGLE", "OTHER"]).optional(),
  skinTone: z.enum(["VERY_FAIR", "FAIR", "MEDIUM", "WHEATISH", "BROWN", "DARK"]).optional(),
});

export const addressSchema = z.object({
  id: optionalText,
  fullName: z.string().trim().min(2, "Enter full name").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone"),
  house: z.string().trim().min(2, "Enter house or flat").max(120),
  street: z.string().trim().min(2, "Enter street").max(120),
  landmark: optionalText,
  city: z.string().trim().min(2, "Enter city").max(80),
  district: z.string().trim().min(2, "Enter district").max(80),
  state: z.string().trim().min(2, "Enter state").max(80),
  country: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^[0-9A-Za-z -]{4,12}$/, "Enter a valid pincode"),
  type: z.enum(["HOME", "OFFICE", "OTHER"]),
  isDefault: z.boolean().default(false),
});

export const measurementSchema = z.object({
  id: optionalText,
  profileName: z.string().trim().min(2, "Enter profile name").max(80),
  bust: optionalNumber,
  waist: optionalNumber,
  hip: optionalNumber,
  shoulder: optionalNumber,
  armLength: optionalNumber,
  sleeveLength: optionalNumber,
  kurtiLength: optionalNumber,
  topLength: optionalNumber,
  blouseLength: optionalNumber,
  neck: optionalNumber,
  thigh: optionalNumber,
  calf: optionalNumber,
  height: optionalNumber,
  weight: optionalNumber,
  heightUnit: z.enum(["CM", "FT_IN"]),
  weightUnit: z.enum(["KG", "LB"]),
  notes: optionalText,
  isDefault: z.boolean().default(false),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type MeasurementInput = z.infer<typeof measurementSchema>;
export type ProfileFormInput = z.input<typeof profileSchema>;
export type AddressFormInput = z.input<typeof addressSchema>;
export type MeasurementFormInput = z.input<typeof measurementSchema>;
