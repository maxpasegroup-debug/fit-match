"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { logError } from "@/lib/logger";
import { requireUserId } from "@/features/profile/data";
import { addressSchema, measurementSchema, profileSchema } from "@/features/profile/schemas";

type ActionState = {
  ok: boolean;
  message: string;
};

function value(formData: FormData, key: string): string {
  const item = formData.get(key);
  return typeof item === "string" ? item : "";
}

function checked(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function decimal(value?: number): Prisma.Decimal | undefined {
  return value === undefined ? undefined : new Prisma.Decimal(value);
}

function nullableDate(value?: string): Date | undefined {
  return value ? new Date(value) : undefined;
}

export async function updateProfileAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = profileSchema.safeParse({
    name: value(formData, "name"),
    phone: value(formData, "phone"),
    dateOfBirth: value(formData, "dateOfBirth"),
    gender: value(formData, "gender") || undefined,
    height: value(formData, "height"),
    heightUnit: value(formData, "heightUnit"),
    weight: value(formData, "weight"),
    weightUnit: value(formData, "weightUnit"),
    preferredLanguage: value(formData, "preferredLanguage"),
    preferredMeasurementUnit: value(formData, "preferredMeasurementUnit"),
    bodyType: value(formData, "bodyType") || undefined,
    skinTone: value(formData, "skinTone") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid profile" };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { name: parsed.data.name } }),
      prisma.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          phone: parsed.data.phone,
          dateOfBirth: nullableDate(parsed.data.dateOfBirth),
          gender: parsed.data.gender,
          height: decimal(parsed.data.height),
          heightUnit: parsed.data.heightUnit,
          weight: decimal(parsed.data.weight),
          weightUnit: parsed.data.weightUnit,
          preferredLanguage: parsed.data.preferredLanguage,
          preferredMeasurementUnit: parsed.data.preferredMeasurementUnit,
          bodyType: parsed.data.bodyType,
          skinTone: parsed.data.skinTone,
        },
        update: {
          phone: parsed.data.phone,
          dateOfBirth: nullableDate(parsed.data.dateOfBirth),
          gender: parsed.data.gender,
          height: decimal(parsed.data.height),
          heightUnit: parsed.data.heightUnit,
          weight: decimal(parsed.data.weight),
          weightUnit: parsed.data.weightUnit,
          preferredLanguage: parsed.data.preferredLanguage,
          preferredMeasurementUnit: parsed.data.preferredMeasurementUnit,
          bodyType: parsed.data.bodyType,
          skinTone: parsed.data.skinTone,
        },
      }),
    ]);
    revalidatePath("/profile");
    return { ok: true, message: "Profile saved." };
  } catch (error) {
    logError(error, "profile update failed");
    return { ok: false, message: "Could not save profile." };
  }
}

export async function saveAddressAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = addressSchema.safeParse({
    id: value(formData, "id"),
    fullName: value(formData, "fullName"),
    phone: value(formData, "phone"),
    house: value(formData, "house"),
    street: value(formData, "street"),
    landmark: value(formData, "landmark"),
    city: value(formData, "city"),
    district: value(formData, "district"),
    state: value(formData, "state"),
    country: value(formData, "country") || "India",
    pincode: value(formData, "pincode"),
    type: value(formData, "type"),
    isDefault: checked(formData, "isDefault"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid address" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      if (parsed.data.id) {
        await tx.address.updateMany({
          where: { id: parsed.data.id, userId },
          data: { ...parsed.data, id: undefined },
        });
      } else {
        await tx.address.create({ data: { ...parsed.data, id: undefined, userId } });
      }
    });
    revalidatePath("/profile");
    return { ok: true, message: "Address saved." };
  } catch (error) {
    logError(error, "address save failed");
    return { ok: false, message: "Could not save address." };
  }
}

export async function deleteAddressAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  await prisma.address.deleteMany({ where: { id: value(formData, "id"), userId } });
  revalidatePath("/profile");
}

export async function setDefaultAddressAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = value(formData, "id");
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.updateMany({ where: { id, userId }, data: { isDefault: true } }),
  ]);
  revalidatePath("/profile");
}

const measurementFields = [
  "bust",
  "waist",
  "hip",
  "shoulder",
  "armLength",
  "sleeveLength",
  "kurtiLength",
  "topLength",
  "blouseLength",
  "neck",
  "thigh",
  "calf",
  "height",
  "weight",
] as const;

