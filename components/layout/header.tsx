import { Bell, Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/config/site";
import type { AuthUser } from "@/types/auth";

const desktopLinks = [
  ["/", "Home"],
  ["/fit-match", "FIT Journey"],
  ["/collections", "Collections"],
  ["/categories", "Categories"],
  ["/#style-studio", "Style Studio"],
] as const;

export function Header({
  user,
  wishlistCount,
  cartCount,
  notificationCount,
}: {
  user: AuthUser | null;
  wishlistCount: number;
  cartCount: number;
  notificationCount: number;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/78 shadow-[0_14px_40px_rgba(36,24,32,0.08)] backdrop-blur-2xl">
      <div className={`${siteConfig.maxWidthClass} flex h-[72px] items-center justify-between gap-3`}>
        <Logo />
        <nav className="hidden items-center gap-1 rounded-full border border-[#eadde6]/80 bg-white/70 p-1 shadow-sm lg:flex" aria-label="Main navigation">
          {desktopLinks.map(([href, label]) => (
            <ButtonLink key={href} href={href} variant="ghost" className="min-h-11 rounded-full px-4 text-sm">
              {label}
            </ButtonLink>
          ))}
        </nav>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Primary actions">
          <ButtonLink href="/search" variant="ghost" size="icon" aria-label="Search" className="min-h-12 min-w-12">
            <Search className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink className="relative min-h-12 min-w-12" href="/wishlist" variant="ghost" size="icon" aria-label={`Wishlist, ${wishlistCount} items`}>
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c21874] text-[10px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            ) : null}
          </ButtonLink>
          <ButtonLink className="relative min-h-12 min-w-12" href="/cart" variant="ghost" size="icon" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c21874] text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </ButtonLink>
          <ButtonLink className="relative hidden min-h-12 min-w-12 sm:inline-flex" href="/notifications" variant="ghost" size="icon" aria-label={`Notifications, ${notificationCount} unread`}>
            <Bell className="h-5 w-5" />
            {notificationCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c21874] text-[10px] font-bold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            ) : null}
          </ButtonLink>
          <ButtonLink
            href={user ? "/profile" : "/login"}
            variant="secondary"
            size="icon"
            aria-label="Profile"
            className="min-h-12 min-w-12"
          >
            <UserRound className="h-5 w-5" />
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
