import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { spacing } from "@/lib/design/spacing";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";

const variants = {
  primary: `${colorClasses.primaryBg} ${colorClasses.whiteText} shadow-sm ${colorClasses.primaryHoverBg}`,
  secondary: `border ${colorClasses.whiteBg} ${colorClasses.bodyText} ${colorClasses.primarySoftHoverBg}`,
  ghost: `${colorClasses.bodyText} ${colorClasses.primarySoftHoverBg}`,
} as const;

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: `${spacing.controlHeight} px-6 text-base`,
  icon: "h-11 w-11 p-0",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center disabled:pointer-events-none disabled:opacity-60",
        radius.pill,
        transitions.colors,
        typography.button,
        colorClasses.focusRing,
        variant === "secondary" && colorClasses.border,
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center",
        radius.pill,
        transitions.colors,
        typography.button,
        colorClasses.focusRing,
        variant === "secondary" && colorClasses.border,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
