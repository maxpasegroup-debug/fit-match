import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, status: "healthy", database: "reachable", environment: env.NODE_ENV, latencyMs: Date.now() - started });
  } catch {
    return NextResponse.json({ ok: false, status: "degraded", database: "unreachable", latencyMs: Date.now() - started }, { status: 503 });
  }
}
