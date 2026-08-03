import React, { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BASE_DICT, LANG_CODES, langMeta } from "./languages";
import { detectSync, fromIp } from "./detect";

// Translation by rewriting the rendered DOM rather than by threading a t()
// through forty components.
//
// The trade-off is deliberate. Keying on the source string means a component
// needs no knowledge that translation exists, so the entire site — including copy
// that lives in data files and copy added later — is covered by adding a
// dictionary entry, and there is no risk of a missing key rendering as
// "hero.title". The cost is that a fragment split across elements has to be keyed
// as the fragments it actually renders as, which is why the catalogue in
// strings.json was extracted from the live DOM rather than written by hand.
//
// Nodes are matched on their trimmed text and the surrounding whitespace is put
// back, so a node reading "\n  Pricing\n" translates without collapsing the
// layout's own spacing.

const KEY = "sk_lang";
const DISMISSED = "sk_lang_offer_dismissed";

// Never touched: code samples, the chat transcript (the model's answer, not our
// copy), and anything a component has explicitly opted out of.
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
const SKIP_SELECTOR = "[data-no-translate], [data-testid='chat-messages']";

// Attributes that are read by a person and so need translating too. Text nodes
// alone would leave the chat placeholder and every icon-button label in English.
const ATTRS = ["placeholder", "title", "aria-label", "alt"];

const Ctx = createContext({
  lang: "en",
  setLang: () => {},
  offer: null,
  dismissOffer: () => {},
  ready: true,
  t: (s) => s,
});

export const useLanguage = () => useContext(Ctx);

/** Lazily pull the generated dictionary for a language, if one has been built. */
async function loadGenerated(code) {
  try {
    // Webpack resolves this to a code-split chunk per language, so a visitor
    // reading English never downloads any of them.
    const mod = await import(`./generated/${code}.json`);
    return mod.default || mod;
  } catch {
    return null;
  }
}

