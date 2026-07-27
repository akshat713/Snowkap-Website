import React from "react";

export function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}

// Slow outline marquee — kinetic texture behind sections
export function OutlineMarquee({ text = "VERIFIED · AUDIT-READY", className = "" }) {
  const content = Array(4).fill(text);
  return (
    <div className={`overflow-hidden select-none pointer-events-none ${className}`} aria-hidden="true">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {content.concat(content).map((t, i) => (
          <span
            key={i}
            className="font-display font-extrabold stroke-text px-8"
            style={{ fontSize: "12vw", lineHeight: 1 }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
