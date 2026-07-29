import React, { useEffect, useRef } from "react";

// A living supply-chain graph: supplier nodes drifting in a field, linking when
// they come close, and periodically sending a verified data pulse inward to the
// platform at the centre. It is the company's actual proposition drawn as motion
// — scattered sources becoming verified, connected data — rather than ambient
// particles that could sit on any site.
//
// Canvas rather than SVG because the edge set is recomputed every frame; hand
// authored paths could not express it. Brand palette only: ink for structure,
// Now Orange for verification.

const INK = "34, 34, 34";
const SIGNAL = "223, 89, 0";

export default function NetworkCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1, raf = 0, running = true;
    let nodes = [];
    let pulses = [];
    let lastPulse = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2); // 2x is plenty; 3x costs fill rate
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      // Density scaled to area so a wide desktop isn't sparse and a phone isn't
      // needlessly busy.
      const count = Math.round(Math.min(58, Math.max(22, (w * h) / 14000)));
      nodes = Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
        const rad = (0.22 + Math.random() * 0.68) * Math.min(w, h) * 0.62;
        return {
          x: w / 2 + Math.cos(a) * rad,
          y: h / 2 + Math.sin(a) * rad * 0.82,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: 1.3 + Math.random() * 1.7,
        };
      });
      pulses = [];
    };

    const LINK_DIST = () => Math.min(w, h) * 0.19;

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const link = LINK_DIST();

      // edges — proximity only, so the mesh breathes as nodes drift. Links close
      // to the platform take the accent: distance from the centre is the visual
      // stand-in for how far the data has been verified.
      const reach = Math.min(w, h) * 0.42;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > link) continue;
          const near = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - cx, (a.y + b.y) / 2 - cy) / reach);
          const fade = 1 - d / link;
          ctx.strokeStyle = near > 0.5
            ? `rgba(${SIGNAL}, ${0.3 * fade * near})`
            : `rgba(${INK}, ${0.2 * fade})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // the platform at the centre
      ctx.fillStyle = `rgba(${SIGNAL}, 0.9)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(${SIGNAL}, 0.22)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 16 + Math.sin(t / 900) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // nodes — the largest handful get a ring, so the field has a hierarchy
      // instead of reading as evenly-scattered dust
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${INK}, 0.58)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n.r > 2.6) {
          ctx.strokeStyle = `rgba(${INK}, 0.16)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // verification pulses travelling inward
      for (const p of pulses) {
        const e = p.progress;
        const x = p.from.x + (cx - p.from.x) * e;
        const y = p.from.y + (cy - p.from.y) * e;
        const g = ctx.createLinearGradient(p.from.x, p.from.y, x, y);
        g.addColorStop(0, `rgba(${SIGNAL}, 0)`);
        g.addColorStop(1, `rgba(${SIGNAL}, ${0.5 * (1 - e)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(p.from.x, p.from.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${SIGNAL}, ${0.95 * (1 - e * 0.5)})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (t) => {
      if (!running) return;
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      if (t - lastPulse > 900 && nodes.length) {
        lastPulse = t;
        pulses.push({ from: nodes[(Math.random() * nodes.length) | 0], progress: 0 });
      }
      for (const p of pulses) p.progress += 0.014;
      pulses = pulses.filter((p) => p.progress < 1);
      draw(t);
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduce) {
      draw(0); // one composed frame, no motion
    } else {
      raf = requestAnimationFrame(step);
    }

    // Don't burn frames on a canvas nobody is looking at.
    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) { running = true; raf = requestAnimationFrame(step); }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; raf = requestAnimationFrame(step); }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`w-full h-full block ${className}`} />;
}
