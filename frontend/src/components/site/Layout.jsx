import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Tray from "@/components/site/Tray";
import ChatWidget from "@/components/site/ChatWidget";
import ScrollProgress from "@/components/site/ScrollProgress";
import { LeadModal, ProposalModal } from "@/components/site/Modals";
import { NoiseOverlay } from "@/components/site/Overlays";
import LanguageBanner from "@/components/site/LanguageBanner";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen bg-bg">
      <NoiseOverlay />
      <ScrollProgress />
      <Nav />
      {/* Keyed on the route so each page arrives rather than snapping in. Short
          and vertical only — a long or sliding transition delays reading. */}
      <motion.main
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.main>
      <Footer />
      <Tray />
      <LeadModal />
      <ProposalModal />
      <ChatWidget />
      <LanguageBanner />
    </div>
  );
}
