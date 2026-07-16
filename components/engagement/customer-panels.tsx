import Link from "next/link";
import { Bell, Gift, Heart, Megaphone, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createReferralInviteAction,
  createReviewAction,
  deleteReviewAction,
  markNotificationReadAction,
  reportReviewAction,
  updateNotificationPreferencesAction,
  voteReviewHelpfulAction,
} from "@/features/engagement/actions";
import type { getEngagementDashboard, getNotificationData, getReferralData, getReviewData, getRewardsData } from "@/features/engagement/data";

type DashboardData = Awaited<ReturnType<typeof getEngagementDashboard>>;
type ReviewData = Awaited<ReturnType<typeof getReviewData>>;
type RewardsData = Awaited<ReturnType<typeof getRewardsData>>;
type ReferralData = Awaited<ReturnType<typeof getReferralData>>;
type NotificationData = Awaited<ReturnType<typeof getNotificationData>>;

const formatDate = (value: Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);

export function EngagementDashboard({ data }: { data: DashboardData }) {
  const cards = [
    { href: "/reviews", label: "Reviews", value: `${data.reviews.length} recent`, icon: Star },
    { href: "/rewards", label: "Sign Rewards", value: `${data.loyalty.pointsBalance} points`, icon: Gift },
    { href: "/referrals", label: "Referrals", value: data.referralProgram.code, icon: Users },
    { href: "/notifications", label: "Notifications", value: `${data.notifications.length} latest`, icon: Bell },
  ] as const;
  return <div className="grid gap-5">
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({ href, label, value, icon: Icon }) => <Link href={href} key={href}><Card className="h-full"><Icon className="h-6 w-6 text-[#c21874]" /><p className="mt-4 text-sm text-[#756871]">{label}</p><p className="mt-1 font-semibold text-[#241820]">{value}</p></Card></Link>)}</section>
    <section className="grid gap-4 lg:grid-cols-2"><Card><Megaphone className="h-5 w-5 text-[#c21874]" /><h2 className="mt-3 text-lg font-semibold">Active offers</h2><div className="mt-4 grid gap-3">{data.promotions.length ? data.promotions.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={item.id}>{item.name}</p>) : <p className="text-sm text-[#756871]">No active promotions right now.</p>}</div></Card><Card><Heart className="h-5 w-5 text-[#c21874]" /><h2 className="mt-3 text-lg font-semibold">Announcements</h2><div className="mt-4 grid gap-3">{data.announcements.length ? data.announcements.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={item.id}>{item.title}</p>) : <p className="text-sm text-[#756871]">No announcements today.</p>}</div></Card></section>
  </div>;
}

