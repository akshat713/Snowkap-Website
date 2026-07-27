import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/site/MagneticButton";
import { useApp } from "@/context/AppContext";

export default function FinalCta() {
  const { setLeadModal, setTrayOpen } = useApp();
  return (
    <section className="py-28 md:py-44 border-t border-white/10 relative overflow-hidden grid-lines" data-testid="final-cta">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 text-center relative">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-6">The only risk is standing still.</div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-10">
          Turn compliance<br />into <span className="italic font-light text-signal">advantage.</span>
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <MagneticButton
            onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })}
            data-testid="final-advisor"
            className="group bg-signal text-bg px-8 py-4 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors"
          >
            Talk to an Advisor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <MagneticButton
            onClick={() => setTrayOpen(true)}
            data-testid="final-programme"
            className="border border-white/25 hover:border-white px-8 py-4 font-semibold transition-colors"
          >
            Review your programme
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
