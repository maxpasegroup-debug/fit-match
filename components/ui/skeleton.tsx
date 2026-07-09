import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse", colorClasses.primarySoftBg, radius.control, className)}
      aria-hidden="true"
    />
  );
}

export function PageSkeleton() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1280px] gap-6">
        <Skeleton className="h-40 rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
          <Skeleton className="h-36 rounded-3xl" />
        </div>
      </div>
    </main>
  );
}
