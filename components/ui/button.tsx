import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { colorClasses } from "@/lib/design/colors";
import { radius } from "@/lib/design/radius";
import { spacing } from "@/lib/design/spacing";
import { transitions } from "@/lib/design/transitions";
import { typography } from "@/lib/design/typography";

const variants = {
  primary: `${colorClasses.primaryBg} ${colorClasses.whiteText} shadow-[0_14px_34px_rgba(194,24,116,0.18)] ${colorClasses.primaryHoverBg} hover:-translate-y-0.5 active:translate-y-0`,
  secondary: `border border-[#eadde6] bg-white/92 ${colorClasses.bodyText} hover:-translate-y-0.5 hover:border-[#c21874]/35 hover:bg-[#fff5fa] hover:shadow-[0_14px_34px_rgba(36,24,32,0.08)]`,
  ghost: `${colorClasses.bodyText} hover:bg-[#fff5fa] hover:text-[#c21874]`,
  outline: `border border-[#c21874]/30 bg-transparent text-[#c21874] hover:-translate-y-0.5 hover:bg-[#fff5fa] hover:shadow-[0_14px_34px_rgba(194,24,116,0.12)]`,
} as const;

const sizes = {
  md: "min-h-12 px-5 text-[16px]",
  lg: `${spacing.controlHeight} min-h-14 px-7 text-[16px]`,
  icon: "h-12 w-12 p-0",
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
        "inline-flex items-center justify-center transition-all duration-300 disabled:pointer-events-none disabled:border-[#eadde6] disabled:bg-[#f4eef2] disabled:text-[#9a8791] disabled:shadow-none",
        radius.pill,
        transitions.colors,
        typography.button,
        colorClasses.focusRing,
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
        "inline-flex items-center justify-center transition-all duration-300",
        radius.pill,
        transitions.colors,
        typography.button,
        colorClasses.focusRing,
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
