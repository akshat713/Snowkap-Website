import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/site/SectionHeader";
import { SECTORS } from "@/data/site";

export default function SectorExplorer() {
  const [active, setActive] = useState(SECTORS[0].id);
  const current = SECTORS.find((s) => s.id === active);

  return (
    <section id="sectors" className="py-24 md:py-36 border-t border-ink/10" data-testid="sectors-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Sector explorer"
          title="Wherever your business sits, we've already mapped it."
          lede="Snowkap works across six sectors. Select yours to see the pressures specific to it and the package that fits."
        />

        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
          <div className="border-t border-ink/10">
            {SECTORS.map((s) => (
              <button
                key={s.id}
                onMouseEnter={() => setActive(s.id)}
                onClick={() => setActive(s.id)}
                data-testid={`sector-${s.id}`}
                className={`w-full text-left border-b border-ink/10 py-6 group flex items-center justify-between gap-4 transition-colors ${active === s.id ? "" : "opacity-55 hover:opacity-100"}`}
              >
                <div>
                  <h3 className={`font-display text-2xl md:text-3xl font-semibold transition-colors ${active === s.id ? "text-signal" : "text-ink"}`}>
                    {s.name}
                  </h3>
                  <AnimatePresence>
                    {active === s.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="text-ink2 text-sm mt-2 max-w-md overflow-hidden"
                      >
                        {s.note}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span className={`font-mono text-sm transition-transform ${active === s.id ? "text-signal translate-x-0" : "text-ink3 -translate-x-2"}`}>→</span>
              </button>
            ))}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden bg-surface sticky top-28">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.name}
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <div className="font-mono text-[11px] uppercase tracking-wider text-signal mb-1">Sector focus</div>
              <div className="font-display text-2xl font-bold">{current.name}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
