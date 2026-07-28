import React from "react";
import { asset } from "@/lib/asset";

// The real wordmark rather than a typographic approximation: the notched O in
// NOW is part of the mark and no available face reproduces it. Two cuts ship —
// ink for light grounds, light for dark or orange ones — so the logo always
// carries the contrast the brand sheet intends.
//
// Sized by height, since the artwork has a fixed aspect ratio and width follows.
export default function Wordmark({ variant = "ink", height = 26, className = "" }) {
  const src = asset(
    variant === "light" ? "/assets/snowkap-wordmark-light.png" : "/assets/snowkap-wordmark-ink.png"
  );
  return (
    <img
      src={src}
      alt="Snowkap"
      draggable="false"
      style={{ height }}
      className={`w-auto select-none ${className}`}
    />
  );
}
