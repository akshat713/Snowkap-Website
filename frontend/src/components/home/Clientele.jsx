import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import ClientLogo from "@/components/site/ClientLogo";
import { CLIENT_SECTORS } from "@/data/content";

export default function Clientele() {
  return (
    <section className="py-20 md:py-24 bg-bg" data-testid="clientele-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          tight
          eyebrow="Clientele"
          title="Trusted by enterprises across six sectors."
          lede="From steel and automotive to pharma and consumer goods — Snowkap powers ESG transformation where supply chains are hardest."
        />
        <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
          {CLIENT_SECTORS.map((g, gi) => (
            <Reveal key={g.sector} i={gi} className="h-full">
              <div className="bg-bg p-6 md:p-7 h-full" data-testid={`clientele-sector-${gi}`}>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal mb-7">{g.sector}</div>
                {/* Fixed boxes rather than a shared height, so each client in a
                    sector gets the same footprint regardless of whether its mark
                    is a wide wordmark or a square roundel. */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-5">
                  {g.logos.map(([name, src]) => (
                    <ClientLogo key={name} name={name} src={src} size="sm" />
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
