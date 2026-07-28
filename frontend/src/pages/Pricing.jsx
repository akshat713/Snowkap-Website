import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/site/Layout";
import ProgrammeBuilder from "@/components/home/ProgrammeBuilder";
import { Reveal } from "@/components/site/Reveal";

const FAQ = [
  { q: "Why doesn't Enterprise show a price?", a: "Enterprise engagements span unlimited supplier networks, custom integrations, and dedicated account teams — the scope varies enough by client that a fixed number would be misleading. Tell us about your supply chain and we'll come back with a real number, fast." },
  { q: "Can I mix a package with custom add-ons?", a: "Yes. Select a package, then switch to Build Custom and add any additional line items — everything lands in the same programme tray together." },
  { q: "Are Starter and Growth prices final?", a: "They're starting points, shown in EUR by default — actual pricing reflects supplier count, sector complexity, and region. Your scoped proposal will confirm the exact number before anything is signed." },
  { q: "How long until a Managed Activation programme shows results?", a: "Our benchmark is over 90% primary data coverage within one quarter — the 90-day, 4-phase programme is designed around that outcome." },
];

export default function Pricing() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [hash]);
  return (
    <Layout>
      <section className="pt-40 pb-16 border-b border-white/10 grid-lines">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5">Pricing</div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl leading-[0.95]">
            Three tiers that grow with you.
          </h1>
          <p className="text-ink2 text-lg mt-6 max-w-2xl">
            From your first verified baseline to a fully managed, multi-framework global programme. Starter and Growth are
            priced below. Enterprise is scoped individually — every deployment is different, so the quote should be too.
          </p>
        </div>
      </section>

      <ProgrammeBuilder />

      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">Before you talk to us</h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f, i) => (
              <Reveal key={i} i={i}>
                <div className="py-7">
                  <h4 className="font-display text-lg font-semibold mb-2">{f.q}</h4>
                  <p className="text-ink2 leading-relaxed text-sm">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
