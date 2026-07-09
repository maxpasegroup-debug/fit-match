import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveAIConfigurationAction, savePromptTemplateAction } from "@/features/ai/actions";

const features = ["STYLIST", "MEASUREMENT", "VIRTUAL_TRY_ON", "STYLE_SUGGESTION", "WEATHER"] as const;

export function AIConfigurationForm() {
  return <Card><h2 className="mb-4 text-lg font-semibold">Provider and limits</h2><form action={saveAIConfigurationAction} className="grid gap-4">
    <label className="grid gap-2 text-sm font-semibold">Feature<select className="h-12 rounded-2xl border border-[#eadde6] px-4" name="feature">{features.map((feature) => <option key={feature}>{feature}</option>)}</select></label>
    <Input defaultValue="mock" label="Provider key" name="provider" required />
    <Input defaultValue="50" label="Daily requests per user" min="1" name="dailyUserLimit" required type="number" />
    <label className="flex items-center gap-3 text-sm font-semibold"><input defaultChecked name="enabled" type="checkbox" />Enabled</label>
    <Button type="submit">Save configuration</Button>
  </form></Card>;
}

export function PromptTemplateForm() {
  return <Card><h2 className="mb-4 text-lg font-semibold">Prompt template</h2><form action={savePromptTemplateAction} className="grid gap-4">
    <Input label="Template key" name="key" placeholder="stylist_default" required />
    <Input label="Name" name="name" required />
    <label className="grid gap-2 text-sm font-semibold">Feature<select className="h-12 rounded-2xl border border-[#eadde6] px-4" name="feature">{features.map((feature) => <option key={feature}>{feature}</option>)}</select></label>
    <Textarea label="Template" name="template" required />
    <label className="flex items-center gap-3 text-sm font-semibold"><input defaultChecked name="active" type="checkbox" />Active</label>
    <Button type="submit">Save template</Button>
  </form></Card>;
}
