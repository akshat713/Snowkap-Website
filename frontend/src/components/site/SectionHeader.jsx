import React from "react";
import { Reveal } from "./Reveal";
import MaskReveal, { MaskBlock } from "./MaskReveal";

export default function SectionHeader({ eyebrow, title, lede, align = "left", light = false }) {
  const titleClass = `font-display font-bold tracking-tight leading-[1.05] text-4xl md:text-5xl lg:text-6xl ${
    light ? "text-bg" : "text-ink"
  }`;
  return (
    <div className={`mb-14 md:mb-20 ${align === "center" ? "text-center mx-auto" : ""} max-w-3xl`}>
      {eyebrow && (
        <Reveal>
          <div className={`font-mono text-[12px] uppercase tracking-[0.2em] mb-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} text-signal`}>
            <span className="w-6 h-px bg-signal inline-block" />
            {eyebrow}
          </div>
        </Reveal>
      )}
      {/* Clipped reveal on the title — every section on the site inherits it from
          here, so the typographic treatment stays consistent. Word-by-word when
          the title is a plain string; as one block when it carries markup, since
          splitting on words would have to stringify it and markup titles would
          render as "[object Object]". */}
      {typeof title === "string" ? (
        <MaskReveal as="h2" delay={0.05} className={titleClass}>
          {title}
        </MaskReveal>
      ) : (
        <MaskBlock as="h2" delay={0.05} className={titleClass}>
          {title}
        </MaskBlock>
      )}
      {lede && (
        <Reveal i={2}>
          <p className={`mt-6 text-base md:text-lg leading-relaxed ${light ? "text-bg/70" : "text-ink2"}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
