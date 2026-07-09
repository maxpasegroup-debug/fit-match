"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Instagram,
  Mail,
  MessageCircle,
  Smartphone,
  Star,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";
import { FitJourney } from "./fit-journey";
import { StyleStudio } from "./style-studio";
import {
  brandPromise,
  categories,
  collectionBanners,
  customerStories,
  footerColumns,
  heroSlides,
  homepageProductRows,
  journeySteps,
  occasions,
  styleJournal,
  stylistOccasions,
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
      <HeroSlider />
      <FitJourney />
      <StyleStudio />
      <FeaturedCollections />
      <ProductShowroom
        eyebrow={homepageProductRows[0]?.eyebrow ?? "Trending now"}
        title={homepageProductRows[0]?.title ?? "Trending Products"}
        subtitle={homepageProductRows[0]?.subtitle ?? "Premium styles customers are loving now."}
        products={homepageProductRows[0]?.products ?? []}
      />
      <AIJourney />
      <ShopByOccasion />
      <ShopByCategory />
      {homepageProductRows.slice(1).map((row) => (
        <ProductShowroom key={row.title} eyebrow={row.eyebrow} title={row.title} subtitle={row.subtitle} products={row.products} />
      ))}
      <AIStylist />
      <CustomerStories />
      <StyleJournal />
      <BrandPromise />
      <LuxuryFooter />
    </div>
  );
}

function HeroSlider() {
  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-[#241820]">
      <div className="flex h-[92svh] snap-x overflow-x-auto scroll-smooth">
        {heroSlides.map((slide, index) => (
          <article id={`slide-${index + 1}`} key={slide.headline} className="relative h-full min-w-full snap-start">
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#241820]/88 via-[#241820]/42 to-[#241820]/12" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/74 via-transparent to-transparent" />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8"
            >
              <div className="mx-auto w-full max-w-[1280px]">
                <div className="max-w-3xl pt-16 text-white">
                  <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.32em] text-white/68">
                    {slide.eyebrow}
                  </motion.p>
                  <motion.h1 variants={fadeUp} className="mt-5 text-5xl font-semibold leading-[0.95] sm:text-7xl lg:text-8xl">
                    {slide.headline}
                  </motion.h1>
                  <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                    {slide.subtitle}
                  </motion.p>
                  <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink href={slide.href} size="lg" className="rounded-full bg-white px-7 text-primary hover:bg-white/90">
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ButtonLink>
                    <ButtonLink href="/collections" variant="secondary" size="lg" className="rounded-full border-white/25 bg-white/12 px-7 text-white hover:bg-white/20">
                      Explore Designs
                    </ButtonLink>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </article>
        ))}
      </div>
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-white backdrop-blur">
        {heroSlides.map((slide, index) => (
          <a
            key={slide.headline}
            href={`#slide-${index + 1}`}
            aria-label={`Go to ${slide.headline}`}
            className={`h-1.5 rounded-full transition ${index === 0 ? "w-8 bg-white" : "w-2 bg-white/45"}`}
          />
        ))}
      </div>
      <div className="absolute bottom-7 right-6 hidden items-center gap-2 text-sm font-semibold text-white/72 md:flex">
        Scroll
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}

