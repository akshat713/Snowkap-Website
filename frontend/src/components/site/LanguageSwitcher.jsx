import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/i18n/TranslationProvider";
import { LANGUAGES, langMeta } from "@/i18n/languages";

// The manual override, and the thing that makes the automatic offer acceptable:
// whatever was detected, the visitor can always see which language they are in
// and change it. Marked data-no-translate throughout — a language menu that
// translates its own entries is a menu nobody can navigate.
export default function LanguageSwitcher({ compact = false, onDark = false }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = langMeta(lang);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref} data-no-translate>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        data-testid="language-switcher"
        // Only the trigger changes on a dark ground. The menu itself is always a
        // light panel, so styling it by descendant selector from here would make
        // its own entries unreadable.
        className={`flex items-center gap-1.5 border transition-colors ${
          onDark
            ? "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
            : "border-ink/15 text-ink2 hover:border-ink/40 hover:text-ink"
        } ${compact ? "px-2.5 py-2" : "px-3 py-2.5"}`}
      >
        <Globe className="w-4 h-4 shrink-0" strokeWidth={1.9} />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
          {current.code}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-[188px] bg-bg border border-ink/15 shadow-xl shadow-ink/10 z-[950] py-1"
          >
            {LANGUAGES.map((l) => (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={l.code === lang}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  data-testid={`language-option-${l.code}`}
                  className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors ${
                    l.code === lang ? "text-signal font-semibold" : "text-ink2 hover:bg-surface hover:text-ink"
                  }`}
                >
                  <span className="w-3.5 shrink-0">
                    {l.code === lang && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                  </span>
                  <span dir={l.dir}>{l.native}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-ink3">
                    {l.code}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
