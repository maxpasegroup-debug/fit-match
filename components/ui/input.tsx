import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { spacing } from "@/lib/design/spacing";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";
import { FieldError } from "@/components/ui/field-error";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className={cn("grid", colorClasses.formLabelText, spacing.gapSm, typography.label)} htmlFor={inputId}>
      {label}
      <input
        id={inputId}
        className={cn(
          "border px-4 text-base outline-none",
          spacing.controlHeight,
          radius.control,
          transitions.colors,
          colorClasses.border,
          colorClasses.whiteBg,
          colorClasses.placeholder,
          colorClasses.inputFocus,
          error && colorClasses.dangerBorder,
          className,
        )}
        {...props}
      />
      <FieldError message={error} />
    </label>
  );
}
