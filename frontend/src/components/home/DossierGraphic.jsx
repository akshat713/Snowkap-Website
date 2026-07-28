import React from "react";

// Scattered supplier evidence -> a structured grid -> a verified seal.
// The same three steps the dossier walks a visitor through, so the panel
// illustrates the section rather than decorating it. Animation lives in
// index.css (.dq-*) and is disabled under prefers-reduced-motion.
export default function DossierGraphic() {
  const stroke = "currentColor";
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[220px]" aria-hidden="true" role="presentation">
      {/* stage 1 — unstructured documents */}
      <g className="dq-scatter" opacity="0.9">
        <rect x="62" y="26" width="52" height="66" rx="2" fill="none" stroke={stroke} strokeWidth="1.6" />
        <line x1="72" y1="42" x2="104" y2="42" stroke={stroke} strokeWidth="1.6" />
        <line x1="72" y1="54" x2="104" y2="54" stroke={stroke} strokeWidth="1.6" opacity=".6" />
        <line x1="72" y1="66" x2="94" y2="66" stroke={stroke} strokeWidth="1.6" opacity=".6" />
        <rect x="124" y="40" width="34" height="44" rx="2" fill="none" stroke={stroke} strokeWidth="1.4" opacity=".55" />
        <rect x="30" y="46" width="26" height="34" rx="2" fill="none" stroke={stroke} strokeWidth="1.4" opacity=".4" />
      </g>

      {/* the pass that structures it */}
      <rect className="dq-scan" x="26" y="30" width="148" height="2.5" fill={stroke} opacity=".85" />

      {/* stage 2 — one verified grid */}
      <g className="dq-grid">
        {[0, 1, 2, 3].map((col) =>
          [0, 1, 2].map((row) => {
            const filled = (col === 1 && row === 1) || (col === 2 && row === 2);
            return (
              <rect
                key={`${col}-${row}`}
                x={30 + col * 36}
                y={30 + row * 36}
                width="28"
                height="28"
                rx="2"
                fill={filled ? stroke : "none"}
                stroke={stroke}
                strokeWidth="1.3"
                opacity={filled ? 0.9 : 1}
                style={{ animationDelay: `${(col + row) * 0.05}s` }}
              />
            );
          })
        )}
      </g>

      {/* stage 3 — audit-ready */}
      <g className="dq-seal">
        <circle cx="100" cy="148" r="30" fill="none" stroke={stroke} strokeWidth="2.4" />
        <circle cx="100" cy="148" r="24" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" opacity=".6" />
        <path d="M88 148 l8 8 l16 -19" fill="none" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
