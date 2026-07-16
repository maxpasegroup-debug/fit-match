"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Camera, Check, Heart, Ruler, Sparkles, Star, Upload } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { demoProducts, fitJourneyIntro, fitJourneySteps } from "./landing-content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export function FitJourney() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({
    0: fitJourneySteps[0]?.options[0]?.label ?? "",
  });

  const activeStep = fitJourneySteps[stepIndex];
  const progress = ((stepIndex + 1) / fitJourneySteps.length) * 100;
  const recommendations = useMemo(() => demoProducts.slice(0, 4), []);

  function choose(label: string) {
    setSelected((current) => ({ ...current, [stepIndex]: label }));
  }

  function nextStep() {
    setStepIndex((current) => Math.min(current + 1, fitJourneySteps.length - 1));
  }

  function previousStep() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <section className="relative bg-[#fffafd] px-4 py-10 sm:px-6 lg:px-8" id="fit-journey">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="rounded-[2rem] border border-[#eadde6] bg-white p-5 shadow-[0_20px_58px_rgba(112,36,73,0.10)] sm:p-7 lg:p-8"
        >
          <div className="grid gap-7 lg:grid-cols-[0.88fr_1.12fr]">
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Signature FIT Journey</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#241820] sm:text-5xl">
                {fitJourneyIntro.title}
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#725f69] sm:text-base">
                {fitJourneyIntro.subtitle}
              </p>
              <div className="mt-7 grid gap-3">
                {fitJourneyIntro.cards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.title}
                      type="button"
                      onClick={() => setStepIndex(index === 0 ? 0 : index === 1 ? 1 : 2)}
                    className="group flex items-center gap-4 rounded-[1.5rem] border border-[#eadde6] bg-[#fff8fb] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_36px_rgba(112,36,73,0.09)]"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#c21874] text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold text-[#241820]">{card.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-[#725f69]">{card.subtitle}</span>
                      </span>
                      <span className="hidden rounded-full border border-[#eadde6] bg-white px-4 py-2 text-xs font-semibold text-[#c21874] shadow-sm sm:block">
                        {card.cta}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-[1.75rem] bg-[#241820] p-4 text-white shadow-inner sm:p-5">
              <div className="rounded-[1.35rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/52">
                      Step {stepIndex + 1} of {fitJourneySteps.length}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold">{activeStep.title}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#c21874]">{Math.round(progress)}%</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/12">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-6 gap-1.5" aria-label="FIT Journey progress">
                  {fitJourneySteps.map((step, index) => (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setStepIndex(index)}
                      aria-label={`Go to ${step.title}`}
                      className={`h-2 rounded-full transition ${index <= stepIndex ? "bg-white" : "bg-white/18"}`}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                key={activeStep.title}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-5 rounded-[1.35rem] bg-white p-4 text-[#241820] sm:p-6"
              >
                <p className="text-sm leading-6 text-[#725f69]">{activeStep.subtitle}</p>

                {stepIndex === fitJourneySteps.length - 1 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {recommendations.map((product) => (
                      <article key={product.name} className="overflow-hidden rounded-3xl border border-primary/10 bg-[#fffafd]">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={product.image.src}
                            alt={product.image.alt}
                            fill
                            sizes="(min-width: 1024px) 220px, 46vw"
                            className="object-cover"
                          />
                          <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#c21874]">
                            {product.fit}
                          </span>
                          <button
                            type="button"
                            aria-label={`Save ${product.name}`}
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-[#c21874]"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold leading-5">{product.name}</h4>
                            <span className="flex items-center gap-1 text-xs font-semibold text-[#8a6400]">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {product.rating}
                            </span>
                          </div>
                          <p className="mt-2 text-sm font-semibold">{product.price}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : stepIndex === 0 ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.85fr]">
                    <button
                      type="button"
                      onClick={() => choose(activeStep.options[0]?.label ?? "Use AI photos")}
                      className={`group rounded-3xl border p-5 text-left transition ${
                        selected[stepIndex] === activeStep.options[0]?.label
                          ? "border-[#c21874] bg-gradient-to-br from-[#c21874] via-[#a91562] to-[#5c173f] text-white shadow-[0_18px_45px_rgba(194,24,116,0.22)]"
                          : "border-[#eadde6] bg-[#fff8fb] text-[#241820] hover:border-[#c21874]/30 hover:bg-white"
                      }`}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c21874] shadow-[0_14px_30px_rgba(112,36,73,0.12)]">
                        <Upload className="h-5 w-5" />
                      </span>
                      <span className="mt-5 block text-lg font-semibold">Upload photos</span>
                      <span className={`mt-2 block text-sm leading-6 ${selected[stepIndex] === activeStep.options[0]?.label ? "text-white/78" : "text-[#725f69]"}`}>
                        Add front and side photos for a guided measurement preview.
                      </span>
                      <span className="mt-5 grid grid-cols-2 gap-3">
                        {["Front photo", "Side photo"].map((label) => (
                          <span key={label} className="rounded-2xl border border-current/20 bg-white/16 p-3">
                            <Camera className="h-4 w-4" />
                            <span className="mt-2 block text-xs font-semibold">{label}</span>
                          </span>
                        ))}
                      </span>
                    </button>
                    <div className="grid gap-3">
                      {activeStep.options.slice(1).map((option) => {
                        const isSelected = selected[stepIndex] === option.label;
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => choose(option.label)}
                            className={`group rounded-3xl border p-4 text-left transition ${
                              isSelected
                                ? "border-[#c21874] bg-gradient-to-br from-[#c21874] to-[#7b174c] text-white shadow-[0_18px_45px_rgba(194,24,116,0.18)]"
                                : "border-[#eadde6] bg-[#fffafd] text-[#241820] hover:border-[#c21874]/30 hover:bg-white"
                            }`}
                          >
                            <span className="flex items-start gap-3">
                              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${isSelected ? "bg-white/16" : "bg-[#fde8f3] text-[#c21874]"}`}>
                                {option.label.includes("saved") ? <Ruler className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                              </span>
                              <span>
                                <span className="block font-semibold">{option.label}</span>
                                <span className={`mt-1 block text-sm leading-6 ${isSelected ? "text-white/76" : "text-[#725f69]"}`}>
                                  {option.detail}
                                </span>
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {activeStep.options.map((option) => {
                      const isSelected = selected[stepIndex] === option.label;
                      return (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() => choose(option.label)}
                          className={`group min-h-[96px] rounded-3xl border p-4 text-left transition ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-[0_18px_45px_rgba(194,24,116,0.18)]"
                              : "border-primary/10 bg-[#fffafd] hover:border-primary/30 hover:bg-white"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-3">
                            <span>
                              {option.value ? (
                                <span
                                  className="mb-3 block h-9 w-9 rounded-full border border-black/10 shadow-sm"
                                  style={{ backgroundColor: option.value }}
                                />
                              ) : null}
                              <span className="block font-semibold">{option.label}</span>
                              <span className={`mt-1 block text-sm leading-6 ${isSelected ? "text-white/76" : "text-[#725f69]"}`}>
                                {option.detail}
                              </span>
                            </span>
                            {isSelected ? <Check className="h-5 w-5 shrink-0" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={previousStep}
                    disabled={stepIndex === 0}
                    className="rounded-full border border-primary/15 px-5 py-3 text-sm font-semibold text-primary disabled:opacity-40"
                  >
                    Back
                  </button>
                  {stepIndex === fitJourneySteps.length - 1 ? (
                    <ButtonLink href="/collections" className="rounded-full px-6">
                      View Recommended Designs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </ButtonLink>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