export default function TranslationProvider({ children }) {
  const stored = (() => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  })();

  const [lang, setLangState] = useState(stored && LANG_CODES.includes(stored) ? stored : "en");
  const [dict, setDict] = useState(null);
  const [offer, setOffer] = useState(null);
  const [ready, setReady] = useState(true);

  // Per-node bookkeeping: the English source, and the exact string we last wrote.
  // Both are needed. The source lets a switch back to English restore the
  // original rather than translating a translation; `applied` lets us tell our
  // own write apart from React writing new content into the same node — the
  // sector snapshot and the dossier steps both do that, and without the
  // distinction a re-render would be translated using the previous sector's key.
  const marks = useRef(new WeakMap());
  // Attribute originals, per element. A WeakMap rather than data-* attributes:
  // dataset keys cannot contain a hyphen, and "aria-label" has one.
  const attrMarks = useRef(new WeakMap());
  const dictRef = useRef(null);
  dictRef.current = dict;

  // --- the DOM pass -------------------------------------------------------
  const translateNode = useCallback((node) => {
    const map = dictRef.current;
    const current = node.nodeValue;
    if (!current || !current.trim()) return;

    const parent = node.parentElement;
    if (!parent) return;
    if (SKIP_TAGS.has(String(parent.tagName).toUpperCase())) return;
    if (parent.closest && parent.closest(SKIP_SELECTOR)) return;

    let mark = marks.current.get(node);
    // Either this node is new, or the app has replaced its content with something
    // that is not what we wrote — in both cases the current value is the source.
    if (!mark || (current !== mark.applied && current !== mark.source)) {
      mark = { source: current, applied: null };
      marks.current.set(node, mark);
    }

    const { source } = mark;
    const trimmed = source.trim();
    const hit = map ? map[trimmed] : null;

    if (!hit) {
      if (current !== source) node.nodeValue = source;
      mark.applied = null;
      return;
    }
    // Preserve the leading/trailing whitespace the layout relies on.
    const next = source.match(/^\s*/)[0] + hit + source.match(/\s*$/)[0];
    if (current !== next) node.nodeValue = next;
    mark.applied = next;
  }, []);

  const translateAttrs = useCallback((el) => {
    if (!el.hasAttribute) return;
    if (el.closest && el.closest(SKIP_SELECTOR)) return;
    const map = dictRef.current;
    let store = attrMarks.current.get(el);
    if (!store) { store = {}; attrMarks.current.set(el, store); }

    for (const attr of ATTRS) {
      if (!el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr);
      if (!current || !current.trim()) continue;

      const mark = store[attr];
      // Same reasoning as for text nodes: if the value is neither the source nor
      // what we last wrote, the component has changed it and it is the new source.
      if (!mark || (current !== mark.applied && current !== mark.source)) {
        store[attr] = { source: current, applied: null };
      }
      const { source } = store[attr];
      const hit = map ? map[source.trim()] : null;
      const next = hit || source;
      if (current !== next) el.setAttribute(attr, next);
      store[attr].applied = hit ? next : null;
    }
  }, []);

  const walk = useCallback((root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { translateNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;

    const texts = [];
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) texts.push(n);
    texts.forEach(translateNode);

    translateAttrs(root);
    root.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach(translateAttrs);
  }, [translateNode, translateAttrs]);

  // --- language selection -------------------------------------------------
  const setLang = useCallback(async (code) => {
    const next = LANG_CODES.includes(code) ? code : "en";
    try { localStorage.setItem(KEY, next); } catch { /* storage blocked */ }
    setOffer(null);
    if (next === "en") {
      setLangState("en");
      setDict(null);
      return;
    }
    setReady(false);
    const generated = await loadGenerated(next);
    // Hand-written entries win over generated ones: they were authored with the
    // brand's voice in mind, and a machine pass should not overwrite them.
    setDict({ ...(generated || {}), ...(BASE_DICT[next] || {}) });
    setLangState(next);
    setReady(true);
  }, []);

  // Restore a stored choice on first mount.
  useEffect(() => {
    if (stored && LANG_CODES.includes(stored) && stored !== "en") setLang(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Work out what to offer, once, to a visitor who has neither chosen nor
  // declined. Deferred so it never competes with the first paint.
  useEffect(() => {
    if (stored) return;
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISSED) === "1"; } catch { /* storage blocked */ }
    if (dismissed) return;

    const ac = new AbortController();
    const t = setTimeout(async () => {
      let guess = detectSync();
      if (guess === "en") {
        // Only now is an IP lookup worth a request — and only if one is
        // configured at all.
        guess = (await fromIp(ac.signal)) || "en";
      }
      if (guess !== "en") setOffer(guess);
    }, 1200);

    return () => { clearTimeout(t); ac.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissOffer = useCallback(() => {
    try { localStorage.setItem(DISMISSED, "1"); } catch { /* storage blocked */ }
    setOffer(null);
  }, []);

  // --- apply, and keep applying ------------------------------------------
  useEffect(() => {
    const meta = langMeta(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;

    walk(document.body);

    // React re-renders and route changes both replace subtrees, so the pass has
    // to run again on whatever appears. characterData is watched too, because a
    // component that swaps its own text writes English back in.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") translateNode(r.target);
        else if (r.type === "attributes") translateAttrs(r.target);
        else r.addedNodes.forEach(walk);
      }
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
    return () => mo.disconnect();
  }, [lang, dict, walk, translateNode, translateAttrs]);

  // For the one case the DOM pass cannot serve: a component that splits a
  // sentence into per-word elements. The headline reveal does exactly that, so
  // the DOM only ever contains single words and no sentence-level key can match.
  // Such a component asks for the translation up front and splits the result.
  const t = useCallback((s) => {
    const str = String(s ?? "");
    return (dict && dict[str.trim()]) || str;
  }, [dict]);

  const value = useMemo(
    () => ({ lang, setLang, offer, dismissOffer, ready, t }),
    [lang, setLang, offer, dismissOffer, ready, t]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
