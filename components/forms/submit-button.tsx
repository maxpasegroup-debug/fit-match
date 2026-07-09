"use client";

import { useFormStatus } from "react-dom";
import { LoadingButton } from "@/components/ui/loading-button";

export function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();

  return (
    <LoadingButton className="w-full" loading={pending} type="submit" size="lg">
      {children}
    </LoadingButton>
  );
}
