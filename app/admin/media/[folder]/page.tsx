import { notFound } from "next/navigation";
import { MediaLibrary } from "@/components/media/media-library";
import { getMediaFolderPage } from "@/features/media/data";
import { isKnownMediaFolder } from "@/lib/media/folders";

export const metadata = { title: "Media Library" };
export const dynamic = "force-dynamic";

export default async function AdminMediaFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ folder: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { folder } = await params;
  if (!isKnownMediaFolder(folder)) notFound();
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q : undefined;
  const view = typeof query.view === "string" ? query.view : undefined;
  const data = await getMediaFolderPage(folder, q, view);
  return <MediaLibrary {...data} />;
}
