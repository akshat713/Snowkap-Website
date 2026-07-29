// Snowkap content — sourced from Corporate Deck, Sales Deck, Design Refinement Strategy & snowkap.com

import { asset } from "@/lib/asset";

export const SIGNIN_URL = "https://login.snowkap.com";

export const TICKER = [
  "1,100+ PRODUCT CARBON FOOTPRINTS",
  "700+ SUPPLIERS ONBOARDED",
  ">90% PRIMARY DATA IN ONE QUARTER",
  "25+ FRAMEWORKS · ONE DATA ENTRY",
  "3,800+ PROFESSIONALS TRAINED",
  "CBAM LIVE · €75.36 / tCO₂e",
];

// Framed as consequences to the business rather than as a list of pressures.
// FORCES in site.js already enumerates the regulatory pressures beside the
// sector snapshot, so restating them here would say the same thing twice on one
// page. What each of these costs you is the part that isn't said elsewhere.
export const PROBLEMS = [
  {
    n: "01",
    title: "Your footprint sits with people you don't employ",
    body: "Up to 90% of a manufacturer's emissions sit upstream, with suppliers in regions where you have no presence. A portal link and an inbox do not reach them — and what you cannot measure, you cannot sell against.",
    graphic: "reach",
  },
  {
    n: "02",
    title: "Default values are priced at the border",
    body: "Where primary data is missing, regulators assume the worst case. Under CBAM that assumption is billed per tonne at €75.36/tCO₂e — so a data gap stops being a reporting problem and becomes a line item.",
    graphic: "default",
  },
  {
    n: "03",
    title: "Every market wants the same data, in its own shape",
    body: "CBAM and CSRD in the EU, BRSR and CCTS in India, SGX/ISSB in Singapore, UK CBAM from 2027, UAE Climate Law. One underlying dataset, and 25+ different ways of being asked for it.",
    graphic: "frameworks",
  },
  {
    n: "04",
    title: "Audit exposure hides in the spreadsheet",
    body: "Around 70% of ESG teams still reconcile 5–12 disconnected sources by hand. Inconsistent formats, broken units and manual edits are precisely what external assurance is designed to find.",
    graphic: "fragments",
  },
  {
    n: "05",
    title: "Contracts and capital screen on it first",
    body: "OEM tenders and institutional investors check disclosure quality before a conversation starts. A missing or weak score takes you out of the running without anyone telling you why.",
    graphic: "gate",
  },
];

export const PILLARS3 = [
  {
    n: "01", title: "Advisory", image: "https://images.pexels.com/photos/7433847/pexels-photo-7433847.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200", tag: "Strategy · Clarity · Ratings",
    desc: "Expert-led ESG strategy, double-materiality assessments, SBTi-aligned roadmaps, and capacity building by sector specialists.",
    items: ["ESG first steps & onboarding", "ESG strategy & ratings optimisation", "Capacity building programmes"],
  },
  {
    n: "02", title: "ESG Platform", image: "https://images.pexels.com/photos/10726228/pexels-photo-10726228.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200", tag: "Data · Intelligence · Compliance",
    desc: "An AI-powered ESG command centre integrating ERP, IoT, and supply-chain data into GHG accounting and multi-framework reporting.",
    items: ["Carbon accounting & GHG reporting", "One-click multi-framework reporting", "Intelligent data capture & audit trail"],
  },
  {
    n: "03", title: "Managed Support", image: "https://images.pexels.com/photos/6572534/pexels-photo-6572534.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200", tag: "Embedded · Scalable · People-led",
    desc: "Embedded compliance and operational support across your entire supplier network — without scaling your headcount.",
    items: ["Supplier evidence collection", "Regulatory change monitoring", "Third-party audit coordination"],
  },
];

