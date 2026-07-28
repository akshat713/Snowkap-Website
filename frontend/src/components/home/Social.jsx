import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { TESTIMONIALS, STANDARDS } from "@/data/site";

export function Testimonials() {
  return (
    <section className="py-24 md:py-36 bg-surface border-t border-ink/10" data-testid="testimonials-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader eyebrow="Customer voices" title="Trusted by the people who decide." />
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} i={i}>
              <div className="h-full border border-ink/10 bg-bg/50 p-7 flex flex-col hover:border-signal/40 transition-colors">
                <div className="font-mono text-[10px] uppercase tracking-wider text-signal mb-5">{t.sector}</div>
                <p className="font-display text-lg leading-snug mb-8 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-ink/20 flex items-center justify-center font-mono text-sm text-signal">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-ink3 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Standards() {
  return (
    <section className="py-24 md:py-36 border-t border-ink/10" data-testid="standards-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Global standards & security"
          title="Structured by methodology. Recognised everywhere we operate."
        />
        <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
          {STANDARDS.map((s, i) => (
            <Reveal key={s.group} i={i}>
              <h6 className="font-mono text-[11px] uppercase tracking-wider text-ink3 mb-5 pb-3 border-b border-ink/10">{s.group}</h6>
              <ul className="space-y-2.5">
                {s.items.map((it) => (
                  <li key={it} className="text-ink2 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-signal" /> {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
