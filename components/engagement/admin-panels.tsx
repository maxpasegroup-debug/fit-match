import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createAnnouncementAction,
  createPromotionAction,
  createRewardRuleAction,
  moderateReviewAction,
  replyToReviewAction,
} from "@/features/engagement/actions";
import type {
  getAdminCampaignMetrics,
  getAdminEngagementOverview,
  getAdminLoyalty,
  getAdminNotifications,
  getAdminPromotions,
  getAdminReferrals,
  getAdminReviews,
} from "@/features/engagement/data";

type Overview = Awaited<ReturnType<typeof getAdminEngagementOverview>>;
type Reviews = Awaited<ReturnType<typeof getAdminReviews>>;
type Loyalty = Awaited<ReturnType<typeof getAdminLoyalty>>;
type Promotions = Awaited<ReturnType<typeof getAdminPromotions>>;
type Notifications = Awaited<ReturnType<typeof getAdminNotifications>>;
type Referrals = Awaited<ReturnType<typeof getAdminReferrals>>;
type Metrics = Awaited<ReturnType<typeof getAdminCampaignMetrics>>;

const formatDate = (value: Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);

export function AdminEngagementOverview({ data }: { data: Overview }) {
  const cards = [
    ["Pending reviews", data.pendingReviews],
    ["Active promotions", data.activePromotions],
    ["Unread notifications", data.unreadNotifications],
    ["Referral records", data.referrals],
    ["Reward rules", data.rewardRules],
  ] as const;
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([label, value]) => <Card key={label}><p className="text-sm text-[#756871]">{label}</p><p className="mt-2 text-3xl font-semibold text-[#c21874]">{value}</p></Card>)}</section>;
}

export function AdminReviewList({ reviews }: { reviews: Reviews }) {
  return <div className="grid gap-4">{reviews.map((review) => <Card key={review.id}><div className="grid gap-3 lg:grid-cols-[1fr_auto]"><div><p className="font-semibold">{review.product.name}</p><p className="text-sm text-[#756871]">{review.user.name} | {review.rating}/5 | {review.status} | {review.reports.length} reports</p><p className="mt-3 text-sm leading-6">{review.content}</p></div><div className="flex flex-wrap gap-2">{["APPROVE", "HIDE", review.featured ? "UNFEATURE" : "FEATURE"].map((action) => <form action={moderateReviewAction} key={action}><input name="reviewId" type="hidden" value={review.id} /><input name="action" type="hidden" value={action} /><Button size="md" type="submit" variant="secondary">{action}</Button></form>)}</div></div><form action={replyToReviewAction} className="mt-4 flex flex-col gap-2 sm:flex-row"><input name="reviewId" type="hidden" value={review.id} /><input className="h-11 flex-1 rounded-2xl border px-4" name="content" placeholder="Admin reply" required /><Button type="submit">Reply</Button></form></Card>)}</div>;
}

export function AdminLoyaltyPanel({ data }: { data: Loyalty }) {
  return <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><h2 className="text-lg font-semibold">Reward rule</h2><form action={createRewardRuleAction} className="mt-4 grid gap-3"><input className="h-11 rounded-2xl border px-4" name="name" placeholder="Rule name" required /><select className="h-11 rounded-2xl border px-4" name="source"><option value="PURCHASE">Purchase</option><option value="REFERRAL">Referral</option><option value="REVIEW">Review</option><option value="BIRTHDAY">Birthday</option><option value="MILESTONE">Milestone</option></select><input className="h-11 rounded-2xl border px-4" min="1" name="points" placeholder="Points" type="number" required /><label className="flex items-center gap-2 text-sm"><input defaultChecked name="active" type="checkbox" />Active</label><Button type="submit">Create rule</Button></form></Card><div className="grid gap-4"><Card><h2 className="text-lg font-semibold">Reward rules</h2><div className="mt-4 grid gap-3">{data.rules.map((rule) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={rule.id}>{rule.name} | {rule.source} | {rule.points} points</p>)}</div></Card><Card><h2 className="text-lg font-semibold">Loyalty accounts</h2><div className="mt-4 grid gap-3">{data.accounts.map((account) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={account.id}>{account.user.name} | {account.pointsBalance} points | {account.tier}</p>)}</div></Card></div></div>;
}

