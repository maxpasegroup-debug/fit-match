"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MediaAuditAction } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/auth";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { cloudinaryClient, cloudinaryTransformationUrl, uploadImageBuffer } from "@/lib/media/cloudinary";
import { auditLog } from "@/features/admin/audit";
import { ensureMediaFolders } from "@/features/media/data";
import {
  bulkMediaSchema,
  imageMimeTypes,
  maxImageBytes,
  maxImageDimension,
  mediaAssetIdSchema,
  mediaMoveSchema,
  mediaRenameSchema,
  mediaUploadSchema,
} from "@/features/media/schemas";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function files(formData: FormData) {
  return formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
}

function assetIds(formData: FormData) {
  return formData.getAll("assetIds").filter((value): value is string => typeof value === "string");
}

function assertImageFile(file: File) {
  if (!imageMimeTypes.includes(file.type as (typeof imageMimeTypes)[number])) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }
  if (file.size > maxImageBytes) {
    throw new Error("Image file size must be 5MB or less.");
  }
}

async function persistUpload(input: {
  file: File;
  folderSlug: string;
  uploadedById: string;
  tags?: string;
}) {
  assertImageFile(input.file);
  await ensureMediaFolders();
  const folder = await prisma.mediaFolder.findUniqueOrThrow({ where: { slug: input.folderSlug } });
  const result = await uploadImageBuffer({
    buffer: Buffer.from(await input.file.arrayBuffer()),
    folder: folder.path,
    filename: input.file.name,
  });
  if (result.width > maxImageDimension || result.height > maxImageDimension) {
    await cloudinaryClient.uploader.destroy(result.public_id);
    throw new Error("Image dimensions are too large.");
  }
  const thumbnailUrl = cloudinaryTransformationUrl(result.public_id, { width: 320, height: 320, crop: "fill", quality: "auto", fetch_format: "auto" });
  const smallUrl = cloudinaryTransformationUrl(result.public_id, { width: 480, crop: "limit", quality: "auto", fetch_format: "auto" });
  const mediumUrl = cloudinaryTransformationUrl(result.public_id, { width: 960, crop: "limit", quality: "auto", fetch_format: "auto" });
  const largeUrl = cloudinaryTransformationUrl(result.public_id, { width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" });
  const tagNames = (input.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const colorMetadata = (result as { colors?: unknown }).colors;
  const dominantColor = Array.isArray(colorMetadata) && colorMetadata.length > 0 && Array.isArray(colorMetadata[0])
    ? String(colorMetadata[0][0])
    : undefined;

  const asset = await prisma.mediaAsset.create({
    data: {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      thumbnailUrl,
      originalFilename: input.file.name,
      width: result.width,
      height: result.height,
      aspectRatio: result.width / result.height,
      format: result.format,
      fileSize: result.bytes,
      dominantColor,
      folderId: folder.id,
      uploadedById: input.uploadedById,
      tags: { create: tagNames.map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })) },
      transformations: {
        create: [
          { name: "thumbnail", width: 320, height: 320, format: "auto", quality: "auto", url: thumbnailUrl },
          { name: "small", width: 480, format: "auto", quality: "auto", url: smallUrl },
          { name: "medium", width: 960, format: "auto", quality: "auto", url: mediumUrl },
          { name: "large", width: 1600, format: "auto", quality: "auto", url: largeUrl },
          { name: "original", width: result.width, height: result.height, format: result.format, url: result.secure_url },
        ],
      },
      audits: { create: { actorId: input.uploadedById, action: "UPLOAD", message: `Uploaded ${input.file.name}` } },
    },
  });
  return asset;
}

