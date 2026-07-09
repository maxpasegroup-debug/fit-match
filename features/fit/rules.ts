import type { BodyType, PreferredFit, SkinTone } from "@prisma/client";

export const fitEaseCm: Record<PreferredFit, number> = {
  SLIM: 2,
  REGULAR: 4,
  RELAXED: 7,
  OVERSIZED: 10,
  CUSTOM: 0,
};

export const skinToneColorRules: Record<SkinTone, { best: string[]; good: string[]; avoid: string[] }> = {
  VERY_FAIR: { best: ["Emerald", "Navy", "Burgundy", "Royal Blue"], good: ["Lavender", "Rose", "Teal"], avoid: ["Pale Beige", "Neon Yellow"] },
  FAIR: { best: ["Ruby", "Emerald", "Cobalt", "Plum"], good: ["Blush", "Mint", "Charcoal"], avoid: ["Washed Beige", "Lime"] },
  MEDIUM: { best: ["Magenta", "Turquoise", "Olive", "Maroon"], good: ["Coral", "Navy", "Cream"], avoid: ["Ash Grey", "Mustard"] },
  WHEATISH: { best: ["Magenta", "Wine", "Peacock Blue", "Forest Green"], good: ["Mustard", "Ivory", "Rust"], avoid: ["Dusty Brown", "Pale Grey"] },
  BROWN: { best: ["Fuchsia", "Gold", "Teal", "White"], good: ["Orange", "Purple", "Emerald"], avoid: ["Muddy Brown", "Olive Grey"] },
  DARK: { best: ["Bright Pink", "Cobalt", "White", "Gold"], good: ["Red", "Turquoise", "Violet"], avoid: ["Very Dark Brown", "Dull Grey"] },
};

export const bodyTypeStyleRules: Record<BodyType, { neck: string[]; sleeve: string[]; length: string[]; silhouette: string[] }> = {
  PEAR: { neck: ["Boat", "Square", "Statement"], sleeve: ["Puff", "Cap", "Three Quarter"], length: ["Knee", "Calf"], silhouette: ["A-line", "Anarkali"] },
  APPLE: { neck: ["V Neck", "Scoop"], sleeve: ["Three Quarter", "Straight"], length: ["Knee", "Long"], silhouette: ["Empire", "Straight"] },
  HOURGLASS: { neck: ["V Neck", "Sweetheart", "Round"], sleeve: ["Fitted", "Three Quarter"], length: ["Waist Defined", "Knee"], silhouette: ["Wrap", "Fitted A-line"] },
  RECTANGLE: { neck: ["Round", "Keyhole", "Sweetheart"], sleeve: ["Puff", "Bell"], length: ["Layered", "Knee"], silhouette: ["Peplum", "Flared"] },
  INVERTED_TRIANGLE: { neck: ["V Neck", "Scoop"], sleeve: ["Raglan", "Sleeveless"], length: ["Hip", "Knee"], silhouette: ["A-line", "Flared"] },
  OTHER: { neck: ["Round", "V Neck"], sleeve: ["Three Quarter", "Straight"], length: ["Knee", "Long"], silhouette: ["Straight", "A-line"] },
};

export const occasionFabricRules: Record<string, string[]> = {
  wedding: ["Silk", "Organza", "Velvet", "Georgette"],
  festival: ["Silk", "Cotton Silk", "Organza", "Chanderi"],
  office: ["Cotton", "Linen", "Rayon", "Crepe"],
  casual: ["Cotton", "Rayon", "Linen"],
  party: ["Georgette", "Crepe", "Velvet", "Organza"],
  summer: ["Cotton", "Linen", "Rayon"],
  winter: ["Velvet", "Silk", "Crepe"],
};
