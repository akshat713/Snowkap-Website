import React, { useState } from "react";
import { motion } from "framer-motion";
import { Radio, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ROLES } from "@/data/site";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Newsletter() {
  const [role, setRole] = useState(ROLES[2]);
  const [form, setForm] = useState({ email: "", name: "", company: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/newsletter", { ...form, role });
      setSent(true);
      toast.success("Welcome to Power of Now.");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setBusy(false); }
  };

  return (
    <section id="newsletter" className="py-24 md:py-36 bg-surface border-t border-white/10" data-testid="newsletter-section">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center border border-white/10 bg-bg/50 p-8 md:p-14">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] text-signal mb-5">
              <Radio className="w-4 h-4" /> The newsletter
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
              Power of <span className="italic font-light text-signal">Now</span>.
            </h2>
            <p className="text-ink2 leading-relaxed max-w-lg">
              Regulatory intelligence, filtered for your desk. We track what's changing across CBAM, CSRD, BRSR and
              beyond — then translate it into what it means for <b className="text-white">your role</b>: the CFO's exposure,
              the COO's operations, the sustainability lead's roadmap. No noise. Only what moves your risk and your numbers.
            </p>
          </div>

          <Reveal>
            {sent ? (
              <div className="border border-signal/40 bg-signal/10 p-10 text-center" data-testid="newsletter-success">
                <h3 className="font-display text-2xl font-bold mb-3">You're in.</h3>
                <p className="text-ink2">Power of Now will land in your inbox, tuned to the <b className="text-white">{role}</b> lens.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-ink2 mb-3">Read it as a…</label>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ROLES.map((r) => (
                    <button
                      type="button" key={r} onClick={() => setRole(r)}
                      data-testid={`newsletter-role-${r.split(" ")[0].toLowerCase()}`}
                      className={`px-3.5 py-2 text-sm border transition-colors ${role === r ? "bg-signal text-bg border-signal font-semibold" : "border-white/15 text-ink2 hover:border-white/40"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <input placeholder="Full name" value={form.name} onChange={change("name")} data-testid="newsletter-name"
                    className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="email" required placeholder="Work email" value={form.email} onChange={change("email")} data-testid="newsletter-email"
                      className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors" />
                    <input placeholder="Company" value={form.company} onChange={change("company")} data-testid="newsletter-company"
                      className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors" />
                  </div>
                  <button disabled={busy} data-testid="newsletter-submit" className="w-full group bg-signal text-bg py-3.5 font-bold hover:bg-signal-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {busy ? "Subscribing…" : "Subscribe to Power of Now"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
