import React from "react";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal } from "@/components/site/Reveal";
import ProblemGraphic from "@/components/home/ProblemGraphic";
import { useApp } from "@/context/AppContext";
import { PROBLEMS } from "@/data/content";

// Takes the framing of the "What Snowkap is" block: a sticky left column
// carrying the argument while the right column's cards stack past it. It suits
// this section better than the flat list it replaces, because these five items
// are cumulative — each one compounds the last, and the sticky header is what
// keeps the claim they compound toward on screen while you read them.
export default function Problem() {
  const { setLeadModal } = useApp();

  return (
    <section className="py-20 md:py-24 bg-bg" data-testid="problem-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
        <div className="lg:sticky lg:top-28 h-fit">
          <SectionHeader
            eyebrow="The structural problem"
            title="ESG stopped being a report. It became a condition of trade."
            lede="Capital, contracts and customs now screen on verified supplier data. The gap is not ambition — it is that the data sits outside the businesses being asked for it."
          />
          <button
            onClick={() => setLeadModal({ kind: "demo", title: "Talk to an Advisor" })}
            data-testid="problem-advisor-link"
            className="group inline-flex items-center gap-2 border border-ink/25 hover:border-signal hover:text-signal px-6 py-3.5 font-semibold transition-colors"
          >
            Talk through your exposure
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {PROBLEMS.map((p, i) => (
            // Staggered sticky offsets, so the cards shingle as they pass rather
            // than landing on top of one another.
            <div key={p.n} className="lg:sticky" style={{ top: `${104 + i * 22}px` }}>
              <div
                className="group lift bg-bg border border-ink/10 hover:border-signal/40"
                data-testid={`problem-card-${i}`}
              >
                <div className="relative aspect-[16/6] overflow-hidden bg-surface border-b border-ink/10">
                  <div className="absolute inset-0 p-6 md:p-8">
                    <ProblemGraphic kind={p.graphic} />
                  </div>
                  <span className="absolute bottom-4 left-6 font-mono text-signal text-sm">{p.n}</span>
                </div>
                <div className="p-7 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4 leading-[1.15]">
                    {p.title}
                  </h3>
                  <p className="text-ink2 leading-relaxed max-w-lg">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outside the grid on purpose. As a sibling of the sticky cards this sat
          underneath the topmost one and was sliced in half — the sticky card wins
          the overlap. Out here it has the row to itself. */}
      <div className="max-w-[1320px] mx-auto px-6 md:px-10 mt-12 md:mt-16">
        <Reveal>
          <p className="font-display text-2xl md:text-4xl font-bold max-w-3xl">
            Five problems, one root cause:{" "}
            <span className="text-signal">the data isn't yours to collect.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
