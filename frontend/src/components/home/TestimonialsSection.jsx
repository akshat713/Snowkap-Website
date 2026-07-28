import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { TESTIMONIALS } from "@/data/content";

export default function TestimonialsSection() {
  return (
    <section className="py-24 md:py-36 bg-surface border-y border-ink/10" data-testid="testimonials-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader eyebrow="Client testimonials" title="Trusted by the people who decide." />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} i={i} className="h-full">
              <figure className="bg-bg border border-ink/10 p-8 md:p-9 h-full flex flex-col hover:border-ink/25 transition-colors" data-testid={`testimonial-${i}`}>
                <span className="font-display text-6xl leading-none text-signal select-none" aria-hidden>&ldquo;</span>
                <blockquote className="text-ink2 leading-relaxed flex-1 mt-2">{t.quote}</blockquote>
                <figcaption className="mt-8 pt-6 border-t border-ink/10">
                  <div className="font-semibold text-ink">{t.name}</div>
                  <div className="text-sm text-ink3 mt-0.5">{t.role} · <span className="text-ink2">{t.company}</span></div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
