import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, FileText, Plus, Check } from "lucide-react";
import { DOSSIER_QUESTIONS } from "@/data/site";
import { recommendPackage, pillarOf } from "@/data/recommendations";
import DossierGraphic from "@/components/home/DossierGraphic";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";

export default function Dossier() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); // output of recommendPackage()
  const { setDossier, choosePackage, selectedPackage, addItem, tray } = useApp();
  const navigate = useNavigate();

  const q = DOSSIER_QUESTIONS[step];
  const progress = Math.round(((step + (answers[q?.key] ? 1 : 0)) / DOSSIER_QUESTIONS.length) * 100);

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

  return (
    <section id="dossier" className="py-24 md:py-36 border-t border-ink/10" data-testid="dossier-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] border border-ink/10 overflow-hidden">
          <div className="bg-signal text-bg p-8 md:p-12 flex flex-col justify-between gap-10">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider mb-6">
                <FileText className="w-4 h-4" /> Before we go further
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">Open your dossier.</h3>
              <p className="text-bg/80 leading-relaxed">
                Four quick questions, no email required. Tell us where you sit and we'll route you to the pressures that
                actually apply, the package that fits, and the order we'd tackle it in. This isn't a lead form.
              </p>
            </div>
            <div className="flex justify-center text-bg/70">
              <DossierGraphic />
            </div>
            <div className="font-mono text-[11px] uppercase tracking-wider">Six sectors · Five regions · One platform</div>
          </div>

          <div className="bg-surface p-8 md:p-12 min-h-[440px] flex flex-col">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="dossier-result">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-signal mb-4">Your case file</div>
                  <h4 className="font-display text-3xl font-bold mb-4">
                    We'd start you on <span className="text-signal">{result.tier}</span>.
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
                        The order we'd tackle it in
                      </div>
                      <ol className="relative">
                        {/* the spine connecting the phases */}
                        <span aria-hidden="true" className="absolute left-[13px] top-3 bottom-3 w-px bg-ink/12" />
                        {result.journey.map((j, i) => (
                          <li key={j.phase} className="relative flex gap-4 pb-5 last:pb-0">
                            <span className="relative z-[1] w-[27px] h-[27px] shrink-0 rounded-full bg-surface border border-signal/60 text-signal font-mono text-[11px] flex items-center justify-center">
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
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink3 mb-3">
                    <span>Question {step + 1} of {DOSSIER_QUESTIONS.length}</span>
                    <span className="text-signal">{progress}%</span>
                  </div>
                  <div className="h-px bg-ink/10 mb-8 relative">
                    <motion.div className="absolute left-0 top-0 h-px bg-signal" animate={{ width: `${progress}%` }} />
                  </div>
                  <h4 className="font-display text-2xl md:text-3xl font-bold mb-8">{q.q}</h4>
                  <div className="grid sm:grid-cols-2 gap-3 flex-1 content-start">
                    {q.options.map((opt) => (
                      <button
                        key={opt} onClick={() => pick(opt)}
                        data-testid={`dossier-option-${opt.split(" ")[0].toLowerCase()}`}
                        className={`text-left px-4 py-3.5 border text-sm transition-colors ${answers[q.key] === opt ? "border-signal bg-signal/10 text-ink" : "border-ink/12 text-ink2 hover:border-ink/40"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="flex items-center gap-2 text-ink2 hover:text-ink text-sm disabled:opacity-30 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={next} disabled={!answers[q.key]}
                      data-testid="dossier-next"
                      className="group bg-signal text-bg px-6 py-2.5 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors disabled:opacity-30"
                    >
                      {step === DOSSIER_QUESTIONS.length - 1 ? "See my case" : "Next"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
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
