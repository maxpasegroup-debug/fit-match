"use client";

import { useState, useTransition } from "react";
import { Camera, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptMeasurementAction, startMeasurementAction } from "@/features/ai/actions";

type Result = { sessionId: string; confidence: number; measurements: Record<string, number>; warnings: string[] };

export function MeasurementWorkflow() {
  const [front, setFront] = useState<File>(); const [side, setSide] = useState<File>();
  const [result, setResult] = useState<Result>(); const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function process() {
    if (!front || !side) return;
    startTransition(async () => {
      try {
        setError("");
        setResult(await startMeasurementAction({ frontFilename: front.name, frontMimeType: front.type, frontSize: front.size, sideFilename: side.name, sideMimeType: side.type, sideSize: side.size }));
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to process photos."); }
    });
  }

  if (result) return (
    <div className="grid gap-5">
      <div className="rounded-3xl border border-[#eadde6] bg-white p-6 shadow-sm">
        <CheckCircle2 className="h-8 w-8 text-[#c21874]" />
        <h2 className="mt-4 text-2xl font-semibold text-[#241820]">Measurement preview</h2>
        <p className="mt-2 text-sm text-[#756871]">Confidence score: {Math.round(result.confidence * 100)}%</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(result.measurements).map(([key, value]) => <div className="rounded-2xl bg-[#fff5fa] p-3" key={key}><p className="text-xs uppercase text-[#756871]">{key}</p><p className="font-semibold">{value} cm</p></div>)}
        </div>
        {result.warnings.map((warning) => <p className="mt-4 text-sm font-semibold text-amber-800" key={warning}>{warning}</p>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => startTransition(async () => { await acceptMeasurementAction(result.sessionId, "AI Measurement"); })} disabled={pending}>Accept and save profile</Button>
        <Button onClick={() => { setResult(undefined); setFront(undefined); setSide(undefined); }} variant="secondary"><RotateCcw className="mr-2 h-4 w-4" />Retry</Button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PhotoInput file={front} label="Take or upload front photo" onChange={setFront} />
        <PhotoInput file={side} label="Take or upload side photo" onChange={setSide} />
      </div>
      <div className="rounded-3xl bg-[#fff5fa] p-5"><p className="font-semibold text-[#241820]">Photo guidance</p><p className="mt-2 text-sm leading-6 text-[#756871]">Use fitted clothing, even lighting, a plain background, and keep your full body visible. Photos are private to your account.</p></div>
      {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
      <Button className="w-full sm:w-fit" disabled={!front || !side || pending} onClick={process}>{pending ? "Preparing preview..." : "Estimate measurements"}</Button>
    </div>
  );
}

function PhotoInput({ label, file, onChange }: { label: string; file?: File; onChange: (file?: File) => void }) {
  return <label className="grid min-h-56 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#e2c9d6] bg-white p-6 text-center focus-within:ring-2 focus-within:ring-[#c21874]"><span><Camera className="mx-auto mb-3 h-8 w-8 text-[#c21874]" /><span className="font-semibold text-[#241820]">{file?.name ?? label}</span><span className="mt-2 block text-xs text-[#756871]">JPEG, PNG or WebP, up to 8 MB</span></span><input accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={(event) => onChange(event.target.files?.[0])} type="file" /></label>;
}
