import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { MODULES } from "@/data/content";

export default function PlatformShowcase() {
  const trackRef = useRef(null);
  const scrollBy = (dir) => trackRef.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section className="py-24 md:py-36 bg-bg" data-testid="platform-showcase">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <SectionHeader
            eyebrow="The product"
            title="One platform. Unified data. Zero uncertainty."
            lede="Built for ESG leads, compliance heads, and sustainability officers who need clarity across carbon, compliance, and supply-chain sustainability."
          />
          <div className="hidden md:flex gap-3 mb-20">
            <button onClick={() => scrollBy(-1)} data-testid="showcase-prev" aria-label="Previous" className="border border-ink/20 hover:border-signal p-3.5 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollBy(1)} data-testid="showcase-next" aria-label="Next" className="border border-ink/20 hover:border-signal p-3.5 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 md:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] pb-4">
        {MODULES.map((m, i) => (
          <Link
            key={m.title}
            to="/platform"
            onClick={() => window.scrollTo(0, 0)}
            data-testid={`module-card-${i}`}
            className="group snap-start shrink-0 w-[300px] md:w-[380px] bg-surface border border-ink/10 hover:border-ink/30 transition-colors"
          >
            <div className="overflow-hidden aspect-[4/3.4] bg-ink/[0.03]">
              <img src={m.img} alt={m.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl md:text-2xl font-bold leading-snug">{m.title}</h3>
                <ArrowUpRight className="w-5 h-5 text-ink3 group-hover:text-signal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
              </div>
              <p className="text-ink2 text-sm leading-relaxed mt-3">{m.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
