"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center px-4 text-center">
          <div className="grid max-w-md gap-4">
            <p className="text-sm font-bold tracking-[0.2em] text-[#c21874]">SIGN SILKS</p>
            <h1 className="text-3xl font-semibold text-[#241820]">Something went wrong</h1>
            <p className="text-sm leading-6 text-[#756871]">Please try again.</p>
            <Button onClick={reset}>Retry</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
