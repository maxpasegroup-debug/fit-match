import { requireAdmin } from "@/lib/admin/auth";
import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";

export async function getSystemHealthData() {
  await requireAdmin();
  const started = Date.now();
  const [mediaAssets, mediaBytes, users, products, orders, notifications] = await Promise.all([
    prisma.mediaAsset.count({ where: { deletedAt: null } }),
    prisma.mediaAsset.aggregate({ where: { deletedAt: null }, _sum: { fileSize: true } }),
    prisma.user.count(),
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.order.count(),
    prisma.notification.count(),
  ]);
  await prisma.$queryRaw`SELECT 1`;
  return {
    version: "1.0.0",
    environment: env.NODE_ENV,
    appUrl: env.APP_URL,
    databaseLatencyMs: Date.now() - started,
    queues: "Provider not connected",
    mediaAssets,
    mediaBytes: mediaBytes._sum.fileSize ?? 0,
    users,
    products,
    orders,
    notifications,
    checks: {
      sentry: Boolean(env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN),
      email: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM),
      cloudinary: Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY),
      razorpay: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
    },
  };
}
