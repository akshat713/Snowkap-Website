import React from "react";

export default function Wordmark({ className = "text-2xl" }) {
  return (
    <span className={`font-display font-extrabold tracking-tight leading-none ${className}`}>
      S<span className="text-signal">NOW</span>KAP
    </span>
  );
}
