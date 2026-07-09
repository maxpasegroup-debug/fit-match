import { redirect } from "next/navigation";
import { Heart, Home, PackageCheck, Ruler, Sparkles, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/features/auth/actions";
import { siteConfig } from "@/lib/config/site";

const shortcuts = [
  { title: "My Profile", icon: UserRound, text: "Manage account details and preferences." },
  { title: "My Measurements", icon: Ruler, text: "Create saved profiles for FIT & Match." },
  { title: "My Addresses", icon: Home, text: "Manage delivery addresses." },
  { title: "Recently viewed", icon: Sparkles, text: "Your browsing history will appear here." },
  { title: "Wishlist", icon: Heart, text: "Saved styles will be ready in the next phase." },
  { title: "Orders", icon: PackageCheck, text: "Order history arrives with commerce features." },
];

export default async function HomeDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-8`}>
        <Card className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-[#c21874]">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#241820]">
              Hi {user.name}, your FIT & Match home is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#756871]">
              This dashboard is intentionally light for Phase 1, with secure account
              access prepared for the shopping and personalization modules.
            </p>
          </div>
          <form action={logoutAction}>
            <Button variant="secondary" type="submit">Log out</Button>
          </form>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <Card key={shortcut.title}>
              <shortcut.icon className="mb-5 h-7 w-7 text-[#c21874]" />
              <h2 className="text-lg font-semibold text-[#241820]">{shortcut.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#756871]">{shortcut.text}</p>
            </Card>
          ))}
        </div>
        <Card>
          <UserRound className="mb-5 h-7 w-7 text-[#c21874]" />
          <h2 className="text-lg font-semibold text-[#241820]">Profile</h2>
          <p className="mt-2 text-sm leading-6 text-[#756871]">
            {user.email} · {user.emailVerified ? "Email verified" : "Email verification pending"}
          </p>
        </Card>
      </div>
    </main>
  );
}
