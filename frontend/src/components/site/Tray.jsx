import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { recommendFor, pillarOf } from "@/data/recommendations";

export default function Tray() {
  const { trayOpen, setTrayOpen, tray, addItem, removeItem, selectedPackage, setSelectedPackage, setProposalOpen, dossier } = useApp();
  const empty = tray.length === 0 && !selectedPackage;

  // Suggestions follow from what's actually in the tray, the package chosen,
  // and the dossier — recomputed on every change so they never go stale.
  const suggestions = useMemo(
    () => recommendFor({ tray, selectedPackage, dossier }),
    [tray, selectedPackage, dossier]
  );

  return (
    <AnimatePresence>
      {trayOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setTrayOpen(false)}
            className="fixed inset-0 bg-ink/45 backdrop-blur-sm z-[790]"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-bg border-l border-ink/10 z-[800] flex flex-col"
            data-testid="programme-tray"
          >
            <div className="p-7 border-b border-ink/10 flex justify-between items-start">
              <div>
                <h3 className="font-display text-2xl font-bold">Your Programme</h3>
                <p className="font-mono text-[11px] text-ink3 mt-1 uppercase tracking-wider">A scoped brief — not a bill</p>
              </div>
              <button onClick={() => setTrayOpen(false)} data-testid="tray-close" className="p-1 text-ink2 hover:text-ink"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-7">
              {empty ? (
                <div className="text-center text-ink3 py-20 text-sm">
                  <Plus className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  Choose a package or add line items from Advisory, the Platform and Managed Support.
                </div>
              ) : (
                <div className="space-y-1">
                  {selectedPackage && (
                    <div className="flex justify-between items-center py-4 border-b border-ink/10" data-testid="tray-package">
                      <div>
                        <div className="font-semibold">{selectedPackage} package</div>
                        <div className="font-mono text-[10px] text-signal uppercase tracking-wider mt-1">Base plan</div>
                      </div>
                      <button onClick={() => setSelectedPackage(null)} className="text-ink3 hover:text-ink text-xs underline">Remove</button>
                    </div>
                  )}
                  {tray.map((item) => (
                    <div key={item.name} className="flex justify-between items-start gap-3 py-4 border-b border-ink/10">
                      <div>
                        <div className="font-medium text-sm leading-snug">{item.name}</div>
                        <div className="font-mono text-[10px] text-ink3 uppercase tracking-wider mt-1">{item.type}</div>
                      </div>
                      <button onClick={() => removeItem(item.name)} className="text-ink3 hover:text-ink text-xs underline shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="mt-7 border border-signal/30 bg-signal/[0.05] p-5" data-testid="tray-recommendations">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-signal mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    {empty ? "Where your sector starts" : "Goes with what you've chosen"}
                  </div>
                  <div className="space-y-4">
                    {suggestions.map((s) => (
                      <div key={s.name} className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium leading-snug">{s.name}</div>
                          <p className="text-ink3 text-[12.5px] leading-relaxed mt-1">{s.why}</p>
                          <div className="font-mono text-[9.5px] uppercase tracking-wider text-ink3/70 mt-1.5">
                            Because of {s.source}
                          </div>
                        </div>
                        <button
                          onClick={() => addItem(s.name, pillarOf(s.name))}
                          data-testid={`tray-add-${s.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}
                          className="shrink-0 inline-flex items-center gap-1.5 border border-signal/50 text-signal hover:bg-signal hover:text-bg px-3 py-1.5 text-xs font-bold transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-7 border-t border-ink/10">
              <button
                disabled={empty}
                onClick={() => { setProposalOpen(true); setTrayOpen(false); }}
                data-testid="tray-request-proposal"
                className="w-full bg-signal text-bg py-3.5 font-bold disabled:opacity-30 hover:bg-signal-hover transition-colors"
              >
                Request Your Proposal
              </button>
              <p className="text-[12px] text-ink3 mt-3 text-center leading-relaxed">
                Submitting sends your selections to our team, who'll come back with a scoped proposal.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
