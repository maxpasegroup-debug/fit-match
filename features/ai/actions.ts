"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { requireUserId } from "@/features/profile/data";
import { prisma } from "@/lib/db/prisma";
import { getAIProvider } from "@/features/ai/providers/registry";
import { assertFeatureAvailable } from "@/features/ai/services/configuration";
import { recordUsage } from "@/features/ai/services/usage";
import { sendStylistMessage } from "@/features/ai/services/stylist";
import { aiConfigurationSchema, chatSchema, measurementSchema, promptSchema, tryOnSchema } from "@/features/ai/schemas";
import type { StyleSuggestionType } from "@prisma/client";

export async function chatAction(input: { conversationId?: string; message: string }) {
  const userId = await requireUserId();
  const parsed = chatSchema.parse(input);
  return sendStylistMessage(userId, parsed.message, parsed.conversationId);
}

export async function startMeasurementAction(input: {
  frontFilename: string; frontMimeType: string; frontSize: number;
  sideFilename: string; sideMimeType: string; sideSize: number;
}) {
  const userId = await requireUserId();
  const parsed = measurementSchema.parse(input);
  const config = await assertFeatureAvailable(userId, "MEASUREMENT");
  const session = await prisma.aIMeasurementSession.create({
    data: {
      userId, provider: config.provider, status: "PROCESSING",
      images: { create: [
        { view: "FRONT", filename: parsed.frontFilename, mimeType: parsed.frontMimeType, fileSize: parsed.frontSize },
        { view: "SIDE", filename: parsed.sideFilename, mimeType: parsed.sideMimeType, fileSize: parsed.sideSize },
      ] },
    },
  });
  const result = await getAIProvider(config.provider).estimate({ frontImage: parsed.frontFilename, sideImage: parsed.sideFilename });
  await prisma.aIMeasurementSession.update({
    where: { id: session.id },
    data: { status: "COMPLETED", confidenceScore: result.data.confidence * 100, measurements: result.data.measurements },
  });
  await recordUsage({ userId, feature: "MEASUREMENT", result, measurementSessionId: session.id });
  revalidatePath("/fit-match/measurements");
  return { sessionId: session.id, ...result.data };
}

export async function acceptMeasurementAction(sessionId: string, profileName: string) {
  const userId = await requireUserId();
  const session = await prisma.aIMeasurementSession.findFirstOrThrow({ where: { id: sessionId, userId, status: "COMPLETED" } });
  const raw = session.measurements;
  const values = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const value = (key: string) => typeof values[key] === "number" ? Number(values[key]) : undefined;
  const measurementProfile = await prisma.measurementProfile.create({
    data: {
      userId,
      profileName: profileName.trim().slice(0, 80) || "AI Measurement",
      bust: value("bust"), waist: value("waist"), hip: value("hip"), shoulder: value("shoulder"),
      armLength: value("armLength"), sleeveLength: value("sleeveLength"), height: value("height"), weight: value("weight"),
      notes: "Created from an AI measurement workflow. Review before ordering.",
    },
  });
  await prisma.aIMeasurementSession.update({ where: { id: session.id }, data: { status: "ACCEPTED", acceptedAt: new Date(), measurementProfileId: measurementProfile.id } });
  revalidatePath("/profile");
  return { profileId: measurementProfile.id };
}

export async function startTryOnAction(input: { productId: string; filename: string; mimeType: string; fileSize: number }) {
  const userId = await requireUserId();
  const parsed = tryOnSchema.parse(input);
  const config = await assertFeatureAvailable(userId, "VIRTUAL_TRY_ON");
  await prisma.product.findFirstOrThrow({ where: { id: parsed.productId, published: true, deletedAt: null } });
  const session = await prisma.virtualTryOnSession.create({
    data: { userId, productId: parsed.productId, provider: config.provider, status: "PROCESSING", sourceFilename: parsed.filename },
  });
  const result = await getAIProvider(config.provider).generate({ sourceImage: parsed.filename, productId: parsed.productId });
  await prisma.virtualTryOnSession.update({ where: { id: session.id }, data: { status: "COMPLETED", resultImageUrl: result.data.imageUrl } });
  await recordUsage({ userId, feature: "VIRTUAL_TRY_ON", result, virtualTryOnSessionId: session.id });
  revalidatePath("/fit-match/virtual-try-on");
  return { sessionId: session.id, ...result.data };
}

export async function generateStyleSuggestionAction(formData: FormData) {
  const userId = await requireUserId();
  const rawType = field(formData, "type");
  const allowed = ["DAILY", "WEEKLY", "FESTIVAL", "WEDDING", "OFFICE", "TRAVEL"] as const;
  if (!allowed.includes(rawType as (typeof allowed)[number])) throw new Error("Unknown suggestion type.");
  const type = rawType as StyleSuggestionType;
  const configuration = await assertFeatureAvailable(userId, "STYLE_SUGGESTION");
  const provider = getAIProvider(configuration.provider);
  const prompt = `Create a concise ${type.toLowerCase()} fashion look. Include color, fabric, silhouette, footwear, and one accessory.`;
  const result = await provider.chat([{ role: "user", content: prompt }]);
  await prisma.styleSuggestion.create({
    data: {
      userId, provider: result.provider, type, title: `${type.charAt(0)}${type.slice(1).toLowerCase()} Look`,
      summary: result.data.content, suggestions: result.data.suggestions,
    },
  });
  await prisma.aIRecommendation.create({ data: { userId, provider: result.provider, feature: "STYLE_SUGGESTION", input: { type }, output: { summary: result.data.content, suggestions: result.data.suggestions } } });
  await recordUsage({ userId, feature: "STYLE_SUGGESTION", result });
  revalidatePath("/fit-match/style-suggestions");
}

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveAIConfigurationAction(formData: FormData) {
  await requireAdmin();
  const parsed = aiConfigurationSchema.parse({
    feature: field(formData, "feature"), provider: field(formData, "provider"),
    dailyUserLimit: field(formData, "dailyUserLimit"), enabled: formData.get("enabled") === "on",
  });
  await prisma.aIConfiguration.upsert({ where: { feature: parsed.feature }, create: parsed, update: parsed });
  revalidatePath("/admin/ai");
}

export async function savePromptTemplateAction(formData: FormData) {
  await requireAdmin();
  const parsed = promptSchema.parse({
    key: field(formData, "key"), feature: field(formData, "feature"), name: field(formData, "name"),
    template: field(formData, "template"), active: formData.get("active") === "on",
  });
  await prisma.aIPromptTemplate.upsert({ where: { key: parsed.key }, create: parsed, update: { ...parsed, version: { increment: 1 } } });
  revalidatePath("/admin/ai");
}
