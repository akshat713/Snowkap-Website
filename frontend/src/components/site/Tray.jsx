import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Tray() {
  const { trayOpen, setTrayOpen, tray, removeItem, selectedPackage, setSelectedPackage, setProposalOpen } = useApp();
  const empty = tray.length === 0 && !selectedPackage;

  return (
    <AnimatePresence>
      {trayOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setTrayOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[790]"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-bg border-l border-white/10 z-[800] flex flex-col"
            data-testid="programme-tray"
          >
            <div className="p-7 border-b border-white/10 flex justify-between items-start">
              <div>
                <h3 className="font-display text-2xl font-bold">Your Programme</h3>
                <p className="font-mono text-[11px] text-ink3 mt-1 uppercase tracking-wider">A scoped brief — not a bill</p>
              </div>
              <button onClick={() => setTrayOpen(false)} data-testid="tray-close" className="p-1 text-ink2 hover:text-white"><X className="w-5 h-5" /></button>
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
                    <div className="flex justify-between items-center py-4 border-b border-white/10" data-testid="tray-package">
                      <div>
                        <div className="font-semibold">{selectedPackage} package</div>
                        <div className="font-mono text-[10px] text-signal uppercase tracking-wider mt-1">Base plan</div>
                      </div>
                      <button onClick={() => setSelectedPackage(null)} className="text-ink3 hover:text-white text-xs underline">Remove</button>
                    </div>
                  )}
                  {tray.map((item) => (
                    <div key={item.name} className="flex justify-between items-start gap-3 py-4 border-b border-white/10">
                      <div>
                        <div className="font-medium text-sm leading-snug">{item.name}</div>
                        <div className="font-mono text-[10px] text-ink3 uppercase tracking-wider mt-1">{item.type}</div>
                      </div>
                      <button onClick={() => removeItem(item.name)} className="text-ink3 hover:text-white text-xs underline shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-7 border-t border-white/10">
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
