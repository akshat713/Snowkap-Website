import React from "react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/data/content";

export default function Faq() {
  return (
    <section className="py-20 md:py-24 bg-bg" data-testid="faq-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-14">
        <div className="lg:sticky lg:top-28 h-fit">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions, answered straight."
            lede="Everything teams usually ask before they book a demo. Anything else — ask Snowkap AI in the corner, or talk to our team."
          />
        </div>
        <Reveal>
          <Accordion type="single" collapsible className="border-t border-ink/10">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-b border-ink/10">
                <AccordionTrigger
                  data-testid={`faq-trigger-${i}`}
                  className="text-left font-display text-lg md:text-xl font-bold py-6 hover:no-underline hover:text-signal transition-colors [&[data-state=open]]:text-signal"
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ink2 leading-relaxed text-base pb-7">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
