import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { shadows } from "@/lib/design/shadows";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border bg-white/92 p-6 transition-all duration-300 hover:shadow-[0_24px_70px_rgba(36,24,32,0.09)]",
        radius.card,
        colorClasses.border,
        shadows.card,
        className,
      )}
      {...props}
    />
  );
}