function AIJourney() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow="AI measurement journey" title="From Measurement to Delivery" subtitle="Four simple steps. No measuring tape. No tailor visits. Just your phone and your perfect dress." />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="relative grid gap-4 md:grid-cols-4"
        >
          <div className="absolute left-8 right-8 top-14 hidden h-px bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 md:block" />
          {journeySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article key={step.title} variants={fadeUp} className="relative rounded-[2rem] border border-primary/10 bg-white p-6 shadow-[0_18px_50px_rgba(112,36,73,0.08)]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Step {index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-[#241820]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#725f69]">{step.text}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ShopByOccasion() {
  return (
    <SectionFrame eyebrow="Shop by occasion" title="Every Moment, Beautifully Made" subtitle="Premium demo cards today, ready for Admin-managed campaigns later.">
      <HorizontalScroller>
        {occasions.map((item) => (
          <ImageTile key={item.title} item={item} className="min-w-[76%] sm:min-w-[42%] lg:min-w-0" />
        ))}
      </HorizontalScroller>
    </SectionFrame>
  );
}

function ShopByCategory() {
  return (
    <SectionFrame eyebrow="Shop by category" title="A Full Premium Wardrobe" subtitle="Circular fashion-app thumbnails for every category the business wants to promote.">
      <div className="sticky top-16 z-20 -mx-4 mb-6 overflow-x-auto border-y border-primary/10 bg-[#fffafd]/92 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex gap-2">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.title} href="/categories" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#3a2530] shadow-sm">
              {category.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {categories.map((item) => (
          <Link key={item.title} href="/categories" className="group text-center">
            <span className="relative mx-auto block aspect-square w-full max-w-[132px] overflow-hidden rounded-full border border-primary/10 bg-white shadow-[0_14px_35px_rgba(112,36,73,0.08)]">
              <Image src={item.image.src} alt={item.image.alt} fill sizes="132px" className="object-cover transition duration-500 group-hover:scale-105" />
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
    <SectionFrame eyebrow="Featured designer collections" title="Luxury Editorial Banners" subtitle="Promotional banners structured for future scheduling, campaign activation, and media-library replacement.">
      <HorizontalScroller>
        {collectionBanners.map((banner) => (
          <Link key={banner.title} href={banner.href} className="group relative min-h-[340px] min-w-[86%] overflow-hidden rounded-[2rem] bg-[#241820] shadow-[0_24px_70px_rgba(112,36,73,0.16)] sm:min-w-[58%] lg:min-w-[42%]">
            <Image src={banner.image.src} alt={banner.image.alt} fill sizes="(min-width: 1024px) 42vw, 86vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/86 via-[#241820]/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{banner.label}</p>
              <h3 className="mt-3 text-3xl font-semibold">{banner.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/78">{banner.subtitle}</p>
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </SectionFrame>
  );
}

function ProductShowroom({ eyebrow, title, subtitle, products }: { eyebrow: string; title: string; subtitle: string; products: ProductCard[] }) {
  return (
    <SectionFrame eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <HorizontalScroller>
        {products.map((product) => (
          <ProductCardView key={`${title}-${product.name}`} product={product} />
        ))}
      </HorizontalScroller>
    </SectionFrame>
  );
}

function ProductCardView({ product }: { product: ProductCard }) {
  return (
    <motion.article variants={fadeUp} className="group min-w-[72%] overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white shadow-[0_18px_45px_rgba(112,36,73,0.08)] sm:min-w-[38%] lg:min-w-[23%]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8eef3]">
        <Image src={product.image.src} alt={product.image.alt} fill sizes="(min-width: 1024px) 23vw, 72vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <button type="button" aria-label={`Add ${product.name} to wishlist`} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur transition hover:scale-105">
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm">{product.fit}</span>
          {product.aiRecommended ? <span className="rounded-full bg-[#241820]/88 px-3 py-1 text-xs font-semibold text-white shadow-sm">AI Recommended</span> : null}
        </div>
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
        <div className="mt-3 flex gap-1.5" aria-label="Available colors">
          {product.colors.map((color) => (
            <span key={color} className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
          ))}
        </div>
        <button type="button" className="mt-4 flex w-full items-center justify-center rounded-full border border-primary/15 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
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
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="mx-auto grid max-w-[1280px] overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-[0_24px_70px_rgba(112,36,73,0.12)] lg:grid-cols-[1fr_1fr]">
        <motion.div variants={fadeUp} className="p-6 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">AI Stylist</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#241820]">Where are you going today?</h2>
          <p className="mt-4 text-sm leading-7 text-[#725f69]">Choose the moment. Your personal stylist prepares simple outfit ideas that match your fit and taste.</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {stylistOccasions.map((item) => (
              <button key={item} type="button" className="rounded-full border border-primary/12 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-[#3a2530] transition hover:bg-primary hover:text-white">
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
          <Image src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=82" alt="Premium personal stylist fashion mood" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover opacity-85" />
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

function CustomerStories() {
  return (
    <SectionFrame eyebrow="Customer stories" title="Loved Across India" subtitle="Premium demo stories with room for real review feeds later.">
      <div className="grid gap-4 md:grid-cols-3">
        {customerStories.map((story) => (
          <motion.article key={story.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="rounded-[1.75rem] border border-primary/10 bg-white p-5 shadow-[0_18px_45px_rgba(112,36,73,0.08)]">
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
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{story.purchased}</p>
            <p className="mt-3 text-sm leading-7 text-[#725f69]">“{story.text}”</p>
          </motion.article>
        ))}
      </div>
    </SectionFrame>
  );
}

function StyleJournal() {
  return (
    <SectionFrame eyebrow="Style journal" title="Fashion Inspiration" subtitle="Editorial content slots for styling stories, seasonal trends, and brand education.">
      <HorizontalScroller>
        {styleJournal.map((post) => (
          <Link key={post.title} href="/collections" className="group min-w-[78%] overflow-hidden rounded-[1.75rem] border border-primary/10 bg-white shadow-[0_18px_45px_rgba(112,36,73,0.08)] sm:min-w-[42%] lg:min-w-[30%]">
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image src={post.image.src} alt={post.image.alt} fill sizes="(min-width: 1024px) 30vw, 78vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{post.readTime}</p>
              <h3 className="mt-3 text-xl font-semibold text-[#241820]">{post.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#725f69]">{post.subtitle}</p>
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </SectionFrame>
  );
}

function BrandPromise() {
  return (
    <SectionFrame eyebrow="Brand promise" title="Luxury That Feels Personal" subtitle="The trust layer management, investors, and customers can understand immediately.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {brandPromise.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="rounded-3xl border border-primary/10 bg-white p-6 shadow-[0_16px_40px_rgba(112,36,73,0.07)]">
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

function LuxuryFooter() {
  return (
    <footer className="border-t border-primary/10 bg-[#241820] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">SIGN SILKS</p>
          <h2 className="mt-4 text-3xl font-semibold">{siteConfig.productName}</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/66">India’s premium AI-assisted custom fashion platform for women. Measure, choose, customise, and receive a beautifully stitched outfit at home.</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Mail, Smartphone].map((Icon, index) => (
              <span key={index} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white">
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 lg:col-span-2">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold">{column.title}</h3>
              <div className="mt-4 grid gap-3">
                {column.links.map((link) => (
                  <Link key={link} href="/policies" className="text-sm text-white/62 hover:text-white">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1280px] flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 SIGN SILKS. Truly Stylish.</p>
        <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">App download placeholder</div>
      </div>
    </footer>
  );
}

function SectionFrame({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</motion.p>
        <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold leading-tight text-[#241820] sm:text-5xl">{title}</motion.h2>
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-sm leading-7 text-[#725f69] sm:text-base">{subtitle}</motion.p>
      </div>
      <motion.div variants={fadeUp}>
        <Link href="/collections" className="inline-flex items-center text-sm font-semibold text-primary">
          Explore all
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function HorizontalScroller({ children }: { children: ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      {children}
    </motion.div>
  );
}

function ImageTile({ item, className }: { item: ImageCard; className: string }) {
  return (
    <Link href="/collections" className={`group block snap-start ${className}`}>
      <motion.article initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#2a1722] shadow-[0_18px_45px_rgba(112,36,73,0.1)]">
        <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 25vw, 76vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/80 via-[#241820]/18 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h3 className="text-2xl font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/78">{item.subtitle}</p>
        </div>
      </motion.article>
    </Link>
  );
}
