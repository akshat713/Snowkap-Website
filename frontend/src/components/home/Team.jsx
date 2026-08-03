import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/Reveal";
import { TEAM, ADVISORS } from "@/data/content";

function Person({ p, i, testid }) {
  return (
    <RevealItem i={i}>
      <div className="group text-center" data-testid={testid}>
        <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto mb-5">
          <img src={p.img} alt={p.name} loading="lazy"
            className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-[filter] duration-500 ring-1 ring-white/15" />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-signal opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="font-display font-bold text-lg">{p.name}</div>
        <div className="text-ink3 text-sm mt-1 leading-snug">{p.role}</div>
      </div>
    </RevealItem>
  );
}

export default function Team({ full = false }) {
  return (
    <section className="py-20 md:py-24 bg-bg" data-testid="team-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          tight
          eyebrow="The people"
          title="The expertise behind the lens."
          lede="Sustainability and technology veterans — backed by an advisory board that has run boardrooms, banks, and global manufacturers."
        />
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink3 mb-8">Core team</div>
        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-10">
          {TEAM.map((p, i) => <Person key={p.name} p={p} i={i} testid={`team-member-${i}`} />)}
        </RevealGroup>

        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink3 mt-14 mb-8 flex items-center gap-3">
          <span className="w-6 h-px bg-signal" /> Advisory board
        </div>
        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 max-w-3xl">
          {ADVISORS.map((p, i) => <Person key={p.name} p={p} i={i} testid={`advisor-${i}`} />)}
        </RevealGroup>

        {!full && (
          <Reveal i={1}>
            <Link
              to="/about"
              onClick={() => window.scrollTo(0, 0)}
              data-testid="team-about-link"
              className="group inline-flex items-center gap-2 mt-12 border border-ink/25 hover:border-signal hover:text-signal px-6 py-3.5 font-semibold transition-colors"
            >
              Meet the full team
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
