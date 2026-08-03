import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Wordmark from "@/components/site/Wordmark";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import { SIGNIN_URL } from "@/data/content";
import api from "@/lib/api";
import { toast } from "sonner";

const COLS = [
  { h: "Platform", links: [["Snowkap AI", "/platform"], ["Carbon Accounting", "/platform"], ["Scope 3 & Suppliers", "/platform"], ["ESG Reporting", "/platform"], ["CBAM Calculator", "/tools/cbam"]] },
  { h: "Company", links: [["About & Team", "/about"], ["Customers", "/customers"], ["Services", "/services"], ["Pricing", "/pricing"], ["Contact", "/contact"]] },
  { h: "Resources", links: [["Blogs", "/resources"], ["Whitepapers", "/resources"], ["Webinars & Events", "/resources"], ["Press", "/resources"]] },
];

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
    <footer className="bg-ink text-white/80 border-t border-ink pt-20 pb-10" data-testid="site-footer">
      <div className="max-w-[1320px] mx-auto px-6 md:px-10">
        {/* The 12-column layout waits for lg. At the md breakpoint a 12-col grid
            leaves each col-span-2 about 108px wide, which is narrower than
            "Book a Demo" or an email field can render — the footer was pushing
            25px of horizontal scroll onto every page between 768px and lg. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/12">
          <div className="sm:col-span-2 lg:col-span-4">
            <Wordmark variant="light" height={30} />
            <p className="text-white/70 max-w-sm leading-relaxed mt-5">
              We turn climate complexity into business clarity. Expert advisory, an AI-powered ESG platform,
              and embedded managed support — one partner, the full ESG journey.
            </p>
            <form onSubmit={quickSub} className="mt-8 flex max-w-sm border border-white/15 focus-within:border-signal transition-colors">
              <input
                data-testid="footer-newsletter-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Work email"
                className="bg-transparent px-4 py-3 flex-1 min-w-0 text-sm outline-none placeholder:text-white/45"
              />
              <button data-testid="footer-newsletter-submit" className="bg-signal text-white px-5 font-bold text-sm">Join</button>
            </form>
          </div>

          {COLS.map((c) => (
            <div key={c.h} className="lg:col-span-2">
              <h6 className="font-mono text-[11px] uppercase tracking-wider text-white/45 mb-4">{c.h}</h6>
              {c.links.map(([l, to]) => (
                <Link key={l} to={to} onClick={() => window.scrollTo(0, 0)} className="block py-1.5 text-white/70 hover:text-ink text-sm">{l}</Link>
              ))}
            </div>
          ))}

          <div className="lg:col-span-2">
            <h6 className="font-mono text-[11px] uppercase tracking-wider text-white/45 mb-4">Get in touch</h6>
            <button onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })} data-testid="footer-book-demo" className="flex items-center gap-1.5 py-1.5 text-white/70 hover:text-signal text-sm group">
              Book a Demo <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <a href="mailto:sales@snowkap.com" className="block py-1.5 text-white/70 hover:text-ink text-sm">sales@snowkap.com</a>
            <a href="mailto:support@snowkap.com" className="block py-1.5 text-white/70 hover:text-ink text-sm">support@snowkap.com</a>
            <a href="tel:+912240079343" className="block py-1.5 text-white/70 hover:text-ink text-sm">+91 22 4007 9343</a>
            <a href={SIGNIN_URL} target="_blank" rel="noreferrer" data-testid="footer-sign-in" className="block py-1.5 text-white/70 hover:text-ink text-sm">Sign In</a>
            <Link to="/admin/login" className="block py-1.5 text-white/45 hover:text-white/70 text-xs mt-2">Admin</Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-white/45">
          <span className="font-mono text-xs">© 2026 Snowkap · India · GCC · SE Asia · Europe</span>
          <span className="font-mono text-xs md:ml-auto md:mr-6">Vision — remove 1 billion tons of CO₂e.</span>
          {/* The switcher's canonical home: reachable at every width, including
              the 1024–1279 band where the header cannot spare the room. */}
          <LanguageSwitcher onDark />
        </div>
      </div>
    </footer>
  );
}
