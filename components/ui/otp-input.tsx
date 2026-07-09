import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";

type OTPInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function OTPInput({ label, className, ...props }: OTPInputProps) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium", colorClasses.formLabelText)}>
      {label}
      <input
        className={cn(
          "h-14 w-full max-w-64 border px-4 text-center font-mono text-2xl tracking-[0.35em] outline-none",
          radius.control,
          colorClasses.border,
          colorClasses.whiteBg,
          colorClasses.inputFocus,
          className,
        )}
        inputMode="numeric"
        maxLength={6}
        {...props}
      />
    </label>
  );
}
