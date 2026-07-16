"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Heart, Share2, Sparkles, type LucideIcon } from "lucide-react";
import { designStudio, type DesignStudioImageOption, type DesignStudioOption } from "./landing-content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const steps = [
  "Base Style",
  "Fabric",
  "Colour",
  "Neck Style",
  "Sleeve",
  "Length",
  "Details",
] as const;

export function DressDesignStudio() {
  const [stepIndex, setStepIndex] = useState(0);
  const [style, setStyle] = useState<DesignStudioImageOption>(designStudio.baseStyles[0]);
  const [fabric, setFabric] = useState<DesignStudioOption>(designStudio.fabrics[1]);
  const [colour, setColour] = useState<DesignStudioOption>(designStudio.colours[0]);
  const [neck, setNeck] = useState<DesignStudioOption>(designStudio.neckStyles[0]);
  const [sleeve, setSleeve] = useState<DesignStudioOption>(designStudio.sleeves[3]);
  const [length, setLength] = useState<DesignStudioOption>(designStudio.lengths[3]);
  const [details, setDetails] = useState<string[]>(["Embroidery"]);

  const progress = ((stepIndex + 1) / steps.length) * 100;
  const estimatedPrice = useMemo(() => style.estimate ?? "₹3,499", [style]);

  function toggleDetail(title: string) {
    setDetails((current) => (current.includes(title) ? current.filter((item) => item !== title) : [...current, title]));
  }

  return (
    <section className="bg-[#fffafd] px-4 py-14 sm:px-6 lg:px-8" id="dress-design-studio">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="mx-auto max-w-[1280px] rounded-[2rem] border border-primary/10 bg-white p-5 shadow-[0_28px_90px_rgba(112,36,73,0.12)] sm:p-8 lg:p-10"
      >
        <motion.div variants={fadeUp} className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Dress Design Studio</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-[#241820] sm:text-6xl">{designStudio.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#725f69] sm:text-base">{designStudio.subtitle}</p>
          </div>
          <div className="rounded-full bg-[#fff5fa] p-2">
            <div className="h-2 overflow-hidden rounded-full bg-primary/10">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.35 }} />
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={fadeUp} className="rounded-[1.75rem] bg-[#fff8fb] p-4 sm:p-5">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:-mx-5 sm:px-5">
              {steps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={`min-w-fit rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                    index === stepIndex ? "bg-primary text-white shadow-lg" : "bg-white text-[#6f5d66]"
                  }`}
                >
                  {index + 1}. {step}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-white p-4 sm:p-5">
              <StepContent
                stepIndex={stepIndex}
                style={style}
                setStyle={setStyle}
                fabric={fabric}
                setFabric={setFabric}
                colour={colour}
                setColour={setColour}
                neck={neck}
                setNeck={setNeck}
                sleeve={sleeve}
                setSleeve={setSleeve}
                length={length}
                setLength={setLength}
                details={details}
                toggleDetail={toggleDetail}
              />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                  disabled={stepIndex === 0}
                  className="rounded-full border border-primary/15 px-5 py-3 text-sm font-semibold text-primary disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((current) => Math.min(steps.length - 1, current + 1))}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
                >
                  {stepIndex === steps.length - 1 ? "Preview Design" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.aside variants={fadeUp} className="sticky top-20 h-fit overflow-hidden rounded-[1.75rem] bg-[#241820] text-white shadow-[0_28px_80px_rgba(36,24,32,0.18)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={style.image.src} alt={style.image.alt} fill sizes="(min-width: 1024px) 42vw, 92vw" className="object-cover opacity-88" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241820] via-[#241820]/22 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/20 bg-white/14 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Live Preview</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">FIT Match 98%</span>
                </div>
                <h3 className="mt-3 text-3xl font-semibold">{style.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {colour.title} {fabric.title} with {neck.title}, {sleeve.title} sleeves, and {length.title} length.
                </p>
              </div>
            </div>
            <div className="grid gap-3 p-5">
              <PreviewLine label="Fabric" value={fabric.title} />
              <PreviewLine label="Colour" value={colour.title} swatch={colour.value} />
              <PreviewLine label="Neck" value={neck.title} />
              <PreviewLine label="Sleeves" value={sleeve.title} />
              <PreviewLine label="Length" value={length.title} />
              <PreviewLine label="Details" value={details.length ? details.join(", ") : "Clean finish"} />
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/55">Estimated price</p>
                  <p className="mt-1 text-xl font-semibold">{estimatedPrice}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs text-white/55">Stitch time</p>
                  <p className="mt-1 text-xl font-semibold">7-10 days</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <ActionButton icon={Heart} label="Save Design" />
                <ActionButton icon={Sparkles} label="Order This Design" />
                <ActionButton icon={Share2} label="Share Design" />
              </div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

function StepContent(props: {
  stepIndex: number;
  style: DesignStudioImageOption;
  setStyle: (value: DesignStudioImageOption) => void;
  fabric: DesignStudioOption;
  setFabric: (value: DesignStudioOption) => void;
  colour: DesignStudioOption;
  setColour: (value: DesignStudioOption) => void;
  neck: DesignStudioOption;
  setNeck: (value: DesignStudioOption) => void;
  sleeve: DesignStudioOption;
  setSleeve: (value: DesignStudioOption) => void;
  length: DesignStudioOption;
  setLength: (value: DesignStudioOption) => void;
  details: string[];
  toggleDetail: (title: string) => void;
}) {
  if (props.stepIndex === 0) {
    return (
      <OptionGrid title="Choose Base Style">
        {designStudio.baseStyles.map((option) => (
          <ImageOption key={option.title} option={option} selected={props.style.title === option.title} onClick={() => props.setStyle(option)} />
        ))}
      </OptionGrid>
    );
  }

  if (props.stepIndex === 1) {
    return <SimpleOptions title="Choose Fabric" options={designStudio.fabrics} selected={props.fabric.title} onSelect={props.setFabric} textured />;
  }

  if (props.stepIndex === 2) {
    return <SimpleOptions title="Choose Colour" options={designStudio.colours} selected={props.colour.title} onSelect={props.setColour} colour />;
  }

  if (props.stepIndex === 3) {
    return <SimpleOptions title="Choose Neck Style" options={designStudio.neckStyles} selected={props.neck.title} onSelect={props.setNeck} />;
  }

  if (props.stepIndex === 4) {
    return <SimpleOptions title="Choose Sleeve" options={designStudio.sleeves} selected={props.sleeve.title} onSelect={props.setSleeve} />;
  }

  if (props.stepIndex === 5) {
    return <SimpleOptions title="Choose Length" options={designStudio.lengths} selected={props.length.title} onSelect={props.setLength} />;
  }

  return (
    <OptionGrid title="Optional Details">
      {designStudio.details.map((option) => (
        <button
          key={option.title}
          type="button"
          onClick={() => props.toggleDetail(option.title)}
          className={`rounded-3xl border p-4 text-left transition ${
            props.details.includes(option.title) ? "border-primary bg-primary text-white" : "border-primary/10 bg-[#fffafd] text-[#241820]"
          }`}
        >
          <span className="flex items-center justify-between gap-3">
            <span>
              <span className="block font-semibold">{option.title}</span>
              <span className={`mt-1 block text-sm ${props.details.includes(option.title) ? "text-white/72" : "text-[#725f69]"}`}>
                {option.subtitle}
              </span>
            </span>
            {props.details.includes(option.title) ? <Check className="h-5 w-5" /> : null}
          </span>
        </button>
      ))}
    </OptionGrid>
  );
}

function OptionGrid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-[#241820]">{title}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ImageOption({ option, selected, onClick }: { option: DesignStudioImageOption; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group overflow-hidden rounded-3xl border text-left transition ${
        selected ? "border-primary shadow-[0_18px_45px_rgba(194,24,116,0.18)]" : "border-primary/10"
      }`}
    >
      <span className="relative block aspect-[5/4] overflow-hidden">
        <Image src={option.image.src} alt={option.image.alt} fill sizes="(min-width: 1024px) 26vw, 46vw" className="object-cover transition duration-500 group-hover:scale-105" />
        {selected ? <span className="absolute right-3 top-3 rounded-full bg-primary p-2 text-white"><Check className="h-4 w-4" /></span> : null}
      </span>
      <span className="block p-4">
        <span className="block font-semibold text-[#241820]">{option.title}</span>
        <span className="mt-1 block text-sm leading-6 text-[#725f69]">{option.subtitle}</span>
      </span>
    </button>
  );
}

function SimpleOptions({
  title,
  options,
  selected,
  onSelect,
  colour = false,
  textured = false,
}: {
  title: string;
  options: DesignStudioOption[];
  selected: string;
  onSelect: (value: DesignStudioOption) => void;
  colour?: boolean;
  textured?: boolean;
}) {
  return (
    <OptionGrid title={title}>
      {options.map((option) => {
        const isSelected = selected === option.title;
        return (
          <button
            key={option.title}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-3xl border p-4 text-left transition ${
              isSelected ? "border-primary bg-primary text-white" : "border-primary/10 bg-[#fffafd] text-[#241820] hover:bg-white"
            }`}
          >
            {colour && option.value ? <span className="mb-4 block h-12 w-12 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: option.value }} /> : null}
            {textured ? <span className="mb-4 block h-10 rounded-2xl bg-gradient-to-r from-primary/10 via-[#efe1cf] to-[#241820]/10" /> : null}
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-semibold">{option.title}</span>
                <span className={`mt-1 block text-sm leading-6 ${isSelected ? "text-white/72" : "text-[#725f69]"}`}>{option.subtitle}</span>
              </span>
              {isSelected ? <Check className="h-5 w-5 shrink-0" /> : null}
            </span>
          </button>
        );
      })}
    </OptionGrid>
  );
}

function PreviewLine({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm">
      <span className="text-white/55">{label}</span>
      <span className="flex items-center gap-2 font-semibold">
        {swatch ? <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: swatch }} /> : null}
        {value}
      </span>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button type="button" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white hover:text-primary">
      <Icon className="mr-1.5 h-4 w-4" />
      {label}
    </button>
  );
}
