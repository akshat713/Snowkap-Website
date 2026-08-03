import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, CalendarPlus } from "lucide-react";
import { API } from "@/lib/api";
import { answerLocally } from "@/lib/assistant";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/i18n/TranslationProvider";

// The assistant gets its own origin, because it is the only part of the API that
// can be served by something as small as edge/. The rest — leads, the newsletter,
// proposals, the dossier count, the resource library — needs the full FastAPI
// backend and its database. Pointing REACT_APP_BACKEND_URL at the chat worker to
// make the assistant work would 404 every form on the site, silently, since they
// all post fire-and-forget.
//
// Set REACT_APP_CHAT_URL to the worker and leave REACT_APP_BACKEND_URL alone.
// Unset, it falls back to the backend, which is correct when one deployment serves
// both.
const CHAT_ORIGIN = process.env.REACT_APP_CHAT_URL || process.env.REACT_APP_BACKEND_URL;
const CHAT_API = CHAT_ORIGIN ? `${CHAT_ORIGIN}/api` : API;
const BACKEND_URL = CHAT_ORIGIN;

const SUGGESTIONS = [
  "What does the Snowkap platform do?",
  "How do you handle Scope 3 data?",
  "How does CBAM affect my business?",
];

function getSessionId() {
  let sid = localStorage.getItem("sk_chat_session");
  if (!sid) {
    sid = (crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem("sk_chat_session", sid);
  }
  return sid;
}

// Auto-open bookkeeping. Per browser tab, so a visitor who reads several pages
// isn't greeted on each one, and a visitor who closes it is left alone.
const AUTO_OPEN_AFTER_MS = 10_000;
const AUTO_OPEN_RETRY_MS = 20_000;
const AUTO_OPEN_FLAG = "sk_chat_autoshown";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [followUps, setFollowUps] = useState([]);
  const scrollRef = useRef(null);
  const typeTimer = useRef(null);
  // null = not tried yet, false = tried and unreachable. Once it has failed we
  // stop paying a network timeout on every subsequent message.
  const backendUp = useRef(null);
  const sessionId = useRef(getSessionId());
  const reduceMotion = useReducedMotion();
  const { setLeadModal, dossier, selectedPackage, tray } = useApp();
  const { lang } = useLanguage();

  // What the site already knows about this visitor, sent with every message so
  // the model can answer for their case rather than in general — "how does CBAM
  // affect us" from someone who told the dossier they are Automotive in the EU
  // should come back about steel and aluminium components. Read fresh from a ref
  // at send time so it always reflects the latest dossier answers.
  const context = useRef(null);
  context.current = {
    path: window.location.pathname + window.location.hash,
    sector: dossier?.sector || null,
    region: dossier?.region || null,
    stage: dossier?.stage || null,
    package: selectedPackage || dossier?.recommended_package || null,
    services: tray.map((t) => t.name).slice(0, 12),
    // A visitor reading the site in German should not get an English answer back.
    // The offline path can't do this — its corpus is the site's English copy — so
    // it stays in English there, which is why the model path is worth having.
    lang,
  };

  useEffect(() => () => clearTimeout(typeTimer.current), []);

  // Offer the assistant once, ten seconds in — long enough that it reads as an
  // offer to someone who stayed rather than an interruption on arrival.
  useEffect(() => {
    let shown = false;
    try { shown = sessionStorage.getItem(AUTO_OPEN_FLAG) === "1"; } catch { /* storage blocked */ }
    if (shown) return;

    let timer = null;
    let attempts = 0;

    // A 400px panel pinned bottom-right lands on top of whatever the reader is
    // doing. Modals and the tray were already respected; the dossier and the
    // programme builder were not, and the panel covered the very buttons those
    // sections exist to offer. If the reader is inside one, wait — and if they
    // are still there on the retry, leave them alone. The launcher is not subtle.
    const engaged = () => {
      if (document.hidden) return true;
      if (document.querySelector(
        '[data-testid="programme-tray"], [data-testid="lead-modal"], [data-testid="proposal-modal"]'
      )) return true;
      const zones = document.querySelectorAll(
        '[data-testid="dossier-section"], [data-testid="service-selector"]'
      );
      for (const z of zones) {
        const r = z.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) return true;
      }
      return false;
    };

    const attempt = () => {
      attempts += 1;
      if (engaged()) {
        // Retried once, then dropped — the flag stays unset so a later page view
        // in the same tab can still make the offer.
        if (attempts < 3) timer = setTimeout(attempt, AUTO_OPEN_RETRY_MS);
        return;
      }
      try { sessionStorage.setItem(AUTO_OPEN_FLAG, "1"); } catch { /* storage blocked */ }
      setOpen(true);
    };

    timer = setTimeout(attempt, AUTO_OPEN_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  // Opening it by hand also spends the one automatic offer, so it can't reappear
  // over someone who has already dealt with it.
  const openChat = () => {
    try { sessionStorage.setItem(AUTO_OPEN_FLAG, "1"); } catch { /* storage blocked */ }
    setOpen(true);
  };

  // Transcript history lives server-side; with no backend there is nothing to
  // fetch, and asking anyway just logs a failed request on every open.
  useEffect(() => {
    if (!open || !BACKEND_URL || backendUp.current === false) return;
    fetch(`${CHAT_API}/chat/history/${sessionId.current}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((h) => { if (Array.isArray(h) && h.length) setMessages(h); })
      .catch(() => { backendUp.current = false; });
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Reveal a local answer a few characters at a time. Not decoration: the panel
  // is built around a streaming response, and an answer that appears instantly
  // and complete reads as a canned popup rather than a reply.
  const typeOut = (full) =>
    new Promise((resolve) => {
      if (reduceMotion) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: full };
          return copy;
        });
        return resolve();
      }
      let i = 0;
      const tick = () => {
        i = Math.min(full.length, i + 3);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: full.slice(0, i) };
          return copy;
        });
        if (i < full.length) typeTimer.current = setTimeout(tick, 12);
        else resolve();
      };
      tick();
    });

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    setFollowUps([]);
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);

    // Answer from the bundled knowledge base when there is no backend to ask.
    // The site is on static hosting, so this is the normal path, not the error
    // path — the previous build apologised and gave an email address instead.
    const answerFromSite = async () => {
      const { text: reply, suggestions } = answerLocally(msg, context.current);
      await typeOut(reply);
      setFollowUps(suggestions);
    };

    if (!BACKEND_URL || backendUp.current === false) {
      await answerFromSite();
      setBusy(false);
      return;
    }

    try {
      const res = await fetch(`${CHAT_API}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: msg, context: context.current }),
      });
      // Without these two checks a non-2xx or bodyless response threw on
      // .getReader() and surfaced as the generic "Connection lost", which hid
      // the actual cause — most often that no backend is reachable at all.
      if (!res.ok) throw new Error(`chat endpoint returned ${res.status}`);
      if (!res.body) throw new Error("chat endpoint returned no stream");
      backendUp.current = true;
      setFollowUps([]);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let streamed = 0;
      let failed = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop();
        for (const ev of events) {
          if (!ev.startsWith("data: ")) continue;
          const payload = ev.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            if (j.delta) {
              streamed += j.delta.length;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + j.delta };
                return copy;
              });
            } else if (j.error) {
              // The server could not reach the model. It sends this only when
              // nothing has been shown yet, so the bundled knowledge base can
              // still answer — which beats printing "unavailable" at someone.
              failed = true;
            }
          } catch { /* partial frame */ }
        }
      }
      if (failed || streamed === 0) {
        // The backend is up but the model call did not produce anything. Answer
        // locally for this message, and do not mark the backend down — a
        // transient model error should not cost the visitor every later answer.
        await answerFromSite();
      } else {
        // Follow-ups come from the local index either way: the curated question
        // sets are the same ones the model's answer will have covered, and
        // asking for them over the wire would cost a second round trip.
        setFollowUps(answerLocally(msg).suggestions || []);
      }
    } catch {
      // The backend is unreachable. Answer from the bundled knowledge base rather
      // than apologising, and remember the failure so the rest of the
      // conversation skips straight to it.
      backendUp.current = false;
      await answerFromSite();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 md:right-6 z-[900] w-[calc(100vw-2rem)] max-w-[400px] h-[540px] max-h-[70vh] bg-surface border border-ink/15 flex flex-col shadow-2xl shadow-black/60"
            data-testid="chat-panel"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-bg">
              <div className="flex items-center gap-2.5">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-signal" />
                </span>
                <span className="font-display font-bold">Ask Snowkap AI</span>
              </div>
              <button onClick={() => setOpen(false)} data-testid="chat-close" aria-label="Close chat" className="text-ink2 hover:text-ink p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4" data-testid="chat-messages">
              {messages.length === 0 && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 text-signal font-mono text-[11px] uppercase tracking-[0.18em] mb-4">
                    <Sparkles className="w-4 h-4" /> ESG questions, answered
                  </div>
                  <p className="text-ink2 text-sm leading-relaxed mb-6">
                    I'm Snowkap's AI assistant. Ask me anything about the platform, CBAM, CSRD, BRSR, Scope 3, or how we work.
                  </p>
                  <div className="space-y-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={s} onClick={() => send(s)} data-testid={`chat-suggestion-${i}`}
                        className="block w-full text-left border border-ink/15 hover:border-signal px-4 py-3 text-sm text-ink2 hover:text-ink transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`chat-msg-${m.role}`}>
                  <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-signal text-white" : "bg-ink/5 border border-ink/10 text-ink2"
                  }`}>
                    {m.content || (busy && i === messages.length - 1 ? <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:150ms]" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:300ms]" /></span> : "")}
                  </div>
                </div>
              ))}

              {/* Follow-ups from whatever just answered. A retrieval assistant is
                  only as good as the visitor's next question is guessable, so
                  offering the two or three it can definitely answer is doing more
                  work here than it would beside a free-form model. */}
              {!busy && followUps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="pt-1 space-y-2"
                  data-testid="chat-followups"
                >
                  {followUps.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      data-testid={`chat-followup-${i}`}
                      className="block w-full text-left border border-ink/15 hover:border-signal px-3.5 py-2.5 text-[13px] text-ink2 hover:text-ink transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-ink/10 px-3 pt-2.5 bg-bg">
              <button
                onClick={() => { setOpen(false); setLeadModal({ kind: "demo", title: "Book a Demo" }); }}
                data-testid="chat-book-demo"
                className="flex items-center gap-1.5 border border-signal/50 text-signal hover:bg-signal hover:text-white px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5" /> Book a Demo
              </button>
              <span className="text-ink3 text-[10px] font-mono">or drop your email in the chat</span>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 p-3 bg-bg"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ESG, CBAM, Scope 3…"
                data-testid="chat-input"
                maxLength={600}
                aria-label="Ask Snowkap AI about ESG, CBAM or Scope 3"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink3"
              />
              <button type="submit" disabled={busy || !input.trim()} data-testid="chat-send" aria-label="Send"
                className="bg-signal text-white p-2.5 hover:bg-signal-hover transition-colors disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => (open ? setOpen(false) : openChat())}
        whileTap={{ scale: 0.95 }}
        data-testid="chat-widget-open"
        aria-label="Ask Snowkap AI"
        className="fixed bottom-5 right-4 md:right-6 z-[900] flex items-center gap-2.5 bg-signal text-white pl-4 pr-5 py-3.5 font-bold shadow-xl shadow-signal/20 hover:bg-signal-hover transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Ask Snowkap AI</span>
      </motion.button>
    </>
  );
}
