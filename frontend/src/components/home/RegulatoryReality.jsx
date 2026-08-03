import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import FlagMark from "@/components/site/FlagMark";
import { REGIONS, REGULATORY_TIMELINE } from "@/data/site";

// Two halves of one argument. The rail on the right says these dates are a
// schedule that arrives whether or not you are ready; the table below says the
// five regimes want largely the same supplier data, which is why one platform
// can serve all five.
//
// The market-maturity labels that used to sit at the foot of each column are
// gone — they described Snowkap's own footprint, which is not what a reader
// scanning a regulatory table is looking for.

const CURRENT_YEAR = 2026;

function Rail() {
  const reduce = useReducedMotion();
  // Group by year so a year heading is drawn once, not once per milestone.
  const years = [...new Set(REGULATORY_TIMELINE.map((m) => m.year))];

  return (
    <div className="relative" data-testid="regulatory-rail">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink3">
          Compliance calendar
        </span>
        <span className="flex-1 h-px bg-ink/10" />
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-signal">
          <span className="relative flex w-1.5 h-1.5">
            {!reduce && (
              <span className="absolute inset-0 rounded-full bg-signal animate-ping" />
            )}
            <span className="relative w-1.5 h-1.5 rounded-full bg-signal" />
          </span>
          Live now
        </span>
      </div>

      <ol className="relative pl-7">
        {/* The rail itself. It draws downward on entry, so the block reads as a
            timeline being laid out rather than a list that was always there. */}
        <motion.span
          aria-hidden="true"
          className="absolute left-[3px] top-1 bottom-1 w-px bg-gradient-to-b from-signal/60 via-ink/20 to-ink/10 origin-top"
          initial={reduce ? undefined : { scaleY: 0 }}
          whileInView={reduce ? undefined : { scaleY: 1 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {years.map((year) => {
          const live = year <= CURRENT_YEAR;
          return (
            <li key={year} className="mb-5 last:mb-0">
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 w-[7px] h-[7px] rounded-full ring-2 ring-bg ${
                    live ? "bg-signal" : "bg-ink/30"
                  }`}
                  style={{ marginTop: 1 }}
                />
                <span
                  className={`font-mono text-[13px] font-bold tracking-[0.08em] ${
                    live ? "text-ink" : "text-ink3"
                  }`}
                >
                  {year}
                </span>
                {!live && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink3">
                    Ahead
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {REGULATORY_TIMELINE.filter((m) => m.year === year).map((m) => (
                  <li key={m.label} className="flex items-start gap-2.5">
                    <FlagMark code={m.flag} className="w-[22px] h-[15px] mt-[3px]" />
                    <span className={`text-[13.5px] leading-snug ${live ? "text-ink2" : "text-ink3"}`}>
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function RegulatoryReality() {
  return (
    <section
      id="regulatory"
      className="py-20 md:py-24 bg-bg border-t border-ink/10"
      data-testid="regulatory-section"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-x-14 gap-y-10 mb-10 md:mb-12">
          <div className="lg:col-span-6">
            <SectionHeader
              tight
              eyebrow="Five regions, one dataset"
              title={<>Solving supply chain data <span className="text-signal">across regions</span></>}
              lede="Each region moves on its own timeline and asks for its own forms — and then asks for the same underlying supplier data. Enter it once."
            />
          </div>
          <div className="lg:col-span-6 lg:pt-2">
            <Rail />
          </div>
        </div>

        {/* Five equal columns on one ground, divided by rules rather than split
            into cards: these are five faces of the same requirement, and five
            floating panels would say the opposite. */}
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10 border border-ink/10">
          {REGIONS.map((r, i) => (
            <RevealItem
              key={r.code}
              i={i}
              className="group relative bg-surface hover:bg-surface2 transition-colors p-6 flex flex-col"
            >
              {/* Accent rule that grows on hover — the only movement in the
                  table, so the hovered column is unambiguous. */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 h-[2px] w-0 bg-signal transition-[width] duration-500 ease-out group-hover:w-full"
              />
              <div className="flex items-center gap-3 mb-5">
                <FlagMark code={r.flag} className="w-9 h-6" />
                <span className="font-mono text-lg font-bold tracking-[0.06em] text-ink/35 group-hover:text-signal transition-colors">
                  {r.code}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-signal leading-snug mb-2.5">{r.name}</h3>
              <p className="text-ink2 text-[13.5px] leading-relaxed">{r.note}</p>
              {/* mt-auto pins the framework chips to the bottom so they line up
                  across five columns of unequal copy length. */}
              <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                {r.frameworks.map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-ink2 bg-bg/70 border border-ink/12 rounded-full px-2 py-[3px]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
