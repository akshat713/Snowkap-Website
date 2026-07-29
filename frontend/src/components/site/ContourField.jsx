import React, { useEffect, useRef } from "react";

// Stacked contour lines that drift and breathe — the shape of a measured
// quantity over time, which is what the numbers on top of it actually are. It
// carries the sustainability and data reading without resorting to a leaf icon,
// and because it is generated it costs one component rather than a photograph
// nobody has licensed.
//
// Colour is passed in as an "r, g, b" triplet so the same field can sit on the
// orange band in white and on a light band in ink.

export default function ContourField({ rgb = "255, 255, 255", lines = 9, alpha = 0.3, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, raf = 0, running = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const step = h / (lines + 1);
      // Sampling every 14px and letting the curve interpolate is smooth enough at
      // this amplitude, and roughly a tenth of the path commands of per-pixel.
      const dx = 14;

      for (let i = 1; i <= lines; i++) {
        const baseY = step * i;
        // Each line runs at its own frequency and phase, so the stack never
        // collapses into a single moving wall.
        const freq = 0.0028 + i * 0.00042;
        const amp = (h / (lines + 3)) * (0.5 + (i % 3) * 0.28);
        const phase = t / (2600 + i * 340) + i * 0.7;
        // Fade toward the top of the stack — gives the field depth.
        const a = alpha * (0.35 + (i / lines) * 0.65);

        ctx.beginPath();
        for (let x = -dx; x <= w + dx; x += dx) {
          const y =
            baseY +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 2.3 - phase * 1.4) * amp * 0.32;
          if (x <= -dx) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${rgb}, ${a})`;
        ctx.lineWidth = i === lines ? 1.6 : 1;
        ctx.stroke();
      }
    };

    const step = (t) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(step);

    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(step); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; raf = requestAnimationFrame(step); }
    };
    document.addEventListener("visibilitychange", onVisibility);
    const onResize = () => { resize(); if (reduce) draw(0); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [rgb, lines, alpha]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`w-full h-full block ${className}`} />;
}
