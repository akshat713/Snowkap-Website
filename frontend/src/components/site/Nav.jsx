import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, FileText } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Wordmark from "@/components/site/Wordmark";
import { SIGNIN_URL } from "@/data/content";

const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "Services", to: "/services" },
  { label: "Customers", to: "/customers" },
  { label: "Resources", to: "/resources" },
  { label: "About", to: "/about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { setLeadModal, tray, selectedPackage, setTrayOpen } = useApp();
  const navigate = useNavigate();
  const trayCount = tray.length + (selectedPackage ? 1 : 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (to) => {
    setMobile(false);
    navigate(to);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[500] transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled ? "bg-black/70 backdrop-blur-2xl border-b border-white/10" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-[76px] flex items-center justify-between gap-6">
          <button onClick={() => go("/")} data-testid="nav-logo" className="flex items-center">
            <Wordmark className="text-[22px]" />
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => (
              <button
                key={n.label}
                onClick={() => go(n.to)}
                data-testid={`nav-${n.label.toLowerCase()}`}
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
              className="hidden sm:flex items-center gap-2 border border-white/20 hover:border-signal hover:text-signal px-4 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              <FileText className="w-3.5 h-3.5" /> Your Programme
              <span
                data-testid="nav-tray-count"
                className={`ml-0.5 min-w-[18px] h-[18px] rounded-full bg-signal text-white text-[10px] font-sans font-bold flex items-center justify-center px-1 ${trayCount === 0 ? "hidden" : ""}`}
              >
                {trayCount}
              </span>
            </button>
            <a
              href={SIGNIN_URL}
              target="_blank"
              rel="noreferrer"
              data-testid="nav-sign-in"
              className="hidden sm:flex items-center gap-1.5 border border-white/20 hover:border-signal hover:text-signal px-4 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              Sign In <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })}
              data-testid="nav-book-demo"
              className="hidden md:inline-flex bg-signal text-white px-4 py-2.5 text-[13px] font-bold hover:bg-signal-hover transition-colors"
            >
              Book a Demo
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
              <Wordmark className="text-2xl" />
              <button onClick={() => setMobile(false)} data-testid="nav-mobile-close"><X className="w-7 h-7" /></button>
            </div>
            <div className="flex flex-col">
              {NAV.map((n) => (
                <button key={n.label} onClick={() => go(n.to)} className="font-display text-3xl py-3 text-left border-b border-white/10">
                  {n.label}
                </button>
              ))}
              <button
                onClick={() => { setMobile(false); setTrayOpen(true); }}
                data-testid="nav-mobile-tray-toggle"
                className="font-display text-3xl py-3 text-left border-b border-white/10 flex items-center gap-3"
              >
                Your Programme
                <span className={`min-w-[24px] h-6 rounded-full bg-signal text-white text-sm font-sans font-bold flex items-center justify-center px-1.5 ${trayCount === 0 ? "hidden" : ""}`}>
                  {trayCount}
                </span>
              </button>
              <a href={SIGNIN_URL} target="_blank" rel="noreferrer" className="font-display text-3xl py-3 text-left border-b border-white/10 flex items-center gap-2">
                Sign In <ArrowUpRight className="w-6 h-6 text-signal" />
              </a>
            </div>
            <button
              onClick={() => { setMobile(false); setLeadModal({ kind: "demo", title: "Book a Demo" }); }}
              className="mt-8 bg-signal text-white py-4 font-bold"
            >
              Book a Demo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
