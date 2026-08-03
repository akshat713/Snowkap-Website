import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { useLanguage } from "@/i18n/TranslationProvider";
import { BANNER, langMeta } from "@/i18n/languages";

// Offered, not imposed. Switching a visitor's language out from under them on the
// strength of a time zone is the kind of helpfulness that reads as a bug — a
// German consultant reading the English site on purpose should not have it
// rewritten. So the detection produces an offer, in the language being offered,
// and declining it is remembered.
//
// It sits at the bottom rather than the top so it never pushes the hero down or
// covers the navigation, and it clears the chat launcher's corner.
export default function LanguageBanner() {
  const { offer, setLang, dismissOffer } = useLanguage();
  const copy = offer ? BANNER[offer] : null;

  return (
    <AnimatePresence>
      {offer && copy && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[880] bg-ink text-bg border-t border-bg/15"
          data-testid="language-banner"
          data-no-translate
          dir={langMeta(offer).dir}
        >
          <div className="max-w-[1320px] mx-auto px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:pr-[220px]">
            <Globe className="w-4 h-4 text-signal shrink-0" strokeWidth={2} />
            <span className="font-semibold text-[14px]">{copy.ask}</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-bg/40">
              {copy.note}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setLang(offer)}
                data-testid="language-accept"
                className="bg-signal text-white text-[13px] font-bold px-4 py-2 hover:bg-signal-hover transition-colors"
              >
                {copy.yes}
              </button>
              <button
                onClick={dismissOffer}
                data-testid="language-decline"
                className="text-bg/60 hover:text-bg text-[13px] px-3 py-2 transition-colors"
              >
                {copy.no}
              </button>
              <button
                onClick={dismissOffer}
                aria-label="Dismiss"
                className="text-bg/50 hover:text-bg p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
