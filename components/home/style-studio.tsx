"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import {
  colourStudioCards,
  demoProducts,
  fabricStudioCards,
  moodCards,
  styleStudioCards,
  type ProductCard,
} from "./landing-content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export function StyleStudio() {
  const [activeMood, setActiveMood] = useState(moodCards[0]);
  const [activeColour, setActiveColour] = useState(colourStudioCards[0]);

  const moodProducts = useMemo(
    () => demoProducts.slice(activeMood.productOffset, activeMood.productOffset + 4),
    [activeMood],
  );
  const colourProducts = useMemo(
    () => demoProducts.slice(activeColour.productOffset, activeColour.productOffset + 4),
    [activeColour],
  );

  return (
    <section className="bg-[#fffafd] px-4 py-14 sm:px-6 lg:px-8" id="style-studio">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading
          eyebrow="Style Studio"
          title="Discover Your Style"
          subtitle="Find collections that match your personality and lifestyle."
        />
        <EditorialStudio />
        <MoodStudio activeTitle={activeMood.title} products={moodProducts} onSelect={setActiveMood} />
        <FabricStudio />
        <ColourStudio activeTitle={activeColour.title} products={colourProducts} onSelect={setActiveColour} />
      </div>
    </section>
  );
}

function EditorialStudio() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className="grid gap-5 lg:grid-cols-4"
    >
      {styleStudioCards.map((card, index) => (
        <motion.article
          key={card.title}
          variants={fadeUp}
          className={`group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-[#241820] shadow-[0_24px_70px_rgba(112,36,73,0.14)] ${
            index === 0 || index === 2 ? "lg:col-span-2" : ""
          }`}
        >
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 92vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241820]/88 via-[#241820]/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">Style edit</p>
            <h3 className="mt-3 text-3xl font-semibold">{card.title}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/76">{card.subtitle}</p>
            <Link href="/collections" className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary">
              {card.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}

function MoodStudio({
  activeTitle,
  products,
  onSelect,
}: {
  activeTitle: string;
  products: ProductCard[];
  onSelect: (mood: (typeof moodCards)[number]) => void;
}) {
  return (
    <div className="mt-16">
      <SectionHeading
        eyebrow="Shop by mood"
        title="Choose the Feeling"
        subtitle="Tap a mood to highlight matching demo designs."
      />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
        {moodCards.map((mood) => {
          const isActive = activeTitle === mood.title;
          return (
            <button
              key={mood.title}
              type="button"
              onClick={() => onSelect(mood)}
              className={`min-w-[72%] snap-start rounded-[1.5rem] border p-5 text-left transition sm:min-w-[38%] lg:min-w-0 ${
                isActive
                  ? "border-primary bg-primary text-white shadow-[0_18px_45px_rgba(194,24,116,0.18)]"
                  : "border-primary/10 bg-white text-[#241820] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(112,36,73,0.08)]"
              }`}
            >
              <Sparkles className={`h-5 w-5 ${isActive ? "text-white" : "text-primary"}`} />
              <span className="mt-4 block text-xl font-semibold">{mood.title}</span>
              <span className={`mt-2 block text-sm leading-6 ${isActive ? "text-white/74" : "text-[#725f69]"}`}>{mood.subtitle}</span>
            </button>
          );
        })}
      </div>
      <ProductRail products={products} label={`${activeTitle} picks`} />
    </div>
  );
}

function FabricStudio() {
  return (
    <div className="mt-16">
      <SectionHeading
        eyebrow="Fabric Studio"
        title="Feel the Fabric Before You Choose"
        subtitle="A premium guide to comfort, weather, care, and occasion suitability."
      />
      <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {fabricStudioCards.map((fabric) => (
          <article
            key={fabric.title}
            className="min-w-[82%] snap-start overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-[0_18px_50px_rgba(112,36,73,0.08)] sm:min-w-[48%] lg:min-w-[31%]"
          >
            <div className="relative aspect-[5/4] overflow-hidden">
              <Image
                src={fabric.image.src}
                alt={fabric.image.alt}
                fill
                sizes="(min-width: 1024px) 31vw, 82vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-2xl font-semibold text-[#241820]">{fabric.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#725f69]">{fabric.subtitle}</p>
              <div className="mt-5 grid gap-2 text-sm">
                <FabricMeta label="Best for" value={fabric.bestOccasions} />
                <FabricMeta label="Weather" value={fabric.weather} />
                <FabricMeta label="Comfort" value={fabric.comfort} />
                <FabricMeta label="Care" value={fabric.maintenance} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ColourStudio({
  activeTitle,
  products,
  onSelect,
}: {
  activeTitle: string;
  products: ProductCard[];
  onSelect: (colour: (typeof colourStudioCards)[number]) => void;
}) {
  return (
    <div className="mt-16">
      <SectionHeading
        eyebrow="Colour Studio"
        title="Find Your Signature Shade"
        subtitle="Tap a colour to see matching demo products."
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
        {colourStudioCards.map((colour) => {
          const isActive = activeTitle === colour.title;
          return (
            <button
              key={colour.title}
              type="button"
              onClick={() => onSelect(colour)}
              className={`rounded-[1.25rem] border bg-white p-3 text-center transition ${
                isActive ? "border-primary shadow-[0_14px_35px_rgba(194,24,116,0.16)]" : "border-primary/10"
              }`}
            >
              <span
                className="mx-auto block h-12 w-12 rounded-full border border-black/10 shadow-inner"
                style={{ backgroundColor: colour.value }}
              />
              <span className="mt-3 block text-xs font-semibold text-[#241820]">{colour.title}</span>
            </button>
          );
        })}
      </div>
      <ProductRail products={products} label={`${activeTitle} edit`} />
    </div>
  );
}

function ProductRail({ products, label }: { products: ProductCard[]; label: string }) {
  return (
    <div className="mt-5 rounded-[2rem] border border-primary/10 bg-white p-4 shadow-[0_18px_50px_rgba(112,36,73,0.08)]">
      <p className="px-1 text-sm font-semibold text-primary">{label}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <article key={`${label}-${product.name}`} className="overflow-hidden rounded-3xl bg-[#fffafd]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={product.image.src} alt={product.image.alt} fill sizes="(min-width: 1024px) 22vw, 46vw" className="object-cover" />
              <button
                type="button"
                aria-label={`Save ${product.name}`}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-primary"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold leading-5 text-[#241820]">{product.name}</h4>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#8a6400]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {product.rating}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#241820]">{product.price}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FabricMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#fff8fb] px-4 py-3">
      <span className="font-semibold text-[#3a2530]">{label}</span>
      <span className="text-right text-[#725f69]">{value}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className="mb-7 max-w-3xl"
    >
      <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
        {eyebrow}
      </motion.p>
      <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold leading-tight text-[#241820] sm:text-5xl">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-3 text-sm leading-7 text-[#725f69] sm:text-base">
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
