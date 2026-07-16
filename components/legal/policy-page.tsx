import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config/site";

export type PolicySection = {
  title: string;
  body: string;
};

export function PolicyPage({ title, updated, sections }: { title: string; updated: string; sections: PolicySection[] }) {
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-6`}><div><p className="text-sm font-semibold text-[#c21874]">FIT & MATCH</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">{title}</h1><p className="mt-3 text-sm text-[#756871]">Last updated: {updated}</p></div><Card className="grid gap-6">{sections.map((section) => <section className="grid gap-2" key={section.title}><h2 className="text-lg font-semibold text-[#241820]">{section.title}</h2><p className="text-sm leading-6 text-[#756871]">{section.body}</p></section>)}</Card></div></main>;
}
