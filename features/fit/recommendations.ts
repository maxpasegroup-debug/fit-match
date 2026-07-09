import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { runFitEngine, type SizeMappingInput } from "@/features/fit/engine";
import { trackServerEvent } from "@/lib/analytics/server";

function json(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function numberValue(value: unknown): number | null {
  return value == null ? null : Number(value);
}

export async function getProductFitRecommendation(productId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const fitProfile = await prisma.fitProfile.findFirst({
    where: { userId: user.id },
    include: {
      measurementProfile: true,
      stylePreference: true,
      colorPreferences: { orderBy: { priority: "desc" } },
      fabricPreferences: { orderBy: { priority: "desc" } },
      occasionPreferences: { orderBy: { priority: "desc" } },
    },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
  if (!fitProfile) return null;

  const product = await prisma.product.findFirstOrThrow({
    where: { id: productId, published: true },
    include: {
      variants: true,
      colors: true,
      fabrics: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      collection: true,
      occasion: true,
      tags: true,
      category: true,
    },
  });
  const sizeChart = await prisma.sizeChart.findFirst({
    where: {
      brand: product.brand,
      active: true,
      OR: [{ categoryId: product.categoryId }, { categoryId: null }],
    },
    include: { mappings: { orderBy: { sortOrder: "asc" } } },
    orderBy: { categoryId: "desc" },
  });
  const mappings: SizeMappingInput[] = (sizeChart?.mappings ?? []).map((mapping) => ({
    sizeName: mapping.sizeName,
    sortOrder: mapping.sortOrder,
    bustMin: numberValue(mapping.bustMin),
    bustMax: numberValue(mapping.bustMax),
    waistMin: numberValue(mapping.waistMin),
    waistMax: numberValue(mapping.waistMax),
    hipMin: numberValue(mapping.hipMin),
    hipMax: numberValue(mapping.hipMax),
    shoulderMin: numberValue(mapping.shoulderMin),
    shoulderMax: numberValue(mapping.shoulderMax),
  }));
  const result = runFitEngine({
    measurements: {
      bust: numberValue(fitProfile.measurementProfile.bust),
      waist: numberValue(fitProfile.measurementProfile.waist),
      hip: numberValue(fitProfile.measurementProfile.hip),
      shoulder: numberValue(fitProfile.measurementProfile.shoulder),
    },
    bodyType: fitProfile.bodyType,
    skinTone: fitProfile.skinTone,
    preferredFit: fitProfile.preferredFit,
    preferredColors: fitProfile.colorPreferences.map((item) => ({ name: item.colorName, avoid: item.avoid })),
    preferredFabrics: fitProfile.fabricPreferences.map((item) => ({ name: item.fabricName, avoid: item.avoid })),
    preferredOccasions: fitProfile.occasionPreferences.map((item) => item.occasionName),
    comfortLevel: fitProfile.stylePreference?.comfortLevel ?? fitProfile.comfortPreference,
    maintenanceLevel: fitProfile.stylePreference?.maintenanceLevel ?? fitProfile.maintenancePreference,
    weather: fitProfile.stylePreference?.weatherPreference,
    preferredNeckStyle: fitProfile.preferredNeckStyle,
    preferredSleeve: fitProfile.preferredSleeve,
    preferredLength: fitProfile.preferredLength,
    product: {
      colors: product.colors.filter((item) => item.available).map((item) => item.name),
      fabrics: product.fabrics.map((item) => item.name),
      sizes: product.sizes.filter((item) => item.available).map((item) => item.name),
      collection: product.collection?.name,
      occasion: product.occasion?.name,
      tags: product.tags.map((item) => item.name),
    },
    sizeMappings: mappings,
    garmentEaseCm: sizeChart ? Number(sizeChart.garmentEaseCm) : undefined,
    toleranceCm: sizeChart ? Number(sizeChart.toleranceCm) : undefined,
  });
  const recommendedVariant = product.variants.find((variant) =>
    variant.available &&
    (!variant.sizeName || variant.sizeName.toLowerCase() === result.recommendedSize.toLowerCase()) &&
    (!variant.colorName || result.bestColors.length === 0 || result.bestColors.some((color) => color.toLowerCase() === variant.colorName?.toLowerCase())),
  );
  const recommendation = await prisma.fitRecommendation.upsert({
    where: { fitProfileId_productId: { fitProfileId: fitProfile.id, productId: product.id } },
    create: {
      userId: user.id,
      fitProfileId: fitProfile.id,
      productId: product.id,
      productVariantId: recommendedVariant?.id,
      recommendedSize: result.recommendedSize,
      alternativeSize: result.alternativeSize,
      score: result.fitScore,
      recommendedColors: json({ best: result.bestColors, good: result.goodColors, avoid: result.avoidColors }),
      recommendedFabrics: json(result.recommendedFabrics),
      recommendedCollections: json(result.recommendedCollections),
      reasons: json(result.reasons),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    update: {
      productVariantId: recommendedVariant?.id,
      recommendedSize: result.recommendedSize,
      alternativeSize: result.alternativeSize,
      score: result.fitScore,
      recommendedColors: json({ best: result.bestColors, good: result.goodColors, avoid: result.avoidColors }),
      recommendedFabrics: json(result.recommendedFabrics),
      recommendedCollections: json(result.recommendedCollections),
      reasons: json(result.reasons),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.fitScore.upsert({
    where: { recommendationId: recommendation.id },
    create: {
      recommendationId: recommendation.id,
      productId: product.id,
      ...result.scores,
      totalScore: result.fitScore,
      explanation: json(result.reasons),
    },
    update: {
      ...result.scores,
      totalScore: result.fitScore,
      explanation: json(result.reasons),
    },
  });
  await trackServerEvent("fit_recommendation", { productId: product.id, metadata: { score: result.fitScore, size: result.recommendedSize } });
  return { recommendation, fitProfile, result, recommendedVariant };
}

export async function getRecommendedProducts(limit = 8) {
  const user = await getCurrentUser();
  if (!user) return [];
  return prisma.fitRecommendation.findMany({
    where: { userId: user.id },
    include: { product: { include: { images: { include: { mediaAsset: true }, orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }] } } }, fitScore: true },
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    take: limit,
  });
}