export const MODULES = [
  { img: asset("/assets/product/capture.jpg"), title: "Capture carbon from every corner", body: "Collect Scope 1, 2 and 3 emissions via bulk uploads, supplier templates, API integrations, and AI-based document parsing. No source left behind." },
  { img: asset("/assets/product/quality.jpg"), title: "Strengthen data at the source", body: "Built-in validation, quality scoring, and auto-tagging. Surface anomalies before they surface in an audit." },
  { img: asset("/assets/product/suppliers.jpg"), title: "Engage your value chain seamlessly", body: "Equip suppliers with easy templates and dashboards. Get primary data, track submissions, and close gaps faster." },
  { img: asset("/assets/product/calculate.jpg"), title: "Calculate carbon with confidence", body: "Hybrid and primary-data PCF estimation across parts, suppliers, and categories — aligned with ISO 14064, ISO 14067 and the GHG Protocol." },
  { img: asset("/assets/product/reporting.jpg"), title: "Report once, comply everywhere", body: "Auto-generate disclosures for BRSR, CDP, TCFD, and ESRS with audit logs, framework mapping, and AI-assist built in." },
  { img: asset("/assets/product/monitor.jpg"), title: "Monitor what matters, live", body: "Track emissions by site, supplier, or material. Compare trends, evaluate hotspots, and inform targets." },
];

export const METRICS = [
  { value: 1100, suffix: "+", label: "Product carbon footprints calculated" },
  { value: 700, suffix: "+", label: "Suppliers onboarded across industries" },
  { value: 3800, suffix: "+", label: "Professionals trained" },
  { value: 25, suffix: "+", label: "Frameworks auto-populated" },
  { value: 90, suffix: "%", prefix: ">", label: "Primary data coverage in one quarter" },
  { value: 6, suffix: "+", label: "Industries served" },
];

// Colour cuts, not the white ones: the page ground is now Clarity white.
const L = (name) => asset(`/assets/logos/${name}.png`);
export const CLIENT_SECTORS = [
  { sector: "Automotive & Transportation", logos: [["Daimler", L("daimler")], ["Schaeffler", L("schaeffler")], ["MAHLE", L("mahle")], ["Ather", L("ather")], ["NRB Bearings", L("nrb")]] },
  { sector: "Manufacturing & Industrial", logos: [["JSW Steel", L("jsw")], ["Econovus", L("econovus")], ["Forstar", L("forstar")], ["Kings Infra", L("kingsinfra")]] },
  { sector: "Healthcare & Pharma", logos: [["Himalaya", L("himalaya")], ["Anthem BioSciences", L("anthem")], ["RPG Life Sciences", L("rpg")], ["Tagros", L("tagros")]] },
  { sector: "Financial, IT & Investment", logos: [["Sutherland", L("sutherland")], ["Chiratae Ventures", L("chiratae")], ["Fireside Ventures", L("fireside")]] },
  { sector: "Beverages & Consumer Goods", logos: [["Senco Gold & Diamonds", L("senco")], ["Varun Beverages", L("varun")], ["african+eastern", L("african-eastern")], ["Chérise", L("cherise")]] },
  { sector: "Energy & Utilities", logos: [["KNPC", L("knpc")]] },
];
export const ALL_LOGOS = CLIENT_SECTORS.flatMap((s) => s.logos);

export const TESTIMONIALS = [
  { quote: "The Snowkap team brought deep industry knowledge and a sharp, data-driven approach to our ESG strategy. Their insights were tailored, relevant, and impactful.", name: "Badal Balchandani", role: "VP, Corporate Sustainability", company: "JSW Steel" },
  { quote: "Working with Snowkap has helped us build our roadmap for sustainability initiatives. Their understanding of Scope 3 emissions, combined with a pragmatic, data-driven approach, helped us build a credible baseline and take action on ground.", name: "Sanjay Banka", role: "Chief Financial Officer", company: "Senco Gold" },
  { quote: "Snowkap delivered a well-structured, insightful review that validated our SBTi target-setting approach and provided clear, practical recommendations. A strong foundation for our Net Zero pathway.", name: "Abhishek Agarwal", role: "Global Head Compliance", company: "Sutherland" },
];

