"use client";

import { useState, useTransition } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatAction } from "@/features/ai/actions";

type Message = { id: string; role: "USER" | "ASSISTANT"; content: string };

export function StylistChat({ initialConversationId, initialMessages }: { initialConversationId?: string; initialMessages: Message[] }) {
  const [conversationId, setConversationId] = useState(initialConversationId);
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState(["What should I wear today?", "Wedding suggestions", "Office suggestions", "Color suggestions"]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function send(content: string) {
    const clean = content.trim();
    if (!clean || pending) return;
    const optimistic = { id: crypto.randomUUID(), role: "USER" as const, content: clean };
    setMessages((current) => [...current, optimistic]);
    setMessage(""); setError("");
    startTransition(async () => {
      try {
        const result = await chatAction({ conversationId, message: clean });
        setConversationId(result.conversationId);
        setMessages((current) => [...current, { id: result.message.id, role: "ASSISTANT", content: result.message.content }]);
        setSuggestions(result.suggestions);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "The stylist could not respond.");
      }
    });
  }

  return (
    <div className="grid min-h-[620px] grid-rows-[1fr_auto] overflow-hidden rounded-3xl border border-[#eadde6] bg-white shadow-sm">
      <div aria-live="polite" className="grid content-start gap-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="mx-auto grid max-w-md justify-items-center gap-3 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fde8f3] text-[#c21874]"><Sparkles className="h-6 w-6" /></span>
            <h2 className="text-xl font-semibold text-[#241820]">How can I style you today?</h2>
            <p className="text-sm leading-6 text-[#756871]">Ask about occasions, colors, fabrics, budgets, or matching accessories.</p>
          </div>
        ) : messages.map((item) => (
          <div className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 ${item.role === "USER" ? "ml-auto bg-[#c21874] text-white" : "bg-[#fff5fa] text-[#3a2c34]"}`} key={item.id}>
            {item.content}
          </div>
        ))}
        {pending ? <p className="text-sm text-[#756871]">Stylist is thinking...</p> : null}
        {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
      </div>
      <div className="border-t border-[#eadde6] p-3 sm:p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((suggestion) => <button className="shrink-0 rounded-full border border-[#eadde6] px-3 py-2 text-xs font-semibold text-[#9f125d]" key={suggestion} onClick={() => send(suggestion)} type="button">{suggestion}</button>)}
        </div>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); send(message); }}>
          <label className="sr-only" htmlFor="stylist-message">Message your stylist</label>
          <input className="h-12 min-w-0 flex-1 rounded-full border border-[#eadde6] px-4 outline-none focus:border-[#c21874] focus:ring-2 focus:ring-[#f4bdd8]" id="stylist-message" maxLength={1500} onChange={(event) => setMessage(event.target.value)} placeholder="Ask your stylist..." value={message} />
          <Button aria-label="Send message" disabled={pending || !message.trim()} size="icon" type="submit"><Send className="h-5 w-5" /></Button>
        </form>
      </div>
    </div>
  );
}
