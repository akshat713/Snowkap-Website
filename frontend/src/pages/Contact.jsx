import React, { useEffect, useState } from "react";
import { Mail, Phone, Headset, Check } from "lucide-react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";

const INFO = [
  { icon: Phone, label: "Call us", value: "+91 22 4007 9343", href: "tel:+912240079343", note: "10 AM – 8 PM IST, Mon–Fri" },
  { icon: Mail, label: "Sales enquiries", value: "sales@snowkap.com", href: "mailto:sales@snowkap.com" },
  { icon: Headset, label: "Support queries", value: "support@snowkap.com", href: "mailto:support@snowkap.com" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", job_title: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const change = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/leads", { ...form, kind: "contact" });
      setSent(true);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally { setBusy(false); }
  };

  const inputCls = "w-full bg-ink/5 border border-ink/10 focus:border-signal px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-ink3";

  return (
    <Layout>
      <PageHero
        eyebrow="Contact"
        title={<>Ready to take control of your <span className="text-signal">ESG and carbon data?</span></>}
        lede="Book a personalised demo or connect with our team — simplify emissions reporting, automate ESG compliance, and surface risks before they escalate."
      />
      <section className="py-20 md:py-24 bg-bg" data-testid="contact-section">
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1fr_1.2fr] gap-14">
          <div>
            {INFO.map(({ icon: Icon, label, value, href, note }) => (
              <a key={label} href={href} className="group flex items-start gap-5 py-7 border-b border-ink/10" data-testid={`contact-${label.split(" ")[0].toLowerCase()}`}>
                <span className="border border-ink/15 p-3 group-hover:border-signal transition-colors">
                  <Icon className="w-5 h-5 text-signal" />
                </span>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink3 mb-1.5">{label}</div>
                  <div className="font-display text-xl font-bold group-hover:text-signal transition-colors">{value}</div>
                  {note && <div className="text-ink3 text-xs mt-1">{note}</div>}
                </div>
              </a>
            ))}
            <div className="mt-10 font-mono text-[11px] uppercase tracking-[0.2em] text-ink3">
              India · GCC · SE Asia · Europe
            </div>
          </div>

          <Reveal>
            {sent ? (
              <div className="border border-signal/40 bg-signal/10 p-12 text-center h-fit" data-testid="contact-success">
                <div className="w-16 h-16 border-2 border-signal rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-7 h-7 text-signal" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Received &amp; logged.</h3>
                <p className="text-ink2">A member of our team will come back to you shortly. A confirmation is on its way to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-surface border border-ink/10 p-8 md:p-10 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input required placeholder="Full name" value={form.name} onChange={change("name")} data-testid="contact-name" className={inputCls} />
                  <input type="email" required placeholder="Work email" value={form.email} onChange={change("email")} data-testid="contact-email" className={inputCls} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="Company" value={form.company} onChange={change("company")} data-testid="contact-company" className={inputCls} />
                  <input placeholder="Job title" value={form.job_title} onChange={change("job_title")} data-testid="contact-job-title" className={inputCls} />
                </div>
                <textarea rows={4} placeholder="What are you trying to solve?" value={form.message} onChange={change("message")} data-testid="contact-message"
                  className={`${inputCls} resize-none`} />
                <button disabled={busy} data-testid="contact-submit"
                  className="w-full bg-signal text-white py-4 font-bold hover:bg-signal-hover transition-colors disabled:opacity-50">
                  {busy ? "Sending…" : "Talk to the Snowkap team"}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