export function AdminPromotionPanel({ data }: { data: Promotions }) {
  return <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><h2 className="text-lg font-semibold">Create promotion</h2><form action={createPromotionAction} className="mt-4 grid gap-3"><input className="h-11 rounded-2xl border px-4" name="name" placeholder="Name" required /><input className="h-11 rounded-2xl border px-4" name="slug" placeholder="festival-silk-sale" required /><select className="h-11 rounded-2xl border px-4" name="type"><option value="FLASH_SALE">Flash sale</option><option value="FESTIVAL_SALE">Festival sale</option><option value="CATEGORY_DISCOUNT">Category discount</option><option value="COLLECTION_DISCOUNT">Collection discount</option><option value="BOGO">BOGO preparation</option><option value="FREE_SHIPPING">Free shipping</option><option value="MEMBER_EXCLUSIVE">Member exclusive</option></select><select className="h-11 rounded-2xl border px-4" name="status"><option value="DRAFT">Draft</option><option value="SCHEDULED">Scheduled</option><option value="ACTIVE">Active</option><option value="PAUSED">Paused</option></select><input className="h-11 rounded-2xl border px-4" name="discountValue" placeholder="Discount value" type="number" /><textarea className="min-h-28 rounded-2xl border p-4" name="description" placeholder="Promotion details" /><Button type="submit">Save promotion</Button></form></Card><div className="grid gap-4">{data.promotions.map((promotion) => <Card key={promotion.id}><p className="font-semibold">{promotion.name}</p><p className="mt-1 text-sm text-[#756871]">{promotion.type} | {promotion.status} | {promotion.banners.length} banners</p></Card>)}</div></div>;
}

export function AdminAnnouncementPanel({ notifications }: { notifications: Notifications }) {
  return <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><h2 className="text-lg font-semibold">Publish announcement</h2><form action={createAnnouncementAction} className="mt-4 grid gap-3"><input className="h-11 rounded-2xl border px-4" name="title" placeholder="Title" required /><textarea className="min-h-28 rounded-2xl border p-4" name="message" placeholder="Message" required /><input className="h-11 rounded-2xl border px-4" name="href" placeholder="/collections/festival" /><select className="h-11 rounded-2xl border px-4" name="placement"><option value="HOMEPAGE">Homepage</option><option value="IN_APP">In app</option><option value="FESTIVAL">Festival</option></select><label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" />Published</label><Button type="submit">Publish</Button></form></Card><Card><h2 className="text-lg font-semibold">Recent notifications</h2><div className="mt-4 grid gap-3">{notifications.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={item.id}>{item.user.name} | {item.type} | {item.status}</p>)}</div></Card></div>;
}

export function AdminReferralPanel({ programs }: { programs: Referrals }) {
  return <div className="grid gap-4">{programs.map((program) => <Card key={program.id}><p className="font-semibold">{program.user.name}</p><p className="mt-1 text-sm text-[#756871]">{program.code} | {program.invites} invites | {program.successfulReferrals} successful</p><div className="mt-3 grid gap-2">{program.referrals.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-3 text-sm" key={item.id}>{item.referredEmail ?? "Joined customer"} | {item.status}</p>)}</div></Card>)}</div>;
}

export function AdminCampaignMetrics({ metrics }: { metrics: Metrics }) {
  return <div className="grid gap-4">{metrics.length ? metrics.map((metric) => <Card key={metric.id}><p className="font-semibold">{metric.metricType}</p><p className="mt-1 text-sm text-[#756871]">Value {metric.value.toString()} | {formatDate(metric.recordedAt)}</p></Card>) : <Card><p className="text-sm text-[#756871]">Campaign analytics storage is ready. Metrics will populate as campaigns run.</p></Card>}</div>;
}
