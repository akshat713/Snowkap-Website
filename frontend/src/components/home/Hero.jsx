import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Globe from "./Globe";
import MagneticButton from "@/components/site/MagneticButton";
import { maskLine } from "@/lib/motion";
import { HERO_TICKER } from "@/data/site";
import { useApp } from "@/context/AppContext";

const LINES = ["Compliance doesn't", "stop at your border.", "Neither do we."];

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { setLeadModal } = useApp();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden grid-lines" data-testid="hero">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <motion.div style={{ y: textY, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 border border-white/15 px-3.5 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink2">Global ESG Intelligence · Six Sectors · Five Regions</span>
          </motion.div>

          <h1 className="font-display font-extrabold tracking-tighter leading-[0.95] text-[13vw] sm:text-[10vw] lg:text-[5.6vw]">
            {LINES.map((line, i) => (
              <span key={i} className="reveal-mask">
                <motion.span
                  className="block"
                  variants={maskLine}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  style={i === 2 ? { color: "#00e599", fontWeight: 300, fontStyle: "italic" } : {}}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7 }}
            className="text-ink2 text-base md:text-lg max-w-xl mt-8 leading-relaxed"
          >
            Advisory, an AI-powered ESG platform, and a team already embedded across Asia, the Gulf, and beyond —
            turning hard-to-reach suppliers into verified, audit-ready data against every framework that matters:
            CBAM, CSRD, BRSR, SGX, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <MagneticButton
              onClick={() => scrollTo("calculator")}
              data-testid="hero-cbam-cta"
              className="group bg-signal text-bg px-7 py-4 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors"
            >
              Try the CBAM Calculator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton
              onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })}
              data-testid="hero-advisor-cta"
              className="border border-white/25 hover:border-white px-7 py-4 font-semibold transition-colors"
            >
              Talk to an Advisor
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: globeY }} className="relative hidden md:block" data-testid="hero-globe">
          <Globe />
        </motion.div>
      </div>

      {/* ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: "45s" }}>
          {HERO_TICKER.concat(HERO_TICKER).map((t, i) => (
            <span key={i} className="font-mono text-[12px] text-ink3 px-8 flex items-center gap-3">
              {t.label} <b className="text-white font-medium">{t.value}</b> <span className="text-signal">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
