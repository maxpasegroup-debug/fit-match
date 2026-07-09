import { Bell, Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/lib/config/site";
import type { AuthUser } from "@/types/auth";

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
    <header className="sticky top-0 z-40 border-b border-[#eadde6]/80 bg-white/90 backdrop-blur">
      <div className={`${siteConfig.maxWidthClass} flex h-16 items-center justify-between gap-3`}>
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
          <ButtonLink href="/search" variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink className="relative" href="/wishlist" variant="ghost" size="icon" aria-label={`Wishlist, ${wishlistCount} items`}>
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c21874] text-[10px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            ) : null}
          </ButtonLink>
          <ButtonLink className="relative" href="/cart" variant="ghost" size="icon" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#c21874] text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </ButtonLink>
          <ButtonLink className="relative" href="/notifications" variant="ghost" size="icon" aria-label={`Notifications, ${notificationCount} unread`}>
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
          >
            <UserRound className="h-5 w-5" />
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
