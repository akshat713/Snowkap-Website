import React from "react";
import Layout from "@/components/site/Layout";
import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import Dossier from "@/components/home/Dossier";
import Problem from "@/components/home/Problem";
import Pillars from "@/components/home/Pillars";
import PlatformShowcase from "@/components/home/PlatformShowcase";
import KineticBand from "@/components/site/KineticBand";
import Metrics from "@/components/home/Metrics";
import Clientele from "@/components/home/Clientele";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Team from "@/components/home/Team";
import CbamBand from "@/components/home/CbamBand";
import Faq from "@/components/home/Faq";
import ResourcesPreview from "@/components/home/ResourcesPreview";
import Newsletter from "@/components/home/Newsletter";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <LogoMarquee />
      <Problem />
      <Pillars />
      <PlatformShowcase />
      {/* Dark band between two light sections — the page has run white for a long
          stretch by here, and the contrast is what stops the scroll. */}
      <KineticBand />
      {/* Sits below the product and services blocks: by this point the visitor
          knows what's on offer, so routing them to their slice of it lands. */}
      <Dossier />
      <Metrics />
      <Clientele />
      <TestimonialsSection />
      <Team />
      <CbamBand />
      <Faq />
      <ResourcesPreview />
      <Newsletter />
      <FinalCta />
    </Layout>
  );
}
