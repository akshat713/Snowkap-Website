import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { PROBLEMS } from "@/data/content";

export default function Problem() {
  return (
    <section className="py-24 md:py-36 bg-bg" data-testid="problem-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="The structural problem"
          title="ESG is now a business access requirement. The infrastructure isn't."
          lede="Capital, contracts, and markets now screen on verified ESG data. The problem is not a lack of ambition — it is a lack of infrastructure."
        />
        <div className="border-t border-white/10">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.n} i={i}>
              <div className="group grid grid-cols-[64px_1fr] md:grid-cols-[120px_1fr_1.2fr] gap-6 md:gap-10 py-9 md:py-12 border-b border-white/10 hover:bg-white/[0.025] transition-colors px-2 md:px-4">
                <span className="font-mono text-signal text-sm md:text-base pt-1.5">{p.n}</span>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight group-hover:translate-x-1 transition-transform">
                  {p.title}
                </h3>
                <p className="col-span-2 md:col-span-1 text-ink2 leading-relaxed md:pt-1.5">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal i={2}>
          <p className="mt-14 font-display text-2xl md:text-3xl font-bold max-w-2xl">
            The only risk is <span className="text-signal">standing still.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
