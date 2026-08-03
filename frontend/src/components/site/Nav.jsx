import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, FileText } from "lucide-react";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";
import { useApp } from "@/context/AppContext";
import Wordmark from "@/components/site/Wordmark";
import { SIGNIN_URL } from "@/data/content";

// Pricing sits third, directly after the two "what it is" pages and before the
// proof pages — the point at which a reader who is convinced starts looking for
// what it costs. It was previously reachable only from in-page links.
const NAV = [
  { label: "Platform", to: "/platform" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Customers", to: "/customers" },
  { label: "Resources", to: "/resources" },
  { label: "About", to: "/about" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { setLeadModal, tray, selectedPackage, setTrayOpen } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const trayCount = tray.length + (selectedPackage ? 1 : 0);

  // Which nav item is current. Nothing in the header said where you were, so on
  // any inner page the navigation gave no sense of position. Prefix match so an
  // article at /resources/<slug> still lights up Resources.
  const isCurrent = (to) => pathname === to || pathname.startsWith(`${to}/`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A full-screen drawer with no Escape and no scroll lock traps you: the only
  // way out was the close button, and the page kept scrolling underneath, so
  // dismissing it could leave you somewhere you never chose to be.
  useEffect(() => {
    if (!mobile) return;
    const onKey = (e) => { if (e.key === "Escape") setMobile(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobile]);

  const go = (to) => {
    setMobile(false);
    navigate(to);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[500] transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled ? "bg-bg/85 backdrop-blur-2xl border-b border-ink/10 shadow-[0_1px_0_rgba(34,34,34,0.04)]" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-[76px] flex items-center justify-between gap-6">
          <button onClick={() => go("/")} data-testid="nav-logo" className="flex items-center">
            <Wordmark height={26} />
          </button>

          {/* The desktop nav starts at xl, not lg. Six items plus three controls
              only just fitted 1024 in English; in German — PLATTFORM,
              LEISTUNGEN, RESSOURCEN, ÜBER UNS — the row ran 23px past the edge
              and clipped Book a Demo. Rather than shrink type until every
              language happens to fit, 1024–1279 now gets the drawer, which holds
              everything at any label length. */}
          <nav className="hidden xl:flex items-center gap-6 xl:gap-8">
            {NAV.map((n) => (
              // A Link, not a button: middle-click, cmd-click and "open in new
              // tab" all worked on nothing before, and a nav that is not a set of
              // anchors is invisible to a crawler.
              <Link
                key={n.label}
                to={n.to}
                onClick={() => window.scrollTo(0, 0)}
                data-testid={`nav-${n.label.toLowerCase()}`}
                aria-current={isCurrent(n.to) ? "page" : undefined}
                className={`relative whitespace-nowrap font-mono text-[12px] font-medium uppercase tracking-[0.14em] transition-colors py-1 ${
                  isCurrent(n.to) ? "text-ink" : "text-ink2 hover:text-ink"
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-signal transition-[width] duration-300 ${
                    isCurrent(n.to) ? "w-full" : "w-0"
                  }`}
                  aria-hidden
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 xl:gap-3">
            <button
              onClick={() => setTrayOpen(true)}
              data-testid="nav-tray-toggle"
              className="hidden sm:flex items-center gap-2 whitespace-nowrap border border-ink/20 hover:border-signal hover:text-signal px-4 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="xl:hidden">Programme</span>
              <span className="hidden xl:inline">Your Programme</span>
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
              className="hidden sm:flex items-center gap-1.5 whitespace-nowrap border border-ink/20 hover:border-signal hover:text-signal px-4 py-2 text-[12px] font-mono uppercase tracking-wider transition-colors"
            >
              Sign In <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setLeadModal({ kind: "demo", title: "Book a Demo" })}
              data-testid="nav-book-demo"
              className="hidden md:inline-flex whitespace-nowrap bg-signal text-white px-4 py-2.5 text-[13px] font-bold hover:bg-signal-hover transition-colors"
            >
              Book a Demo
            </button>
            {/* xl and up only. Below that the header has six nav items and three
                controls already, and the last time something was added here the
                Book a Demo button clipped past the edge at 1024. The footer
                carries the same switcher at every width, and the mobile drawer
                has its own row. */}
            <div className="hidden xl:block">
              <LanguageSwitcher compact />
            </div>
            <button className="xl:hidden p-1.5" onClick={() => setMobile(true)} data-testid="nav-mobile-open" aria-label="Open menu">
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
            className="fixed inset-0 z-[600] bg-bg p-6 flex flex-col xl:hidden overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <Wordmark height={28} />
              <button onClick={() => setMobile(false)} data-testid="nav-mobile-close"><X className="w-7 h-7" /></button>
            </div>
            <div className="flex flex-col">
              {NAV.map((n) => (
                <button
                  key={n.label}
                  onClick={() => go(n.to)}
                  data-testid={`nav-mobile-${n.label.toLowerCase()}`}
                  aria-current={isCurrent(n.to) ? "page" : undefined}
                  className={`font-display text-3xl font-bold py-3 text-left border-b border-ink/10 flex items-center justify-between gap-3 ${
                    isCurrent(n.to) ? "text-signal" : "text-ink"
                  }`}
                >
                  {n.label}
                  {isCurrent(n.to) && <span className="w-2 h-2 rotate-45 bg-signal shrink-0" aria-hidden />}
                </button>
              ))}
              <button
                onClick={() => { setMobile(false); setTrayOpen(true); }}
                data-testid="nav-mobile-tray-toggle"
                className="font-display text-3xl py-3 text-left border-b border-ink/10 flex items-center gap-3"
              >
                Your Programme
                <span className={`min-w-[24px] h-6 rounded-full bg-signal text-white text-sm font-sans font-bold flex items-center justify-center px-1.5 ${trayCount === 0 ? "hidden" : ""}`}>
                  {trayCount}
                </span>
              </button>
              <a href={SIGNIN_URL} target="_blank" rel="noreferrer" className="font-display text-3xl py-3 text-left border-b border-ink/10 flex items-center gap-2">
                Sign In <ArrowUpRight className="w-6 h-6 text-signal" />
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3" data-no-translate>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink3">Language</span>
              <LanguageSwitcher />
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