export async function uploadMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = mediaUploadSchema.parse({ folder: text(formData, "folder"), tags: text(formData, "tags") || undefined });
  const uploadFiles = files(formData);
  if (uploadFiles.length === 0) throw new Error("Select at least one image.");
  await Promise.all(uploadFiles.map((file) => persistUpload({ file, folderSlug: input.folder, uploadedById: admin.id, tags: input.tags })));
  await auditLog({ admin, action: "MEDIA_UPLOADED", entityType: "MediaAsset", message: `Uploaded ${uploadFiles.length} media assets.` });
  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${input.folder}`);
}

export async function renameMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = mediaRenameSchema.parse({ assetId: text(formData, "assetId"), filename: text(formData, "filename") });
  await prisma.mediaAsset.update({ where: { id: input.assetId }, data: { originalFilename: input.filename } });
  await prisma.mediaAudit.create({ data: { assetId: input.assetId, actorId: admin.id, action: MediaAuditAction.RENAME, message: `Renamed to ${input.filename}` } });
  revalidatePath("/admin/media");
}

export async function moveMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = mediaMoveSchema.parse({ assetId: text(formData, "assetId"), folder: text(formData, "folder") });
  const folder = await prisma.mediaFolder.findUniqueOrThrow({ where: { slug: input.folder } });
  await prisma.mediaAsset.update({ where: { id: input.assetId }, data: { folderId: folder.id } });
  await prisma.mediaAudit.create({ data: { assetId: input.assetId, actorId: admin.id, action: "MOVE", message: `Moved to ${folder.path}` } });
  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${input.folder}`);
}

export async function deleteMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = mediaAssetIdSchema.parse({ assetId: text(formData, "assetId") });
  const asset = await prisma.mediaAsset.findUniqueOrThrow({ where: { id: input.assetId } });
  await cloudinaryClient.uploader.destroy(asset.publicId);
  await prisma.mediaAsset.update({ where: { id: asset.id }, data: { deletedAt: new Date() } });
  await prisma.mediaAudit.create({ data: { assetId: asset.id, actorId: admin.id, action: "DELETE", message: `Deleted ${asset.originalFilename}` } });
  revalidatePath("/admin/media");
}

export async function bulkDeleteMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = bulkMediaSchema.parse({ assetIds: assetIds(formData) });
  const assets = await prisma.mediaAsset.findMany({ where: { id: { in: input.assetIds } } });
  await Promise.all(assets.map((asset) => cloudinaryClient.uploader.destroy(asset.publicId)));
  await prisma.mediaAsset.updateMany({ where: { id: { in: input.assetIds } }, data: { deletedAt: new Date() } });
  await prisma.mediaAudit.create({ data: { actorId: admin.id, action: "DELETE", message: `Bulk deleted ${input.assetIds.length} assets.` } });
  revalidatePath("/admin/media");
}

export async function bulkMoveMediaAction(formData: FormData) {
  const admin = await requireAdmin();
  const input = bulkMediaSchema.parse({ assetIds: assetIds(formData), folder: text(formData, "folder") });
  if (!input.folder) throw new Error("Select a target folder.");
  const folder = await prisma.mediaFolder.findUniqueOrThrow({ where: { slug: input.folder } });
  await prisma.mediaAsset.updateMany({ where: { id: { in: input.assetIds } }, data: { folderId: folder.id } });
  await prisma.mediaAudit.create({ data: { actorId: admin.id, action: "MOVE", message: `Bulk moved ${input.assetIds.length} assets to ${folder.path}.` } });
  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${input.folder}`);
}

export async function uploadProfileImageAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Select a profile image.");
  const asset = await persistUpload({ file, folderSlug: "profiles", uploadedById: user.id, tags: "profile" });
  await prisma.user.update({ where: { id: user.id }, data: { avatar: asset.thumbnailUrl, avatarMediaAssetId: asset.id } });
  await prisma.mediaUsage.create({
    data: { assetId: asset.id, usageType: "PROFILE_AVATAR", entityType: "User", entityId: user.id, fieldName: "avatar" },
  });
  revalidatePath("/profile");
}

export async function deleteProfileImageAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await prisma.user.update({ where: { id: user.id }, data: { avatar: null, avatarMediaAssetId: null } });
  revalidatePath("/profile");
}
