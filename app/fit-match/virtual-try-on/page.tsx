import { TryOnWorkflow } from "@/components/ai/try-on-workflow";
import { getTryOnData } from "@/features/ai/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Virtual Try-On" };
export const dynamic = "force-dynamic";

export default async function TryOnPage() {
  const { products, sessions } = await getTryOnData();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid gap-7`}>
    <div><p className="text-sm font-semibold text-[#c21874]">FIT & MATCH</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Virtual try-on</h1><p className="mt-3 text-sm leading-6 text-[#756871]">Select a style and prepare a private preview. Image generation remains in provider-preview mode.</p></div>
    <TryOnWorkflow products={products} />
    {sessions.length ? <section><h2 className="mb-4 text-xl font-semibold">Preview history</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{sessions.map((session) => <div className="rounded-2xl border border-[#eadde6] bg-white p-4" key={session.id}><p className="font-semibold">{session.product.name}</p><p className="mt-2 text-xs text-[#756871]">Attempt {session.attempt} · {session.status}</p></div>)}</div></section> : null}
  </div></main>;
}
