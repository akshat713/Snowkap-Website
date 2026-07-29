import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Lightbulb, Plus, Search, Users, X, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ADDONS } from "@/data/site";
import { PACKAGE_COVERS, SECTOR_PLAYBOOK } from "@/data/recommendations";

// The line-by-line selection surface: all 21 services across the three pillars,
// each selectable on its own.
//
// Three things make it a working model rather than a list of buttons:
//
//   Add is a toggle. A one-way Add is a trap — the only way back out of a
//   mis-click would be the tray, which may be closed.
//
//   A service already inside the selected package is not offered. It shows
//   "In Growth" and is disabled, because adding it would put the same line in
//   the brief twice and imply a second charge for something already bought.
//
//   Services the dossier pointed at are flagged where they sit, not only in the
//   band at the bottom. A recommendation you have to hold in your head while
//   scrolling 21 cards isn't one.
//
// Search and the pillar filter exist because 21 items is past the point where
// scanning works, and someone arriving from a sector recommendation usually
// wants three specific lines rather than the catalogue.

const PILLAR_META = {
  Advisory: { icon: Lightbulb, blurb: "Strategy, ratings and capacity building" },
  "ESG Platform": { icon: Zap, blurb: "Data, intelligence and compliance" },
  "Managed Support": { icon: Users, blurb: "Embedded, people-led delivery" },
};

const slug = (s) => s.replace(/[^a-z0-9]/gi, "-").toLowerCase();

