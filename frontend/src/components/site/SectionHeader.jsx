import React from "react";
import { Reveal } from "./Reveal";

export default function SectionHeader({ eyebrow, title, lede, align = "left", light = false }) {
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
      <Reveal i={1}>
        <h2 className={`font-display font-bold tracking-tight leading-[1.05] text-4xl md:text-5xl lg:text-6xl ${light ? "text-bg" : "text-white"}`}>
          {title}
        </h2>
      </Reveal>
      {lede && (
        <Reveal i={2}>
          <p className={`mt-6 text-base md:text-lg leading-relaxed ${light ? "text-bg/70" : "text-ink2"}`}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
