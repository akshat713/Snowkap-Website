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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const sessionId = useRef(getSessionId());
  const { setLeadModal } = useApp();

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
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Connection lost. Please try again." };
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
            className="fixed bottom-24 right-4 md:right-6 z-[900] w-[calc(100vw-2rem)] max-w-[400px] h-[540px] max-h-[70vh] bg-surface border border-white/15 flex flex-col shadow-2xl shadow-black/60"
            data-testid="chat-panel"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-bg">
              <div className="flex items-center gap-2.5">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-signal" />
                </span>
                <span className="font-display font-bold">Ask Snowkap AI</span>
              </div>
              <button onClick={() => setOpen(false)} data-testid="chat-close" aria-label="Close chat" className="text-ink2 hover:text-white p-1">
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
                        className="block w-full text-left border border-white/15 hover:border-signal px-4 py-3 text-sm text-ink2 hover:text-white transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-signal text-white" : "bg-white/5 border border-white/10 text-ink2"
                  }`}>
                    {m.content || (busy && i === messages.length - 1 ? <span className="inline-flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:150ms]" /><span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse [animation-delay:300ms]" /></span> : "")}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 px-3 pt-2.5 bg-bg">
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
        onClick={() => setOpen((o) => !o)}
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
