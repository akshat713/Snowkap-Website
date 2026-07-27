import React, { useState } from "react";
import { Check, Plus } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import { PACKAGES, ADDONS } from "@/data/site";
import { useApp } from "@/context/AppContext";

export default function ProgrammeBuilder() {
  const [mode, setMode] = useState("package"); // package | custom
  const { choosePackage, selectedPackage, addItem, tray, setProposalOpen } = useApp();
  const inTray = (name) => tray.find((t) => t.name === name);

  return (
    <section id="programme" className="py-24 md:py-36 border-t border-white/10" data-testid="programme-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          eyebrow="Your programme"
          title="Build your programme."
          lede="Take a package built to grow with you, or assemble exactly what you need — line by line — from Advisory, the Platform, and Managed Support. Either way, this builds a scoped brief, not a bill."
        />

        <div className="flex gap-1 border border-white/15 w-fit mb-12">
          {[["package", "Choose a Package"], ["custom", "Build Custom — Line by Line"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              data-testid={`programme-mode-${k}`}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${mode === k ? "bg-signal text-bg" : "text-ink2 hover:text-white"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {mode === "package" ? (
          <div className="grid md:grid-cols-3 gap-5">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} i={i}>
                <div className={`h-full border p-7 flex flex-col relative ${p.popular ? "border-signal bg-signal/[0.04]" : "border-white/10 bg-surface/40"}`}>
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
                    <button onClick={() => setProposalOpen(true)} data-testid="programme-enterprise" className="border border-white/25 hover:border-white py-3 font-semibold transition-colors">Talk to Sales</button>
                  ) : (
                    <button
                      onClick={() => choosePackage(p.id)}
                      data-testid={`programme-select-${p.id.toLowerCase()}`}
                      className={`py-3 font-bold transition-colors ${selectedPackage === p.id ? "bg-white/10 text-white" : "bg-signal text-bg hover:bg-signal-hover"}`}
                    >
                      {selectedPackage === p.id ? "Selected ✓" : `Select ${p.id}`}
                    </button>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {Object.entries(ADDONS).map(([group, items], gi) => (
              <Reveal key={group} i={gi}>
                <div className="border border-white/10 bg-surface/40 p-6 h-full">
                  <h4 className="font-display text-lg font-semibold mb-5 pb-3 border-b border-white/10">{group}</h4>
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it}>
                        <button
                          onClick={() => addItem(it, group)}
                          data-testid={`addon-${it.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                          className="w-full flex items-center justify-between gap-3 text-left py-2.5 group"
                        >
                          <span className={`text-sm ${inTray(it) ? "text-signal" : "text-ink2 group-hover:text-white"} transition-colors`}>{it}</span>
                          {inTray(it) ? <Check className="w-4 h-4 text-signal shrink-0" /> : <Plus className="w-4 h-4 text-ink3 group-hover:text-signal shrink-0 transition-colors" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
