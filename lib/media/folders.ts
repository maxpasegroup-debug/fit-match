import type { MediaFolderKind } from "@prisma/client";

export const mediaFolders: Array<{ name: string; slug: string; path: string; kind: MediaFolderKind }> = [
  { name: "Products", slug: "products", path: "products", kind: "PRODUCTS" },
  { name: "Collections", slug: "collections", path: "collections", kind: "COLLECTIONS" },
  { name: "Categories", slug: "categories", path: "categories", kind: "CATEGORIES" },
  { name: "Banners", slug: "banners", path: "banners", kind: "BANNERS" },
  { name: "Profiles", slug: "profiles", path: "profiles", kind: "PROFILES" },
  { name: "Marketing", slug: "marketing", path: "marketing", kind: "MARKETING" },
  { name: "Lookbooks", slug: "lookbooks", path: "lookbooks", kind: "LOOKBOOKS" },
  { name: "Temporary", slug: "temporary", path: "temporary", kind: "TEMPORARY" },
];

export function isKnownMediaFolder(slug: string): boolean {
  return mediaFolders.some((folder) => folder.slug === slug);
}
