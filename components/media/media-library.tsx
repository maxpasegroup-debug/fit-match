import Image from "next/image";
import Link from "next/link";
import type { MediaAsset, MediaFolder, MediaTag, MediaTransformation, MediaUsage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  bulkDeleteMediaAction,
  bulkMoveMediaAction,
  deleteMediaAction,
  moveMediaAction,
  renameMediaAction,
  uploadMediaAction,
} from "@/features/media/actions";

type Asset = MediaAsset & {
  folder: MediaFolder;
  tags: MediaTag[];
  transformations: MediaTransformation[];
  usages: MediaUsage[];
};

export function MediaLibrary({
  folders,
  activeFolder,
  assets,
  view,
}: {
  folders: MediaFolder[];
  activeFolder: MediaFolder | null;
  assets: Asset[];
  view: "grid" | "list";
}) {
  const folderSlug = activeFolder?.slug ?? "products";
  return (
    <main className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold text-[#c21874]">DAM</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Media Library</h1>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Media folders">
        {folders.map((folder) => (
          <Link
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${folder.slug === folderSlug ? "border-[#c21874] bg-[#fde8f3] text-[#9f125d]" : "border-[#eadde6] bg-white text-[#241820]"}`}
            href={`/admin/media/${folder.slug}`}
            key={folder.id}
          >
            {folder.name}
          </Link>
        ))}
      </nav>
      <section className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
        <form className="flex flex-col gap-3 md:flex-row">
          <input className="h-12 flex-1 rounded-full border border-[#eadde6] px-4" name="q" placeholder="Search filename, public ID, tag" />
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="view" defaultValue={view}>
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
          <Button type="submit">Search</Button>
        </form>
        <form action={uploadMediaAction} className="grid gap-3" encType="multipart/form-data">
          <input name="folder" type="hidden" value={folderSlug} />
          <input className="rounded-2xl border border-[#eadde6] p-4" name="files" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="tags" placeholder="Tags, comma separated" />
          <Button type="submit">Upload Images</Button>
          <p className="text-xs text-[#756871]">Allowed: JPEG, PNG, WebP, GIF. Max 5MB and 6000px per side.</p>
        </form>
      </section>
      <form action={bulkMoveMediaAction} className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#241820]">{activeFolder?.name ?? "Assets"}</h2>
          <div className="flex flex-wrap gap-2">
            <select className="h-11 rounded-full border border-[#eadde6] px-4" name="folder" defaultValue={folderSlug}>
              {folders.map((folder) => <option key={folder.id} value={folder.slug}>{folder.name}</option>)}
            </select>
            <Button type="submit" variant="secondary">Bulk Move</Button>
            <Button formAction={bulkDeleteMediaAction} type="submit" variant="secondary">Bulk Delete</Button>
          </div>
        </div>
        <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-3"}>
          {assets.map((asset) => (
            <article className={view === "grid" ? "rounded-3xl border border-[#f4eaf0] p-3" : "grid gap-4 rounded-3xl border border-[#f4eaf0] p-3 md:grid-cols-[120px_1fr]"} key={asset.id}>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#756871]">
                <input name="assetIds" type="checkbox" value={asset.id} />
                Select
              </label>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#fffafd]">
                <Image alt={asset.originalFilename} className="object-cover" fill loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" src={asset.thumbnailUrl} />
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <p className="font-semibold text-[#241820]">{asset.originalFilename}</p>
                <p className="break-all text-xs text-[#756871]">{asset.publicId}</p>
                <p className="text-xs text-[#756871]">{asset.width} x {asset.height} · {asset.format.toUpperCase()} · {Math.round(asset.fileSize / 1024)}KB</p>
                <p className="text-xs text-[#756871]">Asset ID: {asset.id}</p>
                <div className="flex flex-wrap gap-2">
                  <a className="rounded-full border border-[#eadde6] px-3 py-1 text-xs font-semibold text-[#241820]" href={asset.secureUrl} target="_blank" rel="noreferrer">Preview</a>
                  <span className="rounded-full bg-[#fffafd] px-3 py-1 text-xs text-[#756871]">{asset.usages.length} usages</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </form>
      <section className="grid gap-4 lg:grid-cols-3">
        <form action={renameMediaAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Rename</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="assetId" placeholder="Asset ID" required />
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="filename" placeholder="New filename" required />
          <Button type="submit" variant="secondary">Rename</Button>
        </form>
        <form action={moveMediaAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Move</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="assetId" placeholder="Asset ID" required />
          <select className="h-12 rounded-full border border-[#eadde6] px-4" name="folder" defaultValue={folderSlug}>
            {folders.map((folder) => <option key={folder.id} value={folder.slug}>{folder.name}</option>)}
          </select>
          <Button type="submit" variant="secondary">Move</Button>
        </form>
        <form action={deleteMediaAction} className="grid gap-3 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#241820]">Delete</h2>
          <input className="h-12 rounded-full border border-[#eadde6] px-4" name="assetId" placeholder="Asset ID" required />
          <Button type="submit" variant="secondary">Delete Asset</Button>
        </form>
      </section>
    </main>
  );
}
