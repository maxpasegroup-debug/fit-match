import { MeasurementWorkflow } from "@/components/ai/measurement-workflow";
import { getMeasurementSessions } from "@/features/ai/data";
import { siteConfig } from "@/lib/config/site";

export const metadata = { title: "Photo Measurement" };
export const dynamic = "force-dynamic";

export default async function MeasurementsPage() {
  const sessions = await getMeasurementSessions();
  return <main className="py-10 md:py-14"><div className={`${siteConfig.maxWidthClass} grid max-w-4xl gap-7`}>
    <div><p className="text-sm font-semibold text-[#c21874]">Private photo workflow</p><h1 className="mt-2 text-3xl font-semibold text-[#241820]">Photo measurement</h1><p className="mt-3 text-sm leading-6 text-[#756871]">Take two guided photos, review the confidence and measurements, then choose whether to save.</p></div>
    <MeasurementWorkflow />
    {sessions.length ? <section><h2 className="mb-3 text-xl font-semibold">Recent sessions</h2><div className="grid gap-3">{sessions.map((session) => <div className="flex items-center justify-between rounded-2xl border border-[#eadde6] bg-white p-4" key={session.id}><span className="font-semibold">{session.createdAt.toLocaleDateString("en-IN")}</span><span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{session.status}</span></div>)}</div></section> : null}
  </div></main>;
}