function ServiceCard({ service, pillar, i }) {
  const { tray, addItem, removeItem, selectedPackage } = useApp();
  const reduce = useReducedMotion();

  const selected = tray.some((t) => t.name === service.name);
  const covered = selectedPackage
    ? (PACKAGE_COVERS[selectedPackage] || []).includes(service.name)
    : false;

  const toggle = () => (selected ? removeItem(service.name) : addItem(service.name, pillar));

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.045, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex items-center gap-4 p-5 md:px-6 border transition-colors ${
        covered
          ? "border-ink/10 bg-ink/[0.03]"
          : selected
          ? "border-signal bg-signal/[0.05]"
          : "border-ink/10 bg-bg hover:border-signal/45"
      }`}
      data-testid={`service-card-${slug(service.name)}`}
    >
      {/* Accent edge on a selected line — reads down a long column far faster
          than the button state does */}
      <AnimatePresence>
        {selected && !covered && (
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-signal origin-top"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h4 className={`font-semibold leading-snug ${covered ? "text-ink2" : "text-ink"}`}>
            {service.name}
          </h4>
          {service.recommended && !covered && (
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-signal border border-signal/40 px-1.5 py-0.5 shrink-0">
              For your sector
            </span>
          )}
        </div>
        <p className="text-ink2 text-sm mt-1 leading-relaxed">{service.blurb}</p>
      </div>

      {covered ? (
        <span
          className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink3 border border-ink/15 rounded-full px-3.5 py-2"
          data-testid={`service-covered-${slug(service.name)}`}
        >
          In {selectedPackage}
        </span>
      ) : (
        <button
          onClick={toggle}
          data-testid={`service-add-${slug(service.name)}`}
          aria-pressed={selected}
          aria-label={selected ? `Remove ${service.name}` : `Add ${service.name}`}
          className={`shrink-0 rounded-full border font-semibold text-sm px-4 py-2 flex items-center gap-1.5 transition-colors ${
            selected
              ? "border-signal bg-signal text-white hover:bg-signal-hover"
              : "border-ink/25 text-ink hover:border-signal hover:text-signal"
          }`}
        >
          {selected ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 opacity-0 -mr-1.5 group-hover:opacity-100 group-hover:mr-0 transition-all duration-200" />
              Add
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

export default function ServiceSelector() {
  const { tray, dossier, selectedPackage, setTrayOpen } = useApp();
  const [query, setQuery] = useState("");
  const [pillarFilter, setPillarFilter] = useState("All");
  const inputRef = useRef(null);

  // Services this sector's playbook starts with — flagged inline as well as
  // named in the band, so the advice survives scrolling.
  const recommended = useMemo(() => {
    const play = dossier?.sector ? SECTOR_PLAYBOOK[dossier.sector] : null;
    return new Set(play?.services || []);
  }, [dossier]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(ADDONS)
      .filter(([pillar]) => pillarFilter === "All" || pillar === pillarFilter)
      .map(([pillar, items]) => [
        pillar,
        items
          .filter((s) => !q || s.name.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q))
          .map((s) => ({ ...s, recommended: recommended.has(s.name) })),
      ])
      .filter(([, items]) => items.length > 0);
  }, [query, pillarFilter, recommended]);

  const matches = groups.reduce((n, [, items]) => n + items.length, 0);
  const countIn = (pillar) => tray.filter((t) => t.type === pillar).length;

  return (
    <div data-testid="service-selector">
      {/* Controls. Search plus a pillar filter — 21 lines is past the point at
          which scanning works, and someone who arrived from a sector
          recommendation wants three specific lines, not the catalogue. */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink3 pointer-events-none" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services — CBAM, Scope 3, supplier…"
            aria-label="Search services"
            data-testid="service-search"
            className="w-full border border-ink/15 bg-bg pl-11 pr-10 py-3 text-sm outline-none focus:border-signal transition-colors placeholder:text-ink3"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              aria-label="Clear search"
              data-testid="service-search-clear"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink3 hover:text-ink p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 border border-ink/15 w-fit p-1">
          {["All", ...Object.keys(ADDONS)].map((p) => (
            <button
              key={p}
              onClick={() => setPillarFilter(p)}
              data-testid={`service-filter-${slug(p)}`}
              aria-pressed={pillarFilter === p}
              className={`px-3.5 py-2 text-[13px] font-medium transition-colors ${
                pillarFilter === p ? "bg-signal text-white" : "text-ink2 hover:text-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {matches === 0 ? (
        <div className="border border-ink/10 bg-bg py-16 text-center" data-testid="service-empty">
          <p className="text-ink2">
            Nothing matches “<span className="text-ink font-semibold">{query}</span>”.
          </p>
          <button
            onClick={() => { setQuery(""); setPillarFilter("All"); }}
            className="mt-4 font-mono text-[12px] uppercase tracking-wider text-signal hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-14">
          {groups.map(([pillar, items]) => {
            const Icon = PILLAR_META[pillar]?.icon || Zap;
            const n = countIn(pillar);
            return (
              <section key={pillar} data-testid={`service-group-${slug(pillar)}`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-11 h-11 bg-signal flex items-center justify-center shrink-0">
                    <Icon className="w-[22px] h-[22px] text-white" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl font-bold leading-tight">{pillar}</h3>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink3 mt-0.5">
                      {PILLAR_META[pillar]?.blurb}
                    </p>
                  </div>
                  {n > 0 && (
                    <span
                      className="ml-auto shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-signal border border-signal/40 px-3 py-1.5"
                      data-testid={`service-group-count-${slug(pillar)}`}
                    >
                      {n} added
                    </span>
                  )}
                </div>
                {/* gap-px over an ink ground: the rules are drawn by the grid
                    itself, so 8 cards read as one block */}
                <div className="grid md:grid-cols-2 gap-px bg-ink/[0.08] border border-ink/[0.08]">
                  {items.map((s, i) => (
                    <ServiceCard key={s.name} service={s} pillar={pillar} i={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Dossier band. Dark, because it is the one piece of the block that is
          about this visitor rather than about the catalogue. */}
      {dossier?.sector && SECTOR_PLAYBOOK[dossier.sector] && (
        <div className="mt-14 bg-ink text-bg p-8 md:p-10" data-testid="selector-dossier-band">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-signal" /> Based on your dossier
          </div>
          <p className="text-lg md:text-xl leading-relaxed max-w-4xl">
            Because you told us you're in <strong className="font-semibold">{dossier.sector}</strong>, we'd
            point you toward{" "}
            {SECTOR_PLAYBOOK[dossier.sector].services.map((s, i, arr) => (
              <React.Fragment key={s}>
                <strong className="font-semibold text-signal">{s}</strong>
                {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}
              </React.Fragment>
            ))}
            {dossier.recommended_package ? (
              <>
                {" "}— and the{" "}
                <strong className="font-semibold">{dossier.recommended_package}</strong> package as your
                starting scope.
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      )}

      {/* Running total. The selection is long enough to scroll well past the
          tray trigger in the header, so the count follows the reader. */}
      <AnimatePresence>
        {(tray.length > 0 || selectedPackage) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            // The right padding reserves the chat launcher's footprint. The
            // launcher is viewport-fixed at a higher z-index, so without it the
            // bar's own CTA renders underneath and is unclickable. Two values
            // because the launcher drops its label below sm and collapses to
            // roughly the icon alone.
            className="sticky bottom-4 z-[400] mt-10 bg-ink text-bg pl-5 pr-[76px] sm:pr-[210px] py-4 flex flex-wrap items-center gap-4 shadow-2xl shadow-black/25"
            data-testid="selector-summary"
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.14em]">
              {selectedPackage ? (
                <>
                  <span className="text-signal">{selectedPackage}</span> package
                  {tray.length > 0 ? ` + ${tray.length} service${tray.length === 1 ? "" : "s"}` : ""}
                </>
              ) : (
                <>
                  <span className="text-signal">{tray.length}</span> service
                  {tray.length === 1 ? "" : "s"} selected
                </>
              )}
            </span>
            <button
              onClick={() => setTrayOpen(true)}
              data-testid="selector-review"
              className="ml-auto group bg-signal text-white px-5 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors"
            >
              Review your programme
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
