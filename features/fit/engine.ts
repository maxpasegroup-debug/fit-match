import type { BodyType, PreferredFit, SkinTone } from "@prisma/client";
import { bodyTypeStyleRules, fitEaseCm, occasionFabricRules, skinToneColorRules } from "@/features/fit/rules";
import { clampScore, totalFitScore, type FitScoreParts } from "@/features/fit/score";

export type MeasurementInput = {
  bust?: number | null;
  waist?: number | null;
  hip?: number | null;
  shoulder?: number | null;
};

export type SizeMappingInput = {
  sizeName: string;
  sortOrder: number;
  bustMin?: number | null;
  bustMax?: number | null;
  waistMin?: number | null;
  waistMax?: number | null;
  hipMin?: number | null;
  hipMax?: number | null;
  shoulderMin?: number | null;
  shoulderMax?: number | null;
};

export type FitEngineInput = {
  measurements: MeasurementInput;
  bodyType?: BodyType | null;
  skinTone?: SkinTone | null;
  preferredFit: PreferredFit;
  preferredColors: Array<{ name: string; avoid?: boolean }>;
  preferredFabrics: Array<{ name: string; avoid?: boolean }>;
  preferredOccasions: string[];
  comfortLevel: number;
  maintenanceLevel: number;
  weather?: string | null;
  preferredNeckStyle?: string | null;
  preferredSleeve?: string | null;
  preferredLength?: string | null;
  product: {
    colors: string[];
    fabrics: string[];
    sizes: string[];
    collection?: string | null;
    occasion?: string | null;
    tags: string[];
  };
  sizeMappings: SizeMappingInput[];
  garmentEaseCm?: number;
  toleranceCm?: number;
};

export type FitEngineResult = {
  recommendedSize: string;
  alternativeSize?: string;
  fitScore: number;
  scores: FitScoreParts;
  bestColors: string[];
  goodColors: string[];
  avoidColors: string[];
  recommendedFabrics: string[];
  recommendedCollections: string[];
  style: { neck: string[]; sleeve: string[]; length: string[]; silhouette: string[] };
  reasons: string[];
};

function within(value: number | null | undefined, min: number | null | undefined, max: number | null | undefined, tolerance: number) {
  if (value == null || min == null || max == null) return true;
  return value >= min - tolerance && value <= max + tolerance;
}

function recommendSize(input: FitEngineInput) {
  const ease = input.garmentEaseCm ?? fitEaseCm[input.preferredFit];
  const tolerance = input.toleranceCm ?? 2;
  const adjusted = {
    bust: input.measurements.bust == null ? null : input.measurements.bust + ease,
    waist: input.measurements.waist == null ? null : input.measurements.waist + ease,
    hip: input.measurements.hip == null ? null : input.measurements.hip + ease,
    shoulder: input.measurements.shoulder,
  };
  const sorted = [...input.sizeMappings].sort((a, b) => a.sortOrder - b.sortOrder);
  const matchingIndex = sorted.findIndex((size) =>
    within(adjusted.bust, size.bustMin, size.bustMax, tolerance) &&
    within(adjusted.waist, size.waistMin, size.waistMax, tolerance) &&
    within(adjusted.hip, size.hipMin, size.hipMax, tolerance) &&
    within(adjusted.shoulder, size.shoulderMin, size.shoulderMax, tolerance),
  );
  if (matchingIndex >= 0) {
    return {
      recommended: sorted[matchingIndex].sizeName,
      alternative: sorted[matchingIndex + 1]?.sizeName ?? sorted[matchingIndex - 1]?.sizeName,
      score: 96,
    };
  }
  const available = input.product.sizes;
  return {
    recommended: available.includes("Custom Fit") ? "Custom Fit" : available[0] ?? "Custom Fit",
    alternative: available[1],
    score: available.includes("Custom Fit") ? 88 : 55,
  };
}

