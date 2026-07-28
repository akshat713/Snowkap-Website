import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import Team from "@/components/home/Team";
import { useApp } from "@/context/AppContext";
import { IMAGES } from "@/data/content";

const CREDENTIALS = [
  "IIT Kharagpur", "IIT Bombay", "IIM Lucknow", "IIM Kozhikode", "TISS", "Symbiosis Institute", "CEPT University", "NITIE",
  "GHG Protocol", "IPCC Inventory", "ISO 14064", "ISAE 3000", "EcoVadis", "CDP", "DJSI", "SBTi",
];

const REGIONS = ["India", "GCC", "SE Asia", "Europe"];

export default function About() {
  const { setLeadModal } = useApp();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <PageHero
        eyebrow="About Snowkap"
        title={<>We are your <span className="text-signal">lens</span> for climate decisions.</>}
        lede="A global ESG technology company — combining expert advisory, AI-powered technology, and embedded managed support to convert ESG complexity into measurable business performance."
      />

      {/* narrative */}
      <section className="py-24 md:py-32 bg-bg" data-testid="about-narrative">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
                Data is messy. Sustainability's even messier.
              </h2>
            </Reveal>
            <Reveal i={1}>
              <p className="text-ink2 leading-relaxed mt-6 max-w-xl">
                Carbon accounting is complex. Standards keep multiplying. Systems don't speak. Infrastructure can't keep up.
                Businesses today are stuck between climate ambition and real action — what's missing is a foundation: a clear,
                scalable system for carbon accounting and net-zero success.
              </p>
            </Reveal>
            <Reveal i={2}>
              <p className="text-ink font-semibold leading-relaxed mt-6 max-w-xl">
                That's where Snowkap comes in. We turn climate complexity into business clarity.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <div className="relative rounded-full overflow-hidden border border-ink/15 aspect-square max-w-[480px] mx-auto">
              <img src={IMAGES.forest} alt="Forest through the Snowkap lens" loading="lazy" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent" />
              <div className="absolute bottom-10 left-0 right-0 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-ink/80">
                Clarity is our climate strategy
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* mission band */}
      <section className="py-20 md:py-28 bg-signal text-black" data-testid="about-mission">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 mb-6">Our vision</div>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.0]">
            Remove 1 billion tons of CO₂e — and reshape the future of business and the planet.
          </h2>
          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4 font-mono text-[12px] uppercase tracking-[0.16em] text-black/70">
            {REGIONS.map((r) => <span key={r} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />{r}</span>)}
          </div>
        </div>
      </section>

      <Team full />

      {/* credentials */}
      <section className="py-24 md:py-32 bg-surface border-y border-ink/10" data-testid="about-credentials">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-signal" /> Bench strength
          </div>
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight max-w-2xl leading-[1.03]">
              Credentials that hold up in the boardroom.
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="text-ink2 mt-5 max-w-2xl leading-relaxed">
              Our sustainability team spans climate policy, GHG accounting, supply-chain sustainability, and ESG tech —
              with 13+ years of cross-sector leadership and alumni of India's top engineering and management institutes.
            </p>
          </Reveal>
          <div className="flex flex-wrap gap-3 mt-10">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c} i={i % 6}>
                <span className="border border-ink/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink2 hover:border-signal hover:text-ink transition-colors">
                  {c}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-bg text-center" data-testid="about-cta">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">One partner. The full ESG journey.</h2>
          <button onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })} data-testid="about-book-demo"
            className="group mt-10 inline-flex bg-signal text-white px-8 py-4 font-bold items-center gap-2.5 hover:bg-signal-hover transition-colors">
            Book a Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </Layout>
  );
}
