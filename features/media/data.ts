import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { mediaFolders } from "@/lib/media/folders";

export async function ensureMediaFolders() {
  await prisma.$transaction(
    mediaFolders.map((folder) =>
      prisma.mediaFolder.upsert({
        where: { slug: folder.slug },
        create: folder,
        update: { name: folder.name, path: folder.path, kind: folder.kind },
      }),
    ),
  );
}

export async function getMediaLibraryData(input: {
  folder?: string;
  q?: string;
  view?: string;
}) {
  await requireAdmin();
  await ensureMediaFolders();
  const folderSlug = input.folder ?? "products";
  const [folders, activeFolder] = await Promise.all([
    prisma.mediaFolder.findMany({ orderBy: { name: "asc" } }),
    prisma.mediaFolder.findUnique({ where: { slug: folderSlug } }),
  ]);
  const assets = await prisma.mediaAsset.findMany({
    where: {
      deletedAt: null,
      ...(activeFolder ? { folderId: activeFolder.id } : {}),
      ...(input.q
        ? {
            OR: [
              { originalFilename: { contains: input.q, mode: "insensitive" } },
              { publicId: { contains: input.q, mode: "insensitive" } },
              { tags: { some: { name: { contains: input.q, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: { folder: true, tags: true, transformations: true, usages: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });
  const view: "grid" | "list" = input.view === "list" ? "list" : "grid";
  return { folders, activeFolder, assets, view };
}

export async function getMediaFolderPage(folder: string, q?: string, view?: string) {
  return getMediaLibraryData({ folder, q, view });
}
