import React from "react";
import ClientLogo from "@/components/site/ClientLogo";
import { ALL_LOGOS } from "@/data/content";

export default function LogoMarquee() {
  return (
    <section className="py-14 md:py-18 border-b border-ink/10 bg-bg overflow-hidden" data-testid="logo-marquee">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 mb-9">
        {/* Was 11px at 24% tracking in the lightest ink — technically a label,
            practically unreadable. Larger, in medium, in ink2, with the count
            doing the work the whisper was trying to do. */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 text-center">
          <span className="font-mono text-[12px] md:text-[13px] font-medium uppercase tracking-[0.18em] text-ink2">
            Trusted by the people who decide
          </span>
          <span className="hidden sm:block w-8 h-px bg-ink/20" />
          <span className="font-mono text-[12px] md:text-[13px] font-medium uppercase tracking-[0.18em] text-signal">
            {ALL_LOGOS.length} enterprises · 6 sectors
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Wider fades than before: at 24px a logo was still half-visible as it
            clipped, so the row read as cut off rather than continuous. */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-36 bg-gradient-to-r from-bg via-bg/85 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-36 bg-gradient-to-l from-bg via-bg/85 to-transparent z-10 pointer-events-none" />
        {/* Pauses on hover, so someone who spots their own logo can stop and read it. */}
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {[...ALL_LOGOS, ...ALL_LOGOS].map(([name, src], i) => (
            <div key={i} className="px-6 md:px-8 flex items-center shrink-0">
              <ClientLogo
                name={name}
                src={src}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
