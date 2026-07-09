import { cn } from "@/lib/utils/cn";
import { radius } from "@/lib/design/radius";

export function StatusMessage({
  message,
  tone = "neutral",
}: {
  message?: string;
  tone?: "neutral" | "success" | "error";
}) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={cn(
        "px-4 py-3 text-sm font-medium",
        radius.control,
        tone === "success" && "bg-emerald-50 text-emerald-700",
        tone === "error" && "bg-red-50 text-red-700",
        tone === "neutral" && "bg-[#fff5fa] text-[#7b2755]",
      )}
    >
      {message}
    </p>
  );
}
