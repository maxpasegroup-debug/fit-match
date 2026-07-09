import { NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/lib/analytics/server";

const analyticsSchema = z.object({
  event: z.enum(["page_view", "product_view", "search", "wishlist", "cart", "checkout", "order", "fit_recommendation", "ai_usage"]),
  payload: z.object({
    path: z.string().optional(),
    productId: z.string().optional(),
    query: z.string().optional(),
    value: z.number().optional(),
    metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
  }),
});

export async function POST(request: Request) {
  const parsed = analyticsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  await trackServerEvent(parsed.data.event, parsed.data.payload);
  return NextResponse.json({ ok: true });
}
