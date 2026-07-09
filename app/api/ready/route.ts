import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/config/env";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      ready: true,
      checks: {
        database: true,
        appUrl: Boolean(env.APP_URL),
        authSecret: env.AUTH_SECRET.length >= 32,
        email: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM),
        cloudinary: Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY),
        payments: Boolean(env.RAZORPAY_KEY_ID && env.NEXT_PUBLIC_RAZORPAY_KEY_ID),
      },
    });
  } catch {
    return NextResponse.json({ ok: false, ready: false, checks: { database: false } }, { status: 503 });
  }
}
