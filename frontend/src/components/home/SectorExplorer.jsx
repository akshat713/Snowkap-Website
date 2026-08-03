import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Boxes, Layers, Grid2x2X, Target,
  Truck, Factory, HeartPulse, Landmark, CupSoda, Zap, ArrowRight,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { SECTORS, FORCES } from "@/data/site";
import { SECTOR_PLAYBOOK } from "@/data/recommendations";

// Pick your sector, get your starting point. The old version was a list of six
// names beside a snapshot that only restated the pressures — a reader learned
// what was wrong and nothing about what to do next.
//
// Now the panel has two halves: the pressures specific to the sector on the
// left, and the actual opening move on the right — the three-phase journey and
// the services it starts with, both already authored in SECTOR_PLAYBOOK and
// previously visible only inside the dossier. Selecting a sector now ends in a
// button, which is what a reader who has just recognised their own situation
// wants.
//
// The tabs run horizontally rather than as six stacked rows: it saves the height
// the panel needs to fit in one frame, and six short names read fine in a row.

const FORCE_ICONS = { supply: Boxes, layers: Layers, fragments: Grid2x2X, capital: Target };

const SECTOR_ICONS = {
  automotive: Truck,
  manufacturing: Factory,
  healthcare: HeartPulse,
  financial: Landmark,
  beverages: CupSoda,
  energy: Zap,
};

// The tab labels shorten the full sector names — "Automotive & Transportation"
// in a pill row wraps and the row loses its shape. The panel shows the full name.
const SHORT = {
  automotive: "Automotive",
  manufacturing: "Manufacturing",
  healthcare: "Healthcare & Pharma",
  financial: "Financial & IT",
  beverages: "Consumer Goods",
  energy: "Energy & Utilities",
};

