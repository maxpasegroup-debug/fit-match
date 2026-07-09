import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className={cn("flex items-center gap-3 text-sm font-medium", colorClasses.formLabelText)}>
      <input
        className={cn("h-5 w-5", colorClasses.primaryAccent, colorClasses.focusRing, className)}
        type="radio"
        {...props}
      />
      {label}
    </label>
  );
}
