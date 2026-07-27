import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Reveal } from "@/components/site/Reveal";
import { METRICS } from "@/data/content";

function Counter({ m, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => { if (inView) setVal(m.value); }, [inView, m.value]);
  return (
    <Reveal i={i}>
      <div ref={ref} className="border border-white/10 bg-bg p-7 md:p-9 h-full hover:border-signal/40 transition-colors" data-testid={`metric-${i}`}>
        <div className="font-mono text-4xl md:text-5xl font-semibold text-white tracking-tight">
          {m.prefix || ""}<NumberFlow value={val} /><span className="text-signal">{m.suffix}</span>
        </div>
        <p className="text-ink2 text-sm mt-4 leading-relaxed">{m.label}</p>
      </div>
    </Reveal>
  );
}

export default function Metrics() {
  return (
    <section className="py-24 md:py-32 bg-surface border-y border-white/10" data-testid="metrics-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-12 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> Trusted. Proven. Recognised.
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {METRICS.map((m, i) => <Counter key={m.label} m={m} i={i} />)}
        </div>
      </div>
    </section>
  );
}
