import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";

function Field({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-[12px] font-mono uppercase tracking-wider text-ink2 mb-2">{label}</span>
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors placeholder:text-ink3"
      />
    </label>
  );
}

function Shell({ title, subtitle, children, onClose, testid }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[950] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border border-white/10 w-full max-w-[540px] p-8 md:p-10 my-8"
          data-testid={testid}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-3xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-1 text-ink2 hover:text-white" data-testid="modal-close"><X className="w-5 h-5" /></button>
          </div>
          {subtitle && <p className="text-ink2 text-sm mb-7 leading-relaxed">{subtitle}</p>}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Success({ title, msg, onClose }) {
  return (
    <div className="text-center py-6" data-testid="modal-success">
      <div className="w-16 h-16 border-2 border-signal rounded-full flex items-center justify-center mx-auto mb-5">
        <Check className="w-7 h-7 text-signal" />
      </div>
      <h4 className="font-display text-2xl font-bold mb-3">{title}</h4>
      <p className="text-ink2 text-sm leading-relaxed mb-7">{msg}</p>
      <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm transition-colors">Close</button>
    </div>
  );
}

export function LeadModal() {
  const { leadModal, setLeadModal } = useApp();
  const [form, setForm] = useState({ name: "", email: "", company: "", job_title: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!leadModal) return null;

  const close = () => { setLeadModal(null); setSent(false); setForm({ name: "", email: "", company: "", job_title: "", message: "" }); };
  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads", { ...form, kind: leadModal.kind, reference: leadModal.reference });
      setSent(true);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setBusy(false); }
  };

  return (
    <Shell
      title={sent ? "" : leadModal.title}
      subtitle={sent ? "" : (leadModal.reference ? `Regarding: ${leadModal.reference}` : "Tell us where you sit — we'll route you to the right team.")}
      onClose={close}
      testid="lead-modal"
    >
      {sent ? (
        <Success title="Received & logged." msg="A member of our team will be in touch shortly. A confirmation is on its way to your inbox." onClose={close} />
      ) : (
        <form onSubmit={submit}>
          <Field label="Full name" required value={form.name} onChange={change("name")} data-testid="lead-name" />
          <Field label="Work email" type="email" required value={form.email} onChange={change("email")} data-testid="lead-email" />
          <Field label="Company" value={form.company} onChange={change("company")} data-testid="lead-company" />
          <Field label="Job title" value={form.job_title} onChange={change("job_title")} data-testid="lead-title" />
          <label className="block mb-6">
            <span className="block text-[12px] font-mono uppercase tracking-wider text-ink2 mb-2">What are you trying to solve?</span>
            <textarea value={form.message} onChange={change("message")} rows={3} data-testid="lead-message"
              className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors resize-none" />
          </label>
          <button disabled={busy} data-testid="lead-submit" className="w-full bg-signal text-bg py-3.5 font-bold hover:bg-signal-hover transition-colors disabled:opacity-50">
            {busy ? "Sending…" : "Send to Our Team"}
          </button>
        </form>
      )}
    </Shell>
  );
}

export function ProposalModal() {
  const { proposalOpen, setProposalOpen, tray, selectedPackage, dossier, clearTray } = useApp();
  const [form, setForm] = useState({ name: "", email: "", company: "", job_title: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!proposalOpen) return null;

  const close = () => { setProposalOpen(false); setSent(false); };
  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/proposals", {
        ...form, package: selectedPackage, items: tray.map((t) => t.name), dossier,
      });
      setSent(true);
      clearTray();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setBusy(false); }
  };

  const summary = [selectedPackage ? `${selectedPackage} package` : null, ...tray.map((t) => t.name)].filter(Boolean);

  return (
    <Shell
      title={sent ? "" : "Request your proposal"}
      subtitle={sent ? "" : "This isn't a checkout — it sends your selections to our team, who'll come back with a scoped proposal."}
      onClose={close}
      testid="proposal-modal"
    >
      {sent ? (
        <Success title="Received & logged." msg="Your scoped brief has reached our team. We'll come back with a real, scoped proposal, fast." onClose={close} />
      ) : (
        <form onSubmit={submit}>
          {summary.length > 0 && (
            <div className="bg-white/5 border border-white/10 p-4 mb-6 text-sm">
              <div className="font-mono text-[10px] uppercase tracking-wider text-signal mb-2">Your selections</div>
              <ul className="text-ink2 space-y-1 list-disc pl-4">{summary.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
          <Field label="Full name" required value={form.name} onChange={change("name")} data-testid="proposal-name" />
          <Field label="Work email" type="email" required value={form.email} onChange={change("email")} data-testid="proposal-email" />
          <Field label="Company" value={form.company} onChange={change("company")} data-testid="proposal-company" />
          <Field label="Job title" value={form.job_title} onChange={change("job_title")} data-testid="proposal-title" />
          <label className="block mb-6">
            <span className="block text-[12px] font-mono uppercase tracking-wider text-ink2 mb-2">Anything we should know?</span>
            <textarea value={form.message} onChange={change("message")} rows={3} data-testid="proposal-message"
              className="w-full bg-white/5 border border-white/10 focus:border-signal px-4 py-3 text-sm outline-none transition-colors resize-none" />
          </label>
          <button disabled={busy} data-testid="proposal-submit" className="w-full bg-signal text-bg py-3.5 font-bold hover:bg-signal-hover transition-colors disabled:opacity-50">
            {busy ? "Sending…" : "Send to Our Team"}
          </button>
        </form>
      )}
    </Shell>
  );
}
