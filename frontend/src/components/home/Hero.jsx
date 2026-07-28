import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { maskLine } from "@/lib/motion";
import { TICKER, IMAGES } from "@/data/content";

const LINES = [
  <>Turn climate</>,
  <>complexity into</>,
  <>business <span className="text-signal">clarity.</span></>,
];

export default function Hero() {
  const { setLeadModal } = useApp();
  const { scrollY } = useScroll();
  const lensY = useTransform(scrollY, [0, 800], [0, 140]);
  const ringY = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-bg" data-testid="hero-section">
      {/* lens — circular masked imagery, the brand motif */}
      <motion.div
        style={{ y: lensY }}
        className="absolute top-[10vh] right-[-12vw] md:right-[-4vw] w-[68vw] md:w-[46vw] max-w-[720px] aspect-square pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full overflow-hidden border border-ink/15">
          <img src={IMAGES.heroLens} alt="" className="w-full h-full object-cover opacity-70" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        </div>
        {/* rotating arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 rounded-full border border-dashed border-ink/10"
        />
        <div className="absolute -inset-20 rounded-full border border-ink/[0.06]" />
        <span className="absolute top-[7%] right-[22%] w-3 h-3 rounded-full bg-signal" />
      </motion.div>

      <motion.div style={{ y: ringY }} className="absolute -left-40 top-1/3 w-[420px] h-[420px] rounded-full border border-ink/[0.05] pointer-events-none" aria-hidden />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 w-full pt-40 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center gap-3 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.24em] text-signal mb-8"
        >
          <span className="w-8 h-px bg-signal" />
          ESG Intelligence for your business growth
        </motion.div>

        <h1 className="font-display font-extrabold tracking-tighter leading-[0.94] text-[13.5vw] sm:text-[11vw] lg:text-[7.6rem]">
          {LINES.map((l, i) => (
            <span key={i} className="reveal-mask">
              <motion.span variants={maskLine} custom={i} initial="hidden" animate="show" className="block">
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-ink2 text-base md:text-lg leading-relaxed max-w-xl"
        >
          Expert advisory, an AI-powered ESG platform, and embedded managed support — converting
          ESG complexity into measurable business performance across 25+ frameworks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })}
            data-testid="hero-book-demo"
            className="group bg-signal text-white px-7 py-4 font-bold flex items-center gap-2.5 hover:bg-signal-hover transition-colors"
          >
            Book a Demo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <Link
            to="/platform"
            onClick={() => window.scrollTo(0, 0)}
            data-testid="hero-explore-platform"
            className="group border border-ink/25 hover:border-ink px-7 py-4 font-semibold flex items-center gap-2.5 transition-colors"
          >
            Explore the Platform
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* proof ticker */}
      <div className="relative border-t border-ink/10 py-4 overflow-hidden" data-testid="hero-ticker">
        <div className="flex w-max animate-marquee gap-0">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink3 px-6 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-signal inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
