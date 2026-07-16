"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PWAManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
        });
      });
    }).catch(() => undefined);

    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  if (!installEvent && !updateReady) return null;

  return <div className="fixed inset-x-3 bottom-24 z-50 rounded-3xl border border-[#eadde6] bg-white p-4 shadow-xl md:bottom-5 md:left-auto md:right-5 md:max-w-sm"><p className="text-sm font-semibold text-[#241820]">{updateReady ? "A fresh version is ready" : "Install FIT & MATCH"}</p><p className="mt-1 text-xs leading-5 text-[#756871]">{updateReady ? "Reload to use the latest production build." : "Add FIT & MATCH to your home screen for quick access."}</p><div className="mt-3 flex gap-2">{updateReady ? <Button onClick={() => window.location.reload()} type="button">Reload</Button> : <Button onClick={install} type="button">Install</Button>}<Button onClick={() => { setInstallEvent(null); setUpdateReady(false); }} type="button" variant="ghost">Later</Button></div></div>;
}
