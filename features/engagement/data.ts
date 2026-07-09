import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db/prisma";
import { requireUserId } from "@/features/profile/data";

function referralCode(userId: string) {
  return `SILK-${userId.slice(-8).toUpperCase()}`;
}

export async function ensureLoyaltyAccount(userId: string) {
  return prisma.loyaltyAccount.upsert({
    where: { userId },
    create: { userId, referralCode: referralCode(userId) },
    update: {},
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
}

export async function ensureReferralProgram(userId: string) {
  return prisma.referralProgram.upsert({
    where: { userId },
    create: { userId, code: referralCode(userId) },
    update: {},
    include: { referrals: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
}

export async function getEngagementDashboard() {
  const userId = await requireUserId();
  const [loyalty, referralProgram, notifications, reviews, promotions, announcements] = await Promise.all([
    ensureLoyaltyAccount(userId),
    ensureReferralProgram(userId),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.review.findMany({
      where: { userId, deletedAt: null },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.promotion.findMany({ where: { status: "ACTIVE" }, orderBy: { updatedAt: "desc" }, take: 4 }),
    prisma.announcement.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 3 }),
  ]);
  return { loyalty, referralProgram, notifications, reviews, promotions, announcements };
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, status: "UNREAD" } });
}

export async function getReviewData() {
  const userId = await requireUserId();
  const [reviews, products, publicReviews] = await Promise.all([
    prisma.review.findMany({
      where: { userId, deletedAt: null },
      include: { product: { select: { name: true, slug: true } }, images: { include: { mediaAsset: true } }, replies: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({ where: { published: true, deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 100 }),
    prisma.review.findMany({
      where: { userId: { not: userId }, status: "APPROVED", deletedAt: null },
      include: { product: { select: { name: true, slug: true } }, user: { select: { name: true } } },
      orderBy: [{ featured: "desc" }, { helpfulCount: "desc" }, { createdAt: "desc" }],
      take: 20,
    }),
  ]);
  return { reviews, products, publicReviews };
}

export async function getRewardsData() {
  const userId = await requireUserId();
  const [account, rules] = await Promise.all([
    ensureLoyaltyAccount(userId),
    prisma.rewardRule.findMany({ where: { active: true }, orderBy: { points: "desc" }, take: 20 }),
  ]);
  return { account, rules };
}

export async function getReferralData() {
  const userId = await requireUserId();
  return ensureReferralProgram(userId);
}

export async function getNotificationData() {
  const userId = await requireUserId();
  const [notifications, preference] = await Promise.all([
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.notificationPreference.upsert({ where: { userId }, create: { userId }, update: {} }),
  ]);
  return { notifications, preference };
}

export async function getAdminEngagementOverview() {
  await requireAdmin();
  const [pendingReviews, activePromotions, unreadNotifications, referrals, rewardRules] = await Promise.all([
    prisma.review.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.promotion.count({ where: { status: "ACTIVE" } }),
    prisma.notification.count({ where: { status: "UNREAD" } }),
    prisma.referral.count(),
    prisma.rewardRule.count({ where: { active: true } }),
  ]);
  return { pendingReviews, activePromotions, unreadNotifications, referrals, rewardRules };
}

export async function getAdminReviews() {
  await requireAdmin();
  return prisma.review.findMany({
    where: { deletedAt: null },
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true } }, reports: true, replies: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminLoyalty() {
  await requireAdmin();
  const [accounts, rules] = await Promise.all([
    prisma.loyaltyAccount.findMany({ include: { user: { select: { name: true, email: true } } }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.rewardRule.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return { accounts, rules };
}

export async function getAdminPromotions() {
  await requireAdmin();
  const [promotions, campaigns, announcements] = await Promise.all([
    prisma.promotion.findMany({ include: { banners: true }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.couponCampaign.findMany({ orderBy: { updatedAt: "desc" }, take: 50 }),
    prisma.announcement.findMany({ orderBy: { updatedAt: "desc" }, take: 50 }),
  ]);
  return { promotions, campaigns, announcements };
}

export async function getAdminNotifications() {
  await requireAdmin();
  return prisma.notification.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAdminReferrals() {
  await requireAdmin();
  return prisma.referralProgram.findMany({
    include: {
      user: { select: { name: true, email: true } },
      referrals: { orderBy: { createdAt: "desc" }, take: 10 },
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

export async function getAdminCampaignMetrics() {
  await requireAdmin();
  return prisma.campaignMetric.findMany({ orderBy: { recordedAt: "desc" }, take: 100 });
}
