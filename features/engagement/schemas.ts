import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().min(1),
  orderId: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  content: z.string().trim().min(20).max(2000),
  mediaAssetIds: z.string().trim().optional(),
});

export const reviewReportSchema = z.object({
  reviewId: z.string().min(1),
  reason: z.string().trim().min(3).max(120),
  details: z.string().trim().max(500).optional(),
});

export const referralInviteSchema = z.object({
  referredEmail: z.string().trim().email(),
});

export const notificationPreferenceSchema = z.object({
  orderUpdates: z.boolean(),
  offers: z.boolean(),
  referrals: z.boolean(),
  rewards: z.boolean(),
  reviewReminders: z.boolean(),
  wishlistReminders: z.boolean(),
  backInStock: z.boolean(),
  priceDrops: z.boolean(),
  emailEnabled: z.boolean(),
  inAppEnabled: z.boolean(),
});

export const adminReviewActionSchema = z.object({
  reviewId: z.string().min(1),
  action: z.enum(["APPROVE", "HIDE", "FEATURE", "UNFEATURE"]),
});

export const reviewReplySchema = z.object({
  reviewId: z.string().min(1),
  content: z.string().trim().min(3).max(1000),
});

export const promotionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/),
  type: z.enum(["FLASH_SALE", "FESTIVAL_SALE", "CATEGORY_DISCOUNT", "COLLECTION_DISCOUNT", "BOGO", "FREE_SHIPPING", "MEMBER_EXCLUSIVE"]),
  status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "ENDED", "ARCHIVED"]),
  description: z.string().trim().max(1000).optional(),
  discountValue: z.coerce.number().min(0).optional(),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(2).max(140),
  message: z.string().trim().min(5).max(500),
  href: z.string().trim().max(240).optional(),
  placement: z.enum(["HOMEPAGE", "IN_APP", "FESTIVAL"]),
  published: z.boolean(),
});

export const rewardRuleSchema = z.object({
  name: z.string().trim().min(2).max(120),
  source: z.enum(["PURCHASE", "REFERRAL", "REVIEW", "BIRTHDAY", "MILESTONE", "ADMIN", "PROMOTION"]),
  points: z.coerce.number().int().min(1).max(100000),
  active: z.boolean(),
});
