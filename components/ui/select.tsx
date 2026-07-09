import type { SelectHTMLAttributes } from "react";
import { FieldError } from "@/components/ui/field-error";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { spacing } from "@/lib/design/spacing";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";
import { cn } from "@/lib/utils/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ label, error, id, className, children, ...props }: SelectProps) {
  const inputId = id ?? props.name;

  return (
    <label className={cn("grid gap-2", colorClasses.formLabelText, typography.label)} htmlFor={inputId}>
      {label}
      <select
        id={inputId}
        className={cn(
          "border px-4 text-base outline-none",
          spacing.controlHeight,
          radius.control,
          transitions.colors,
          colorClasses.border,
          colorClasses.whiteBg,
          colorClasses.inputFocus,
          error && colorClasses.dangerBorder,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <FieldError message={error} />
    </label>
  );
}
