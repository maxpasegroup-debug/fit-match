"use client";

import { useMemo, useState, type DragEvent } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Eye,
  GripVertical,
  ImageIcon,
  LayoutGrid,
  MonitorSmartphone,
  RotateCcw,
  Save,
  ToggleLeft,
  ToggleRight,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  categories,
  collectionBanners,
  customerStories,
  fitJourneyIntro,
  fitJourneySteps,
  designStudio,
  heroSlides,
  homepageProductRows,
  occasions,
  colourStudioCards,
  fabricStudioCards,
  moodCards,
  styleStudioCards,
  styleJournal,
} from "@/components/home/landing-content";

type BuilderSection = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  status: "Live" | "Draft" | "Scheduled";
  items: number;
};

const defaultSections: BuilderSection[] = [
  { id: "hero", title: "Hero Slider", description: "Cinematic homepage slides with CTA buttons and overlays.", enabled: true, status: "Live", items: heroSlides.length },
  { id: "fit-journey", title: "Signature FIT Journey", description: "Personalised onboarding cards, guided choices, and recommended designs.", enabled: true, status: "Live", items: fitJourneySteps.length },
  { id: "style-studio", title: "Style Studio", description: "Editorial style cards, mood filters, fabric studio, and colour studio.", enabled: true, status: "Live", items: styleStudioCards.length + moodCards.length + fabricStudioCards.length + colourStudioCards.length },
  { id: "design-studio", title: "Dress Design Studio", description: "Luxury configurator for styles, fabrics, colours, sleeves, necklines, lengths, and details.", enabled: true, status: "Live", items: designStudio.baseStyles.length + designStudio.fabrics.length + designStudio.colours.length },
  { id: "journey", title: "AI Measurement Journey", description: "Four-step explanation for measurement to delivery.", enabled: true, status: "Live", items: 4 },
  { id: "occasion", title: "Occasion Cards", description: "Wedding, office, college, daily wear, and seasonal cards.", enabled: true, status: "Live", items: occasions.length },
  { id: "category", title: "Category Thumbnails", description: "Circular premium category shortcuts for mobile shopping.", enabled: true, status: "Live", items: categories.length },
  { id: "collections", title: "Collection Banners", description: "Large promotional editorial banners with campaign copy.", enabled: true, status: "Scheduled", items: collectionBanners.length },
  { id: "products", title: "Product Showroom", description: "Trending, recommended, new arrivals, and collection rows.", enabled: true, status: "Live", items: homepageProductRows.reduce((total, row) => total + row.products.length, 0) },
  { id: "stories", title: "Customer Stories", description: "Premium testimonials with ratings, locations, and purchases.", enabled: true, status: "Draft", items: customerStories.length },
  { id: "journal", title: "Style Journal", description: "Fashion inspiration cards for styling, trends, and education.", enabled: true, status: "Draft", items: styleJournal.length },
  { id: "footer", title: "Footer Content", description: "Brand story, policy links, newsletter, and app placeholder.", enabled: true, status: "Live", items: 4 },
];

const mediaPanels = [
  "Upload hero banners",
  "Replace category thumbnails",
  "Select collection banners",
  "Crop placeholder",
  "Preview before publishing",
  "Reuse media from library",
  "Delete unused visual",
  "Schedule campaign assets",
] as const;

