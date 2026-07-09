import { AdminShell } from "@/components/admin/admin-shell";
import { AdminAnnouncementPanel } from "@/components/engagement/admin-panels";
import { getAdminNotifications } from "@/features/engagement/data";

export const metadata = { title: "Notifications Admin" };
export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const notifications = await getAdminNotifications();
  return <AdminShell title="Notifications"><AdminAnnouncementPanel notifications={notifications} /></AdminShell>;
}
