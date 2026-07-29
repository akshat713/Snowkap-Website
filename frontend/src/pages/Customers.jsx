import React, { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import ClientLogo from "@/components/site/ClientLogo";
import { useApp } from "@/context/AppContext";
import { CLIENT_SECTORS } from "@/data/content";

const CASE_STUDIES = [
  {
    n: "01", sector: "Manufacturing & Industrial", client: "JSW Steel",
    headline: "From fragmented spreadsheets to a single, audit-ready source of truth.",
    challenge: "One of the world's largest steel producers ran emissions data across dozens of disconnected spreadsheets and site systems — slow to consolidate, hard to assure, and impossible to act on.",
    approach: "Snowkap deployed the ESG platform with embedded managed support: a unified data fabric across sites, supplier onboarding for Scope 3, and sector-specialist advisory aligning the roadmap with disclosure and ratings goals.",
    outcome: "A single, audit-ready carbon baseline with primary data flowing from operations and suppliers — reviewed at board level and ready for assurance.",
    stats: [[">90%", "Primary data in one quarter"], ["Scope 1–3", "Unified baseline"], ["1", "Source of truth across sites"]],
    quote: "The Snowkap team brought deep industry knowledge and a sharp, data-driven approach to our ESG strategy. Their insights were tailored, relevant, and impactful.",
    author: "Badal Balchandani", role: "VP, Corporate Sustainability, JSW Steel",
  },
  {
    n: "02", sector: "Beverages & Consumer Goods", client: "Senco Gold",
    headline: "A rated ESG score became a measurable capital-access advantage.",
    challenge: "A listed consumer business needed its ESG story to translate into capital access — but ratings and disclosures lagged the performance underneath them.",
    approach: "Snowkap built a credible Scope 3 baseline, structured disclosures around rating methodologies, and linked the sustainability roadmap to finance outcomes the CFO could defend.",
    outcome: "A data-backed sustainability roadmap with on-ground action — and an ESG profile that now works as a capital-access advantage, not a compliance cost.",
    stats: [["7.6×", "ROI on ratings work"], ["Scope 3", "Credible baseline built"], ["CFO-grade", "Finance-linked roadmap"]],
    quote: "Working with Snowkap has helped us build our roadmap for sustainability initiatives. Their understanding of Scope 3 emissions, combined with a pragmatic, data-driven approach, helped us build a credible baseline and take action on ground.",
    author: "Sanjay Banka", role: "Chief Financial Officer, Senco Gold",
  },
  {
    n: "03", sector: "Financial, IT & Investment", client: "Sutherland",
    headline: "SBTi targets validated. Multi-framework reporting, one data model.",
    challenge: "A global BPO and IT services provider needed its SBTi target-setting approach validated — and a practical net-zero pathway across a distributed, multi-country footprint.",
    approach: "Snowkap ran a structured review of the target-setting methodology, benchmarked it against SBTi criteria, and consolidated multi-framework reporting into a single data model.",
    outcome: "Validated targets, clear and practical recommendations, and a strong foundation for the Net Zero pathway — with every framework fed from one data entry.",
    stats: [["25+", "Frameworks, one entry"], ["SBTi", "Approach validated"], ["Net zero", "Pathway defined"]],
    quote: "Snowkap delivered a well-structured, insightful review that validated our SBTi target-setting approach and provided clear, practical recommendations. A strong foundation for our Net Zero pathway.",
    author: "Abhishek Agarwal", role: "Global Head Compliance, Sutherland",
  },
];

function CaseStudy({ s, i }) {
  return (
    <section className={`py-24 md:py-32 ${i % 2 ? "bg-surface border-y border-ink/10" : "bg-bg"}`} data-testid={`case-study-${i}`}>
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-mono text-signal text-sm">{s.n}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink3">{s.sector}</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter leading-[0.95]">{s.client}</h2>
          <p className="font-display text-xl md:text-2xl font-bold text-ink2 mt-5 leading-snug max-w-md">{s.headline}</p>
          <figure className="mt-10 border-l-2 border-signal pl-5 max-w-md">
            <blockquote className="text-ink2 leading-relaxed text-sm">&ldquo;{s.quote}&rdquo;</blockquote>
            <figcaption className="mt-4">
              <div className="font-semibold text-ink text-sm">{s.author}</div>
              <div className="text-ink3 text-xs mt-0.5">{s.role}</div>
            </figcaption>
          </figure>
        </div>

        <div>
          <div className="border-t border-ink/10">
            {[["The challenge", s.challenge], ["The Snowkap approach", s.approach], ["The outcome", s.outcome]].map(([t, b]) => (
              <div key={t} className="grid md:grid-cols-[200px_1fr] gap-4 md:gap-8 py-8 border-b border-ink/10">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal pt-1">{t}</div>
                <p className="text-ink2 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-px bg-ink/10 border border-ink/10 mt-10">
            {s.stats.map(([n, l]) => (
              <div key={l} className={`${i % 2 ? "bg-surface" : "bg-bg"} p-5 md:p-7`}>
                <div className="font-mono text-2xl md:text-3xl font-semibold text-signal tracking-tight">{n}</div>
                <div className="text-ink3 text-[11px] uppercase tracking-wider mt-2 leading-snug">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Customers() {
  const { setLeadModal } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <PageHero
        eyebrow="Customer stories"
        title={<>Proof, not <span className="text-signal">promises.</span></>}
        lede="Every story is real — sector, regulatory driver, suppliers activated, data coverage, and outcome. The full write-up is one short conversation away."
      />

      {/* A wall, not a marquee. On the home page the logos are ambient proof and
          motion suits them; here they are the subject of the page, so a visitor
          arrives wanting to find a specific company — and you cannot scan a
          moving strip for a name. Equal cells also make the equal weighting
          structural: every client gets exactly the same area, and the name is
          spelled out rather than left to whoever can recognise a mark. */}
      <section className="border-b border-ink/10 py-16 md:py-20 bg-surface" data-testid="customers-logo-wall">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-9">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Who we work with
            </h2>
            <span className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-signal">
              {CLIENT_SECTORS.reduce((n, s) => n + s.logos.length, 0)} enterprises · {CLIENT_SECTORS.length} sectors
            </span>
          </div>

          {/* Hairlines are drawn by each cell's own right/bottom border rather
              than by gaps over a tinted background. With 21 clients in 5 columns
              the last row is one cell wide, and the background technique painted
              the four empty slots as a solid block. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-t border-l border-ink/10">
            {CLIENT_SECTORS.flatMap((group) =>
              group.logos.map(([name, src]) => (
                <div
                  key={name}
                  className="group bg-bg hover:bg-surface/70 transition-colors border-r border-b border-ink/10 p-5 md:p-6 flex flex-col items-center justify-between gap-4 text-center"
                  data-testid={`customer-cell-${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <ClientLogo name={name} src={src} size="sm" />
                  </div>
                  {/* Fixed caption height: a two-line client name would
                      otherwise make its whole grid row taller than the rest. */}
                  <div className="min-h-[52px]">
                    <div className="text-[13px] font-medium leading-snug text-ink">{name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink3 mt-1.5 leading-snug">
                      {group.sector}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {CASE_STUDIES.map((s, i) => <CaseStudy key={s.client} s={s} i={i} />)}

      <section className="py-24 md:py-32 bg-bg text-center border-t border-ink/10" data-testid="customers-cta">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.24em] text-signal mb-6">Your turn</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.98]">
            Become the next story.
          </h2>
          <p className="text-ink2 mt-6 max-w-xl mx-auto">From first baseline to board-ready outcomes — one partner, the full ESG journey.</p>
          <Reveal>
            <button onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })} data-testid="customers-become-story"
              className="group mt-10 inline-flex items-center gap-2 bg-signal text-white px-8 py-4 font-bold hover:bg-signal-hover transition-colors">
              Talk to an Advisor <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
