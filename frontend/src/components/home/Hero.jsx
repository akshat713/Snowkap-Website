import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { maskLine } from "@/lib/motion";
import { TICKER, IMAGES } from "@/data/content";
import NetworkCanvas from "@/components/home/NetworkCanvas";
import MagneticButton from "@/components/site/MagneticButton";

const LINES = [
  <>Supply chains do not</>,
  <>stop at your border.</>,
  <><span className="text-signal">Neither do we.</span></>,
];

export default function Hero() {
  const { setLeadModal } = useApp();
  const { scrollY } = useScroll();
  const lensY = useTransform(scrollY, [0, 800], [0, 140]);
  const ringY = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-bg" data-testid="hero-section">
      {/* the supply chain, alive: nodes linking and sending verified data inward */}
      <div className="absolute inset-0 opacity-[0.9] pointer-events-none" aria-hidden data-testid="hero-network">
        <NetworkCanvas />
      </div>

      {/* lens — circular masked imagery, the brand motif */}
      <motion.div
        style={{ y: lensY }}
        className="absolute top-[10vh] right-[-12vw] md:right-[-4vw] w-[68vw] md:w-[46vw] max-w-[720px] aspect-square pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full overflow-hidden border border-ink/15">
          {/* Brand ground beneath the photograph. The lens is the largest shape on
              the page, so a slow or failed decode would otherwise leave a hole in
              the middle of the composition. */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface2 to-signal/25" aria-hidden />
          <img src={IMAGES.heroLens} alt="" className="relative w-full h-full object-cover opacity-70" loading="eager" />
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
          An AI-powered ESG platform, expert advisory, and a team embedded across Asia, the
          Gulf and beyond — turning hard-to-reach suppliers into verified, audit-ready data
          against every framework that matters: CBAM, CSRD, BRSR, SGX and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          {/* the site's single most important action, so it gets the physics.
              Leads into the sector explorer rather than a demo form: the pitch is
              that we have already mapped your sector, so prove it before asking. */}
          <MagneticButton
            onClick={() => document.getElementById("sectors")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            data-testid="hero-find-sector"
            strength={0.22}
            className="group bg-signal text-white px-7 py-4 font-bold flex items-center gap-2.5 hover:bg-signal-hover transition-colors"
          >
            Find Your Sector
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
          <button
            onClick={() => setLeadModal({ kind: "demo", title: "Talk to an Advisor" })}
            data-testid="hero-talk-advisor"
            className="group border border-ink/25 hover:border-ink px-7 py-4 font-semibold flex items-center gap-2.5 transition-colors"
          >
            Talk to an Advisor
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
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
