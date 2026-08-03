import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapPin, ScrollText, Users, Layers3 } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import ContourField from "@/components/site/ContourField";
import { ACTIVATION_COMPARE, ACTIVATION_ROI, ACTIVATION_EDGE } from "@/data/site";

// The differentiator block: the one claim that separates this from every
// carbon-accounting platform, which is that the hard part isn't the software.
//
// It runs on the dark ground because it is the argument the rest of the page
// rests on — the page alternates white and off-white, so one ink block reads as
// the load-bearing one rather than as another band.
//
// The old version stacked four bars. Four bars is two comparisons the eye has
// to pair up by reading labels; a tab per metric plus a dot matrix makes each
// comparison a single glance. Twenty-eight filled cells against seventy is the
// whole pitch, and it needs no axis.

const EDGE_ICONS = { presence: MapPin, nuance: ScrollText, scale: Users, single: Layers3 };

const CELLS = 100; // 10 × 10 — one cell per supplier contacted

function DotMatrix({ filled, primary, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-10 gap-[3px] w-full max-w-[196px]" aria-hidden="true">
      {Array.from({ length: CELLS }, (_, i) => {
        const on = i < filled;
        return (
          <motion.span
            key={i}
            className={`aspect-square rounded-[1.5px] ${
              on ? (primary ? "bg-signal" : "bg-bg/45") : "bg-bg/[0.08]"
            }`}
            initial={reduce || !on ? undefined : { opacity: 0, scale: 0.4 }}
            whileInView={reduce || !on ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            // Staggering by index rather than by row makes the fill read as a
            // count going up, which is what the number means.
            transition={{ duration: 0.3, delay: delay + i * 0.008, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

function SpeedGauge({ days, scale, primary, delay = 0 }) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, (days / scale) * 100);
  return (
    <div className="w-full max-w-[320px]" aria-hidden="true">
      <div className="relative h-9 bg-bg/[0.07] rounded-sm overflow-hidden">
        {/* Week ticks, so "7 days" and "45 days" are read against something. */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: Math.round(scale / 7) }, (_, i) => (
            <span key={i} className="flex-1 border-r border-bg/10 last:border-r-0" />
          ))}
        </div>
        <motion.div
          className={`relative h-full ${primary ? "bg-signal" : "bg-bg/25"}`}
          initial={reduce ? { width: `${pct}%` } : { width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-bg/35 mt-1.5">
        <span>Day 0</span>
        <span>Week 4</span>
        <span>Week 8</span>
      </div>
    </div>
  );
}

export default function ManagedActivation() {
  const [metric, setMetric] = useState(ACTIVATION_COMPARE[0].id);
  const current = ACTIVATION_COMPARE.find((m) => m.id === metric);

  return (
    <section className="relative py-20 md:py-24 bg-ink text-bg overflow-hidden" data-testid="activation-section">
      {/* Generated backdrop rather than a stock photograph: it carries the
          measured-quantity reading and costs one canvas. */}
      <div className="absolute inset-0 opacity-[0.5] pointer-events-none">
        <ContourField rgb="223, 89, 0" lines={7} alpha={0.16} />
      </div>

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-x-14 gap-y-8 items-end mb-10">
          <div className="lg:col-span-7">
            <SectionHeader
              tight
              light
              eyebrow="Why Snowkap"
              title={<>Software can send a questionnaire. <span className="text-signal">It can&rsquo;t make someone answer it.</span></>}
              lede="A meaningful share of suppliers across emerging markets never respond to a self-serve portal. That is not a data problem, it's a people problem — and it's the one thing no carbon-accounting platform is built to solve."
            />
          </div>

          {/* The ROI figure sits with the headline, not below the chart: it is the
              consequence of the claim, so it belongs in the same glance. */}
          <Reveal i={1} className="lg:col-span-5">
            <div
              className="border border-signal/40 bg-signal/[0.07] backdrop-blur-sm p-6 md:p-7"
              data-testid="activation-roi"
            >
              <div className="flex items-end gap-4">
                <span className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter text-signal leading-none">
                  {ACTIVATION_ROI.figure}
                </span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-bg/60 pb-1.5">
                  {ACTIVATION_ROI.caption}
                </span>
              </div>
              <p className="text-bg/65 text-[13px] leading-relaxed mt-4">{ACTIVATION_ROI.body}</p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="border border-bg/15 bg-bg/[0.03] backdrop-blur-sm" data-testid="activation-compare">
            {/* Metric tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-1 gap-y-2 border-b border-bg/12 p-3 sm:px-4">
              <div className="flex gap-1" role="tablist" aria-label="Comparison metric">
                {ACTIVATION_COMPARE.map((m) => (
                  <button
                    key={m.id}
                    role="tab"
                    aria-selected={metric === m.id}
                    onClick={() => setMetric(m.id)}
                    data-testid={`activation-tab-${m.id}`}
                    className={`relative font-mono text-[11px] font-medium uppercase tracking-[0.14em] px-3.5 py-2.5 transition-colors ${
                      metric === m.id ? "text-ink" : "text-bg/50 hover:text-bg/85"
                    }`}
                  >
                    {metric === m.id && (
                      <motion.span
                        layoutId="activation-tab"
                        className="absolute inset-0 bg-signal"
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative">{m.tab}</span>
                  </button>
                ))}
              </div>
              <span className="sm:ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-bg/40 px-3.5 sm:px-2">
                {current.unit}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-bg/12"
              >
                {current.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className="p-6 md:p-8"
                    data-testid={`activation-row-${current.id}-${i}`}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span
                        className={`font-display text-4xl md:text-5xl font-extrabold tracking-tighter leading-none ${
                          row.primary ? "text-signal" : "text-bg/45"
                        }`}
                      >
                        {row.value}
                      </span>
                      {row.primary && (
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-signal border border-signal/45 px-1.5 py-[3px]">
                          Snowkap
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[13.5px] font-medium mb-6 ${
                        row.primary ? "text-bg/85" : "text-bg/50"
                      }`}
                    >
                      {row.label}
                    </div>
                    {current.id === "response" ? (
                      <DotMatrix filled={row.dots} primary={row.primary} delay={i * 0.12} />
                    ) : (
                      <SpeedGauge
                        days={row.days}
                        scale={current.scale}
                        primary={row.primary}
                        delay={i * 0.12}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            <p className="border-t border-bg/12 px-6 md:px-8 py-4 text-bg/55 text-[13px] leading-relaxed">
              {current.note}
            </p>
          </div>
        </Reveal>

        {/* The four reasons it works. Each carries its own figure, so the row is
            four proofs rather than four assertions. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mt-px bg-bg/12">
          {ACTIVATION_EDGE.map((e, i) => {
            const Icon = EDGE_ICONS[e.icon] || MapPin;
            return (
              <Reveal
                key={e.title}
                i={i}
                className="group bg-ink hover:bg-bg/[0.05] transition-colors p-6 md:p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-[18px] h-[18px] text-signal shrink-0" strokeWidth={1.9} />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-signal">
                    {e.stat}
                  </span>
                </div>
                <h3 className="font-display text-[17px] font-bold text-bg leading-snug mb-2">{e.title}</h3>
                <p className="text-bg/55 text-[13px] leading-relaxed">{e.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
