import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Footer() {
  const { setLeadModal } = useApp();
  const [email, setEmail] = useState("");

  const quickSub = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.post("/newsletter", { email, role: "Other" });
      toast.success("Subscribed to Power of Now.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    }
  };

  return (
    <footer className="bg-bg border-t border-white/10 pt-20 pb-10">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-signal" />
              <span className="font-display text-2xl font-extrabold">Snowkap</span>
            </div>
            <p className="text-ink2 max-w-sm leading-relaxed">
              Compliance doesn't stop at your border. Neither do we. Verified, audit-ready ESG data across every
              framework that matters.
            </p>
            <form onSubmit={quickSub} className="mt-8 flex max-w-sm border border-white/15 focus-within:border-signal transition-colors">
              <input
                data-testid="footer-newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Work email"
                className="bg-transparent px-4 py-3 flex-1 text-sm outline-none placeholder:text-ink3"
              />
              <button data-testid="footer-newsletter-submit" className="bg-signal text-bg px-5 font-bold text-sm">Join</button>
            </form>
          </div>

          <div className="md:col-span-2">
            <h6 className="font-mono text-[11px] uppercase tracking-wider text-ink3 mb-4">Platform</h6>
            {["Solution", "Sectors", "CBAM Calculator", "Pricing"].map((l) => (
              <Link key={l} to={l === "Pricing" ? "/pricing" : "/"} className="block py-1.5 text-ink2 hover:text-white text-sm">{l}</Link>
            ))}
          </div>
          <div className="md:col-span-2">
            <h6 className="font-mono text-[11px] uppercase tracking-wider text-ink3 mb-4">Resources</h6>
            {[["Blog", "/resources"], ["Whitepapers", "/resources"], ["Press", "/resources"], ["Events", "/resources"]].map(([l, to]) => (
              <Link key={l} to={to} className="block py-1.5 text-ink2 hover:text-white text-sm">{l}</Link>
            ))}
          </div>
          <div className="md:col-span-3">
            <h6 className="font-mono text-[11px] uppercase tracking-wider text-ink3 mb-4">Get in touch</h6>
            <button onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })} className="flex items-center gap-1.5 py-1.5 text-ink2 hover:text-signal text-sm group">
              Talk to an Advisor <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <Link to="/customers" className="block py-1.5 text-ink2 hover:text-white text-sm">Customer stories</Link>
            <a href="mailto:press@snowkap.com" className="block py-1.5 text-ink2 hover:text-white text-sm">press@snowkap.com</a>
            <Link to="/admin/login" className="block py-1.5 text-ink3 hover:text-ink2 text-xs mt-2">Admin</Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-ink3">
          <span className="font-mono text-xs">© 2026 Snowkap · Six sectors · Five regions · One platform</span>
          <span className="font-mono text-xs">To power 1 Gigaton of verified carbon reduction by 2030.</span>
        </div>
      </div>
    </footer>
  );
}
