import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// A drawn diagram per structural problem, sized to the same 16:7 banner the
// pillar cards use so the two sections read as one system.
//
// These are diagrams rather than photographs on purpose. Four of the five
// problems — priced default values, twenty-five overlapping frameworks, audit
// exposure inside a spreadsheet, a tender screen you never see — have no
// photographic subject; stock imagery of an office would decorate the card
// without representing what it says. Each of these depicts its own problem, and
// because they are vector they stay sharp at any width and cannot 404.
//
// Palette is brand only: ink for structure, Now Orange for wherever the failure
// actually is.

const INK = "#222222";
const SIGNAL = "#DF5900";

const wrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};
// Opacity only. `scale` on an SVG <g> depends on transform-box/transform-origin
// resolving the way you expect, which varies; the stagger carries the entrance
// on its own and this cannot mis-render.
const pop = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
// Animates the width attribute rather than scaleX, for the same reason: an SVG
// rect has no reliable scale origin without setting transform-box first.
const grow = {
  hidden: { width: 0 },
  show: (w) => ({ width: w, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }),
};

// 01 — the footprint sits with people you don't employ. A tight cluster you
// control, and a wide arc of suppliers you don't, most of them unreachable.
function Reach() {
  const inner = [
    [86, 60], [116, 44], [116, 78],
  ];
  const outer = [
    [196, 22, 1], [232, 40, 0], [258, 20, 0], [286, 44, 0],
    [206, 60, 1], [244, 66, 0], [278, 76, 0],
    [196, 96, 0], [232, 92, 1], [262, 104, 0], [300, 88, 0],
  ];
  return (
    <>
      {/* The boundary: inside it you have presence, outside it you do not.
          Revealed by opacity, not pathLength — framer implements pathLength by
          writing its own stroke-dasharray, which would overwrite the 5-5 dash
          that makes this read as a border rather than a wall. */}
      <motion.path
        variants={pop}
        d="M158 6 C 150 40, 150 84, 158 118"
        stroke={SIGNAL} strokeWidth="1.5" strokeDasharray="5 5" fill="none"
      />
      <motion.g variants={wrap}>
        {inner.map(([x, y], i) => (
          <motion.g key={`i${i}`} variants={pop}>
            <circle cx={x} cy={y} r="5" fill={INK} />
            <line x1={x} y1={y} x2={116} y2={61} stroke={INK} strokeWidth="1" opacity="0.35" />
          </motion.g>
        ))}
        {outer.map(([x, y, reached], i) => (
          <motion.g key={`o${i}`} variants={pop}>
            <circle
              cx={x} cy={y} r="4"
              fill={reached ? SIGNAL : "none"}
              stroke={reached ? SIGNAL : INK}
              strokeWidth="1.2"
              opacity={reached ? 1 : 0.4}
            />
            {reached ? (
              <line x1={x} y1={y} x2={158} y2={61} stroke={SIGNAL} strokeWidth="1" opacity="0.4" />
            ) : null}
          </motion.g>
        ))}
      </motion.g>
    </>
  );
}

// 02 — default values are priced. Two stacked bars: what you actually emit,
// and what you are billed for in the absence of proof.
function DefaultValue() {
  return (
    <motion.g variants={wrap}>
      <motion.g variants={pop}>
        <text x="20" y="34" fill={INK} fontSize="9" className="font-mono" opacity="0.55">VERIFIED</text>
        <motion.rect
          variants={grow} custom={120}
          x="20" y="42" height="14" fill={INK} opacity="0.28"
        />
      </motion.g>
      <motion.g variants={pop}>
        <text x="20" y="80" fill={SIGNAL} fontSize="9" className="font-mono">DEFAULT — BILLED</text>
        <motion.rect
          variants={grow} custom={286}
          x="20" y="88" height="14" fill={SIGNAL}
        />
      </motion.g>
      {/* the delta is the whole point */}
      <motion.g variants={pop}>
        <line x1="140" y1="42" x2="140" y2="102" stroke={SIGNAL} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <text x="150" y="26" fill={SIGNAL} fontSize="11" className="font-mono" fontWeight="bold">
          €75.36 / tCO₂e
        </text>
      </motion.g>
    </motion.g>
  );
}

