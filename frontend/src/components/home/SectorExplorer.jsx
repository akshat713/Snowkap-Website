import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, Layers, Grid2x2X, Target } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { SECTORS, FORCES } from "@/data/site";

// Two halves that argue for each other: pick your sector on the left and the
// snapshot names the pressures specific to it; the right column shows the four
// forces every sector is subject to regardless. Specific, then universal.
//
// The four forces live here rather than with the regional band because they are
// what the sector snapshot is answering — a reader who has just seen their own
// three pressures is exactly the reader for whom the general four land.

const ICONS = { supply: Boxes, layers: Layers, fragments: Grid2x2X, capital: Target };

export default function SectorExplorer() {
  const [active, setActive] = useState(SECTORS[0].id);
  const current = SECTORS.find((s) => s.id === active);

  return (
    // scroll-mt clears the fixed header, so the hero's "Find Your Sector" lands
    // on the heading rather than tucking it under the nav
    <section id="sectors" className="scroll-mt-24 py-24 md:py-36 bg-bg border-t border-ink/10" data-testid="sectors-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Sector explorer"
          title="Wherever your business sits, we've already mapped it."
          lede="Snowkap works across six sectors. Select yours to see the pressures specific to it, and the forces every sector is now subject to."
        />

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <div className="border-t border-ink/10">
              {SECTORS.map((s) => (
                <button
                  key={s.id}
                  onMouseEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                  onClick={() => setActive(s.id)}
                  data-testid={`sector-${s.id}`}
                  aria-pressed={active === s.id}
                  className={`w-full text-left border-b border-ink/10 py-5 group flex items-center justify-between gap-4 transition-colors ${
                    active === s.id ? "" : "opacity-55 hover:opacity-100"
                  }`}
                >
                  <h3
                    className={`font-display text-xl md:text-2xl font-semibold transition-colors ${
                      active === s.id ? "text-signal" : "text-ink"
                    }`}
                  >
                    {s.name}
                  </h3>
                  <span
                    className={`font-mono text-sm transition-transform ${
                      active === s.id ? "text-signal translate-x-0" : "text-ink3 -translate-x-2"
                    }`}
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Sector snapshot — the specific pressures for whatever is selected */}
            <div className="relative mt-10" data-testid="sector-snapshot">
              <span className="absolute -top-4 left-6 bg-signal text-white font-mono text-[11px] uppercase tracking-[0.16em] px-4 py-2">
                Sector Snapshot
              </span>
              <div className="border border-ink/15 pt-10 pb-7 px-6 md:px-8 bg-surface/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h4 className="font-display text-2xl md:text-3xl font-bold text-signal mb-5">
                      {current.name}
                    </h4>
                    <ul className="space-y-3">
                      {current.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-ink2 leading-relaxed">
                          <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* The four forces, with a rule between each — a list of pressures, not
              a grid of cards, so it reads as one continuous argument */}
          <div className="divide-y divide-ink/10 border-t border-ink/10 lg:border-t-0 lg:pt-0 pt-4">
            {FORCES.map((f, i) => {
              const Icon = ICONS[f.icon] || Boxes;
              return (
                <Reveal key={f.n} i={i}>
                  <div className="flex gap-5 md:gap-7 py-7 md:py-8" data-testid={`force-${i}`}>
                    <span className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-signal flex items-center justify-center">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h4 className="font-display text-xl md:text-2xl font-bold text-signal leading-snug mb-2">
                        {f.title}
                      </h4>
                      <p className="text-ink2 leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
