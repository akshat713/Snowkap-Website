import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, FileText } from "lucide-react";
import { DOSSIER_QUESTIONS } from "@/data/site";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";

export default function Dossier() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(null); // recommended package
  const { setDossier } = useApp();
  const navigate = useNavigate();

  const q = DOSSIER_QUESTIONS[step];
  const progress = Math.round(((step + (answers[q?.key] ? 1 : 0)) / DOSSIER_QUESTIONS.length) * 100);

  const pick = (val) => setAnswers((a) => ({ ...a, [q.key]: val }));

  const next = async () => {
    if (step < DOSSIER_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      try {
        const { data } = await api.post("/dossier", answers);
        setDossier({ ...answers, recommended_package: data.recommended_package });
        setDone(data.recommended_package);
      } catch {
        setDone("Growth");
      }
    }
  };

  const reset = () => { setStep(0); setAnswers({}); setDone(null); };
  const goProgramme = () => {
    const el = document.getElementById("programme");
    if (el) { el.scrollIntoView({ behavior: "smooth" }); }
    else { navigate("/pricing#programme"); }
  };

  return (
    <section id="dossier" className="py-24 md:py-36 border-t border-white/10" data-testid="dossier-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] border border-white/10 overflow-hidden">
          <div className="bg-signal text-bg p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider mb-6">
                <FileText className="w-4 h-4" /> Before we go further
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">Open your dossier.</h3>
              <p className="text-bg/80 leading-relaxed">
                Four quick questions, no email required. Tell us where you sit, and we'll route you to the right
                pressures, the right package, and the right proof. This isn't a lead form.
              </p>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-wider mt-10">Six sectors · Five regions · One platform</div>
          </div>

          <div className="bg-surface p-8 md:p-12 min-h-[420px] flex flex-col">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="dossier-result">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-signal mb-4">Your case file</div>
                  <h4 className="font-display text-3xl font-bold mb-4">We'd start you on <span className="text-signal">{done}</span>.</h4>
                  <p className="text-ink2 leading-relaxed mb-8">
                    Based on your sector ({answers.sector}), region ({answers.region}) and stage, the <b className="text-white">{done}</b> programme
                    fits where you are now — and everything on the site below is now tuned to your case.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={goProgramme} data-testid="dossier-see-programme" className="group bg-signal text-bg px-6 py-3 font-bold flex items-center gap-2 hover:bg-signal-hover transition-colors">
                      See my programme <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={reset} data-testid="dossier-restart" className="border border-white/20 hover:border-white px-6 py-3 font-semibold transition-colors">Start over</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }} className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink3 mb-3">
                    <span>Question {step + 1} of {DOSSIER_QUESTIONS.length}</span>
                    <span className="text-signal">{progress}%</span>
                  </div>
                  <div className="h-px bg-white/10 mb-8 relative">
                    <motion.div className="absolute left-0 top-0 h-px bg-signal" animate={{ width: `${progress}%` }} />
                  </div>
                  <h4 className="font-display text-2xl md:text-3xl font-bold mb-8">{q.q}</h4>
                  <div className="grid sm:grid-cols-2 gap-3 flex-1 content-start">
                    {q.options.map((opt) => (
                      <button
                        key={opt} onClick={() => pick(opt)}
                        data-testid={`dossier-option-${opt.split(" ")[0].toLowerCase()}`}
                        className={`text-left px-4 py-3.5 border text-sm transition-colors ${answers[q.key] === opt ? "border-signal bg-signal/10 text-white" : "border-white/12 text-ink2 hover:border-white/40"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => setStep((s) => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="flex items-center gap-2 text-ink2 hover:text-white text-sm disabled:opacity-30 transition-colors"
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
