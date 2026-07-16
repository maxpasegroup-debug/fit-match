import { CheckCircle2, Ruler, Sparkles } from "lucide-react";
import type { AwaitedProductFitRecommendation } from "@/features/fit/types";

export function FitRecommendationPanel({ data }: { data: AwaitedProductFitRecommendation }) {
  if (!data) {
    return (
      <div className="rounded-3xl border border-[#eadde6] bg-[#fffafd] p-5">
        <p className="font-semibold text-[#241820]">FIT & MATCH</p>
        <p className="mt-2 text-sm text-[#756871]">Create a FIT profile in My Profile to unlock personal size, color, and fabric recommendations.</p>
      </div>
    );
  }
  const { result, fitProfile } = data;
  return (
    <section className="grid gap-4 rounded-3xl border border-[#eadde6] bg-[#fffafd] p-5" aria-label="FIT and Match recommendation">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#c21874]">FIT & MATCH Recommendation</p>
          <h2 className="text-xl font-semibold text-[#241820]">Recommended: {result.recommendedSize}</h2>
          <p className="text-sm text-[#756871]">Using {fitProfile.name} · {fitProfile.measurementProfile.profileName}</p>
        </div>
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#c21874] text-lg font-bold text-white" aria-label={`Fit score ${result.fitScore} percent`}>
          {result.fitScore}%
        </span>
      </div>
      {result.alternativeSize ? <p className="text-sm font-semibold text-[#756871]">Alternative size: {result.alternativeSize}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <RecommendationList title="Recommended Colors" values={[...result.bestColors, ...result.goodColors]} icon={<Sparkles className="h-5 w-5" />} />
        <RecommendationList title="Recommended Fabrics" values={result.recommendedFabrics.slice(0, 5)} icon={<Ruler className="h-5 w-5" />} />
      </div>
      <div className="grid gap-2">
        <p className="font-semibold text-[#241820]">Why this fits you</p>
        {result.reasons.map((reason) => (
          <p className="flex gap-2 text-sm leading-6 text-[#756871]" key={reason}>
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#c21874]" />
            {reason}
          </p>
        ))}
      </div>
    </section>
  );
}

function RecommendationList({ title, values, icon }: { title: string; values: string[]; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center gap-2 text-[#c21874]">{icon}<p className="font-semibold text-[#241820]">{title}</p></div>
      <p className="mt-2 text-sm text-[#756871]">{values.length > 0 ? values.join(", ") : "No direct product match; review available options."}</p>
    </div>
  );
}
