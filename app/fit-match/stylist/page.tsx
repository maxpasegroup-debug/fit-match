import { StylistChat } from "@/components/ai/stylist-chat";
import { getStylistData } from "@/features/ai/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "AI Stylist" };
export const dynamic = "force-dynamic";

export default async function StylistPage() {
  const conversations = await getStylistData();
  const active = conversations[0];
  return <main className="py-8 md:py-12"><div className={`${siteConfig.maxWidthClass} grid max-w-4xl gap-6`}>
    <div><p className="text-sm font-semibold text-[#c21874]">FIT & MATCH</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Your stylist</h1></div>
    <StylistChat initialConversationId={active?.id} initialMessages={(active?.messages ?? []).filter((item) => item.role !== "SYSTEM").map((item) => ({ id: item.id, role: item.role === "USER" ? "USER" : "ASSISTANT", content: item.content }))} />
  </div></main>;
}