export function HomepageBuilder() {
  const [sections, setSections] = useState(defaultSections);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [journeyTitle, setJourneyTitle] = useState(fitJourneyIntro.title);
  const [journeySubtitle, setJourneySubtitle] = useState(fitJourneyIntro.subtitle);
  const [journeyCtas, setJourneyCtas] = useState(fitJourneyIntro.cards.map((card) => card.cta));
  const [styleTitle, setStyleTitle] = useState("Discover Your Style");
  const [styleSubtitle, setStyleSubtitle] = useState("Find collections that match your personality and lifestyle.");
  const [designTitle, setDesignTitle] = useState(designStudio.title);
  const [designSubtitle, setDesignSubtitle] = useState(designStudio.subtitle);

  const enabledCount = useMemo(() => sections.filter((section) => section.enabled).length, [sections]);
  const assetCount =
    heroSlides.length +
    occasions.length +
    categories.length +
    collectionBanners.length +
    styleJournal.length +
    fitJourneyIntro.cards.length +
    styleStudioCards.length +
    fabricStudioCards.length +
    designStudio.baseStyles.length;

  function toggleSection(id: string) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)),
    );
  }

  function moveSection(id: string, direction: "up" | "down") {
    setSections((current) => {
      const index = current.findIndex((section) => section.id === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetId: string) {
    event.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    setSections((current) => {
      const draggedIndex = current.findIndex((section) => section.id === draggedId);
      const targetIndex = current.findIndex((section) => section.id === targetId);
      if (draggedIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [item] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setDraggedId(null);
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Enabled sections" value={enabledCount.toString()} icon={ToggleRight} />
        <Metric title="Demo assets" value={assetCount.toString()} icon={ImageIcon} />
        <Metric title="Showroom products" value="60" icon={LayoutGrid} />
        <Metric title="Preview modes" value="3" icon={MonitorSmartphone} />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#c21874]">Homepage Builder</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#241820]">Visual CMS workspace</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756871]">
              Mock controls today, structured for future database persistence, DAM asset selection, scheduling, and publishing workflows.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton icon={Eye} label="Preview" />
            <ActionButton icon={RotateCcw} label="Reset demo" />
            <ActionButton icon={Save} label="Save draft" primary />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#241820]">Homepage Sections</h2>
              <p className="mt-1 text-sm text-[#756871]">Drag, reorder, enable, and prepare sections for publishing.</p>
            </div>
            <span className="rounded-full bg-[#fff5fa] px-3 py-1 text-xs font-semibold text-[#c21874]">Local demo mode</span>
          </div>
          <div className="grid gap-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => setDraggedId(section.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, section.id)}
                className="rounded-3xl border border-[#f2d7e6] bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-3">
                    <GripVertical className="mt-1 h-5 w-5 shrink-0 text-[#c21874]" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[#241820]">{section.title}</h3>
                        <span className="rounded-full bg-[#f8eef3] px-2 py-1 text-xs font-semibold text-[#6b5360]">{section.status}</span>
                        <span className="rounded-full bg-[#fff8e8] px-2 py-1 text-xs font-semibold text-[#7c5d00]">{section.items} items</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#756871]">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => moveSection(section.id, "up")} disabled={index === 0} className="rounded-full border border-[#f2d7e6] px-3 py-2 text-xs font-semibold text-[#3a2c34] disabled:opacity-40">
                      Up
                    </button>
                    <button type="button" onClick={() => moveSection(section.id, "down")} disabled={index === sections.length - 1} className="rounded-full border border-[#f2d7e6] px-3 py-2 text-xs font-semibold text-[#3a2c34] disabled:opacity-40">
                      Down
                    </button>
                    <button type="button" onClick={() => toggleSection(section.id)} className="flex items-center gap-2 rounded-full bg-[#fff5fa] px-3 py-2 text-xs font-semibold text-[#c21874]">
                      {section.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {section.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#241820]">FIT Journey Controls</h2>
                <p className="mt-2 text-sm leading-6 text-[#756871]">
                  Mock controls for the signature homepage entry. Future persistence can store this as Homepage Builder content.
                </p>
              </div>
              <span className="rounded-full bg-[#fff5fa] px-3 py-1 text-xs font-semibold text-[#c21874]">Preview ready</span>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Journey title
                <input
                  value={journeyTitle}
                  onChange={(event) => setJourneyTitle(event.target.value)}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Subtitle
                <textarea
                  value={journeySubtitle}
                  onChange={(event) => setJourneySubtitle(event.target.value)}
                  rows={3}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <div className="grid gap-2">
                <p className="text-sm font-semibold text-[#3a2c34]">Entry CTA labels</p>
                {fitJourneyIntro.cards.map((card, index) => (
                  <label key={card.title} className="grid gap-2 rounded-2xl bg-[#fff8fb] p-3 text-sm font-semibold text-[#3a2c34]">
                    {card.title}
                    <input
                      value={journeyCtas[index] ?? ""}
                      onChange={(event) =>
                        setJourneyCtas((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))
                      }
                      className="rounded-xl border border-[#f2d7e6] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#c21874]"
                    />
                  </label>
                ))}
              </div>
              <div className="rounded-3xl border border-[#f2d7e6] bg-white p-4">
                <p className="text-sm font-semibold text-[#241820]">Configured steps</p>
                <div className="mt-3 grid gap-2">
                  {fitJourneySteps.map((step, index) => (
                    <div key={step.title} className="flex items-center justify-between rounded-2xl bg-[#fff8fb] px-4 py-3 text-sm">
                      <span className="font-semibold text-[#3a2c34]">
                        {index + 1}. {step.title}
                      </span>
                      <span className="text-xs font-semibold text-[#c21874]">{step.options.length} options</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#241820]">Design Studio Controls</h2>
                <p className="mt-2 text-sm leading-6 text-[#756871]">
                  Mock configuration for the flagship dress configurator, ready for future CMS persistence.
                </p>
              </div>
              <span className="rounded-full bg-[#fff5fa] px-3 py-1 text-xs font-semibold text-[#c21874]">Configurator</span>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Section title
                <input
                  value={designTitle}
                  onChange={(event) => setDesignTitle(event.target.value)}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Subtitle
                <textarea
                  value={designSubtitle}
                  onChange={(event) => setDesignSubtitle(event.target.value)}
                  rows={3}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <div className="grid gap-3">
                {[
                  ["Base styles", designStudio.baseStyles.length],
                  ["Fabric list", designStudio.fabrics.length],
                  ["Colour palettes", designStudio.colours.length],
                  ["Neck styles", designStudio.neckStyles.length],
                  ["Sleeve styles", designStudio.sleeves.length],
                  ["Length options", designStudio.lengths.length],
                  ["Optional details", designStudio.details.length],
                ].map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-[#fff8fb] px-4 py-3 text-sm">
                    <span className="font-semibold text-[#3a2c34]">{label}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#c21874]">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#241820]">Style Studio Controls</h2>
                <p className="mt-2 text-sm leading-6 text-[#756871]">
                  Manage the editorial inspiration layer, mood filters, fabric cards, and colour cards with local demo content.
                </p>
              </div>
              <span className="rounded-full bg-[#fff5fa] px-3 py-1 text-xs font-semibold text-[#c21874]">Editorial</span>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Section title
                <input
                  value={styleTitle}
                  onChange={(event) => setStyleTitle(event.target.value)}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#3a2c34]">
                Description
                <textarea
                  value={styleSubtitle}
                  onChange={(event) => setStyleSubtitle(event.target.value)}
                  rows={3}
                  className="rounded-2xl border border-[#f2d7e6] bg-white px-4 py-3 text-sm font-medium outline-none focus:border-[#c21874]"
                />
              </label>
              <div className="grid gap-3">
                {[
                  ["Style Studio cards", styleStudioCards.length],
                  ["Mood cards", moodCards.length],
                  ["Fabric cards", fabricStudioCards.length],
                  ["Colour cards", colourStudioCards.length],
                ].map(([label, count]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-[#fff8fb] px-4 py-3 text-sm">
                    <span className="font-semibold text-[#3a2c34]">{label}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#c21874]">{count} items</span>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-[#f2d7e6] bg-white p-4">
                <p className="text-sm font-semibold text-[#241820]">Preview mood cards</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {moodCards.map((mood) => (
                    <span key={mood.title} className="rounded-full bg-[#fff5fa] px-3 py-2 text-xs font-semibold text-[#c21874]">
                      {mood.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold text-[#241820]">Media Experience</h2>
            <p className="mt-2 text-sm leading-6 text-[#756871]">
              Uses the existing DAM direction visually: Admin can replace, crop, preview, delete, and reuse media once persistence is wired.
            </p>
            <div className="mt-5 grid gap-2">
              {mediaPanels.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-[#fff8fb] px-4 py-3 text-sm">
                  <span className="font-semibold text-[#3a2c34]">{item}</span>
                  <Upload className="h-4 w-4 text-[#c21874]" />
                </div>
              ))}
            </div>
            <Link href="/admin/media" className="mt-5 inline-flex items-center rounded-full bg-[#c21874] px-5 py-3 text-sm font-semibold text-white">
              Open Media Library
            </Link>
          </Card>

          <Card className="p-5">
            <h2 className="text-xl font-semibold text-[#241820]">Campaign Scheduling</h2>
            <div className="mt-4 grid gap-3">
              {["Wedding Edit", "Festival Glamour", "Premium Silk Collection"].map((campaign, index) => (
                <div key={campaign} className="rounded-2xl border border-[#f2d7e6] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#241820]">{campaign}</p>
                    <CalendarClock className="h-4 w-4 text-[#c21874]" />
                  </div>
                  <p className="mt-2 text-sm text-[#756871]">{index === 0 ? "Active now" : index === 1 ? "Scheduled for next campaign" : "Draft promotion"}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value, icon: Icon }: { title: string; value: string; icon: LucideIcon }) {
  return (
    <Card className="p-5">
      <Icon className="mb-4 h-6 w-6 text-[#c21874]" />
      <p className="text-3xl font-semibold text-[#241820]">{value}</p>
      <p className="text-sm text-[#756871]">{title}</p>
    </Card>
  );
}

function ActionButton({ label, icon: Icon, primary = false }: { label: string; icon: LucideIcon; primary?: boolean }) {
  return (
    <button
      type="button"
      className={
        primary
          ? "inline-flex items-center rounded-full bg-[#c21874] px-5 py-3 text-sm font-semibold text-white"
          : "inline-flex items-center rounded-full border border-[#f2d7e6] bg-white px-5 py-3 text-sm font-semibold text-[#3a2c34]"
      }
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  );
}
