"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { FieldError } from "@/components/ui/field-error";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { spacing } from "@/lib/design/spacing";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";
import { cn } from "@/lib/utils/cn";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function PasswordInput({ label, error, id, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name;

  return (
    <label className={cn("grid", colorClasses.formLabelText, spacing.gapSm, typography.label)} htmlFor={inputId}>
      {label}
      <span className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full border px-4 pr-12 text-base outline-none",
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
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center",
            colorClasses.mutedText,
            spacing.touchTarget,
            radius.pill,
            colorClasses.focusRing,
          )}
          onClick={() => setVisible((value) => !value)}
          type="button"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </span>
      <FieldError message={error} />
    </label>
  );
}
