import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { PWAManager } from "@/components/pwa/pwa-manager";
import { SkipLink } from "@/components/layout/skip-link";
import { getCurrentUser } from "@/lib/auth/session";
import { getWishlistCount } from "@/features/catalog/data";
import { getCartCount } from "@/features/checkout/data";
import { getUnreadNotificationCount } from "@/features/engagement/data";
import { env } from "@/lib/config/env";
import { siteConfig } from "@/lib/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: {
    default: `${siteConfig.productName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.productName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.productName,
  icons: [{ rel: "icon", url: "/favicon.svg" }, { rel: "apple-touch-icon", url: "/icon.svg" }],
  appleWebApp: {
    capable: true,
    title: siteConfig.productName,
    statusBarStyle: "default",
    startupImage: [{ url: "/icon.svg" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.productName} by ${siteConfig.brandName}`,
    description: siteConfig.description,
    siteName: siteConfig.brandName,
    type: "website",
    url: "/",
    images: [{ url: "/favicon.svg", width: 64, height: 64, alt: "SIGN SILKS" }],
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.productName} by ${siteConfig.brandName}`,
    description: siteConfig.description,
    images: ["/favicon.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#c21874",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const [wishlistCount, cartCount, notificationCount] = user
    ? await Promise.all([getWishlistCount(user.id), getCartCount(user.id), getUnreadNotificationCount(user.id)])
    : [0, 0, 0];

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SkipLink />
        <AppShell user={user} wishlistCount={wishlistCount} cartCount={cartCount} notificationCount={notificationCount}>
          <AnalyticsProvider />
          <PWAManager />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </AppShell>
      </body>
    </html>
  );
}
