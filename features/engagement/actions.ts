"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { requireUserId } from "@/features/profile/data";
import {
  adminReviewActionSchema,
  announcementSchema,
  notificationPreferenceSchema,
  promotionSchema,
  referralInviteSchema,
  reviewReplySchema,
  reviewReportSchema,
  reviewSchema,
  rewardRuleSchema,
} from "@/features/engagement/schemas";
import { ensureLoyaltyAccount, ensureReferralProgram } from "@/features/engagement/data";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function enabled(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function mediaIds(value?: string) {
  return Array.from(new Set((value ?? "").split(",").map((item) => item.trim()).filter(Boolean))).slice(0, 5);
}

export async function createReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = reviewSchema.parse({
    productId: field(formData, "productId"),
    orderId: field(formData, "orderId") || undefined,
    rating: field(formData, "rating"),
    title: field(formData, "title") || undefined,
    content: field(formData, "content"),
    mediaAssetIds: field(formData, "mediaAssetIds") || undefined,
  });
  await prisma.product.findFirstOrThrow({ where: { id: parsed.productId, published: true, deletedAt: null }, select: { id: true } });
  if (parsed.orderId) {
    await prisma.order.findFirstOrThrow({ where: { id: parsed.orderId, userId }, select: { id: true } });
  }
  const existing = await prisma.review.findFirst({ where: { userId, productId: parsed.productId, orderId: parsed.orderId ?? null, deletedAt: null } });
  const review = existing
    ? await prisma.review.update({
      where: { id: existing.id },
      data: { rating: parsed.rating, title: parsed.title, content: parsed.content, status: "PENDING", updatedAt: new Date() },
    })
    : await prisma.review.create({
      data: { userId, productId: parsed.productId, orderId: parsed.orderId, rating: parsed.rating, title: parsed.title, content: parsed.content },
    });
  const ids = mediaIds(parsed.mediaAssetIds);
  if (ids.length) {
    await prisma.reviewImage.deleteMany({ where: { reviewId: review.id } });
    await prisma.reviewImage.createMany({ data: ids.map((mediaAssetId, index) => ({ reviewId: review.id, mediaAssetId, displayOrder: index })) });
  }
  const rewarded = await prisma.loyaltyTransaction.findFirst({ where: { userId, source: "REVIEW", referenceType: "Review", referenceId: review.id } });
  if (!rewarded) {
    const account = await ensureLoyaltyAccount(userId);
    const rewardPoints = 25;
    await prisma.$transaction([
      prisma.loyaltyTransaction.create({
        data: {
          accountId: account.id,
          userId,
          type: "EARN",
          source: "REVIEW",
          points: rewardPoints,
          balanceAfter: account.pointsBalance + rewardPoints,
          description: "Review bonus",
          referenceType: "Review",
          referenceId: review.id,
        },
      }),
      prisma.loyaltyAccount.update({
        where: { id: account.id },
        data: { pointsBalance: { increment: rewardPoints }, lifetimeEarned: { increment: rewardPoints } },
      }),
    ]);
  }
  revalidatePath("/reviews");
  revalidatePath("/rewards");
}

export async function deleteReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const reviewId = field(formData, "reviewId");
  await prisma.review.updateMany({ where: { id: reviewId, userId }, data: { deletedAt: new Date() } });
  revalidatePath("/reviews");
}

export async function voteReviewHelpfulAction(formData: FormData) {
  const userId = await requireUserId();
  const reviewId = field(formData, "reviewId");
  await prisma.review.findFirstOrThrow({ where: { id: reviewId, userId: { not: userId }, status: "APPROVED", deletedAt: null }, select: { id: true } });
  const existing = await prisma.reviewVote.findUnique({ where: { reviewId_userId: { reviewId, userId } } });
  if (existing) return;
  await prisma.$transaction([
    prisma.reviewVote.create({ data: { reviewId, userId, type: "HELPFUL" } }),
    prisma.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } }),
  ]);
  revalidatePath("/reviews");
}

