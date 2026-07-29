import React from "react";
import { LOGO_WORDMARKS } from "@/data/content";

// One logo, one fixed box, everywhere it appears.
//
// The box is what delivers equal weighting. The assets are already normalised so
// each mark occupies a comparable footprint inside an identical 300x96 canvas
// (see scripts/normalise-logos.py); rendering that canvas at a fixed width and
// height means the markup cannot reintroduce the imbalance, which is exactly
// what the previous `h-8 w-auto` did — a 7:1 wordmark took seven times the space
// of a square mark and read as seven times the endorsement.
//
// Full opacity, not the 60% it used to be. These are the clients; dimming them
// to a whisper was the other half of why they were hard to see.
// The asset canvas is 190x58 CSS pixels. These boxes hold that exact ratio, so
// object-contain scales the whole canvas uniformly and every mark keeps both its
// normalised size and its alignment. A box of a different ratio would letterbox
// the canvas and silently shrink the artwork inside it.
const BOXES = {
  sm: "w-[152px] h-[46px]",   // 0.8x — sector groupings and dense grids
  md: "w-[190px] h-[58px]",   // 1.0x — the marquee, at measured size
  lg: "w-[228px] h-[70px]",   // 1.2x — feature placements
};

export default function ClientLogo({ name, src, size = "md", className = "" }) {
  const box = BOXES[size] || BOXES.md;

  // No usable artwork in either source set — set the name instead of shipping an
  // empty box. Tracked so it is obvious which clients still need real files.
  if (LOGO_WORDMARKS.has(name)) {
    return (
      <div
        className={`${box} flex items-center justify-center shrink-0 ${className}`}
        title={name}
        data-testid={`client-wordmark-${name.toLowerCase()}`}
      >
        <span className="font-display font-bold tracking-tight text-ink text-xl leading-none">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className={`${box} flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={src}
        alt={name}
        title={name}
        loading="lazy"
        // object-contain inside a fixed box: the asset's own transparent padding
        // does the centring, so nothing is cropped and every mark shares a
        // baseline without per-logo nudging.
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  );
}
