import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Headline reveal: each word rises out from behind its own edge, staggered.
// The clipping is what makes it read as typeset rather than faded in — the
// letters arrive from somewhere instead of merely becoming visible.
//
// Splits on words and lets them wrap naturally, so a line break the browser
// chooses is still masked correctly at any width.
//
// The viewport trigger lives on the heading, never on the words. A word starts
// translated 115% down inside an `overflow-hidden` span, which means its
// intersection rect is empty — an observer attached to the word itself can never
// fire, so the reveal would stay parked at its start offset forever. The heading
// is in normal flow and unclipped, so it intersects honestly; the words inherit
// the resulting variant through MotionContext and stagger off their own `custom`.
const rise = {
  hidden: { y: "115%" },
  show: (d) => ({ y: "0%", transition: { duration: 0.72, delay: d, ease: [0.16, 1, 0.3, 1] } }),
};

export default function MaskReveal({ children, as = "span", delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  const words = String(children).split(" ");
  const Tag = motion[as] || motion.span;

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {words.map((word, i) => (
        // The separating space goes between the clipping boxes, never inside one:
        // CSS drops trailing whitespace at the end of an inline-block, so a space
        // placed within the mask collapses and the words render flush together.
        <React.Fragment key={`${word}-${i}`}>
          {/* inline-block pair: the outer clips, the inner travels */}
          <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
            <motion.span className="inline-block" variants={rise} custom={delay + i * 0.045}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

// Whole-block variant, for headings whose content is markup rather than a plain
// string — a coloured clause, a line break the copy chose. It cannot be split
// into words without rebuilding the element tree, so the whole heading rises as
// one. Trigger sits on an unclipped wrapper, for the same reason as above.
export function MaskBlock({ children, as = "h1", className = "", delay = 0.05 }) {
  const reduce = useReducedMotion();
  const Inner = motion[as] || motion.h1;

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      <span className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
        <Inner className={className} variants={rise} custom={delay}>
          {children}
        </Inner>
      </span>
    </motion.div>
  );
}

// Line-at-a-time variant, for display headlines where the break points are an
// editorial decision rather than the browser's, and a line may carry its own
// colour. Same trigger placement and the same reason for it.
export function MaskLines({ lines = [], as = "h2", className = "", delay = 0.05 }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.h2;

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className}>
        {lines.map((l, i) => (
          <span key={i} className={`block ${l.className || ""}`}>{l.text}</span>
        ))}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.09em] -mb-[0.09em]">
          <motion.span
            className={`block ${l.className || ""}`}
            variants={rise}
            custom={delay + i * 0.09}
          >
            {l.text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
