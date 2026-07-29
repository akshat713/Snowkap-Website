import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, CalendarPlus } from "lucide-react";
import { API } from "@/lib/api";
import { useApp } from "@/context/AppContext";

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
const AUTO_OPEN_FLAG = "sk_chat_autoshown";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const { setLeadModal } = useApp();

  // Offer the assistant once, ten seconds in — long enough that it reads as an
  // offer to someone who stayed rather than an interruption on arrival.
  useEffect(() => {
    let shown = false;
    try { shown = sessionStorage.getItem(AUTO_OPEN_FLAG) === "1"; } catch { /* storage blocked */ }
    if (shown) return;

    const t = setTimeout(() => {
      // Don't talk over a modal, the programme tray, or a tab nobody is looking
      // at — in any of those cases the greeting would land badly or unseen.
      const busyElsewhere = document.querySelector(
        '[data-testid="programme-tray"], [data-testid="lead-modal"], [data-testid="proposal-modal"]'
      );
      if (document.hidden || busyElsewhere) return;
      try { sessionStorage.setItem(AUTO_OPEN_FLAG, "1"); } catch { /* storage blocked */ }
      setOpen(true);
    }, AUTO_OPEN_AFTER_MS);

    return () => clearTimeout(t);
  }, []);

  // Opening it by hand also spends the one automatic offer, so it can't reappear
  // over someone who has already dealt with it.
  const openChat = () => {
    try { sessionStorage.setItem(AUTO_OPEN_FLAG, "1"); } catch { /* storage blocked */ }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    fetch(`${API}/chat/history/${sessionId.current}`)
      .then((r) => r.json())
      .then((h) => { if (Array.isArray(h) && h.length) setMessages(h); })
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${API}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: msg }),
      });
      // Without these two checks a non-2xx or bodyless response threw on
      // .getReader() and surfaced as the generic "Connection lost", which hid
      // the actual cause — most often that no backend is reachable at all.
      if (!res.ok) throw new Error(`chat endpoint returned ${res.status}`);
      if (!res.body) throw new Error("chat endpoint returned no stream");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
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
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + j.delta };
                return copy;
              });
            } else if (j.error) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: j.error };
                return copy;
              });
            }
          } catch { /* partial frame */ }
        }
      }
    } catch (err) {
      // Say which it is. A visitor who is told "try again" on a build with no
      // backend will try again forever; one given an address can act.
      const offline = err instanceof TypeError; // fetch itself never reached a server
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: offline
            ? "I can't reach the Snowkap assistant from here — it isn't running on this deployment yet. In the meantime, sales@snowkap.com reaches the team directly, or use Book a Demo below."
            : "Something went wrong answering that. Please try again, or email sales@snowkap.com.",
        };
        return copy;
      });
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
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-signal text-white" : "bg-ink/5 border border-ink/10 text-ink2"
                  }`}>
                    {m.content || (busy && i === messages.length - 1 ? <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:150ms]" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:300ms]" /></span> : "")}
                  </div>
                </div>
              ))}
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
