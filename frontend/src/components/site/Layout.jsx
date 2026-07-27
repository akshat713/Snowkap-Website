import React from "react";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Tray from "@/components/site/Tray";
import { LeadModal, ProposalModal } from "@/components/site/Modals";
import { NoiseOverlay } from "@/components/site/Overlays";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-bg">
      <NoiseOverlay />
      <Nav />
      <main>{children}</main>
      <Footer />
      <Tray />
      <LeadModal />
      <ProposalModal />
    </div>
  );
}
