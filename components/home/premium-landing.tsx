"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  MessageCircle,
  Ruler,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import {
  categories,
  collectionBanners,
  customerStories,
  designerPicks,
  heroImage,
  journeySteps,
  measurementSteps,
  occasionRows,
  occasions,
  recommendedProducts,
  sectionEyebrow,
  stylistOccasions,
  trendingProducts,
  trustBadges,
  whyCards,
  type ImageCard,
  type ProductCard,
} from "./landing-content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: "easeOut" } },
};

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.58, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export function PremiumLanding() {
  return (
    <div className="overflow-hidden bg-[#fffafd] text-[#241820]">
      <Hero />
      <TrustBadges />
      <AIMeasurementCTA />
      <ShopByOccasion />
      <ShopByCategory />
      <FeaturedCollections />
      <ProductSection
        eyebrow="Trending now"
        title="Trending Collections"
        subtitle="Beautiful looks customers are loving this week."
        products={trendingProducts}
      />
      <RecommendedForYou />
      {occasionRows.map((row) => (
        <ProductSection key={row.title} title={row.title} subtitle={row.subtitle} products={row.items} compact />
      ))}
      <ProductSection
        eyebrow="Premium edit"
        title="Premium Designer Picks"
        subtitle="Editorial styles with a designer showroom feeling."
        products={designerPicks}
      />
      <AIStylist />
      <WhyFitMatch />
      <CustomerStories />
      <FinalCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            {sectionEyebrow}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-5xl font-semibold leading-[0.98] text-[#21151c] sm:text-6xl lg:text-7xl"
          >
            Find Your Perfect Dress
            <span className="block text-primary">Made Just for You</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-8 text-[#725f69] sm:text-lg">
            Take your measurements with AI, choose your favourite design, customise every detail, and receive a
            beautifully stitched dress delivered anywhere in India.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/fit/measurement" size="lg" className="rounded-full px-7">
              Start AI Measurement
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/collections" variant="secondary" size="lg" className="rounded-full px-7">
              Explore Designs
            </ButtonLink>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            {["Women only", "Custom made", "Pan India"].map((item) => (
              <div key={item} className="rounded-2xl border border-primary/10 bg-white/80 p-3 text-center shadow-sm">
                <p className="text-xs font-semibold text-[#3b2932] sm:text-sm">{item}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeScale}
          className="relative min-h-[610px] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_90px_rgba(112,36,73,0.16)]"
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/70 via-[#241820]/18 to-transparent" />
          <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] border border-white/35 bg-white/78 p-4 shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#241820]">Your dress journey</p>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">2 min start</span>
            </div>
            <div className="grid gap-2">
              {journeySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.42 }}
                    className="flex items-center gap-3 rounded-2xl bg-white/88 p-3 shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#241820]">{step.title}</span>
                      <span className="block truncate text-xs text-[#725f69]">{step.text}</span>
                    </span>
                    {index < journeySteps.length - 1 ? (
                      <ChevronRight className="h-4 w-4 shrink-0 text-primary/60" />
                    ) : (
                      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="px-4 py-5 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto grid max-w-[1280px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {trustBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <motion.div
              variants={fadeUp}
              key={badge.title}
              className="rounded-3xl border border-primary/10 bg-white p-4 shadow-[0_14px_35px_rgba(112,36,73,0.07)]"
            >
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-[#241820]">{badge.title}</p>
              <p className="mt-1 text-xs text-[#816f78]">{badge.text}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function AIMeasurementCTA() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[2rem] border border-primary/10 bg-[#2a1722] shadow-[0_26px_70px_rgba(112,36,73,0.16)] lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeScale} className="relative min-h-[320px]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82"
            alt="Woman using phone for a premium fashion measurement experience"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2a1722]/70 to-transparent" />
        </motion.div>
        <motion.div variants={fadeUp} className="p-6 text-white sm:p-10 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">AI Measurement</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">Measure Yourself in Just 2 Minutes</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
            A simple guided flow helps you begin your custom-fit dress journey from home.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {measurementSteps.map((step) => (
              <div key={step} className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur">
                <Ruler className="h-5 w-5 text-white" />
                <p className="mt-3 text-sm font-semibold">{step}</p>
              </div>
            ))}
          </div>
          <ButtonLink href="/fit/measurement" size="lg" className="mt-8 rounded-full bg-white px-7 text-primary hover:bg-white/90">
            Start Measuring
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ShopByOccasion() {
  return (
    <SectionFrame eyebrow="Shop by occasion" title="Every Moment, Beautifully Made" subtitle="Choose the day. We help shape the dress around you.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {occasions.map((item) => (
          <ImageTile key={item.title} item={item} aspect="aspect-[4/5]" />
        ))}
      </div>
    </SectionFrame>
  );
}

function ShopByCategory() {
  return (
    <SectionFrame eyebrow="Shop by category" title="A Full Fashion Wardrobe" subtitle="Premium edits for college, work, weddings, festivals, and everyday life.">
      <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {categories.map((item) => (
          <Link key={item.title} href="/categories" className="group text-center">
            <span className="relative mx-auto block aspect-square w-full max-w-[132px] overflow-hidden rounded-full border border-primary/10 bg-white shadow-[0_14px_35px_rgba(112,36,73,0.08)]">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1280px) 130px, (min-width: 640px) 22vw, 30vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </span>
            <span className="mt-3 block text-sm font-semibold leading-5 text-[#2a1722]">{item.title}</span>
            <span className="mt-1 block text-xs text-[#806d76]">{item.subtitle}</span>
          </Link>
        ))}
      </div>
    </SectionFrame>
  );
}

function FeaturedCollections() {
  return (
    <SectionFrame eyebrow="Featured collections" title="Designer Showroom Edits" subtitle="Large editorial banners today, fully configurable by Admin later.">
      <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0">
        {collectionBanners.map((banner) => (
          <Link
            key={banner.title}
            href="/collections"
            className="group relative min-h-[310px] min-w-[82%] snap-start overflow-hidden rounded-[2rem] bg-[#2a1722] shadow-[0_24px_70px_rgba(112,36,73,0.16)] sm:min-w-[58%] lg:min-w-0"
          >
            <Image
              src={banner.image.src}
              alt={banner.image.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 82vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/82 via-[#241820]/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Collection</p>
              <h3 className="mt-3 text-3xl font-semibold">{banner.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/78">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </SectionFrame>
  );
}

function RecommendedForYou() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-[0_20px_60px_rgba(112,36,73,0.09)] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Recommended for you</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#241820]">Made Just For You</h2>
          <p className="mt-4 text-sm leading-7 text-[#725f69]">
            Based on your measurements and style preferences. Demo recommendations make the store feel ready on day one.
          </p>
          <div className="mt-6 rounded-3xl bg-primary/8 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white">
                <WandSparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-[#241820]">FIT Match is ready</p>
                <p className="text-sm text-[#725f69]">Your best size, colour, and fabric suggestions appear here.</p>
              </div>
            </div>
          </div>
        </motion.div>
        <ProductGrid products={recommendedProducts} compact />
      </div>
    </section>
  );
}

function ProductSection({
  eyebrow,
  title,
  subtitle,
  products,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  products: ProductCard[];
  compact?: boolean;
}) {
  return (
    <SectionFrame eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <ProductGrid products={products} compact={compact} />
    </SectionFrame>
  );
}

function ProductGrid({ products, compact = false }: { products: ProductCard[]; compact?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={`grid gap-4 ${compact ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}
    >
      {products.map((product) => (
        <ProductCardView key={`${product.name}-${product.price}`} product={product} />
      ))}
    </motion.div>
  );
}

function ProductCardView({ product }: { product: ProductCard }) {
  return (
    <motion.article variants={fadeUp} className="group overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white shadow-[0_18px_45px_rgba(112,36,73,0.08)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8eef3]">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition hover:scale-105"
        >
          <Heart className="h-5 w-5" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          {product.fit}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-6 text-[#241820]">{product.name}</h3>
          <span className="flex items-center gap-1 rounded-full bg-[#fff5d9] px-2 py-1 text-xs font-semibold text-[#7b5600]">
            <Star className="h-3.5 w-3.5 fill-current" />
            {product.rating}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-[#241820]">{product.price}</span>
          <span className="text-sm text-[#9a8791] line-through">{product.originalPrice}</span>
          <span className="text-sm font-semibold text-primary">{product.discount}</span>
        </div>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center rounded-full border border-primary/15 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          Quick View
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}

function AIStylist() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-[0_24px_70px_rgba(112,36,73,0.12)] lg:grid-cols-[1fr_1fr]"
      >
        <motion.div variants={fadeUp} className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">AI Stylist</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#241820]">Where are you going today?</h2>
          <p className="mt-4 text-sm leading-7 text-[#725f69]">
            Choose the moment. Your personal stylist prepares simple outfit ideas that match your fit and taste.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {stylistOccasions.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-primary/12 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-[#3a2530] transition hover:bg-primary hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>
          <ButtonLink href="/ai/stylist" size="lg" className="mt-8 rounded-full px-7">
            Ask My Stylist
            <MessageCircle className="ml-2 h-4 w-4" />
          </ButtonLink>
        </motion.div>
        <motion.div variants={fadeScale} className="relative min-h-[360px] bg-[#2a1722]">
          <Image
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82"
            alt="Premium personal stylist fashion mood"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-82"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/74 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/25 bg-white/18 p-5 text-white backdrop-blur-xl">
            <p className="text-sm font-semibold">Stylist preview</p>
            <p className="mt-2 text-2xl font-semibold">Soft silk, rose tone, custom length</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function WhyFitMatch() {
  return (
    <SectionFrame eyebrow="Why FIT & Match" title="Why Women Love FIT & Match" subtitle="Simple, personal, and premium from first tap to final delivery.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {whyCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="rounded-3xl border border-primary/10 bg-white p-6 shadow-[0_16px_40px_rgba(112,36,73,0.07)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[#241820]">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#725f69]">{card.text}</p>
            </motion.div>
          );
        })}
      </div>
    </SectionFrame>
  );
}

function CustomerStories() {
  return (
    <SectionFrame eyebrow="Customer stories" title="Loved Across India" subtitle="Demo stories today, ready for real reviews when customers start sharing.">
      <div className="grid gap-4 md:grid-cols-3">
        {customerStories.map((story) => (
          <motion.article
            key={story.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="rounded-[1.75rem] border border-primary/10 bg-white p-5 shadow-[0_18px_45px_rgba(112,36,73,0.08)]"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image src={story.image.src} alt={story.image.alt} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-[#241820]">{story.name}</p>
                <p className="text-sm text-[#806d76]">{story.location}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-1 text-[#c58a00]" aria-label={`${story.rating} star rating`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm font-semibold text-[#241820]">{story.rating}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#725f69]">“{story.text}”</p>
          </motion.article>
        ))}
      </div>
    </SectionFrame>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#241820] via-[#7f174f] to-primary p-8 text-center text-white shadow-[0_30px_90px_rgba(112,36,73,0.22)] sm:p-12 lg:p-16"
      >
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
          {siteConfig.productName}
        </motion.p>
        <motion.h2 variants={fadeUp} className="mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Ready to Create Your Perfect Dress?
        </motion.h2>
        <motion.div variants={fadeUp} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/fit/measurement" size="lg" className="rounded-full bg-white px-7 text-primary hover:bg-white/90">
            Start AI Measurement
            <ArrowRight className="ml-2 h-4 w-4" />
          </ButtonLink>
          <ButtonLink
            href="/collections"
            variant="secondary"
            size="lg"
            className="rounded-full border-white/25 bg-white/12 px-7 text-white hover:bg-white/20"
          >
            Browse Collections
          </ButtonLink>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SectionFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            {eyebrow ? (
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold leading-tight text-[#241820] sm:text-5xl">
              {title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-sm leading-7 text-[#725f69] sm:text-base">
              {subtitle}
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link href="/collections" className="inline-flex items-center text-sm font-semibold text-primary">
              Explore all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function ImageTile({ item, aspect }: { item: ImageCard; aspect: string }) {
  return (
    <Link href="/collections" className="group block">
      <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className={`relative overflow-hidden rounded-[1.75rem] bg-[#2a1722] shadow-[0_18px_45px_rgba(112,36,73,0.1)] ${aspect}`}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/80 via-[#241820]/18 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="text-2xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/78">{item.subtitle}</p>
        </div>
      </motion.article>
    </Link>
  );
}