export async function reportReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = reviewReportSchema.parse({ reviewId: field(formData, "reviewId"), reason: field(formData, "reason"), details: field(formData, "details") || undefined });
  await prisma.review.findFirstOrThrow({ where: { id: parsed.reviewId, userId: { not: userId }, deletedAt: null }, select: { id: true } });
  const existing = await prisma.reviewReport.findUnique({ where: { reviewId_userId: { reviewId: parsed.reviewId, userId } } });
  await prisma.reviewReport.upsert({
    where: { reviewId_userId: { reviewId: parsed.reviewId, userId } },
    create: { reviewId: parsed.reviewId, userId, reason: parsed.reason, details: parsed.details },
    update: { reason: parsed.reason, details: parsed.details, status: "PENDING" },
  });
  await prisma.review.update({
    where: { id: parsed.reviewId },
    data: existing ? { status: "REPORTED" } : { reportCount: { increment: 1 }, status: "REPORTED" },
  });
  revalidatePath("/reviews");
}

export async function createReferralInviteAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = referralInviteSchema.parse({ referredEmail: field(formData, "referredEmail") });
  const program = await ensureReferralProgram(userId);
  await prisma.$transaction([
    prisma.referral.create({ data: { programId: program.id, referrerId: userId, referredEmail: parsed.referredEmail } }),
    prisma.referralProgram.update({ where: { id: program.id }, data: { invites: { increment: 1 } } }),
  ]);
  revalidatePath("/referrals");
}

export async function updateNotificationPreferencesAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = notificationPreferenceSchema.parse({
    orderUpdates: enabled(formData, "orderUpdates"),
    offers: enabled(formData, "offers"),
    referrals: enabled(formData, "referrals"),
    rewards: enabled(formData, "rewards"),
    reviewReminders: enabled(formData, "reviewReminders"),
    wishlistReminders: enabled(formData, "wishlistReminders"),
    backInStock: enabled(formData, "backInStock"),
    priceDrops: enabled(formData, "priceDrops"),
    emailEnabled: enabled(formData, "emailEnabled"),
    inAppEnabled: enabled(formData, "inAppEnabled"),
  });
  await prisma.notificationPreference.upsert({ where: { userId }, create: { userId, ...parsed }, update: parsed });
  revalidatePath("/notifications");
}

export async function markNotificationReadAction(formData: FormData) {
  const userId = await requireUserId();
  await prisma.notification.updateMany({
    where: { id: field(formData, "notificationId"), userId },
    data: { status: "READ", readAt: new Date() },
  });
  revalidatePath("/notifications");
}

export async function moderateReviewAction(formData: FormData) {
  await requireAdmin();
  const parsed = adminReviewActionSchema.parse({ reviewId: field(formData, "reviewId"), action: field(formData, "action") });
  const data = parsed.action === "APPROVE"
    ? { status: "APPROVED" as const, approvedAt: new Date(), hiddenAt: null }
    : parsed.action === "HIDE"
      ? { status: "HIDDEN" as const, hiddenAt: new Date() }
      : parsed.action === "FEATURE"
        ? { featured: true }
        : { featured: false };
  await prisma.review.update({ where: { id: parsed.reviewId }, data });
  revalidatePath("/admin/reviews");
}

export async function replyToReviewAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = reviewReplySchema.parse({ reviewId: field(formData, "reviewId"), content: field(formData, "content") });
  await prisma.reviewReply.create({ data: { reviewId: parsed.reviewId, adminId: admin.id, content: parsed.content } });
  revalidatePath("/admin/reviews");
}

export async function createPromotionAction(formData: FormData) {
  await requireAdmin();
  const parsed = promotionSchema.parse({
    name: field(formData, "name"),
    slug: field(formData, "slug"),
    type: field(formData, "type"),
    status: field(formData, "status"),
    description: field(formData, "description") || undefined,
    discountValue: field(formData, "discountValue") || undefined,
  });
  await prisma.promotion.upsert({
    where: { slug: parsed.slug },
    create: parsed,
    update: parsed,
  });
  revalidatePath("/admin/promotions");
  revalidatePath("/admin/campaigns");
}

export async function createAnnouncementAction(formData: FormData) {
  await requireAdmin();
  const parsed = announcementSchema.parse({
    title: field(formData, "title"),
    message: field(formData, "message"),
    href: field(formData, "href") || undefined,
    placement: field(formData, "placement"),
    published: enabled(formData, "published"),
  });
  await prisma.announcement.create({ data: parsed });
  revalidatePath("/admin/notifications");
}

export async function createRewardRuleAction(formData: FormData) {
  await requireAdmin();
  const parsed = rewardRuleSchema.parse({
    name: field(formData, "name"),
    source: field(formData, "source"),
    points: field(formData, "points"),
    active: enabled(formData, "active"),
  });
  await prisma.rewardRule.create({ data: parsed });
  revalidatePath("/admin/loyalty");
}
