import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import type { AuthUser } from "@/types/auth";

export function AppShell({
  children,
  user,
  wishlistCount,
  cartCount,
  notificationCount,
}: {
  children: ReactNode;
  user: AuthUser | null;
  wishlistCount: number;
  cartCount: number;
  notificationCount: number;
}) {
  return (
    <>
      <Header user={user} wishlistCount={wishlistCount} cartCount={cartCount} notificationCount={notificationCount} />
      {children}
      <Footer />
      <BottomNav />
    </>
  );
}
