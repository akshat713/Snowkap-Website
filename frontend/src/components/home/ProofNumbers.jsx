import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { PROOF } from "@/data/site";
import { OutlineMarquee } from "@/components/site/Overlays";

export default function ProofNumbers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="py-20 md:py-24 border-t border-ink/10 relative overflow-hidden" data-testid="proof-section">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 opacity-100">
        <OutlineMarquee text="VERIFIED · NOT PROMISED · " />
      </div>
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-4 flex items-center gap-3">
          <span className="w-6 h-px bg-signal inline-block" /> Proof in numbers
        </div>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-16">The numbers behind the claim.</h2>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {PROOF.map((p, i) => (
            <div key={i} className="bg-bg p-6 md:p-8">
              <div className="font-mono font-semibold text-5xl md:text-6xl tracking-tighter text-signal mb-4">
                {inView ? <NumberFlow value={p.value} /> : 0}{p.suffix}
              </div>
              <div className="text-ink font-medium text-sm md:text-base leading-snug mb-2">{p.label}</div>
              <div className="text-ink3 text-xs leading-relaxed">{p.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
