import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";

const NAV = [
  { label: "Solution", to: "/#pillars" },
  { label: "Sectors", to: "/#sectors" },
  { label: "CBAM Calculator", to: "/#calculator" },
  { label: "Pricing", to: "/pricing" },
  { label: "Customers", to: "/customers" },
  { label: "Resources", to: "/resources" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { tray, setTrayOpen, setLeadModal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (to) => {
    setMobile(false);
    if (to.startsWith("/#")) {
      const id = to.slice(2);
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[500] transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled ? "bg-black/60 backdrop-blur-2xl border-b border-white/10" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-[76px] flex items-center justify-between gap-6">
          <button onClick={() => go("/")} data-testid="nav-logo" className="flex items-center gap-2.5 group">
            <span className="w-2.5 h-2.5 rounded-full bg-signal group-hover:scale-125 transition-transform" />
            <span className="font-display text-2xl font-extrabold tracking-tight">Snowkap</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <button
                key={n.label}
                onClick={() => go(n.to)}
                data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink2 hover:text-white transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrayOpen(true)}
              data-testid="nav-tray-toggle"
              className="relative hidden sm:flex items-center gap-2 border border-white/20 hover:border-signal px-3.5 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              Programme
              {tray.length > 0 && (
                <span className="bg-signal text-bg text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {tray.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setLeadModal({ kind: "advisor", title: "Talk to an Advisor" })}
              data-testid="nav-talk-advisor"
              className="hidden md:inline-flex bg-signal text-bg px-4 py-2.5 text-[13px] font-bold hover:bg-signal-hover transition-colors"
            >
              Talk to an Advisor
            </button>
            <button className="lg:hidden p-1.5" onClick={() => setMobile(true)} data-testid="nav-mobile-open" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[600] bg-bg p-6 flex flex-col lg:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-display text-2xl font-extrabold">Snowkap</span>
              <button onClick={() => setMobile(false)} data-testid="nav-mobile-close"><X className="w-7 h-7" /></button>
            </div>
            <div className="flex flex-col">
              {NAV.map((n) => (
                <button key={n.label} onClick={() => go(n.to)} className="font-display text-3xl py-3 text-left border-b border-white/10">
                  {n.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setMobile(false); setLeadModal({ kind: "advisor", title: "Talk to an Advisor" }); }}
              className="mt-8 bg-signal text-bg py-4 font-bold"
            >
              Talk to an Advisor
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
