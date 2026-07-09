import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

export function AuthFormShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fffafd] px-4 py-10">
      <div className="mx-auto grid w-full max-w-md gap-7">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Card className="p-6 sm:p-8">
          <div className="mb-7 grid gap-2 text-center">
            <h1 className="text-2xl font-semibold text-[#241820]">{title}</h1>
            <p className="text-sm leading-6 text-[#756871]">{subtitle}</p>
          </div>
          {children}
        </Card>
      </div>
    </main>
  );
}
