import { AdminShell } from "@/components/admin/admin-shell";
import { FitRuleForm, SizeChartForm, SizeMappingForm } from "@/components/fit/admin-fit-forms";
import { Card } from "@/components/ui/card";
import { getAdminFitData } from "@/features/fit/data";

export const metadata = { title: "FIT Engine Admin" };
export const dynamic = "force-dynamic";

export default async function AdminFitPage() {
  const { rules, charts, categories } = await getAdminFitData();
  return (
    <AdminShell title="FIT & Match Engine">
      <div className="grid gap-5 lg:grid-cols-2">
        <FitRuleForm />
        <SizeChartForm categories={categories} />
      </div>
      <SizeMappingForm charts={charts} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-[#241820]">Active Rules</h2>
          <div className="grid gap-3">
            {rules.map((rule) => (
              <div className="rounded-2xl bg-[#fffafd] p-4" key={rule.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#241820]">{rule.name}</p>
                  <span className="rounded-full bg-[#fde8f3] px-3 py-1 text-xs font-bold text-[#9f125d]">{rule.type}</span>
                </div>
                <p className="mt-1 text-sm text-[#756871]">{rule.code} · priority {rule.priority} · weight {rule.weight}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-[#241820]">Size Charts</h2>
          <div className="grid gap-3">
            {charts.map((chart) => (
              <div className="rounded-2xl bg-[#fffafd] p-4" key={chart.id}>
                <p className="font-semibold text-[#241820]">{chart.brand} · {chart.name}</p>
                <p className="text-sm text-[#756871]">{chart.category?.name ?? "All categories"} · {chart.mappings.length} sizes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chart.mappings.map((mapping) => <span className="rounded-full border border-[#eadde6] px-3 py-1 text-xs font-semibold" key={mapping.id}>{mapping.sizeName}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
