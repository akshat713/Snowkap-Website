import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { PILLARS3 } from "@/data/content";

export default function Pillars() {
  return (
    <section id="pillars" className="py-24 md:py-36 bg-surface border-y border-white/10" data-testid="pillars-section">
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
            className="group inline-flex items-center gap-2 border border-white/25 hover:border-signal hover:text-signal px-6 py-3.5 font-semibold transition-colors"
          >
            Explore our services
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {PILLARS3.map((p, i) => (
            <div key={p.n} className="lg:sticky" style={{ top: `${104 + i * 28}px` }}>
              <div className="bg-bg border border-white/10 p-8 md:p-10 hover:border-white/25 transition-colors" data-testid={`pillar-card-${i}`}>
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-mono text-signal text-sm">{p.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3">{p.tag}</span>
                </div>
                <h3 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4">{p.title}</h3>
                <p className="text-ink2 leading-relaxed mb-7 max-w-lg">{p.desc}</p>
                <ul className="space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 text-sm text-ink2">
                      <Check className="w-4 h-4 text-signal shrink-0" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