// 03 — one dataset, twenty-five shapes. A single source fanning out into
// offset framework plates.
function Frameworks() {
  const plates = [0, 1, 2, 3, 4];
  return (
    <motion.g variants={wrap}>
      <motion.g variants={pop}>
        <rect x="18" y="46" width="46" height="30" fill={SIGNAL} />
        <text x="41" y="65" fill="#fff" fontSize="8" className="font-mono" textAnchor="middle">DATA</text>
      </motion.g>
      {plates.map((p) => (
        <motion.g key={p} variants={pop}>
          <line
            x1="64" y1="61" x2={168 + p * 4} y2={22 + p * 20}
            stroke={INK} strokeWidth="1" opacity="0.22"
          />
          <rect
            x={168 + p * 4} y={13 + p * 20} width="128" height="15"
            fill="none" stroke={INK} strokeWidth="1" opacity={0.5 - p * 0.06}
          />
        </motion.g>
      ))}
      <motion.g variants={pop}>
        <text x="300" y="112" fill={INK} fontSize="9" className="font-mono" opacity="0.5" textAnchor="end">
          25+ FRAMEWORKS
        </text>
      </motion.g>
    </motion.g>
  );
}

// 04 — audit exposure in the spreadsheet. Scattered grid fragments that never
// line up, two of them flagged.
function Fragments() {
  const cells = [
    [24, 20, 0], [72, 26, 0], [126, 18, 1], [178, 28, 0], [232, 20, 0], [280, 30, 0],
    [30, 58, 0], [84, 52, 0], [136, 62, 0], [190, 54, 1], [244, 64, 0],
    [20, 92, 0], [76, 96, 0], [130, 88, 0], [186, 98, 0], [240, 90, 0], [288, 96, 0],
  ];
  return (
    <motion.g variants={wrap}>
      {cells.map(([x, y, flagged], i) => (
        <motion.g key={i} variants={pop}>
          <rect
            x={x} y={y} width="34" height="15"
            fill={flagged ? SIGNAL : "none"}
            stroke={flagged ? SIGNAL : INK}
            strokeWidth="1"
            opacity={flagged ? 1 : 0.32}
            transform={`rotate(${((i % 5) - 2) * 2.2} ${x + 17} ${y + 7})`}
          />
        </motion.g>
      ))}
    </motion.g>
  );
}

// 05 — the screen you never see. A gate most entrants don't clear, and no
// notification either way.
function Gate() {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <motion.g variants={wrap}>
      <motion.path
        variants={drawIn}
        d="M196 8 L196 114"
        stroke={SIGNAL} strokeWidth="1.5" fill="none"
      />
      <motion.g variants={pop}>
        <text x="204" y="18" fill={SIGNAL} fontSize="9" className="font-mono">SCREEN</text>
      </motion.g>
      {rows.map((r) => {
        const y = 26 + r * 16;
        const passes = r === 2;
        return (
          <motion.g key={r} variants={pop}>
            <circle cx="26" cy={y} r="4" fill={passes ? SIGNAL : INK} opacity={passes ? 1 : 0.3} />
            <line
              x1="34" y1={y} x2={passes ? 292 : 188} y2={y}
              stroke={passes ? SIGNAL : INK}
              strokeWidth="1"
              strokeDasharray={passes ? "0" : "4 4"}
              opacity={passes ? 0.8 : 0.28}
            />
            {passes ? <circle cx="292" cy={y} r="4" fill={SIGNAL} /> : null}
          </motion.g>
        );
      })}
    </motion.g>
  );
}

const KINDS = { reach: Reach, default: DefaultValue, frameworks: Frameworks, fragments: Fragments, gate: Gate };

export default function ProblemGraphic({ kind = "reach", className = "" }) {
  const reduce = useReducedMotion();
  const Shape = KINDS[kind] || Reach;

  return (
    <motion.svg
      viewBox="0 0 320 122"
      className={`w-full h-full ${className}`}
      role="presentation"
      aria-hidden="true"
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      <Shape />
    </motion.svg>
  );
}
