import Link from "next/link";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <Link
        aria-disabled={page <= 1}
        className="rounded-full border border-[#eadde6] px-4 py-2 text-sm font-semibold text-[#241820] aria-disabled:pointer-events-none aria-disabled:opacity-50"
        href={`${basePath}?page=${Math.max(page - 1, 1)}`}
      >
        Previous
      </Link>
      <span className="text-sm text-[#756871]">Page {page} of {totalPages}</span>
      <Link
        aria-disabled={page >= totalPages}
        className="rounded-full border border-[#eadde6] px-4 py-2 text-sm font-semibold text-[#241820] aria-disabled:pointer-events-none aria-disabled:opacity-50"
        href={`${basePath}?page=${Math.min(page + 1, totalPages)}`}
      >
        Next
      </Link>
    </nav>
  );
}