export default function SectorExplorer() {
  const [active, setActive] = useState(SECTORS[0].id);
  const index = SECTORS.findIndex((s) => s.id === active);
  const current = SECTORS[index];
  const play = SECTOR_PLAYBOOK[current.name];

  // Wraps, so the stepper never dead-ends on the first or last sector.
  const step = (d) => setActive(SECTORS[(index + d + SECTORS.length) % SECTORS.length].id);

  return (
    // scroll-mt clears the fixed header, so the hero's "Find Your Sector" lands
    // on the heading rather than tucking it under the nav
    <section
      id="sectors"
      className="scroll-mt-24 py-20 md:py-24 bg-bg border-t border-ink/10"
      data-testid="sectors-section"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          tight
          eyebrow="Sector explorer"
          title={<>Wherever your business sits, <span className="text-signal">we&rsquo;ve already mapped it.</span></>}
          lede="Six sectors. Select yours for the pressures specific to it — and the first three moves we would make."
        />

        {/* Sector tabs. Horizontal scroll on narrow screens rather than a wrap,
            so the row keeps one line and the selected pill stays findable. */}
        <div
          role="tablist"
          aria-label="Sector"
          className="flex gap-2 overflow-x-auto mb-6 md:mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SECTORS.map((s) => {
            const Icon = SECTOR_ICONS[s.id] || Boxes;
            const on = active === s.id;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(s.id)}
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                data-testid={`sector-${s.id}`}
                className={`relative shrink-0 flex items-center gap-2 px-4 py-2.5 border transition-colors ${
                  on
                    ? "border-signal text-bg"
                    : "border-ink/15 text-ink2 hover:border-ink/35 hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="sector-pill"
                    className="absolute inset-0 bg-signal"
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <Icon className="relative w-4 h-4 shrink-0" strokeWidth={1.9} />
                <span className="relative font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] whitespace-nowrap">
                  {SHORT[s.id] || s.name}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-px bg-ink/10 border border-ink/10"
            data-testid="sector-snapshot"
          >
            {/* Left: what is pressing on this sector */}
            <div className="bg-surface p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-signal">
                  Sector snapshot
                </span>
                <span className="flex-1 h-px bg-ink/12" />
              </div>
              <h3 className="font-display text-2xl md:text-[27px] font-bold text-ink leading-tight mb-3">
                {current.name}
              </h3>
              <p className="text-ink2 text-[14px] leading-relaxed mb-6">
                {play ? play.pressure : current.note}
              </p>
              <ul className="space-y-2.5">
                {current.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-ink2 text-[13.5px] leading-relaxed">
                    <span className="mt-[0.5em] w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Stepper pinned to the foot of the panel. It closes the gap the
                  taller right column opens, and on a phone — where the tab row
                  has scrolled out of sight by now — it is the easier control. */}
              <div className="mt-auto pt-7 flex items-center justify-between gap-4 border-t border-ink/10">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink3">
                  {String(index + 1).padStart(2, "0")} / {String(SECTORS.length).padStart(2, "0")} sectors
                </span>
                <div className="flex gap-px bg-ink/12">
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous sector"
                    className="w-9 h-9 bg-surface hover:bg-signal hover:text-white text-ink2 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next sector"
                    className="w-9 h-9 bg-surface hover:bg-signal hover:text-white text-ink2 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: the opening move. Three numbered phases on a rail, then the
                services that start it and a way to act on it. */}
            <div className="bg-bg p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink3">
                  Where we would start
                </span>
                <span className="flex-1 h-px bg-ink/12" />
              </div>

              {play ? (
                <>
                  <ol className="relative pl-8 mb-6">
                    <span
                      aria-hidden="true"
                      className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-signal via-signal/40 to-ink/10"
                    />
                    {play.journey.map((j, i) => (
                      <li key={j.phase} className="relative mb-4 last:mb-0">
                        <span
                          aria-hidden="true"
                          className="absolute -left-8 top-0 w-[23px] h-[23px] rounded-full bg-signal text-white font-mono text-[10px] font-bold flex items-center justify-center ring-4 ring-bg"
                        >
                          {i + 1}
                        </span>
                        <div className="font-display text-[15px] font-bold text-ink leading-snug">
                          {j.phase}
                        </div>
                        <p className="text-ink2 text-[13px] leading-relaxed mt-0.5">{j.detail}</p>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-auto">
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink3 mb-2.5">
                      Usually starts with
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {play.services.map((sv) => (
                        <span
                          key={sv}
                          className="text-[12px] font-medium text-ink2 bg-surface border border-ink/12 rounded-full px-2.5 py-1"
                        >
                          {sv}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/pricing"
                      data-testid="sector-cta"
                      className="group inline-flex items-center gap-2 bg-ink text-bg font-semibold text-[13.5px] px-5 py-3 hover:bg-signal transition-colors"
                    >
                      Build a package for {SHORT[current.id] || current.name}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-ink2 text-sm leading-relaxed">{current.note}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* The four forces every sector is subject to regardless — the general
            case, landing on a reader who has just seen their own specific one. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px mt-px bg-ink/10 border border-ink/10 border-t-0">
          {FORCES.map((f, i) => {
            const Icon = FORCE_ICONS[f.icon] || Boxes;
            return (
              <Reveal
                key={f.n}
                i={i}
                className="group bg-bg hover:bg-surface transition-colors p-6"
              >
                <div className="flex items-center gap-3 mb-3.5" data-testid={`force-${i}`}>
                  <span className="shrink-0 w-9 h-9 bg-signal/10 border border-signal/25 flex items-center justify-center group-hover:bg-signal transition-colors">
                    <Icon
                      className="w-[17px] h-[17px] text-signal group-hover:text-white transition-colors"
                      strokeWidth={1.9}
                    />
                  </span>
                  <span className="font-mono text-[11px] font-bold text-ink/25 group-hover:text-signal transition-colors">
                    {f.n}
                  </span>
                </div>
                <h4 className="font-display text-[15px] font-bold text-ink leading-snug mb-2">{f.title}</h4>
                <p className="text-ink2 text-[12.5px] leading-relaxed">{f.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
