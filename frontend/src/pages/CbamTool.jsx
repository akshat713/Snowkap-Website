import React, { useEffect } from "react";
import Layout from "@/components/site/Layout";
import PageHero from "@/components/site/PageHero";
import CbamCalculator from "@/components/home/CbamCalculator";

export default function CbamTool() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Layout>
      <PageHero
        eyebrow="Free tool"
        title={<>CBAM Exposure <span className="text-signal">Calculator.</span></>}
        lede="The EU Carbon Border Adjustment Mechanism is live. Estimate your annual liability — and what verified primary data saves you against default values."
      />
      <CbamCalculator />
    </Layout>
  );
}