export function ReviewCenter({ data }: { data: ReviewData }) {
  return <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><h2 className="text-lg font-semibold">Write a review</h2>{data.products.length ? <form action={createReviewAction} className="mt-4 grid gap-3"><select className="h-11 rounded-2xl border px-4" name="productId" required>{data.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><select className="h-11 rounded-2xl border px-4" name="rating" required>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select><input className="h-11 rounded-2xl border px-4" name="title" placeholder="Short title" /><textarea className="min-h-32 rounded-2xl border p-4" name="content" placeholder="Share fit, fabric, comfort, and styling notes" required /><input className="h-11 rounded-2xl border px-4" name="mediaAssetIds" placeholder="Cloudinary media asset IDs, comma separated" /><Button type="submit">Submit review</Button></form> : <p className="mt-4 text-sm text-[#756871]">Published products will appear here when the catalog is ready.</p>}</Card><div className="grid gap-4"><h2 className="text-xl font-semibold">My reviews</h2>{data.reviews.map((review) => <Card key={review.id}><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{review.product.name}</p><p className="text-sm text-[#756871]">{review.rating}/5 | {review.status} | {formatDate(review.createdAt)}</p></div><form action={deleteReviewAction}><input name="reviewId" type="hidden" value={review.id} /><Button size="md" type="submit" variant="ghost">Delete</Button></form></div><p className="mt-3 text-sm leading-6">{review.content}</p>{review.replies.map((reply) => <p className="mt-3 rounded-2xl bg-[#fff5fa] p-3 text-sm" key={reply.id}>FIT & MATCH: {reply.content}</p>)}</Card>)}<h2 className="pt-4 text-xl font-semibold">Community reviews</h2>{data.publicReviews.map((review) => <Card key={review.id}><p className="font-semibold">{review.product.name}</p><p className="mt-1 text-sm text-[#756871]">{review.user.name} | {review.rating}/5 | {review.helpfulCount} helpful</p><p className="mt-3 text-sm leading-6">{review.content}</p><div className="mt-4 flex flex-wrap gap-2"><form action={voteReviewHelpfulAction}><input name="reviewId" type="hidden" value={review.id} /><Button type="submit" variant="secondary">Helpful</Button></form><form action={reportReviewAction} className="flex gap-2"><input name="reviewId" type="hidden" value={review.id} /><input className="h-11 rounded-2xl border px-4" name="reason" placeholder="Report reason" required /><Button type="submit" variant="ghost">Report</Button></form></div></Card>)}</div></div>;
}

export function RewardsPanel({ data }: { data: RewardsData }) {
  return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card><p className="text-sm text-[#756871]">Available points</p><h2 className="mt-2 text-4xl font-semibold text-[#c21874]">{data.account.pointsBalance}</h2><p className="mt-3 text-sm">Tier: {data.account.tier}</p><div className="mt-5 grid gap-3">{data.account.transactions.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={item.id}>{item.description} | {item.points} points</p>)}</div></Card><Card><h2 className="text-lg font-semibold">Earn more</h2><div className="mt-4 grid gap-3">{data.rules.map((rule) => <p className="rounded-2xl border p-3 text-sm" key={rule.id}>{rule.name}: {rule.points} points</p>)}</div></Card></div>;
}

export function ReferralPanel({ data }: { data: ReferralData }) {
  return <div className="grid gap-5 lg:grid-cols-[360px_1fr]"><Card><h2 className="text-lg font-semibold">Your referral code</h2><p className="mt-3 rounded-2xl bg-[#fff5fa] p-4 text-xl font-semibold text-[#c21874]">{data.code}</p><form action={createReferralInviteAction} className="mt-5 grid gap-3"><input className="h-11 rounded-2xl border px-4" name="referredEmail" placeholder="Friend email" type="email" required /><Button type="submit">Track invite</Button></form></Card><Card><h2 className="text-lg font-semibold">Referral history</h2><div className="mt-4 grid gap-3">{data.referrals.map((item) => <p className="rounded-2xl bg-[#fff5fa] p-4 text-sm" key={item.id}>{item.referredEmail ?? "Customer"} | {item.status}</p>)}</div></Card></div>;
}

export function NotificationCenter({ data }: { data: NotificationData }) {
  const prefs = data.preference;
  const names = ["orderUpdates", "offers", "referrals", "rewards", "reviewReminders", "wishlistReminders", "backInStock", "priceDrops", "emailEnabled", "inAppEnabled"] as const;
  return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><div className="grid gap-3">{data.notifications.map((item) => <Card key={item.id}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-[#756871]">{item.message}</p></div>{item.status === "UNREAD" ? <form action={markNotificationReadAction}><input name="notificationId" type="hidden" value={item.id} /><Button size="md" type="submit" variant="secondary">Read</Button></form> : null}</div></Card>)}</div><Card><h2 className="text-lg font-semibold">Preferences</h2><form action={updateNotificationPreferencesAction} className="mt-4 grid gap-3">{names.map((name) => <label className="flex items-center gap-3 text-sm" key={name}><input defaultChecked={Boolean(prefs[name])} name={name} type="checkbox" />{name.replace(/([A-Z])/g, " $1")}</label>)}<Button type="submit">Save preferences</Button></form></Card></div>;
}