function measurementPayload(formData: FormData) {
  const payload: Record<string, string | boolean> = {
    id: value(formData, "id"),
    profileName: value(formData, "profileName"),
    heightUnit: value(formData, "heightUnit"),
    weightUnit: value(formData, "weightUnit"),
    notes: value(formData, "notes"),
    isDefault: checked(formData, "isDefault"),
  };
  measurementFields.forEach((field) => {
    payload[field] = value(formData, field);
  });
  return payload;
}

function jsonValue(value: unknown): Prisma.InputJsonValue | null {
  if (value === null || value === undefined) {
    return null;
  }
  return String(value);
}

function serializeMeasurement(profile: Record<string, unknown>): Prisma.InputJsonObject {
  return Object.fromEntries(
    Object.entries(profile).filter(([key]) =>
      ["profileName", "bust", "waist", "hip", "shoulder", "armLength", "sleeveLength", "kurtiLength", "topLength", "blouseLength", "neck", "thigh", "calf", "height", "weight", "heightUnit", "weightUnit", "notes", "isDefault"].includes(key),
    ).map(([key, currentValue]) => [key, jsonValue(currentValue)]),
  ) as Prisma.InputJsonObject;
}

export async function saveMeasurementAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = measurementSchema.safeParse(measurementPayload(formData));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid measurements" };
  }

  const data = {
    profileName: parsed.data.profileName,
    bust: decimal(parsed.data.bust),
    waist: decimal(parsed.data.waist),
    hip: decimal(parsed.data.hip),
    shoulder: decimal(parsed.data.shoulder),
    armLength: decimal(parsed.data.armLength),
    sleeveLength: decimal(parsed.data.sleeveLength),
    kurtiLength: decimal(parsed.data.kurtiLength),
    topLength: decimal(parsed.data.topLength),
    blouseLength: decimal(parsed.data.blouseLength),
    neck: decimal(parsed.data.neck),
    thigh: decimal(parsed.data.thigh),
    calf: decimal(parsed.data.calf),
    height: decimal(parsed.data.height),
    weight: decimal(parsed.data.weight),
    heightUnit: parsed.data.heightUnit,
    weightUnit: parsed.data.weightUnit,
    notes: parsed.data.notes,
    isDefault: parsed.data.isDefault,
  };

  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault) {
        await tx.measurementProfile.updateMany({ where: { userId }, data: { isDefault: false } });
      }
      if (parsed.data.id) {
        const previous = await tx.measurementProfile.findFirstOrThrow({
          where: { id: parsed.data.id, userId },
        });
        const updated = await tx.measurementProfile.update({
          where: { id: previous.id },
          data,
        });
        await tx.measurementHistory.create({
          data: {
            measurementProfileId: updated.id,
            userId,
            previousValues: serializeMeasurement(previous),
            updatedValues: serializeMeasurement(updated),
          },
        });
      } else {
        await tx.measurementProfile.create({ data: { ...data, userId } });
      }
    });
    revalidatePath("/profile");
    return { ok: true, message: "Measurement profile saved." };
  } catch (error) {
    logError(error, "measurement save failed");
    return { ok: false, message: "Could not save measurements." };
  }
}

export async function deleteMeasurementAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  await prisma.measurementProfile.deleteMany({ where: { id: value(formData, "id"), userId } });
  revalidatePath("/profile");
}

export async function archiveMeasurementAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  await prisma.measurementProfile.updateMany({
    where: { id: value(formData, "id"), userId },
    data: { archivedAt: new Date(), isDefault: false },
  });
  revalidatePath("/profile");
}

export async function restoreMeasurementAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  await prisma.measurementProfile.updateMany({
    where: { id: value(formData, "id"), userId },
    data: { archivedAt: null },
  });
  revalidatePath("/profile");
}

export async function duplicateMeasurementAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const source = await prisma.measurementProfile.findFirstOrThrow({
    where: { id: value(formData, "id"), userId },
  });
  await prisma.measurementProfile.create({
    data: {
      userId,
      profileName: `${source.profileName} Copy`,
      bust: source.bust,
      waist: source.waist,
      hip: source.hip,
      shoulder: source.shoulder,
      armLength: source.armLength,
      sleeveLength: source.sleeveLength,
      kurtiLength: source.kurtiLength,
      topLength: source.topLength,
      blouseLength: source.blouseLength,
      neck: source.neck,
      thigh: source.thigh,
      calf: source.calf,
      height: source.height,
      weight: source.weight,
      heightUnit: source.heightUnit,
      weightUnit: source.weightUnit,
      notes: source.notes,
    },
  });
  revalidatePath("/profile");
}
