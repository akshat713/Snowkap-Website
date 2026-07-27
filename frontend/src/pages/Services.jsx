import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { useApp } from "@/context/AppContext";
import { JOURNEY } from "@/data/content";

const ADVISORY = [
  ["Materiality & Double Materiality", "Materiality maps and ESG risk assessment tailored to sector priorities, aligned with CSRD."],
  ["SBTi-Aligned Decarbonisation", "Science-based targets and MAC-curve roadmaps to net zero — linked to ROI."],
  ["Ratings Optimisation", "EcoVadis, CDP, DJSI, Sustainalytics — disclosures aligned to external rating methodologies."],
  ["Benchmark Intelligence", "Peer comparison to guide CDP, DJSI, and EcoVadis score lifts."],
  ["Stakeholder Communications", "ESG messaging for investors, boards, regulators, and broader stakeholders."],
  ["Regulatory & Disclosure Readiness", "CSRD, BRSR, CDP, TCFD, and ISSB readiness diagnostics and gap closure."],
];

const MANAGED = [
  ["Supplier Onboarding", "Dedicated executives guide each supplier through evidence submission, verification, and portal onboarding — at scale."],
  ["Proactive Engagement", "Direct outreach, follow-ups, and in-platform query support drive supplier participation."],
  ["Compliance Monitoring", "Continuous tracking of CSRD, GRI, BRSR, and CBAM updates with proactive alerts to your team."],
  ["Audit Coordination", "Pre-validated evidence binders and interfaces with third-party assurance partners."],
];

const TRAINING = [
  ["Function-Focused Mastery", "Finance: impact-weighted valuation. Procurement: supplier scorecards. Operations: process-level carbon analytics."],
  ["Leadership Accelerator", "Evidence-backed playbooks linking ESG to ROI, with narrative frameworks for investors and boards."],
  ["Adaptive Learning System", "Instructor-led deep dives plus self-paced micro-modules in multiple languages."],
  ["Deployment Toolkit", "Snowkap-certified SOPs, templates, data checklists, and supplier onboarding packs."],
];

const STATS = [
  ["3,800+", "professionals trained across 6+ industries"],
  ["900+", "stakeholders engaged"],
  ["50+", "hours of assurance saved per cycle"],
  [">90%", "primary data coverage in one quarter"],
];

function Block({ eyebrow, title, lede, items, testid, surface }) {
  return (
    <section className={`py-24 md:py-32 ${surface ? "bg-surface border-y border-white/10" : "bg-bg"}`} data-testid={testid}>
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> {eyebrow}
        </div>
        <Reveal><h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-2xl leading-[1.03]">{title}</h2></Reveal>
        <Reveal i={1}><p className="text-ink2 leading-relaxed mt-5 max-w-2xl">{lede}</p></Reveal>
        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 mt-12">
          {items.map(([t, b], i) => (
            <RevealItem key={t} i={i} className="h-full">
              <div className={`${surface ? "bg-surface" : "bg-bg"} p-8 h-full hover:bg-white/[0.03] transition-colors`}>
                <h3 className="font-display text-lg font-bold mb-3">{t}</h3>
                <p className="text-ink2 text-sm leading-relaxed">{b}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export default function Services() {
  const { setLeadModal } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <PageHero
        eyebrow="Services"
        title={<>Beyond reporting. <span className="text-signal">Toward transformation.</span></>}
        lede="Service-enabled, platform-based solutions across every stage of the sustainability journey — from baselining to net zero. One engagement, end to end."
      />

      {/* journey strip */}
      <section className="border-b border-white/10 bg-bg" data-testid="services-journey">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-5">
          {JOURNEY.map((j, i) => (
            <div key={j.step} className="py-10 md:py-12 md:px-6 border-b md:border-b-0 md:border-l border-white/10 first:border-l-0 first:pl-0">
              <div className="font-mono text-signal text-xs mb-3">0{i + 1}</div>
              <div className="font-display text-xl font-bold">{j.step}</div>
              <p className="text-ink3 text-xs leading-relaxed mt-2">{j.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Block
        eyebrow="Pillar 01 · Advisory"
        title="Expert-led ESG strategy, from entry to enterprise."
        lede="Low ESG ratings don't just impact reputation — they restrict capital access, slow sales, and expose you to regulatory risk. Our advisory portfolio fixes that."
        items={ADVISORY}
        testid="services-advisory"
      />

      <Block
        eyebrow="Pillar 03 · Managed Support"
        title="Embedded. Scalable. People-led."
        lede="Dedicated specialists across supplier engagement, compliance coordination, and audit readiness — scaling with your network without scaling your headcount. 700+ suppliers onboarded, engagement starts day one."
        items={MANAGED}
        testid="services-managed"
        surface
      />

      <Block
        eyebrow="Capacity building"
        title="Turn every function into an ESG force-multiplier."
        lede="From finance and procurement to operations and leadership — build ESG capabilities that drive measurable, cross-functional impact. 3,800+ professionals trained across manufacturing, pharma, fashion, and retail."
        items={TRAINING}
        testid="services-training"
      />

      <section className="py-20 bg-signal text-black" data-testid="services-stats">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map(([n, l]) => (
            <div key={n}>
              <div className="font-display text-5xl font-extrabold tracking-tight">{n}</div>
              <p className="mt-3 text-black/70 text-sm leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-bg" data-testid="services-cta">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Let's build a high-impact ESG strategy together.</h2>
          <p className="text-ink2 mt-5 max-w-xl mx-auto">Whether you're starting your sustainability journey or refining a mature strategy — move faster, reduce risk, and stay ahead of regulation.</p>
          <button onClick={() => setLeadModal({ kind: "advisor", title: "Book a Consultation" })} data-testid="services-book-consult"
            className="group mt-10 inline-flex bg-signal text-white px-8 py-4 font-bold items-center gap-2.5 hover:bg-signal-hover transition-colors">
            Book a Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </Layout>
  );
}
