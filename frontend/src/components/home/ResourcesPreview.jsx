import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import api from "@/lib/api";

export default function ResourcesPreview() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/resources?type=blog").then(({ data }) => setItems(data.slice(0, 3))).catch(() => {});
  }, []);
  if (!items.length) return null;

  return (
    <section className="py-24 md:py-36 bg-surface border-t border-white/10" data-testid="resources-preview">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHeader eyebrow="Stay ahead" title="Latest intelligence." />
          <Link to="/resources" onClick={() => window.scrollTo(0, 0)} data-testid="resources-view-all"
            className="group mb-20 hidden md:inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-ink2 hover:text-signal transition-colors">
            All resources <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <Reveal key={r.slug} i={i} className="h-full">
              <Link to={`/resources/${r.slug}`} onClick={() => window.scrollTo(0, 0)} data-testid={`resource-preview-${i}`}
                className="group block bg-bg border border-white/10 hover:border-white/30 transition-colors h-full">
                {r.image && (
                  <div className="aspect-[16/9] overflow-hidden bg-white/[0.03]">
                    <img src={r.image} alt={r.title} loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700" />
                  </div>
                )}
                <div className="p-7">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal mb-3">
                    {r.category || "Blog"}{r.date_label ? ` · ${r.date_label}` : ""}
                  </div>
                  <h3 className="font-display text-xl font-bold leading-snug group-hover:text-signal transition-colors">{r.title}</h3>
                  <p className="text-ink2 text-sm leading-relaxed mt-3 line-clamp-3">{r.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
