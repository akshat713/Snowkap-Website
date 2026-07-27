import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Lightweight SVG "supply-chain globe": rotating wireframe sphere + pulsing arcs.
export default function Globe() {
  const R = 190;
  const cx = 220, cy = 220;

  const lats = useMemo(() => [-60, -30, 0, 30, 60].map((deg) => {
    const ry = R * Math.cos((deg * Math.PI) / 180);
    const y = cy - R * Math.sin((deg * Math.PI) / 180);
    return { ry, y };
  }), []);

  const arcs = useMemo(() => ([
    { x1: 90, y1: 150, x2: 340, y2: 120, d: 0 },
    { x1: 110, y1: 300, x2: 330, y2: 250, d: 1.1 },
    { x1: 150, y1: 110, x2: 300, y2: 320, d: 2.2 },
    { x1: 80, y1: 240, x2: 360, y2: 200, d: 1.6 },
  ]), []);

  const nodes = useMemo(() => ([
    [90, 150], [340, 120], [110, 300], [330, 250], [150, 110], [300, 320], [80, 240], [360, 200], [220, 90], [200, 350],
  ]), []);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle at 60% 35%, rgba(0,229,153,0.35), transparent 60%)" }} />
      <svg viewBox="0 0 440 440" className="w-full h-full relative">
        <defs>
          <radialGradient id="sphere" cx="42%" cy="35%">
            <stop offset="0%" stopColor="#12251d" />
            <stop offset="70%" stopColor="#0a0f0d" />
            <stop offset="100%" stopColor="#060608" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R} fill="url(#sphere)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* rotating longitude lines */}
        <motion.g
          animate={{ scaleX: [1, 0.05, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {[0, 1, 2, 3].map((i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={R * (1 - i * 0.03)} ry={R} fill="none" stroke="rgba(0,229,153,0.14)" strokeWidth="1" />
          ))}
        </motion.g>

        {/* latitude lines */}
        {lats.map((l, i) => (
          <ellipse key={i} cx={cx} cy={l.y} rx={l.ry} ry={l.ry * 0.28} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}

        {/* connection arcs */}
        {arcs.map((a, i) => {
          const mx = (a.x1 + a.x2) / 2;
          const my = Math.min(a.y1, a.y2) - 80;
          const path = `M ${a.x1} ${a.y1} Q ${mx} ${my} ${a.x2} ${a.y2}`;
          return (
            <g key={i}>
              <path d={path} fill="none" stroke="rgba(0,229,153,0.18)" strokeWidth="1" />
              <motion.circle r="3.5" fill="#00e599"
                animate={{ offsetDistance: ["0%", "100%"] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: a.d }}
                style={{ offsetPath: `path("${path}")` }}
              />
            </g>
          );
        })}

        {/* nodes */}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <motion.circle cx={x} cy={y} r="2.5" fill="#00e599"
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }} />
            <circle cx={x} cy={y} r="7" fill="none" stroke="rgba(0,229,153,0.25)" strokeWidth="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}
