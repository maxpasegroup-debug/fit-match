import { z } from "zod";
import { isKnownMediaFolder } from "@/lib/media/folders";

export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const maxImageBytes = 5 * 1024 * 1024;
export const maxImageDimension = 6000;

export const mediaUploadSchema = z.object({
  folder: z.string().refine(isKnownMediaFolder, "Unknown media folder"),
  alt: z.string().trim().max(180).optional(),
  tags: z.string().trim().max(300).optional(),
});

export const mediaAssetIdSchema = z.object({
  assetId: z.string().cuid(),
});

export const mediaRenameSchema = mediaAssetIdSchema.extend({
  filename: z.string().trim().min(2).max(180),
});

export const mediaMoveSchema = mediaAssetIdSchema.extend({
  folder: z.string().refine(isKnownMediaFolder, "Unknown media folder"),
});

export const bulkMediaSchema = z.object({
  assetIds: z.array(z.string().cuid()).min(1),
  folder: z.string().refine(isKnownMediaFolder, "Unknown media folder").optional(),
});
