import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/site/Reveal";
import { REGIONS } from "@/data/site";

// Five equal columns on one off-white ground, divided by rules rather than
// separated into cards. The point of the block is that these are five faces of
// the same requirement, so they should read as one table — five floating panels
// would say the opposite.
//
// The four forces that used to sit below this now live with the sector snapshot,
// where a reader has just seen their own sector's pressures and the general case
// follows naturally.
export default function RegulatoryReality() {
  return (
    <section id="regulatory" className="py-24 md:py-36 bg-bg border-t border-ink/10" data-testid="regulatory-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          title={<>Solving supply chain data <span className="text-signal">across regions</span></>}
          lede="Five regions, each moving on its own timeline and often demanding the same underlying data."
        />

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink/10 border border-ink/10">
          {REGIONS.map((r, i) => (
            <RevealItem
              key={r.code}
              i={i}
              className="group bg-surface hover:bg-surface2 transition-colors p-7 flex flex-col"
            >
              <span className="font-mono text-3xl font-bold text-ink/20 group-hover:text-signal/70 transition-colors mb-6">
                {r.code}
              </span>
              <h3 className="font-display text-xl font-bold text-signal leading-snug mb-3">{r.name}</h3>
              <p className="text-ink2 text-sm leading-relaxed">{r.note}</p>
              {/* mt-auto pins the status to the bottom, so the labels line up
                  across five columns of unequal copy length */}
              <span
                className={`mt-auto pt-8 font-mono text-[11px] uppercase tracking-wider ${
                  r.tone === "primary" ? "text-signal" : "text-ink3"
                }`}
              >
                {r.status}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
