import { Grid2X2, Home, PackageCheck, Shirt, UserRound } from "lucide-react";
import Link from "next/link";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid2X2 },
  { href: "/fit-match", label: "FIT & MATCH", icon: Shirt },
  { href: "/orders", label: "Orders", icon: PackageCheck },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#eadde6] bg-white/95 shadow-[0_-8px_30px_rgba(36,24,32,0.08)] backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid h-[68px] grid-cols-5">
        {items.map((item) => (
          <Link
            className="flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[#5d5159] transition hover:text-[#c21874]"
            href={item.href}
            key={item.href}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden min-[390px]:block">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
