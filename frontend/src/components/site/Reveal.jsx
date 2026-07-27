import React from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export function Reveal({ children, className = "", i = 0, as = "div" }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={viewport} className={className}>
      {children}
    </Comp>
  );
}

export function RevealGroup({ children, className = "" }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewport} className={className}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "", i = 0 }) {
  return (
    <motion.div variants={fadeUp} custom={i} className={className}>
      {children}
    </motion.div>
  );
}
