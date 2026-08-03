import React, { useId } from "react";

// Hand-drawn SVG flags rather than an icon font or a sprite from a CDN: the
// build has no network access to image hosts, and five inline flags cost less
// than a single request would. All five are normalised to 3:2 so the column
// heads line up — real ratios vary (the Union Jack is 2:1, the UAE 2:1) and a
// row of mixed ratios reads as a mistake in a table.
//
// Each flag is drawn in a 60×40 viewBox.

const STAR = (cx, cy, r, rot = -90) => {
  // 5-pointed star, outer radius r, inner radius r * 0.382 (golden section —
  // the ratio that makes a pentagram's arms meet cleanly).
  const pts = [];
  for (let i = 0; i < 10; i += 1) {
    const rad = ((rot + i * 36) * Math.PI) / 180;
    const rr = i % 2 === 0 ? r : r * 0.382;
    pts.push(`${(cx + rr * Math.cos(rad)).toFixed(2)},${(cy + rr * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(" ");
};

function EuFlag() {
  // Twelve stars on a circle whose radius is a third of the flag height —
  // the geometry the Council of Europe specifies.
  const stars = [];
  for (let i = 0; i < 12; i += 1) {
    const rad = ((i * 30 - 90) * Math.PI) / 180;
    stars.push([30 + 12 * Math.cos(rad), 20 + 12 * Math.sin(rad)]);
  }
  return (
    <>
      <rect width="60" height="40" fill="#003399" />
      {stars.map(([cx, cy], i) => (
        <polygon key={i} points={STAR(cx, cy, 2.3)} fill="#FFCC00" />
      ))}
    </>
  );
}

function InFlag() {
  const spokes = [];
  for (let i = 0; i < 24; i += 1) {
    const rad = (i * 15 * Math.PI) / 180;
    spokes.push([30 + 1.1 * Math.cos(rad), 20 + 1.1 * Math.sin(rad), 30 + 5.1 * Math.cos(rad), 20 + 5.1 * Math.sin(rad)]);
  }
  return (
    <>
      <rect width="60" height="40" fill="#F93" />
      <rect y="13.33" width="60" height="13.34" fill="#FFF" />
      <rect y="26.67" width="60" height="13.33" fill="#138808" />
      <circle cx="30" cy="20" r="5.4" fill="none" stroke="#000080" strokeWidth="0.9" />
      <circle cx="30" cy="20" r="1.1" fill="#000080" />
      {spokes.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.42" />
      ))}
    </>
  );
}

function GbFlag({ clip }) {
  return (
    <>
      <clipPath id={clip}>
        {/* Four quadrant wedges. The red diagonals are counter-changed — each
            half-diagonal is clipped to the quadrant on one side of the white
            saltire, which is what gives the Union Jack its offset. */}
        <path d="M30,20 L60,20 L60,40 z M30,20 L60,20 L60,0 z M30,20 L0,20 L0,0 z M30,20 L0,20 L0,40 z" />
      </clipPath>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFF" strokeWidth="8" />
      <g clipPath={`url(#${clip})`}>
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4.4" />
      </g>
      <path d="M30,0 V40 M0,20 H60" stroke="#FFF" strokeWidth="13.3" />
      <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
    </>
  );
}

function SgFlag({ clip }) {
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    const rad = ((i * 72 - 90) * Math.PI) / 180;
    stars.push([25.5 + 4.9 * Math.cos(rad), 12.5 + 4.9 * Math.sin(rad)]);
  }
  return (
    <>
      <rect width="60" height="40" fill="#FFF" />
      <rect width="60" height="20" fill="#EF3340" />
      {/* Crescent: a white disc with a red disc bitten out of its right side. */}
      <mask id={clip}>
        <rect width="60" height="40" fill="#000" />
        <circle cx="14" cy="12.5" r="7.6" fill="#FFF" />
        <circle cx="17.8" cy="12.5" r="6.6" fill="#000" />
      </mask>
      <rect width="60" height="40" fill="#FFF" mask={`url(#${clip})`} />
      {stars.map(([cx, cy], i) => (
        <polygon key={i} points={STAR(cx, cy, 1.9)} fill="#FFF" />
      ))}
    </>
  );
}

function GccFlag() {
  // The Gulf column covers several regimes; the UAE flag stands for it, as the
  // market Snowkap enters first.
  return (
    <>
      <rect x="15" width="45" height="13.33" fill="#00732F" />
      <rect x="15" y="13.33" width="45" height="13.34" fill="#FFF" />
      <rect x="15" y="26.67" width="45" height="13.33" fill="#000" />
      <rect width="15" height="40" fill="#FF0000" />
    </>
  );
}

const FLAGS = { EU: EuFlag, IN: InFlag, UK: GbFlag, SG: SgFlag, GCC: GccFlag };

const LABELS = {
  EU: "Flag of the European Union",
  IN: "Flag of India",
  UK: "Flag of the United Kingdom",
  SG: "Flag of Singapore",
  GCC: "Flag of the United Arab Emirates",
};

export default function FlagMark({ code, className = "w-9 h-6" }) {
  const clip = useId().replace(/:/g, "");
  const Flag = FLAGS[code];
  if (!Flag) return null;
  return (
    <svg
      viewBox="0 0 60 40"
      className={`${className} shrink-0 rounded-[2px] ring-1 ring-ink/15 shadow-[0_1px_2px_rgba(34,34,34,0.12)]`}
      role="img"
      aria-label={LABELS[code]}
      data-testid={`flag-${code}`}
    >
      <Flag clip={`fm-${clip}`} />
    </svg>
  );
}
