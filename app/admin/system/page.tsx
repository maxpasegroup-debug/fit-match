import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { getSystemHealthData } from "@/features/system/data";

export const metadata = { title: "System Health" };
export const dynamic = "force-dynamic";

function mb(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function AdminSystemPage() {
  const data = await getSystemHealthData();
  const cards = [
    ["Application version", data.version],
    ["Environment", data.environment],
    ["Database latency", `${data.databaseLatencyMs} ms`],
    ["Queue status", data.queues],
    ["Media usage", `${data.mediaAssets} assets`],
    ["Storage usage", mb(data.mediaBytes)],
  ] as const;
  return <AdminShell title="System Health"><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label, value]) => <Card key={label}><p className="text-sm text-[#756871]">{label}</p><p className="mt-2 text-xl font-semibold text-[#241820]">{value}</p></Card>)}</section><Card><h2 className="text-lg font-semibold">Environment checks</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(data.checks).map(([key, value]) => <div className="rounded-2xl bg-[#fff5fa] p-4" key={key}><p className="font-semibold capitalize">{key}</p><p className="mt-1 text-sm text-[#756871]">{value ? "Configured" : "Needs attention"}</p></div>)}</div></Card><Card><h2 className="text-lg font-semibold">Operational counts</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Users", data.users], ["Products", data.products], ["Orders", data.orders], ["Notifications", data.notifications]].map(([label, value]) => <div className="rounded-2xl bg-[#fff5fa] p-4" key={label}><p className="text-sm text-[#756871]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#c21874]">{value}</p></div>)}</div></Card></AdminShell>;
}
