import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export default function CbamBand() {
  return (
    <section className="bg-signal text-black" data-testid="cbam-band">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 justify-between">
            <div className="max-w-2xl">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 opacity-80">
                <Calculator className="w-4 h-4" /> Free tool
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.02]">
                CBAM is live at €75.36/tCO₂e. Default values cost up to 30% more.
              </h2>
              <p className="mt-4 text-black/70 leading-relaxed max-w-xl">
                Estimate your annual CBAM liability in 30 seconds — and see what verified primary data saves you, every certificate cycle.
              </p>
            </div>
            <Link
              to="/tools/cbam"
              onClick={() => window.scrollTo(0, 0)}
              data-testid="cbam-band-cta"
              className="group shrink-0 bg-black text-ink px-8 py-5 font-bold flex items-center gap-3 hover:bg-neutral-900 transition-colors"
            >
              Calculate your exposure
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
