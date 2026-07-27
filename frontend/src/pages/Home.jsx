import React from "react";
import Layout from "@/components/site/Layout";
import Hero from "@/components/home/Hero";
import Dossier from "@/components/home/Dossier";
import RegulatoryReality from "@/components/home/RegulatoryReality";
import ThreePillars from "@/components/home/ThreePillars";
import SectorExplorer from "@/components/home/SectorExplorer";
import CbamCalculator from "@/components/home/CbamCalculator";
import ProofNumbers from "@/components/home/ProofNumbers";
import ProgrammeBuilder from "@/components/home/ProgrammeBuilder";
import { Testimonials, Standards } from "@/components/home/Social";
import Newsletter from "@/components/home/Newsletter";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Dossier />
      <RegulatoryReality />
      <ThreePillars />
      <SectorExplorer />
      <CbamCalculator />
      <ProofNumbers />
      <ProgrammeBuilder />
      <Testimonials />
      <Standards />
      <Newsletter />
      <FinalCta />
    </Layout>
  );
}
