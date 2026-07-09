export type FitScoreParts = {
  sizeScore: number;
  colorScore: number;
  fabricScore: number;
  styleScore: number;
  occasionScore: number;
};

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function totalFitScore(parts: FitScoreParts): number {
  return clampScore(
    parts.sizeScore * 0.4 +
      parts.colorScore * 0.2 +
      parts.fabricScore * 0.15 +
      parts.styleScore * 0.15 +
      parts.occasionScore * 0.1,
  );
}
