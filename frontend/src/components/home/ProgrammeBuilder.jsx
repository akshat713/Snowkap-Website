import React, { useState } from "react";
import { Check } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import ServiceSelector from "@/components/home/ServiceSelector";
import { PACKAGES } from "@/data/site";
import { useApp } from "@/context/AppContext";

export default function ProgrammeBuilder() {
  const [mode, setMode] = useState("package"); // package | custom
  const { choosePackage, selectedPackage, setProposalOpen, dossier } = useApp();
  const reco = dossier?.recommended_package && dossier.recommended_package !== selectedPackage
    ? dossier.recommended_package : null;

  return (
    <section id="programme" className="py-24 md:py-36 border-t border-ink/10" data-testid="programme-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Your programme"
          title="Build your programme."
          lede="Take a package built to grow with you, or assemble exactly what you need — line by line — from Advisory, the Platform, and Managed Support. Either way, this builds a scoped brief, not a bill."
        />

        {reco && (
          <div className="border border-signal/40 bg-signal/[0.06] px-6 py-5 mb-10 flex flex-wrap items-center justify-between gap-4" data-testid="programme-dossier-reco">
            <div className="max-w-xl">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal mb-2">From your dossier</div>
              <p className="text-sm text-ink2 leading-relaxed">
                We'd recommend the <span className="text-ink font-semibold">{reco}</span> package
                {dossier.sector ? <> for {dossier.sector}</> : null}
                {dossier.stage ? <> — {dossier.stage.toLowerCase()}</> : null}.
              </p>
            </div>
            <button
              onClick={() => choosePackage(reco)}
              data-testid="programme-dossier-reco-select"
              className="bg-signal text-bg px-4 py-2 text-sm font-bold hover:bg-signal-hover transition-colors shrink-0"
            >
              Select {reco}
            </button>
          </div>
        )}

        <div className="flex gap-1 border border-ink/15 w-fit mb-12">
          {[["package", "Choose a Package"], ["custom", "Build Custom — Line by Line"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              data-testid={`programme-mode-${k}`}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${mode === k ? "bg-signal text-bg" : "text-ink2 hover:text-ink"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {mode === "package" ? (
          <div className="grid md:grid-cols-3 gap-5">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} i={i}>
                <div className={`h-full border p-7 flex flex-col relative ${p.popular ? "border-signal bg-signal/[0.04]" : "border-ink/10 bg-surface/40"}`}>
                  {p.popular && <span className="absolute -top-3 left-7 bg-signal text-bg text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">Most Popular</span>}
                  <h3 className="font-display text-2xl font-bold">{p.id}</h3>
                  <p className="text-ink3 text-sm mb-5">{p.tagline}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-mono text-3xl font-semibold">{p.price}</span>
                    <span className="text-ink3 text-sm">{p.cadence}</span>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink3 mb-5">{p.note}</p>
                  <p className="text-ink2 text-sm mb-6 leading-relaxed">{p.desc}</p>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-ink2">
                        <Check className="w-4 h-4 text-signal shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  {p.id === "Enterprise" ? (
                    <button onClick={() => setProposalOpen(true)} data-testid="programme-enterprise" className="border border-ink/25 hover:border-ink py-3 font-semibold transition-colors">Talk to Sales</button>
                  ) : (
                    <button
                      onClick={() => choosePackage(p.id)}
                      data-testid={`programme-select-${p.id.toLowerCase()}`}
                      className={`py-3 font-bold transition-colors ${selectedPackage === p.id ? "bg-ink/10 text-ink" : "bg-signal text-bg hover:bg-signal-hover"}`}
                    >
                      {selectedPackage === p.id ? "Selected ✓" : `Select ${p.id}`}
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <ServiceSelector />
        )}
      </div>
    </section>
  );
}
