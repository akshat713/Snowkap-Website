import React, { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { useApp } from "@/context/AppContext";
import { SIGNIN_URL } from "@/data/content";
import { asset } from "@/lib/asset";

const DEEP_MODULES = [
  {
    tag: "Snowkap AI", title: "Predict. Plan. Perform.",
    body: "Tired of juggling spreadsheets, PDFs, and frameworks? Snowkap AI automates your entire emissions workflow — quick, accurate, and audit-ready.",
    img: asset("/assets/product/capture.jpg"),
    points: [
      ["AI-OCR Extraction", "Parse invoices, utility bills, and documents in seconds. Auto-extract activity data and calculate Scope 1–3 with precision."],
      ["Conversational ESG Copilot", "Ask questions, identify data gaps, and navigate complex sustainability tasks with a dedicated AI assistant."],
      ["Auto-Compliance Transfer Engine", "Vector-based intelligence auto-populates overlapping fields across frameworks from your existing reports and verified public sources."],
      ["Built-in Validation Engine", "Spot missing data, detect anomalies, and correct formatting errors before submission. Your compliance guardrail, always on."],
    ],
  },
  {
    tag: "Carbon Accounting", title: "Pinpoint your carbon impact.",
    body: "Measure your enterprise footprint with scientific rigour and automation. Every number verified, traceable, and actionable.",
    img: asset("/assets/product/calculate.jpg"),
    points: [
      ["Unified Data Fabric", "Integrate meters, purchase orders, proxies, and suppliers into one normalised, tagged system — ERP, IoT, and API connectors included."],
      ["60,000+ Emission Factors", "Global and India/SEA/GCC-specific factors with IPCC-aligned precision mapping across Scope 1–3."],
      ["Dynamic Calculation Engine", "Part-, supplier-, or category-level PCF with transparent what-if analysis. 1,100+ PCFs calculated to date."],
      ["Standards Mapping & Audit Trail", "Every factor and output tagged to ISO 14064/14067 and the GHG Protocol, with full version history."],
    ],
  },
  {
    tag: "Scope 3 & Supplier Engagement", title: "Turn supplier blind spots into Scope 3 progress.",
    body: "From onboarding to real-time dashboards — manage your entire value-chain emissions in one place.",
    img: asset("/assets/product/suppliers.jpg"),
    points: [
      ["Tiered Assessments", "Tailored workflows per supplier tier collect the right GHG, energy, and PCF data without confusion."],
      ["AI Verification", "Every file scanned for completeness, consistency, and audit-readiness with machine-learning checks."],
      ["Proxy Gap-Filling", "90%+ confidence proxy datasets close gaps when suppliers can't provide primary data — without compromising integrity."],
      ["Supplier Engagement Hub", "Onboard, remind, and support hundreds of vendors through one branded, centralised portal."],
    ],
  },
  {
    tag: "ESG Reporting", title: "Report once. Comply everywhere.",
    body: "One data entry auto-populates 25+ frameworks — with audit logs, framework mapping, and AI-assist built in.",
    img: asset("/assets/product/reporting.jpg"),
    points: [
      ["Public Data Auto-Pull", "Auto-populate 70–80% of a report from your own data and verified public sources."],
      ["Unified Reporting Hub", "BRSR & BRSR Core, CSRD/ESRS, GRI, IFRS S1/S2, CDP, TCFD, DJSI — from one dataset."],
      ["Live Regulation Watch", "Track 25+ evolving frameworks to future-proof filings, with proactive alerts."],
      ["Audit-Ready Outputs", "One-click XBRL, Word, PDF, and Excel exports with maker-checker governance."],
    ],
  },
];

const OUTCOMES = [
  ["80%", "less manual effort — ETL, unit conversions, and factor mapping automated"],
  ["99.5%", "data accuracy through normalisation and standards mapping"],
  ["100%", "audit readiness — protocol-aligned, traceable, versioned"],
  ["10×", "faster data-to-disclosure cycle"],
];

const PERSONAS = [
  ["Sustainability Teams", "Auto-calculate PCF and Scope 3. Export compliant reports across frameworks in minutes."],
  ["Compliance Officers", "Cut disclosure prep time by 70% with intelligent validations and pre-formatted outputs."],
  ["Supply Chain Managers", "Identify high-carbon suppliers and align vendor performance with decarbonisation targets."],
  ["CXOs & Boards", "Instant ESG insight, audit readiness, and clear next-step recommendations via executive dashboards."],
];

export default function Platform() {
  const { setLeadModal } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <PageHero
        eyebrow="The platform"
        title={<>Your ESG <span className="text-signal">command centre.</span></>}
        lede="An AI-powered platform integrating ERP, IoT, and supply-chain data into GHG accounting and multi-framework reporting. Pre-packed dashboards, ready on day one."
      >
        <div className="mt-10 flex flex-wrap gap-4">
          <button onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })} data-testid="platform-book-demo"
            className="group bg-signal text-white px-7 py-4 font-bold flex items-center gap-2.5 hover:bg-signal-hover transition-colors">
            Book a Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href={SIGNIN_URL} target="_blank" rel="noreferrer" data-testid="platform-sign-in"
            className="group border border-ink/25 hover:border-ink px-7 py-4 font-semibold flex items-center gap-2.5 transition-colors">
            Sign in to Snowkap <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </PageHero>

      {DEEP_MODULES.map((m, mi) => (
        <section key={m.tag} className={`py-20 md:py-24 ${mi % 2 ? "bg-surface border-y border-ink/10" : "bg-bg"}`} data-testid={`platform-module-${mi}`}>
          <div className={`max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center`}>
            <div className={mi % 2 ? "lg:order-2" : ""}>
              <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-signal" /> {m.tag}
              </div>
              <Reveal>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.03]">{m.title}</h2>
              </Reveal>
              <Reveal i={1}><p className="text-ink2 leading-relaxed mt-5 max-w-xl">{m.body}</p></Reveal>
              <div className="mt-9 space-y-6">
                {m.points.map(([t, b], i) => (
                  <Reveal key={t} i={i + 1}>
                    <div className="flex gap-4">
                      <Check className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-ink">{t}</div>
                        <p className="text-ink2 text-sm leading-relaxed mt-1">{b}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal className={mi % 2 ? "lg:order-1" : ""}>
              <div className="relative overflow-hidden border border-ink/12 bg-black aspect-square max-w-[520px] mx-auto group">
                <img src={m.img} alt={m.tag} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink3 bg-ink/50 backdrop-blur px-3 py-1.5 border border-ink/10">{m.tag}</div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="py-24 bg-signal text-black" data-testid="platform-outcomes">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {OUTCOMES.map(([n, l]) => (
            <div key={n}>
              <div className="font-display text-5xl md:text-6xl font-extrabold tracking-tight">{n}</div>
              <p className="mt-3 text-black/70 text-sm leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24 bg-bg" data-testid="platform-personas">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-12 flex items-center gap-3">
            <span className="w-6 h-px bg-signal" /> How leading teams use Snowkap
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
            {PERSONAS.map(([t, b], i) => (
              <Reveal key={t} i={i} className="h-full">
                <div className="bg-bg p-8 h-full hover:bg-ink/[0.03] transition-colors">
                  <h3 className="font-display text-xl font-bold mb-3">{t}</h3>
                  <p className="text-ink2 text-sm leading-relaxed">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal i={1}>
            <button onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })} data-testid="platform-bottom-demo"
              className="group mt-14 bg-signal text-white px-8 py-4 font-bold flex items-center gap-2.5 hover:bg-signal-hover transition-colors">
              See it live — Book a Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
