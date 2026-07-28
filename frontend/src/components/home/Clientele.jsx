import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { CLIENT_SECTORS } from "@/data/content";

export default function Clientele() {
  return (
    <section className="py-24 md:py-36 bg-bg" data-testid="clientele-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Clientele"
          title="Trusted by enterprises across six sectors."
          lede="From steel and automotive to pharma and consumer goods — Snowkap powers ESG transformation where supply chains are hardest."
        />
        <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
          {CLIENT_SECTORS.map((g, gi) => (
            <Reveal key={g.sector} i={gi} className="h-full">
              <div className="bg-bg p-7 md:p-9 h-full" data-testid={`clientele-sector-${gi}`}>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal mb-7">{g.sector}</div>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-7">
                  {g.logos.map(([name, src]) => (
                    <img key={name} src={src} alt={name} title={name} loading="lazy"
                      className="h-7 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity" />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
