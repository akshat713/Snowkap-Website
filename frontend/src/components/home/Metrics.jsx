import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { Reveal } from "@/components/site/Reveal";
import ContourField from "@/components/site/ContourField";
import { METRICS } from "@/data/content";

function Counter({ m, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => { if (inView) setVal(m.value); }, [inView, m.value]);
  return (
    <Reveal i={i}>
      <div ref={ref} className="border border-white/25 bg-white/[0.08] p-7 md:p-9 h-full hover:bg-white/[0.14] hover:border-white/45 transition-colors" data-testid={`metric-${i}`}>
        <div className="font-mono text-4xl md:text-5xl font-semibold text-white tracking-tight">
          {m.prefix || ""}<NumberFlow value={val} /><span className="text-white/70">{m.suffix}</span>
        </div>
        <p className="text-white/80 text-sm mt-4 leading-relaxed">{m.label}</p>
      </div>
    </Reveal>
  );
}

export default function Metrics() {
  return (
    <section className="relative py-20 md:py-24 bg-signal overflow-hidden" data-testid="metrics-section">
      {/* measured quantities, drawn — the field under the numbers it belongs to */}
      <div className="absolute inset-0 opacity-70 pointer-events-none" aria-hidden data-testid="metrics-contour">
        <ContourField rgb="255, 255, 255" lines={10} alpha={0.26} />
      </div>
      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-white mb-12 flex items-center gap-3">
          <span className="w-6 h-px bg-white" /> Trusted. Proven. Recognised.
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {METRICS.map((m, i) => <Counter key={m.label} m={m} i={i} />)}
        </div>
      </div>
    </section>
  );
}
