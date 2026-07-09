import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

export function ReservedPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-6`}>
        <Card className="max-w-2xl">
          <Icon className="mb-5 h-7 w-7 text-[#c21874]" />
          <h1 className="text-3xl font-semibold text-[#241820]">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#756871]">{description}</p>
        </Card>
      </div>
    </main>
  );
}
