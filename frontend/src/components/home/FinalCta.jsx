import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { maskLine } from "@/lib/motion";

export default function FinalCta() {
  const { setLeadModal } = useApp();
  return (
    <section className="relative py-28 md:py-44 bg-bg overflow-hidden border-t border-ink/10" data-testid="final-cta">
      {/* lens rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-ink/[0.05] pointer-events-none" aria-hidden />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-ink/[0.07] pointer-events-none" aria-hidden />
      <motion.div
        animate={{ rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full border border-dashed border-signal/15 pointer-events-none" aria-hidden
      />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 text-center">
        <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-signal mb-8">The close</div>
        <h2 className="font-display font-extrabold tracking-tighter leading-[0.98] text-5xl md:text-7xl lg:text-8xl">
          <span className="reveal-mask">
            <motion.span variants={maskLine} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} className="block">
              Clarity is our
            </motion.span>
          </span>
          <span className="reveal-mask">
            <motion.span variants={maskLine} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }} className="block text-signal">
              climate strategy.
            </motion.span>
          </span>
        </h2>
        <p className="text-ink2 text-lg mt-8 max-w-xl mx-auto">
          Run your climate strategy like your business strategy. The only risk is standing still.
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })}
            data-testid="final-cta-demo"
            className="group bg-signal text-white px-8 py-4.5 py-4 font-bold flex items-center gap-2.5 hover:bg-signal-hover transition-colors"
          >
            Book a Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            data-testid="final-cta-contact"
            className="border border-ink/25 hover:border-ink px-8 py-4 font-semibold transition-colors"
          >
            Talk to our team
          </Link>
        </div>
      </div>
    </section>
  );
}
