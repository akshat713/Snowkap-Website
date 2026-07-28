import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT = ["Snowkap — Turn Climate Complexity Into Business Clarity",
  "Expert advisory, an AI-powered ESG platform, and embedded managed support. Carbon accounting, Scope 3, and 25+ frameworks — one partner, the full ESG journey."];

const META = {
  "/": DEFAULT,
  "/platform": ["ESG Platform — AI-Powered Carbon & Compliance Command Centre | Snowkap",
    "Carbon accounting with 60,000+ emission factors, AI-OCR data capture, Scope 3 supplier engagement, and one-click reporting across BRSR, CSRD, GRI, CDP and 25+ frameworks."],
  "/services": ["ESG Advisory, Managed Support & Training | Snowkap",
    "Expert-led ESG strategy, SBTi decarbonisation roadmaps, ratings optimisation, embedded supplier support, and capacity building — 3,800+ professionals trained."],
  "/customers": ["Customer Stories — JSW Steel, Senco Gold, Sutherland | Snowkap",
    "Real ESG outcomes: >90% primary data in one quarter, 7.6× ROI on ratings work, SBTi targets validated. See how enterprises win with Snowkap."],
  "/about": ["About Snowkap — The Expertise Behind the Lens",
    "A global ESG technology company across India, GCC, SE Asia and Europe. Meet the team and advisory board on a mission to remove 1 billion tons of CO₂e."],
  "/contact": ["Contact Snowkap — Book a Demo",
    "Talk to the Snowkap team about carbon accounting, ESG reporting, and Scope 3. sales@snowkap.com · +91 22 4007 9343."],
  "/tools/cbam": ["Free CBAM Exposure Calculator | Snowkap",
    "CBAM is live at €75.36/tCO₂e. Estimate your annual liability in 30 seconds — and what verified primary data saves you against default values."],
  "/resources": ["Resources — ESG Blogs, Whitepapers, Webinars & Press | Snowkap",
    "Regulatory intelligence on CBAM, CSRD, BRSR and Scope 3 — blogs, whitepapers, webinars and press from the Snowkap team."],
  "/pricing": ["Pricing & Programme Builder | Snowkap",
    "Build your ESG programme — advisory, platform, and managed support scoped to your sector and footprint."],
};

function setTag(selector, create, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(create).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function SeoManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, desc] = META[pathname]
      || (pathname.startsWith("/resources/") ? META["/resources"] : null)
      || (pathname.startsWith("/admin") ? ["Admin | Snowkap", DEFAULT[1]] : null)
      || DEFAULT;
    document.title = title;
    setTag('meta[name="description"]', { name: "description" }, desc);
    setTag('meta[property="og:title"]', { property: "og:title" }, title);
    setTag('meta[property="og:description"]', { property: "og:description" }, desc);
    setTag('meta[property="og:url"]', { property: "og:url" }, window.location.href);
  }, [pathname]);
  return null;
}
