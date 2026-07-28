import React from "react";
import { ALL_LOGOS } from "@/data/content";

export default function LogoMarquee() {
  return (
    <section className="py-16 md:py-20 border-b border-ink/10 bg-bg overflow-hidden" data-testid="logo-marquee">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink3 text-center">
          Trusted by the people who decide
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        <div className="flex w-max animate-marquee items-center">
          {[...ALL_LOGOS, ...ALL_LOGOS].map(([name, src], i) => (
            <div key={i} className="px-10 flex items-center shrink-0">
              <img src={src} alt={name} title={name} className="h-8 md:h-9 w-auto opacity-60 hover:opacity-100 transition-opacity" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
