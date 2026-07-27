import React, { useEffect } from "react";
import Layout from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight } from "lucide-react";

const STORIES = [
  { sector: "Manufacturing & Industrial", name: "JSW Steel", stat: "90%+", statLabel: "Primary data in one quarter", body: "How one of the world's largest steel producers moved from fragmented spreadsheets to a single, audit-ready source of truth.", image: "https://images.pexels.com/photos/32503741/pexels-photo-32503741.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { sector: "Beverages & Consumer Goods", name: "Senco Gold", stat: "7.6×", statLabel: "ROI on ratings work", body: "How a rated ESG score became a measurable capital-access advantage for a listed consumer business.", image: "https://images.pexels.com/photos/6572534/pexels-photo-6572534.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { sector: "Financial, IT & Investment", name: "Sutherland", stat: "25+", statLabel: "Frameworks, one entry", body: "How a global BPO and IT services provider consolidated multi-framework reporting into a single data model.", image: "https://images.pexels.com/photos/7433840/pexels-photo-7433840.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
];

export default function Customers() {
  const { setLeadModal } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <section className="pt-40 pb-16 border-b border-white/10 grid-lines">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5">Customer stories</div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter max-w-3xl leading-[0.95]">Proof, not promises.</h1>
          <p className="text-ink2 text-lg mt-6 max-w-2xl">Every story is real. The full write-up — sector, geography, regulatory driver, suppliers activated, data coverage, and outcome — is one short conversation away.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 space-y-5">
          {STORIES.map((s, i) => (
            <Reveal key={s.name} i={i}>
              <div className="group grid md:grid-cols-[1fr_1.4fr_auto] gap-8 items-center border border-white/10 hover:border-signal/40 bg-surface/40 p-7 md:p-9 transition-colors">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-signal mb-3">{s.sector}</div>
                  <h3 className="font-display text-3xl font-bold mb-3">{s.name}</h3>
                  <div className="font-mono text-4xl font-semibold text-signal">{s.stat}</div>
                  <div className="text-ink3 text-xs uppercase tracking-wider mt-1">{s.statLabel}</div>
                </div>
                <p className="text-ink2 leading-relaxed">{s.body}</p>
                <div className="hidden lg:block w-48 h-32 overflow-hidden">
                  <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-700" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="max-w-[1320px] mx-auto px-6 md:px-10 mt-16 text-center">
          <button onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })} className="group inline-flex items-center gap-2 bg-signal text-bg px-8 py-4 font-bold hover:bg-signal-hover transition-colors">
            Become the next story <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </Layout>
  );
}
