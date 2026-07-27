import React from "react";
import { Reveal } from "@/components/site/Reveal";

export default function PageHero({ eyebrow, title, lede, children }) {
  return (
    <section className="pt-40 pb-16 border-b border-white/10 grid-lines">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-signal" /> {eyebrow}
          </div>
        </Reveal>
        <Reveal i={1}>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl leading-[0.95]">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal i={2}>
            <p className="text-ink2 text-lg mt-6 max-w-2xl leading-relaxed">{lede}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
