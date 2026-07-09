import type { LucideIcon } from "lucide-react";
import { Bell, Heart, PackageCheck, Ruler, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { colorClasses } from "@/lib/design/colors";

export function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="grid place-items-center gap-3 py-10 text-center">
      <Icon className={`h-8 w-8 ${colorClasses.primaryText}`} aria-hidden="true" />
      <h2 className={`text-lg font-semibold ${colorClasses.bodyText}`}>{title}</h2>
      <p className={`max-w-sm text-sm leading-6 ${colorClasses.mutedText}`}>{description}</p>
    </Card>
  );
}

export function NoOrders() {
  return <EmptyState title="No orders yet" description="Your orders will appear here after checkout launches." icon={PackageCheck} />;
}

export function NoWishlist() {
  return <EmptyState title="No wishlist items" description="Saved styles will appear here when catalog features launch." icon={Heart} />;
}

export function NoResults() {
  return <EmptyState title="No results" description="Search results will appear when products are available." icon={Search} />;
}

export function NoSavedMeasurements() {
  return <EmptyState title="No saved measurements" description="Measurement tools are reserved for a later phase." icon={Ruler} />;
}

export function NoNotifications() {
  return <EmptyState title="No notifications" description="Account notifications will appear here." icon={Bell} />;
}
