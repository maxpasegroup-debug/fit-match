import Link from "next/link";
import {
  BadgeIndianRupee,
  BarChart3,
  Brain,
  Brush,
  Camera,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Headphones,
  Home,
  ImageIcon,
  Megaphone,
  PackageCheck,
  Palette,
  Repeat2,
  Ruler,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type AdminDashboardData = {
  products: number;
  published: number;
  lowStock: number;
  suppliers: number;
};

const executiveKpis = [
  { title: "Today's Orders", value: "148", delta: "+18%", icon: PackageCheck },
  { title: "Revenue", value: "₹12.8L", delta: "+24%", icon: BadgeIndianRupee },
  { title: "Pending Stitching", value: "36", delta: "8 urgent", icon: Scissors },
  { title: "In Production", value: "72", delta: "+11", icon: ClipboardCheck },
  { title: "Ready for Dispatch", value: "28", delta: "Today", icon: Truck },
  { title: "Delivered", value: "312", delta: "+9%", icon: ShieldCheck },
  { title: "Returns", value: "4", delta: "-2%", icon: Repeat2 },
  { title: "Active Customers", value: "18.4K", delta: "+31%", icon: Users },
  { title: "Average Order Value", value: "₹4,280", delta: "+12%", icon: CircleDollarSign },
  { title: "FIT Match Usage", value: "71%", delta: "+16%", icon: Ruler },
] as const;

const businessInsights = [
  ["Top Selling Category", "Designer Kurtis", "2,184 orders"],
  ["Top Colour", "Rose Pink", "31% selection"],
  ["Top Fabric", "Silk Blend", "Premium conversion"],
  ["Top Collection", "Wedding Edit", "₹28.4L revenue"],
  ["Top Occasion", "Festival", "43% traffic"],
  ["Most Used Measurement", "Custom Fit M", "1,804 profiles"],
  ["Most Viewed Product", "Rose Silk Kurti", "42K views"],
  ["Highest Rated Product", "Pearl Office Set", "4.9 rating"],
] as const;

const pipelineColumns = [
  { title: "Order Received", cards: [["Ananya", "Rose Silk Kurti", "Today", "High"], ["Meera", "Office Saree", "Today", "Normal"]] },
  { title: "Measurement Verified", cards: [["Nisha", "Anarkali Set", "Tomorrow", "High"]] },
  { title: "Fabric Allocated", cards: [["Diya", "Cotton Co-ord", "Jul 12", "Normal"], ["Asha", "Temple Set", "Jul 12", "Low"]] },
  { title: "Cutting", cards: [["Riya", "Wedding Lehenga", "Jul 13", "High"]] },
  { title: "Stitching", cards: [["Kavya", "Festival Dress", "Jul 14", "High"], ["Mira", "Daily Kurti", "Jul 14", "Normal"]] },
  { title: "Quality Check", cards: [["Sara", "Party Gown", "Today", "High"]] },
  { title: "Packing", cards: [["Pooja", "Silk Saree", "Today", "Normal"]] },
  { title: "Ready for Dispatch", cards: [["Isha", "Office Set", "Today", "High"]] },
  { title: "Delivered", cards: [["Neha", "Travel Dress", "Done", "Normal"]] },
] as const;

const workspaces = [
  { title: "Designer Studio", href: "/admin/products", icon: Brush, text: "Create edits, style stories, and product looks." },
  { title: "Tailor Workspace", href: "/admin/orders", icon: Scissors, text: "Track assignments, stages, and quality checks." },
  { title: "Marketing Studio", href: "/admin/campaigns", icon: Megaphone, text: "Plan campaigns, offers, banners, and reminders." },
  { title: "Warehouse", href: "/admin/warehouses", icon: Warehouse, text: "Inventory, dispatch batches, and stock alerts." },
  { title: "Customer Care", href: "/admin/notifications", icon: Headphones, text: "Notifications, customer messages, and service cues." },
  { title: "Finance", href: "/admin/promotions", icon: BadgeIndianRupee, text: "Coupons, promotions, revenue, and settlements." },
  { title: "AI Control Centre", href: "/admin/ai", icon: Brain, text: "AI settings, prompts, and usage governance." },
  { title: "Media Library", href: "/admin/media", icon: ImageIcon, text: "DAM assets, folders, and campaign visuals." },
  { title: "Homepage Builder", href: "/admin/homepage", icon: Home, text: "Control the premium customer experience." },
] as const;

const marketingStudio = [
  { title: "Homepage", status: "Luxury hero live", icon: Home },
  { title: "Collections", status: "7 campaigns active", icon: Store },
  { title: "Offers", status: "Festival sale draft", icon: Sparkles },
  { title: "Banners", status: "5 scheduled", icon: ImageIcon },
  { title: "Notifications", status: "12.8% open rate", icon: Send },
  { title: "Seasonal Campaigns", status: "Wedding edit ready", icon: CalendarIcon },
  { title: "Lookbooks", status: "3 editorial stories", icon: Camera },
] as const;

const charts = [
  { title: "Revenue", values: [46, 62, 58, 74, 88, 81, 96], icon: BadgeIndianRupee },
  { title: "Orders", values: [38, 44, 49, 61, 72, 69, 84], icon: PackageCheck },
  { title: "Category Performance", values: [72, 48, 66, 58, 91, 76, 62], icon: BarChart3 },
  { title: "Collection Performance", values: [42, 64, 71, 55, 88, 79, 94], icon: Palette },
  { title: "Customer Growth", values: [28, 36, 44, 59, 63, 78, 86], icon: Users },
  { title: "FIT Match Usage", values: [35, 52, 57, 66, 71, 79, 91], icon: Ruler },
  { title: "AI Usage", values: [18, 26, 39, 52, 61, 68, 74], icon: Brain },
  { title: "Conversion Funnel", values: [96, 72, 58, 44, 31, 24, 18], icon: ChartNoAxesCombined },
] as const;

export function ExecutiveDashboard({ data }: { data: AdminDashboardData }) {
  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#241820] via-[#6f1748] to-[#c21874] p-6 text-white shadow-[0_28px_90px_rgba(112,36,73,0.22)] lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/58">Fashion Business Operating System</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Executive command centre for FIT & MATCH.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
              A premium view for founders, designers, tailors, warehouse teams, marketers, and management to understand the business at a glance.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <HeroStat title="Products" value={data.products.toString()} />
            <HeroStat title="Published" value={data.published.toString()} />
            <HeroStat title="Low Stock" value={data.lowStock.toString()} />
            <HeroStat title="Suppliers" value={data.suppliers.toString()} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {executiveKpis.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </section>

      <SectionHeader title="Business Insights" subtitle="Demo intelligence for category, colour, fabric, collection, occasion, and FIT Match decisions." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessInsights.map(([title, value, detail]) => (
          <Card key={title} className="bg-white/90 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c21874]">{title}</p>
            <p className="mt-3 text-2xl font-semibold text-[#241820]">{value}</p>
            <p className="mt-2 text-sm text-[#756871]">{detail}</p>
          </Card>
        ))}
      </section>

      <SectionHeader title="Production Pipeline" subtitle="Kanban-style workflow from order received to delivery." />
      <section className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {pipelineColumns.map((column) => (
          <div key={column.title} className="min-w-[280px] snap-start rounded-[1.75rem] border border-[#eadde6] bg-[#fffafd] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[#241820]">{column.title}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#c21874]">{column.cards.length}</span>
            </div>
            <div className="mt-4 grid gap-3">
              {column.cards.map(([customer, design, dueDate, priority]) => (
                <div key={`${customer}-${design}`} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#241820]">{customer}</p>
                      <p className="mt-1 text-sm text-[#756871]">{design}</p>
                    </div>
                    <span className={priority === "High" ? "rounded-full bg-[#fde8f3] px-2 py-1 text-xs font-semibold text-[#9f125d]" : "rounded-full bg-[#f7f0ea] px-2 py-1 text-xs font-semibold text-[#6d5b52]"}>
                      {priority}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#c21874]">Due {dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <SectionHeader title="Workspaces" subtitle="Fast entry points for every operating team." />
      <section className="grid gap-4 md:grid-cols-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.title} {...workspace} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader title="Marketing Studio" subtitle="Campaign manager view for homepage, collections, offers, notifications, and lookbooks." />
          <div className="grid gap-3">
            {marketingStudio.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff5fa] text-[#c21874]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#241820]">{item.title}</p>
                      <p className="text-sm text-[#756871]">{item.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#c21874]" />
                </Card>
              );
            })}
          </div>
        </div>
        <div>
          <SectionHeader title="Analytics" subtitle="Mock executive charts for performance, growth, AI, and conversion health." />
          <div className="grid gap-4 md:grid-cols-2">
            {charts.map((chart) => (
              <ChartCard key={chart.title} {...chart} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/14 bg-white/12 p-4 backdrop-blur">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-white/62">{title}</p>
    </div>
  );
}

function KpiCard({ title, value, delta, icon: Icon }: { title: string; value: string; delta: string; icon: LucideIcon }) {
  return (
    <Card className="bg-white/92 p-5">
      <div className="flex items-start justify-between gap-3">
        <Icon className="h-6 w-6 text-[#c21874]" />
        <span className="rounded-full bg-[#fff5fa] px-2 py-1 text-xs font-semibold text-[#c21874]">{delta}</span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-[#241820]">{value}</p>
      <p className="mt-1 text-sm text-[#756871]">{title}</p>
    </Card>
  );
}

function WorkspaceCard({ title, href, icon: Icon, text }: { title: string; href: string; icon: LucideIcon; text: string }) {
  return (
    <Link href={href} className="group rounded-[1.75rem] border border-[#eadde6] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(112,36,73,0.1)]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff5fa] text-[#c21874]">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-xl font-semibold text-[#241820]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#756871]">{text}</p>
      <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#c21874]">
        Open workspace
        <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ChartCard({ title, values, icon: Icon }: { title: string; values: readonly number[]; icon: LucideIcon }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-[#241820]">{title}</p>
          <p className="text-sm text-[#756871]">Last 7 days</p>
        </div>
        <Icon className="h-5 w-5 text-[#c21874]" />
      </div>
      <div className="mt-5 flex h-28 items-end gap-2">
        {values.map((value, index) => (
          <span
            key={`${title}-${index}`}
            className="flex-1 rounded-t-2xl bg-gradient-to-t from-[#c21874] to-[#f2aacd]"
            style={{ height: `${Math.max(value, 12)}%` }}
          />
        ))}
      </div>
    </Card>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#c21874]">Executive View</p>
      <h2 className="mt-2 text-2xl font-semibold text-[#241820] md:text-3xl">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#756871]">{subtitle}</p>
    </div>
  );
}

function CalendarIcon(props: React.ComponentProps<typeof Megaphone>) {
  return <Megaphone {...props} />;
}
