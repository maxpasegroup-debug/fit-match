export const fallbackProductImage = "/product-placeholder.svg";

export function mediaUrl(input?: { mediaAsset?: { secureUrl: string } | null; url?: string | null } | null) {
  return input?.mediaAsset?.secureUrl ?? input?.url ?? fallbackProductImage;
}

export function bannerMediaUrl(input?: {
  desktopMediaAsset?: { secureUrl: string } | null;
  image?: string | null;
} | null) {
  return input?.desktopMediaAsset?.secureUrl ?? input?.image ?? fallbackProductImage;
}
