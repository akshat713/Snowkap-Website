import React from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

// A hairline of Now Orange tracking read position. The pages here are long — the
// homepage runs past 14,000px — so an ambient sense of "how much is left" is
// genuinely useful rather than decorative. Sits under the header, full width.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  // Spring only when motion is welcome; otherwise track scroll exactly.
  const width = useSpring(scrollYProgress, reduce ? { duration: 0 } : { stiffness: 220, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-signal origin-left z-[600] pointer-events-none"
    />
  );
}
