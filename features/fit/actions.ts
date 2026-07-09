"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { requireUserId } from "@/features/profile/data";
import { auditLog } from "@/features/admin/audit";
import { fitProfileSchema, fitRuleSchema, recommendationFeedbackSchema, sizeChartSchema, sizeMappingSchema } from "@/features/fit/schemas";

type ActionState = { ok: boolean; message: string };
const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function optional(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || undefined;
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function list(value?: string) {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

function parseJson(value: string): Prisma.InputJsonValue {
  return JSON.parse(value) as Prisma.InputJsonValue;
}

export async function saveFitProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  const parsed = fitProfileSchema.safeParse({
    measurementProfileId: text(formData, "measurementProfileId"),
    name: text(formData, "name"),
    bodyType: optional(formData, "bodyType"),
    skinTone: optional(formData, "skinTone"),
    preferredFit: text(formData, "preferredFit"),
    preferredSleeve: optional(formData, "preferredSleeve"),
    preferredLength: optional(formData, "preferredLength"),
    preferredNeckStyle: optional(formData, "preferredNeckStyle"),
    preferredSilhouette: optional(formData, "preferredSilhouette"),
    weatherPreference: optional(formData, "weatherPreference"),
    comfortLevel: text(formData, "comfortLevel") || "3",
    maintenanceLevel: text(formData, "maintenanceLevel") || "3",
    colors: optional(formData, "colors"),
    avoidedColors: optional(formData, "avoidedColors"),
    fabrics: optional(formData, "fabrics"),
    avoidedFabrics: optional(formData, "avoidedFabrics"),
    occasions: optional(formData, "occasions"),
    isDefault: checked(formData, "isDefault"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid FIT profile.");
  const measurement = await prisma.measurementProfile.findFirst({ where: { id: parsed.data.measurementProfileId, userId, archivedAt: null } });
  if (!measurement) return fail("Measurement profile not found.");

  await prisma.$transaction(async (tx) => {
    if (parsed.data.isDefault) await tx.fitProfile.updateMany({ where: { userId }, data: { isDefault: false } });
    const fitProfile = await tx.fitProfile.upsert({
      where: { userId_measurementProfileId: { userId, measurementProfileId: measurement.id } },
      create: {
        userId,
        measurementProfileId: measurement.id,
        name: parsed.data.name,
        bodyType: parsed.data.bodyType,
        skinTone: parsed.data.skinTone,
        preferredFit: parsed.data.preferredFit,
        preferredSleeve: parsed.data.preferredSleeve,
        preferredLength: parsed.data.preferredLength,
        preferredNeckStyle: parsed.data.preferredNeckStyle,
        preferredSilhouette: parsed.data.preferredSilhouette,
        comfortPreference: parsed.data.comfortLevel,
        maintenancePreference: parsed.data.maintenanceLevel,
        isDefault: parsed.data.isDefault,
      },
      update: {
        name: parsed.data.name,
        bodyType: parsed.data.bodyType,
        skinTone: parsed.data.skinTone,
        preferredFit: parsed.data.preferredFit,
        preferredSleeve: parsed.data.preferredSleeve,
        preferredLength: parsed.data.preferredLength,
        preferredNeckStyle: parsed.data.preferredNeckStyle,
        preferredSilhouette: parsed.data.preferredSilhouette,
        comfortPreference: parsed.data.comfortLevel,
        maintenancePreference: parsed.data.maintenanceLevel,
        isDefault: parsed.data.isDefault,
      },
    });
    await tx.stylePreference.upsert({
      where: { fitProfileId: fitProfile.id },
      create: {
        fitProfileId: fitProfile.id,
        preferredFit: parsed.data.preferredFit,
        sleeveStyle: parsed.data.preferredSleeve,
        garmentLength: parsed.data.preferredLength,
        neckStyle: parsed.data.preferredNeckStyle,
        silhouette: parsed.data.preferredSilhouette,
        weatherPreference: parsed.data.weatherPreference,
        comfortLevel: parsed.data.comfortLevel,
        maintenanceLevel: parsed.data.maintenanceLevel,
      },
      update: {
        preferredFit: parsed.data.preferredFit,
        sleeveStyle: parsed.data.preferredSleeve,
        garmentLength: parsed.data.preferredLength,
        neckStyle: parsed.data.preferredNeckStyle,
        silhouette: parsed.data.preferredSilhouette,
        weatherPreference: parsed.data.weatherPreference,
        comfortLevel: parsed.data.comfortLevel,
        maintenanceLevel: parsed.data.maintenanceLevel,
      },
    });
    await Promise.all([
      tx.colorPreference.deleteMany({ where: { fitProfileId: fitProfile.id } }),
      tx.fabricPreference.deleteMany({ where: { fitProfileId: fitProfile.id } }),
      tx.occasionPreference.deleteMany({ where: { fitProfileId: fitProfile.id } }),
    ]);
    await tx.colorPreference.createMany({
      data: [
        ...list(parsed.data.colors).map((colorName, index) => ({ fitProfileId: fitProfile.id, colorName, priority: 100 - index, avoid: false })),
        ...list(parsed.data.avoidedColors).map((colorName, index) => ({ fitProfileId: fitProfile.id, colorName, priority: 100 - index, avoid: true })),
      ],
    });
    await tx.fabricPreference.createMany({
      data: [
        ...list(parsed.data.fabrics).map((fabricName, index) => ({ fitProfileId: fitProfile.id, fabricName, priority: 100 - index, avoid: false })),
        ...list(parsed.data.avoidedFabrics).map((fabricName, index) => ({ fitProfileId: fitProfile.id, fabricName, priority: 100 - index, avoid: true })),
      ],
    });
    await tx.occasionPreference.createMany({
      data: list(parsed.data.occasions).map((occasionName, index) => ({ fitProfileId: fitProfile.id, occasionName, priority: 100 - index })),
    });
  });
  revalidatePath("/profile");
  return ok("FIT profile saved.");
}

export async function saveFitRuleAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = fitRuleSchema.safeParse({
    id: optional(formData, "id"),
    name: text(formData, "name"),
    code: text(formData, "code").toUpperCase(),
    type: text(formData, "type"),
    description: optional(formData, "description"),
    conditions: text(formData, "conditions"),
    outcomes: text(formData, "outcomes"),
    priority: text(formData, "priority") || "100",
    weight: text(formData, "weight") || "10",
    active: checked(formData, "active"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid FIT rule.");
  try {
    const data = { ...parsed.data, id: undefined, conditions: parseJson(parsed.data.conditions), outcomes: parseJson(parsed.data.outcomes) };
    const rule = parsed.data.id
      ? await prisma.fitRule.update({ where: { id: parsed.data.id }, data })
      : await prisma.fitRule.upsert({ where: { code: parsed.data.code }, create: data, update: data });
    await auditLog({ admin, action: "FIT_RULE_SAVED", entityType: "FitRule", entityId: rule.id, message: rule.name });
    revalidatePath("/admin/fit");
    return ok("FIT rule saved.");
  } catch {
    return fail("Conditions and outcomes must be valid JSON.");
  }
}

export async function saveSizeChartAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = sizeChartSchema.safeParse({
    id: optional(formData, "id"),
    brand: text(formData, "brand"),
    name: text(formData, "name"),
    categoryId: optional(formData, "categoryId"),
    garmentEaseCm: text(formData, "garmentEaseCm") || "4",
    toleranceCm: text(formData, "toleranceCm") || "2",
    active: checked(formData, "active"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid size chart.");
  const data = { ...parsed.data, id: undefined, garmentEaseCm: new Prisma.Decimal(parsed.data.garmentEaseCm), toleranceCm: new Prisma.Decimal(parsed.data.toleranceCm) };
  const chart = parsed.data.id
    ? await prisma.sizeChart.update({ where: { id: parsed.data.id }, data })
    : await prisma.sizeChart.create({ data });
  await auditLog({ admin, action: "SIZE_CHART_SAVED", entityType: "SizeChart", entityId: chart.id, message: `${chart.brand} ${chart.name}` });
  revalidatePath("/admin/fit");
  return ok("Size chart saved.");
}

export async function saveSizeMappingAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const field = (key: string) => optional(formData, key);
  const parsed = sizeMappingSchema.safeParse({
    sizeChartId: text(formData, "sizeChartId"),
    sizeName: text(formData, "sizeName"),
    sortOrder: text(formData, "sortOrder") || "0",
    bustMin: field("bustMin"), bustMax: field("bustMax"),
    waistMin: field("waistMin"), waistMax: field("waistMax"),
    hipMin: field("hipMin"), hipMax: field("hipMax"),
    shoulderMin: field("shoulderMin"), shoulderMax: field("shoulderMax"),
  });
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid size mapping.");
  const decimal = (value?: number) => value === undefined ? undefined : new Prisma.Decimal(value);
  const mapping = await prisma.brandSizeMapping.upsert({
    where: { sizeChartId_sizeName: { sizeChartId: parsed.data.sizeChartId, sizeName: parsed.data.sizeName } },
    create: {
      ...parsed.data,
      bustMin: decimal(parsed.data.bustMin), bustMax: decimal(parsed.data.bustMax),
      waistMin: decimal(parsed.data.waistMin), waistMax: decimal(parsed.data.waistMax),
      hipMin: decimal(parsed.data.hipMin), hipMax: decimal(parsed.data.hipMax),
      shoulderMin: decimal(parsed.data.shoulderMin), shoulderMax: decimal(parsed.data.shoulderMax),
    },
    update: {
      sortOrder: parsed.data.sortOrder,
      bustMin: decimal(parsed.data.bustMin), bustMax: decimal(parsed.data.bustMax),
      waistMin: decimal(parsed.data.waistMin), waistMax: decimal(parsed.data.waistMax),
      hipMin: decimal(parsed.data.hipMin), hipMax: decimal(parsed.data.hipMax),
      shoulderMin: decimal(parsed.data.shoulderMin), shoulderMax: decimal(parsed.data.shoulderMax),
    },
  });
  await auditLog({ admin, action: "SIZE_MAPPING_SAVED", entityType: "BrandSizeMapping", entityId: mapping.id, message: mapping.sizeName });
  revalidatePath("/admin/fit");
  return ok("Size mapping saved.");
}

export async function saveRecommendationFeedbackAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const parsed = recommendationFeedbackSchema.parse({
    recommendationId: optional(formData, "recommendationId"),
    orderItemId: optional(formData, "orderItemId"),
    feedback: text(formData, "feedback"),
    notes: optional(formData, "notes"),
  });
  if (parsed.recommendationId) {
    await prisma.fitRecommendation.findFirstOrThrow({ where: { id: parsed.recommendationId, userId: user.id }, select: { id: true } });
  }
  if (parsed.orderItemId) {
    await prisma.orderItem.findFirstOrThrow({ where: { id: parsed.orderItemId, order: { userId: user.id } }, select: { id: true } });
  }
  await prisma.recommendationFeedback.create({ data: { userId: user.id, ...parsed } });
  revalidatePath("/orders");
}
