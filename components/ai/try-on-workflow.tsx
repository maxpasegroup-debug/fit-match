"use client";

import { useState, useTransition } from "react";
import { ImageIcon, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startTryOnAction } from "@/features/ai/actions";

export function TryOnWorkflow({ products }: { products: Array<{ id: string; name: string }> }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [photo, setPhoto] = useState<File>(); const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function generate() {
    if (!photo || !productId) return;
    startTransition(async () => {
      try {
        const result = await startTryOnAction({ productId, filename: photo.name, mimeType: photo.type, fileSize: photo.size });
        setMessage(result.message);
      } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to prepare preview."); }
    });
  }
  return <div className="grid gap-5 lg:grid-cols-2">
    <div className="grid gap-4 rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm">
      <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">Choose product<select className="h-12 rounded-2xl border border-[#eadde6] bg-white px-4" onChange={(event) => setProductId(event.target.value)} value={productId}>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
      <label className="grid min-h-52 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-[#e2c9d6] p-5 text-center"><span><ImageIcon className="mx-auto mb-3 h-8 w-8 text-[#c21874]" /><span className="font-semibold">{photo?.name ?? "Upload your photo"}</span></span><input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0])} type="file" /></label>
      <Button disabled={!photo || !productId || pending} onClick={generate}><WandSparkles className="mr-2 h-4 w-4" />{pending ? "Preparing..." : "Generate preview"}</Button>
    </div>
    <div aria-live="polite" className="grid min-h-80 place-items-center rounded-3xl bg-[#fff5fa] p-6 text-center">
      <div><WandSparkles className="mx-auto h-10 w-10 text-[#c21874]" /><h2 className="mt-4 text-xl font-semibold">Virtual preview</h2><p className="mt-2 max-w-sm text-sm leading-6 text-[#756871]">{message || "Your generated look will appear here when an image provider is connected."}</p></div>
    </div>
  </div>;
}
