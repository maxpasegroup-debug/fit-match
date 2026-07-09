import type { TextareaHTMLAttributes } from "react";
import { FieldError } from "@/components/ui/field-error";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";
import { cn } from "@/lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({ label, error, id, className, ...props }: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className={cn("grid gap-2", colorClasses.formLabelText, typography.label)} htmlFor={inputId}>
      {label}
      <textarea
        id={inputId}
        className={cn(
          "min-h-32 resize-y border px-4 py-3 text-base outline-none",
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