const T = (name) => asset(`/assets/team/${name}.png`);
export const TEAM = [
  { name: "Rajesh P", role: "Chief Executive Officer", img: T("rajesh-p") },
  { name: "Giri K", role: "Co-Founder", img: T("giri-k") },
  { name: "Ambalika G", role: "Head of Sustainability", img: T("ambalika-g") },
  { name: "Prachi B", role: "Head of Technology", img: T("prachi-b") },
  { name: "Siddharth P", role: "Head of Product", img: T("siddharth-p") },
  { name: "Parameswaran R", role: "Head of Project Delivery", img: T("rajesh-g") },
];
export const ADVISORS = [
  { name: "Rajesh G", role: "Founder & Chairman, SNG & Partners", img: T("parameswaran-r") },
  { name: "Prof. Kaushal", role: "Governor's Task Force, Wisconsin", img: T("prof-kaushal") },
  { name: "Srini S", role: "Jt. MD & CFO, Bosch India", img: T("srini-s") },
];

export const FAQS = [
  { q: "What is Snowkap?", a: "Snowkap is a global ESG technology company combining expert advisory, an AI-powered platform, and embedded managed support — converting ESG complexity into measurable business performance. Founded by sustainability and technology veterans, we operate across India, GCC, SE Asia, and Europe." },
  { q: "What does the Snowkap platform actually do?", a: "It's an AI-powered ESG command centre: carbon accounting across Scope 1–3 with 60,000+ emission factors, AI-OCR extraction from invoices and PDFs, supplier engagement with AI verification, and one-click multi-framework reporting — BRSR, CSRD/ESRS, GRI, IFRS S1/S2, CDP, TCFD — from a single data entry." },
  { q: "How does Snowkap handle Scope 3 and supplier data?", a: "Tiered supplier assessments, AI-verified evidence, and 90%+ confidence proxy datasets when suppliers can't provide primary data. Our managed support team onboards and chases suppliers so your team doesn't have to — our benchmark is over 90% primary data coverage within one quarter." },
  { q: "Which reporting frameworks does Snowkap support?", a: "25+ active frameworks including BRSR and BRSR Core, CSRD/ESRS, GRI, IFRS S1/S2, CDP, TCFD, DJSI, EcoVadis, and CBAM. One data entry auto-populates every applicable framework, with a live regulation watch tracking updates." },
  { q: "How does Snowkap ensure data accuracy and integrity?", a: "Automated validation and completeness checks on every upload, unit standardisation, anomaly detection, maker-checker governance, and full audit trails. Every emission factor and output is tagged to its standard with full version history — externally assurable by design." },
  { q: "Can Snowkap help beyond reporting?", a: "Yes — that's the point. Our advisory arm builds SBTi-aligned decarbonisation roadmaps, MAC-curve reduction plans, and ratings improvement programmes (EcoVadis, CDP, DJSI), while linking every initiative to ROI so sustainability drives business value, not just compliance." },
  { q: "Is my data secure on the platform?", a: "Enterprise-grade security with role-based access control, full audit-trail logging, data residency options, and maker-checker workflows. The platform is built to the same rigour as your financial systems." },
  { q: "How do we get started?", a: "Book a demo or write to sales@snowkap.com. Guided onboarding takes you from setup to first report fast — with a dedicated onboarding manager and embedded support from day one." },
];

export const JOURNEY = [
  { step: "Measure", body: "GHG baseline — Scope 1, 2 & 3. Product carbon footprints." },
  { step: "Assess", body: "Double materiality, ESG risk, supply-chain assessment, peer benchmarking." },
  { step: "Comply", body: "Customer & market compliance across 25+ frameworks." },
  { step: "Transform", body: "Reduction & net-zero roadmaps linked to ROI." },
  { step: "Report", body: "Impact reporting, assurance & certification." },
];

export const IMAGES = {
  heroLens: "https://images.unsplash.com/photo-1644542410329-44b2286639d9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
  forest: "https://images.unsplash.com/photo-1712528131639-32df6230278a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
};
