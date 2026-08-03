import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { PILLARS3 } from "@/data/content";

export default function Pillars() {
  return (
    <section id="pillars" className="py-20 md:py-24 bg-surface border-y border-ink/10" data-testid="pillars-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
        <div className="lg:sticky lg:top-28 h-fit">
          <SectionHeader
            eyebrow="What Snowkap is"
            title="Three integrated capabilities. One operational outcome."
            lede="Software alone can't chase suppliers. Consultants alone can't scale. Snowkap runs all three as one operation — one partner, the full ESG journey."
          />
          <Link
            to="/services"
            onClick={() => window.scrollTo(0, 0)}
            data-testid="pillars-services-link"
            className="group inline-flex items-center gap-2 border border-ink/25 hover:border-signal hover:text-signal px-6 py-3.5 font-semibold transition-colors"
          >
            Explore our services
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {PILLARS3.map((p, i) => (
            <div key={p.n} className="lg:sticky" style={{ top: `${104 + i * 28}px` }}>
              <div className="group lift bg-bg border border-ink/10 hover:border-signal/40" data-testid={`pillar-card-${i}`}>
                {p.image && (
                  <div className="relative aspect-[16/6] overflow-hidden bg-surface2">
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-[1.02] group-hover:scale-[1.06] transition-all duration-[900ms] ease-out"
                    />
                    {/* keeps the number legible whatever the photograph does */}
                    <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/55 to-transparent" />
                    <span className="absolute bottom-4 left-6 font-mono text-white text-sm">{p.n}</span>
                  </div>
                )}
                <div className="p-7 md:p-8">
                <div className="flex items-baseline justify-between mb-5">
                  {!p.image && <span className="font-mono text-signal text-sm">{p.n}</span>}
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3 ml-auto">{p.tag}</span>
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">{p.title}</h3>
                <p className="text-ink2 leading-relaxed mb-6 max-w-lg">{p.desc}</p>
                <ul className="space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm text-ink2">
                      <Check className="w-4 h-4 text-signal shrink-0" /> {it}
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
