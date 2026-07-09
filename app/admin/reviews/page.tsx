import { AdminShell } from "@/components/admin/admin-shell";
import { AdminReviewList } from "@/components/engagement/admin-panels";
import { getAdminReviews } from "@/features/engagement/data";

export const metadata = { title: "Review Moderation" };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();
  return <AdminShell title="Review Moderation"><AdminReviewList reviews={reviews} /></AdminShell>;
}
