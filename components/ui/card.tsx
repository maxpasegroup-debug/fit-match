import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { shadows } from "@/lib/design/shadows";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border bg-white p-5",
        radius.card,
        colorClasses.border,
        shadows.card,
        className,
      )}
      {...props}
    />
  );
}
