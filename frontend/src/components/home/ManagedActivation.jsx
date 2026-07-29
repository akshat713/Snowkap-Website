import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { ACTIVATION_PROOF, ACTIVATION_ROI, ACTIVATION_EDGE } from "@/data/site";

// The differentiator block: the one claim that separates this from every
// carbon-accounting platform, which is that the hard part isn't the software.
//
// The bars are the argument, so they are built as a like-for-like comparison
// with the self-serve figure directly above the managed figure. The two rows in
// each pair share a scale; without that the comparison would be decorative.
// Note the second pair inverts — fewer days is better — so the shorter bar is
// the accent one, which is why the fill values are authored rather than derived
// from the numbers.

function Bar({ row, i }) {
  const reduce = useReducedMotion();
  const primary = row.tone === "primary";

  return (
    <div className="py-4" data-testid={`activation-bar-${i}`}>
      <div className="flex items-baseline justify-between gap-4 mb-2.5">
        <span className={`text-sm md:text-[15px] font-semibold ${primary ? "text-ink" : "text-ink2"}`}>
          {row.label}
        </span>
        <span className={`font-mono text-sm font-bold shrink-0 ${primary ? "text-signal" : "text-ink3"}`}>
          {row.value}
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-ink/[0.07] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${primary ? "bg-signal" : "bg-signal/45"}`}
          initial={reduce ? { width: `${row.fill}%` } : { width: 0 }}
          whileInView={{ width: `${row.fill}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.05, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function ManagedActivation() {
  return (
    <section className="py-24 md:py-36 bg-surface border-y border-ink/10" data-testid="activation-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Why Snowkap"
          title="Software can send a questionnaire. It can't make someone answer it."
          lede="A meaningful share of suppliers across emerging markets never respond to a self-serve portal. That is not a data problem, it's a people problem — and it's the one thing no carbon-accounting platform is built to solve."
        />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
          <Reveal>
            <div className="border-2 border-signal/60 bg-bg p-6 md:p-9" data-testid="activation-bars">
              <div className="divide-y divide-ink/[0.07]">
                {ACTIVATION_PROOF.map((row, i) => (
                  <Bar key={row.label} row={row} i={i} />
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal i={1}>
            <div className="bg-bg border border-ink/10 p-8 md:p-9 h-full" data-testid="activation-roi">
              <div className="font-display text-6xl md:text-7xl font-extrabold tracking-tighter text-signal leading-none">
                {ACTIVATION_ROI.figure}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink2 mt-3 mb-6">
                {ACTIVATION_ROI.caption}
              </div>
              <p className="text-ink2 text-sm leading-relaxed">{ACTIVATION_ROI.body}</p>
            </div>
          </Reveal>
        </div>

        {/* gap-px over an ink ground draws the dividers, so four cards read as one
            block rather than four floating panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mt-8 bg-ink/10 border border-ink/10">
          {ACTIVATION_EDGE.map((e, i) => (
            <Reveal key={e.title} i={i} className="bg-bg p-7 md:p-8 hover:bg-surface transition-colors">
              <h3 className="font-display text-lg font-bold text-signal leading-snug mb-4">{e.title}</h3>
              <p className="text-ink2 text-sm leading-relaxed">{e.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
