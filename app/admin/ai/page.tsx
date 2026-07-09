import { AdminShell } from "@/components/admin/admin-shell";
import { AIConfigurationForm, PromptTemplateForm } from "@/components/ai/admin-ai-forms";
import { Card } from "@/components/ui/card";
import { getAdminAIData } from "@/features/ai/data";

export const metadata = { title: "AI Experience Admin" };
export const dynamic = "force-dynamic";

export default async function AdminAIPage() {
  const { configurations, prompts, usage } = await getAdminAIData();
  return <AdminShell title="AI Experience Layer">
    <div className="grid gap-5 lg:grid-cols-2"><AIConfigurationForm /><PromptTemplateForm /></div>
    <Card><h2 className="mb-4 text-lg font-semibold">Feature configuration</h2><div className="grid gap-3">{configurations.length ? configurations.map((item) => <div className="grid gap-2 rounded-2xl bg-[#fffafd] p-4 sm:grid-cols-[1fr_auto_auto]" key={item.id}><span className="font-semibold">{item.feature}</span><span className="text-sm">{item.provider}</span><span className="text-sm text-[#756871]">{item.enabled ? "Enabled" : "Disabled"} · {item.dailyUserLimit}/day</span></div>) : <p className="text-sm text-[#756871]">Configurations are created when each feature is first used or saved here.</p>}</div></Card>
    <div className="grid gap-5 lg:grid-cols-2"><Card><h2 className="mb-4 text-lg font-semibold">Prompt registry</h2><div className="grid gap-3">{prompts.map((item) => <div className="rounded-2xl bg-[#fffafd] p-4" key={item.id}><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-[#756871]">{item.key} · v{item.version} · {item.feature}</p></div>)}</div></Card><Card><h2 className="mb-4 text-lg font-semibold">Usage telemetry</h2><div className="grid gap-3">{usage.map((item) => <div className="rounded-2xl bg-[#fffafd] p-4" key={`${item.provider}-${item.feature}-${item.failed}`}><p className="font-semibold">{item.feature} · {item.provider}</p><p className="mt-1 text-sm text-[#756871]">{item._count._all} requests · {Math.round(item._avg.latencyMs ?? 0)} ms avg · {item.failed ? "failed" : "successful"}</p></div>)}</div></Card></div>
  </AdminShell>;
}
