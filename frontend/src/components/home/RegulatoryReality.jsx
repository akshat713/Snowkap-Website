import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { REGIONS, FORCES } from "@/data/site";

export default function RegulatoryReality() {
  return (
    <section id="regulatory" className="py-24 md:py-36 border-t border-white/10" data-testid="regulatory-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="The regulatory reality"
          title="Compliance stopped being a local problem."
          lede="Five regions, each moving on its own timeline — and often demanding the same underlying data."
        />

        <RevealGroup className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {REGIONS.map((r, i) => (
            <RevealItem
              key={r.code}
              i={i}
              className={`${i < 2 ? "md:col-span-6" : "md:col-span-4"} group border border-white/10 hover:border-signal/50 p-7 bg-surface/40 transition-colors relative overflow-hidden`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-4xl font-bold text-white/15 group-hover:text-signal/60 transition-colors">{r.code}</span>
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border ${r.tone === "primary" ? "border-signal/40 text-signal" : "border-white/15 text-ink3"}`}>
                  {r.status}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{r.name}</h3>
              <p className="text-ink2 text-sm leading-relaxed">{r.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* four forces */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px mt-20 bg-white/10 border border-white/10">
          {FORCES.map((f, i) => (
            <Reveal key={f.n} i={i} className="bg-bg p-7 hover:bg-surface transition-colors">
              <span className="font-mono text-signal text-sm">{f.n}</span>
              <h4 className="font-display text-lg font-semibold mt-4 mb-3 leading-snug">{f.title}</h4>
              <p className="text-ink2 text-sm leading-relaxed">{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
