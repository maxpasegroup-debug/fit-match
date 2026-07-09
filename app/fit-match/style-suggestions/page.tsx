import { WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateStyleSuggestionAction } from "@/features/ai/actions";
import { getStyleSuggestions } from "@/features/ai/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Style Suggestions" };
export const dynamic = "force-dynamic";
const types = ["DAILY", "WEEKLY", "FESTIVAL", "WEDDING", "OFFICE", "TRAVEL"] as const;

export default async function StyleSuggestionsPage() {
  const suggestions = await getStyleSuggestions();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-7`}>
    <div><p className="text-sm font-semibold text-[#c21874]">Personal lookbook</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Style suggestions</h1><p className="mt-3 text-sm leading-6 text-[#756871]">Create an occasion-ready starting point using the configured styling provider.</p></div>
    <div className="flex gap-2 overflow-x-auto pb-2">{types.map((type) => <form action={generateStyleSuggestionAction} key={type}><input name="type" type="hidden" value={type} /><Button className="whitespace-nowrap" type="submit" variant="secondary">{type.charAt(0) + type.slice(1).toLowerCase()} look</Button></form>)}</div>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Generated style suggestions">{suggestions.map((suggestion) => <Card key={suggestion.id}><WandSparkles className="h-6 w-6 text-[#c21874]" /><p className="mt-4 text-xs font-bold text-[#9f125d]">{suggestion.type}</p><h2 className="mt-2 text-lg font-semibold">{suggestion.title}</h2><p className="mt-2 text-sm leading-6 text-[#756871]">{suggestion.summary}</p></Card>)}</section>
  </div></main>;
}
