import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// The motion banner: two counter-running rows of display type naming what the
// company actually stands on. Scroll velocity feeds the travel speed, so the
// band accelerates with the reader and reverses when they scroll back — the
// page's own momentum becomes the animation, which is what separates this from
// a CSS marquee that runs at one speed forever.
//
// One row is solid and one is outlined. The contrast is what gives it the edge:
// a single weight at a single opacity reads as a caption strip, two weights read
// as a designed band.

const THEMES = ["Technology", "Sustainability", "Expertise", "ESG", "EHS", "Assurance"];

// Wrap into [min,max) — the modulo alone gives negative results for negative v.
const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Row({ baseVelocity, outline }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // clamp:false lets fast scrolling push past the mapped range instead of
  // saturating, which is where the whip comes from.
  const factor = useTransform(smooth, [0, 1200], [0, 4], { clamp: false });
  const direction = useRef(1);

  // Four copies, so -25% of the track is exactly one full set: the seam always
  // lands on an identical glyph run and never shows.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(f);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    // The vertical padding is load-bearing: leading is tightened to 0.95 for the
    // set, so ascenders overshoot the line box and the row's own clip would slice
    // their tops off.
    <div className="overflow-hidden whitespace-nowrap select-none py-[0.06em]" aria-hidden>
      <motion.div className="flex w-max" style={{ x }}>
        {[0, 1, 2, 3].map((copy) => (
          <span key={copy} className="flex shrink-0">
            {THEMES.map((t) => (
              <span key={t} className="flex items-center shrink-0">
                <span
                  className={`font-display font-extrabold tracking-tighter leading-[0.95] text-[13vw] md:text-[7.5vw] px-[0.09em] ${
                    outline ? "kinetic-outline" : "text-bg"
                  }`}
                >
                  {t}
                </span>
                <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rotate-45 bg-signal shrink-0 mx-[0.35em]" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function KineticBand() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Counter-drift on the whole band: it settles as it centres, so the band feels
  // anchored to the page rather than pasted on top of it.
  // Kept small on purpose: the rows already carry horizontal motion, and a wide
  // vertical range pulls them into the band's own clip at the extremes.
  const y = useTransform(scrollYProgress, [0, 1], [18, -18]);

  return (
    <section
      ref={ref}
      className="relative bg-ink py-14 md:py-20 overflow-hidden"
      data-testid="kinetic-band"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-signal/60" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-signal/60" aria-hidden />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 mb-8 md:mb-12">
        <div className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.24em] text-signal flex items-center gap-3">
          <span className="w-8 h-px bg-signal" />
          What we bring to the table
        </div>
      </div>

      {reduce ? (
        // Static composition rather than a frozen marquee: the same statement,
        // set as a list, with nothing moving.
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          {THEMES.map((t, i) => (
            <span key={t} className="flex items-center gap-6">
              <span className="font-display font-extrabold tracking-tighter text-3xl md:text-5xl text-bg">{t}</span>
              {i < THEMES.length - 1 && <span className="w-2.5 h-2.5 rotate-45 bg-signal" />}
            </span>
          ))}
        </div>
      ) : (
        <motion.div style={{ y }} className="flex flex-col gap-1 md:gap-2">
          <Row baseVelocity={2.2} outline={false} />
          <Row baseVelocity={-1.6} outline />
        </motion.div>
      )}

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 mt-8 md:mt-12">
        <p className="text-bg/60 text-sm md:text-base leading-relaxed max-w-lg">
          Engineering, climate science, and audit discipline in one operation — so ESG
          data holds up to a regulator, a customer, and a lender alike.
        </p>
      </div>
    </section>
  );
}
