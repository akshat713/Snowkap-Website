import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, Check, ShieldCheck, Clock, MailX } from "lucide-react";
import SectionHeader from "@/components/site/SectionHeader";
import { DOSSIER_QUESTIONS } from "@/data/site";
import { recommendPackage, pillarOf } from "@/data/recommendations";
import DossierGraphic from "@/components/home/DossierGraphic";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";

// The dossier used to be a two-panel box dropped onto the page with no section
// header, a flat orange slab on the left and an internal "Open your dossier."
// where the section title should have been. It read as a widget, not as the
// moment the page turns from argument into action.
//
// Three things changed. It has a proper header now, in the site's voice. The
// left panel is the dark counterpart to the ink block above it and carries a
// live checklist of the four questions — a reader can see what is being asked
// before committing to the first tap, which is most of what makes a four-step
// form feel safe. And the answer options are keyed, so the whole thing can be
// run from the number row.

// Short forms for the checklist. The questions themselves stay as written.
const STEP_LABELS = ["Sector", "Exposure", "Stage", "Size"];

const ASSURANCES = [
  { icon: MailX, text: "No email required" },
  { icon: Clock, text: "About forty seconds" },
  { icon: ShieldCheck, text: "Nothing leaves your browser" },
];

export default function Dossier() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); // output of recommendPackage()
  // The number-key shortcut only works while focus is inside the group, so the
  // hint is only shown then. Advertising a shortcut that does nothing for a
  // reader who hasn't tabbed in yet is worse than not advertising it.
  const [keyboard, setKeyboard] = useState(false);
  const { setDossier, choosePackage, selectedPackage, addItem, tray } = useApp();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const q = DOSSIER_QUESTIONS[step];
  const answered = DOSSIER_QUESTIONS.filter((d) => answers[d.key]).length;

  const pick = (val) => setAnswers((a) => ({ ...a, [q.key]: val }));

  const next = () => {
    if (step < DOSSIER_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Computed here rather than server-side: the published site is static, and
    // a recommendation that depends on a reachable API is a recommendation that
    // silently defaults. Everything downstream reads it from context.
    const r = recommendPackage(answers);
    setResult(r);
    setDossier({ ...answers, recommended_package: r.tier });
    // Fire-and-forget, purely so the admin dashboard still counts dossiers
    // wherever a backend exists. Never allowed to affect what's shown.
    api.post("/dossier", { ...answers, recommended_package: r.tier }).catch(() => {});
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); setDossier(null); };

  const goProgramme = () => {
    const el = document.getElementById("programme");
    if (el) { el.scrollIntoView({ behavior: "smooth" }); }
    else { navigate("/pricing#programme"); }
  };

  const takePackage = () => { choosePackage(result.tier); };

  // Number keys pick an option, Enter advances. A four-step form that needs four
  // precise taps is a four-step form people abandon on a laptop.
  const onKeyDown = (e) => {
    if (result) return;
    const n = Number(e.key);
    if (n >= 1 && n <= q.options.length) { pick(q.options[n - 1]); return; }
    if (e.key === "Enter" && answers[q.key]) next();
  };

  return (
    <section id="dossier" className="py-20 md:py-24 bg-bg border-t border-ink/10" data-testid="dossier-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <SectionHeader
          tight
          eyebrow="Open your dossier"
          title={<>Four questions. <span className="text-signal">One straight answer.</span></>}
          lede="Tell us where you sit and we'll name the pressures that actually apply to you, the package that fits, and the order we'd tackle it in. This isn't a lead form — there's nothing to submit and no one calls you."
        />

        <div
          className="grid lg:grid-cols-[0.72fr_1.28fr] border border-ink/12 overflow-hidden"
          onKeyDown={onKeyDown}
          onFocus={() => setKeyboard(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setKeyboard(false);
          }}
          role="group"
          aria-label="Dossier"
        >
          {/* Left: the ink counterpart to the argument above, carrying the
              checklist. Progress is a fact about the reader's own answers, so it
              is shown as ticked questions rather than as a percentage. */}
          <div className="relative bg-ink text-bg p-7 md:p-9 flex flex-col gap-6">
            <div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-5xl font-extrabold tracking-tighter text-signal leading-none">
                  {answered}
                </span>
                <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-bg/45">
                  of {DOSSIER_QUESTIONS.length} answered
                </span>
              </div>

              <ol className="space-y-px bg-bg/10" data-testid="dossier-checklist">
                {DOSSIER_QUESTIONS.map((d, i) => {
                  const done = Boolean(answers[d.key]);
                  const on = !result && i === step;
                  return (
                    <li key={d.key}>
                      <button
                        type="button"
                        // Only steps already reached are navigable — jumping
                        // ahead would hand back a recommendation built on gaps.
                        disabled={i > answered || Boolean(result)}
                        onClick={() => setStep(i)}
                        data-testid={`dossier-step-${d.key}`}
                        className={`w-full text-left flex items-center gap-3 px-3.5 py-3 transition-colors disabled:cursor-default ${
                          on ? "bg-signal/15" : "bg-ink hover:bg-bg/[0.06] disabled:hover:bg-ink"
                        }`}
                      >
                        <span
                          className={`w-[18px] h-[18px] shrink-0 rounded-full border flex items-center justify-center ${
                            done
                              ? "bg-signal border-signal"
                              : on
                              ? "border-signal"
                              : "border-bg/25"
                          }`}
                        >
                          {done && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${
                            done || on ? "text-bg" : "text-bg/40"
                          }`}
                        >
                          {STEP_LABELS[i]}
                        </span>
                        <span className="ml-auto text-[12px] text-bg/50 truncate max-w-[52%] text-right">
                          {answers[d.key] || ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Scattered evidence becoming a verified seal — the same three steps
                the form walks the reader through. Held small: it illustrates the
                panel, it isn't the panel. */}
            <div className="hidden sm:flex justify-center text-signal [&_svg]:max-w-[150px]">
              <DossierGraphic />
            </div>

            <ul className="mt-auto space-y-2">
              {ASSURANCES.map((a) => (
                <li key={a.text} className="flex items-center gap-2.5 text-bg/55 text-[12.5px]">
                  <a.icon className="w-3.5 h-3.5 text-signal shrink-0" strokeWidth={2} />
                  {a.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface p-7 md:p-9 min-h-[418px] flex flex-col">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="dossier-result">
                  <div className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-signal mb-4">
                    Your case file
                  </div>
                  <h4 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-4">
                    We&rsquo;d start you on <span className="text-signal">{result.tier}</span>.
                  </h4>

                  {result.reasons.length > 0 && (
                    <p className="text-ink2 leading-relaxed mb-5">
                      Because {result.reasons.join(", and ")}.
                    </p>
                  )}

                  {(result.pressure || result.regionNote) && (
                    <div className="border-l-2 border-signal/50 pl-4 mb-7 space-y-2">
                      {result.pressure && <p className="text-sm text-ink2 leading-relaxed">{result.pressure}</p>}
                      {result.regionNote && <p className="text-[13px] text-ink2/85 leading-relaxed">{result.regionNote}</p>}
                    </div>
                  )}

                  {result.journey.length > 0 && (
                    <div className="mb-8" data-testid="dossier-journey">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3 mb-4">
                        The order we&rsquo;d tackle it in
                      </div>
                      <ol className="relative">
                        {/* the spine connecting the phases */}
                        <span aria-hidden="true" className="absolute left-[13px] top-3 bottom-3 w-px bg-gradient-to-b from-signal/60 to-ink/12" />
                        {result.journey.map((j, i) => (
                          <li key={j.phase} className="relative flex gap-4 pb-5 last:pb-0">
                            <span className="relative z-[1] w-[27px] h-[27px] shrink-0 rounded-full bg-surface border border-signal/60 text-signal font-mono text-[11px] font-bold flex items-center justify-center">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="pt-0.5">
                              <div className="font-semibold text-sm">{j.phase}</div>
                              <p className="text-ink2 text-sm leading-relaxed mt-1">{j.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {result.services.length > 0 && (
                    <div className="mb-8">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink3 mb-3">
                        Where {result.tier} clients in your sector start
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.services.map((name) => {
                          const added = tray.some((t) => t.name === name);
                          return (
                            <button
                              key={name}
                              onClick={() => !added && addItem(name, pillarOf(name))}
                              disabled={added}
                              data-testid={`dossier-service-${name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                              className={`inline-flex items-center gap-2 border px-3 py-2 text-[13px] transition-colors ${
                                added
                                  ? "border-signal/40 text-signal cursor-default"
                                  : "border-ink/15 text-ink2 hover:border-signal hover:text-ink"
                              }`}
                            >
                              {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={takePackage}
                      disabled={selectedPackage === result.tier}
                      data-testid="dossier-take-package"
                      className="group bg-signal text-bg px-6 py-3 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors disabled:opacity-50"
                    >
                      {selectedPackage === result.tier ? `${result.tier} selected ✓` : `Add ${result.tier} to my programme`}
                    </button>
                    <button onClick={goProgramme} data-testid="dossier-see-programme" className="group border border-ink/20 hover:border-ink px-6 py-3 font-semibold flex items-center gap-2 transition-colors">
                      See the full programme <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  {/* Tertiary, and kept off the primary row so it never lands
                      under the floating chat widget on a short viewport. */}
                  <button onClick={reset} data-testid="dossier-restart" className="mt-5 text-ink3 hover:text-ink text-sm underline transition-colors">
                    Start over
                  </button>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="flex-1 flex flex-col">
                  {/* Segmented progress: four questions, four segments. A single
                      thin bar at 25% told the reader a percentage; four blocks
                      tell them how many taps are left. */}
                  <div className="flex items-center gap-3 mb-7">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink3">
                      {String(step + 1).padStart(2, "0")} / {String(DOSSIER_QUESTIONS.length).padStart(2, "0")}
                    </span>
                    <div className="flex-1 flex gap-1.5">
                      {DOSSIER_QUESTIONS.map((d, i) => (
                        <span key={d.key} className="flex-1 h-[3px] bg-ink/10 overflow-hidden">
                          <motion.span
                            className="block h-full bg-signal origin-left"
                            initial={false}
                            animate={{ scaleX: answers[d.key] ? 1 : i === step ? 0.35 : 0 }}
                            transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <h4 className="font-display text-2xl md:text-[32px] font-bold tracking-tight leading-tight mb-7">
                    {q.q}
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-2.5 flex-1 content-start">
                    {q.options.map((opt, i) => {
                      const on = answers[q.key] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => pick(opt)}
                          aria-pressed={on}
                          data-testid={`dossier-option-${opt.split(" ")[0].toLowerCase()}`}
                          className={`group text-left flex items-center gap-3 pl-3 pr-4 py-3 border text-sm transition-all ${
                            on
                              ? "border-signal bg-signal/10 text-ink"
                              : "border-ink/12 text-ink2 hover:border-signal/50 hover:bg-bg"
                          }`}
                        >
                          {/* The key hint doubles as the selected marker, so the
                              row never gains or loses width on selection. */}
                          <span
                            className={`w-6 h-6 shrink-0 rounded-sm flex items-center justify-center font-mono text-[11px] font-bold transition-colors ${
                              on
                                ? "bg-signal text-white"
                                : "bg-ink/[0.06] text-ink3 group-hover:bg-signal/15 group-hover:text-signal"
                            }`}
                          >
                            {on ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-8">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="flex items-center gap-2 text-ink2 hover:text-ink text-sm disabled:opacity-30 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                      {keyboard && (
                        <span className="hidden sm:block font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink3">
                          Press 1&ndash;{q.options.length}
                        </span>
                      )}
                      <button
                        onClick={next}
                        disabled={!answers[q.key]}
                        data-testid="dossier-next"
                        className="group bg-signal text-bg px-6 py-2.5 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors disabled:opacity-30"
                      >
                        {step === DOSSIER_QUESTIONS.length - 1 ? "See my case" : "Next"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