function matchColors(input: FitEngineInput) {
  const rules = input.skinTone ? skinToneColorRules[input.skinTone] : { best: [], good: [], avoid: [] };
  const preferred = input.preferredColors.filter((color) => !color.avoid).map((color) => color.name);
  const avoided = new Set([...rules.avoid, ...input.preferredColors.filter((color) => color.avoid).map((color) => color.name)].map((color) => color.toLowerCase()));
  const available = input.product.colors;
  const best = available.filter((color) => [...preferred, ...rules.best].some((item) => item.toLowerCase() === color.toLowerCase()) && !avoided.has(color.toLowerCase()));
  const good = available.filter((color) => !best.includes(color) && rules.good.some((item) => item.toLowerCase() === color.toLowerCase()) && !avoided.has(color.toLowerCase()));
  return { best, good, avoid: available.filter((color) => avoided.has(color.toLowerCase())) };
}

function matchFabrics(input: FitEngineInput) {
  const preferred = input.preferredFabrics.filter((fabric) => !fabric.avoid).map((fabric) => fabric.name);
  const avoided = new Set(input.preferredFabrics.filter((fabric) => fabric.avoid).map((fabric) => fabric.name.toLowerCase()));
  const occasionNames = [...input.preferredOccasions, input.product.occasion ?? "", input.weather ?? ""].filter(Boolean);
  const ruleFabrics = occasionNames.flatMap((occasion) => occasionFabricRules[occasion.toLowerCase()] ?? []);
  return input.product.fabrics
    .filter((fabric) => !avoided.has(fabric.toLowerCase()))
    .sort((a, b) => {
      const rank = (name: string) => preferred.findIndex((item) => item.toLowerCase() === name.toLowerCase()) >= 0 ? 3 : ruleFabrics.findIndex((item) => item.toLowerCase() === name.toLowerCase()) >= 0 ? 2 : 1;
      return rank(b) - rank(a);
    });
}

export function runFitEngine(input: FitEngineInput): FitEngineResult {
  const size = recommendSize(input);
  const colors = matchColors(input);
  const fabrics = matchFabrics(input);
  const style = bodyTypeStyleRules[input.bodyType ?? "OTHER"];
  const collectionMatches = input.product.collection && input.preferredOccasions.some((occasion) => input.product.collection?.toLowerCase().includes(occasion.toLowerCase()))
    ? [input.product.collection]
    : [];
  const scores: FitScoreParts = {
    sizeScore: size.score,
    colorScore: clampScore(colors.best.length * 30 + colors.good.length * 15 + (input.product.colors.length > 0 ? 40 : 20)),
    fabricScore: clampScore(fabrics.length > 0 ? 70 + Math.min(30, fabrics.length * 8) : 35),
    styleScore: clampScore(70 + (input.preferredNeckStyle && style.neck.includes(input.preferredNeckStyle) ? 15 : 0) + (input.preferredSleeve && style.sleeve.includes(input.preferredSleeve) ? 15 : 0)),
    occasionScore: clampScore(collectionMatches.length > 0 || input.preferredOccasions.some((occasion) => input.product.tags.some((tag) => tag.toLowerCase().includes(occasion.toLowerCase()))) ? 95 : 65),
  };
  const reasons = [
    `${size.recommended} balances your saved measurements with ${input.preferredFit.toLowerCase()} garment ease.`,
    colors.best.length > 0 ? `${colors.best.join(", ")} complement your skin tone and color preferences.` : "Available colors are checked against your saved preferences.",
    fabrics.length > 0 ? `${fabrics.slice(0, 3).join(", ")} align with your comfort and occasion preferences.` : "Fabric suitability uses your comfort and maintenance preferences.",
    `${style.silhouette[0]} silhouettes are a strong match for your selected body type.`,
  ];
  return {
    recommendedSize: size.recommended,
    alternativeSize: size.alternative,
    fitScore: totalFitScore(scores),
    scores,
    bestColors: colors.best,
    goodColors: colors.good,
    avoidColors: colors.avoid,
    recommendedFabrics: fabrics,
    recommendedCollections: collectionMatches,
    style,
    reasons,
  };
}
