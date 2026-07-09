import { ArrowRight, CheckCircle2, HeartHandshake, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StructuredData } from "@/components/seo/structured-data";
import { ProductSection } from "@/components/catalog/product-section";
import { getDiscoveryHomeData, getWishlistProductIds } from "@/features/catalog/data";
import { siteConfig } from "@/lib/config/site";

const collections = ["Soft Silks", "Occasion Edit", "Everyday Grace"];
const reasons = [
  { title: "Premium curation", icon: Sparkles },
  { title: "Secure account foundation", icon: ShieldCheck },
  { title: "Made for confident choices", icon: HeartHandshake },
];
const steps = ["Create your account", "Explore guided style paths", "Return for smarter shopping"];

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [data, wishlistIds] = await Promise.all([getDiscoveryHomeData(), getWishlistProductIds()]);
  const recently = data.recently.map((item) => item.product);

  return (
    <main>
      <StructuredData />
      <section className="bg-white">
        <div className={`${siteConfig.maxWidthClass} grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20`}>
          <div className="grid gap-7">
            <p className="text-sm font-black tracking-[0.24em] text-[#c21874]">
              {siteConfig.brandName}
            </p>
            <div className="grid gap-4">
              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] text-[#241820] sm:text-6xl lg:text-7xl">
                FIT & Match
              </h1>
              <p className="text-2xl font-medium text-[#7b2755]">{siteConfig.tagline}</p>
              <p className="max-w-xl text-base leading-8 text-[#756871] sm:text-lg">
                A minimal, premium foundation for SIGN SILKS customers to begin
                their personal style journey with clean account flows and a
                graceful mobile shopping feel.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" size="lg">
                Create Account <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="lg">
                Log in
              </ButtonLink>
            </div>
          </div>
          <div className="rounded-[2rem] border border-[#eadde6] bg-[#fffafd] p-5 shadow-[0_28px_90px_rgba(194,24,116,0.12)]">
            <div className="aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(145deg,#ffffff,#fde8f3)] p-6">
              <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-white bg-white/70 p-6">
                <div>
                  <p className="text-sm font-semibold text-[#c21874]">SIGN SILKS</p>
                  <p className="mt-3 text-3xl font-semibold text-[#241820]">Quiet luxury, ready for Phase 2.</p>
                </div>
                <div className="grid gap-3">
                  {collections.map((collection) => (
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#3a2c34] shadow-sm" key={collection}>
                      {collection}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className={`${siteConfig.maxWidthClass} grid gap-8`}>
          <SectionTitle title="Featured Collections" />
          {data.collections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {data.collections.map((collection) => (
                <ButtonLink className="h-auto justify-start rounded-3xl border border-[#eadde6] bg-white p-5 text-left text-[#241820]" href={`/collections/${collection.slug}`} key={collection.id} variant="secondary">
                  {collection.name}
                </ButtonLink>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {collections.map((collection) => (
                <Card key={collection}>
                  <p className="text-lg font-semibold text-[#241820]">{collection}</p>
                  <p className="mt-2 text-sm leading-6 text-[#756871]">Collection will appear when products are published.</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className={`${siteConfig.maxWidthClass} grid gap-10`}>
          <ProductSection title="Trending Now" href="/search?trending=true" products={data.trending} wishlistIds={wishlistIds} />
          <ProductSection title="New Arrivals" href="/search?newArrival=true" products={data.newArrivals} wishlistIds={wishlistIds} />
          <ProductSection title="Wedding Collection" href="/collections/wedding" products={data.wedding} wishlistIds={wishlistIds} />
          <ProductSection title="Office Collection" href="/collections/office" products={data.office} wishlistIds={wishlistIds} />
          <ProductSection title="Festival Collection" href="/collections/festival" products={data.festival} wishlistIds={wishlistIds} />
          <ProductSection title="Premium Picks" href="/search?featured=true" products={data.premium} wishlistIds={wishlistIds} />
          <ProductSection title="Recently Viewed" href="/profile" products={recently} wishlistIds={wishlistIds} />
          <ProductSection title="Continue Shopping" href="/search" products={[...data.trending, ...data.newArrivals].slice(0, 8)} wishlistIds={wishlistIds} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className={`${siteConfig.maxWidthClass} grid gap-8`}>
          <SectionTitle title="Why Choose Sign Silks" />
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((reason) => (
              <Card key={reason.title}>
                <reason.icon className="mb-5 h-7 w-7 text-[#c21874]" />
                <p className="text-lg font-semibold text-[#241820]">{reason.title}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className={`${siteConfig.maxWidthClass} grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center`}>
          <SectionTitle title="How FIT & Match Works" />
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm" key={step}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fde8f3] font-bold text-[#c21874]">
                  {index + 1}
                </span>
                <p className="font-semibold text-[#241820]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className={`${siteConfig.maxWidthClass} grid gap-8`}>
          <SectionTitle title="Testimonials" />
          <Card>
            <Ruler className="mb-5 h-7 w-7 text-[#c21874]" />
            <p className="max-w-3xl text-xl leading-9 text-[#3a2c34]">
              Customer stories will appear after launch data is available.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="grid gap-3">
      <CheckCircle2 className="h-6 w-6 text-[#c21874]" />
      <h2 className="text-3xl font-semibold text-[#241820]">{title}</h2>
    </div>
  );
}
