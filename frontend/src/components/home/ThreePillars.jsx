import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { PILLARS } from "@/data/site";

export default function ThreePillars() {
  return (
    <section id="pillars" className="py-24 md:py-36 bg-surface border-t border-ink/10" data-testid="pillars-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="How we solve it"
          title="Three stations, one operation."
          lede="Advisory sets the strategy. The platform runs the data. Managed support does the work no software can — on the ground, in the languages and time zones your suppliers actually operate in."
        />

        <div className="space-y-5">
          {PILLARS.map((p, idx) => (
            <Reveal key={p.n} i={idx}>
              <div className="group grid md:grid-cols-[auto_1fr_auto] gap-8 items-center border border-ink/10 hover:border-signal/40 bg-bg/60 p-7 md:p-9 transition-colors">
                <div className="font-display text-6xl md:text-8xl font-extrabold text-ink/10 group-hover:text-signal/70 transition-colors leading-none">
                  {p.n}
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-signal mb-3">{p.tag}</div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">{p.title}</h3>
                  <p className="text-ink2 max-w-xl leading-relaxed mb-5">{p.desc}</p>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {p.items.map((it) => (
                      <li key={it} className="text-sm text-ink2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-signal" /> {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden lg:block w-52 h-40 overflow-hidden shrink-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
