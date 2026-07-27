// Static site content for Snowkap

export const HERO_TICKER = [
  { label: "CBAM CERTIFICATE", value: "€75.36 / tCO₂e — Q1 2026" },
  { label: "UK CBAM EFFECTIVE", value: "JAN 2027" },
  { label: "SUPPLIERS ACTIVATED", value: "700+ ACROSS FIVE REGIONS" },
  { label: "PRIMARY DATA COVERAGE", value: "90%+ IN ONE QUARTER" },
  { label: "FRAMEWORKS", value: "25+ FROM ONE DATA ENTRY" },
  { label: "SIX SECTORS · FIVE REGIONS", value: "ONE PLATFORM" },
];

export const REGIONS = [
  { code: "EU", name: "European Union", note: "CBAM certificate €75.36/tCO₂e · CSRD in force", status: "P1 — Germany & Austria entry", tone: "primary" },
  { code: "IN", name: "India", note: "BRSR Core assurance · CCTS binding targets", status: "Proven at scale", tone: "primary" },
  { code: "UK", name: "United Kingdom", note: "UK CBAM effective Jan 2027", status: "Expanding", tone: "muted" },
  { code: "SG", name: "Singapore & SEA", note: "SGX/ISSB mandatory reporting · Vietnam ETS live", status: "Expanding", tone: "muted" },
  { code: "GCC", name: "Gulf Region", note: "UAE Climate Law · Qatar, Saudi disclosure regimes", status: "Expanding", tone: "muted" },
];

export const FORCES = [
  { n: "01", title: "Supply Chain Data Demands", body: "Buyers and OEMs now require verified data from Tier 1–3 suppliers before they'll sign — wherever those suppliers sit." },
  { n: "02", title: "Multi-Framework Burden", body: "CBAM and CSRD in the EU, BRSR and CCTS in India, SGX/ISSB in Singapore, UK CBAM from 2027, UAE Climate Law — 25+ overlapping standards." },
  { n: "03", title: "Fragmented Data", body: "Most ESG teams still run on spreadsheets across five to twelve disconnected sources — where audit exposure starts." },
  { n: "04", title: "Capital & Market Access", body: "Institutional investors and premium tenders now screen on ESG ratings and disclosure quality. A missing score closes doors." },
];

export const PILLARS = [
  {
    n: "01", tag: "Strategy · Ratings · Capacity Building", title: "Advisory",
    desc: "Expert guidance to set the right targets, frameworks and narrative for your stakeholders.",
    items: ["SBTi Target Setting & Decarbonisation Roadmap", "Ratings Optimisation", "Double Materiality Assessment"],
    image: "https://images.pexels.com/photos/7433847/pexels-photo-7433847.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200",
  },
  {
    n: "02", tag: "Data · Intelligence · Compliance", title: "ESG Platform",
    desc: "An AI-powered command centre that turns scattered data into audit-ready intelligence.",
    items: ["Scope 3 Engine", "Multi-Framework Auto-Reporting", "Supplier ESG Assessment Portal"],
    image: "https://images.pexels.com/photos/10726228/pexels-photo-10726228.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200",
  },
  {
    n: "03", tag: "Embedded · Scalable · People-Led", title: "Managed Support",
    desc: "A dedicated team that executes the work no software can, on the ground.",
    items: ["Managed Supplier Activation", "Regulatory Change Monitoring", "Third-Party Audit Coordination"],
    image: "https://images.pexels.com/photos/6572534/pexels-photo-6572534.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1200",
  },
];

export const SECTORS = [
  { id: "automotive", name: "Automotive & Transportation", note: "OEMs are cascading verified Scope 3 requirements down Tier 1–3 suppliers.", image: "https://images.pexels.com/photos/6572534/pexels-photo-6572534.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { id: "manufacturing", name: "Manufacturing & Industrial", note: "Energy-intensive operations feeding global OEM supply chains.", image: "https://images.pexels.com/photos/32503741/pexels-photo-32503741.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { id: "healthcare", name: "Healthcare & Pharma", note: "Complex global sourcing and cold-chain logistics emissions.", image: "https://images.pexels.com/photos/10726228/pexels-photo-10726228.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { id: "financial", name: "Financial, IT & Investment", note: "Financed emissions (Scope 3, Category 15) across portfolios.", image: "https://images.pexels.com/photos/7433840/pexels-photo-7433840.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { id: "beverages", name: "Beverages & Consumer Goods", note: "Upstream agricultural and packaging emissions dominate the footprint.", image: "https://images.pexels.com/photos/18602382/pexels-photo-18602382.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
  { id: "energy", name: "Energy & Utilities", note: "Direct emissions intensity under multiple, overlapping carbon-pricing regimes.", image: "https://images.pexels.com/photos/18602382/pexels-photo-18602382.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=900" },
];

export const PROOF = [
  { value: 1200, suffix: "+", label: "Product carbon footprints calculated", sub: "Manufacturing · Auto · Pharma · Consumer Goods" },
  { value: 700, suffix: "+", label: "Suppliers onboarded via Managed Activation", sub: "Tier 1 & 2 supply chains, globally" },
  { value: 90, suffix: "%+", label: "Primary data coverage within one quarter", sub: "Benchmark no competitor has matched" },
  { value: 25, suffix: "+", label: "Frameworks auto-populated from one entry", sub: "CBAM · CSRD · BRSR · GRI · IFRS · EUDR" },
];

export const TESTIMONIALS = [
  { sector: "Automotive & Industrial", quote: "Snowkap moved us from fragmented spreadsheets to a single, audit-ready source of truth — in one reporting cycle.", name: "Badal Balchandani", role: "VP Corporate Sustainability · JSW Steel", initials: "BB" },
  { sector: "Consumer Goods", quote: "Their ratings work directly improved our access to capital. ESG finally reads as a financial advantage, not a cost.", name: "Sanjay Banka", role: "Chief Financial Officer · Senco Gold", initials: "SB" },
  { sector: "Financial & IT Services", quote: "One data entry, compliant across every framework we report against. The multi-framework engine is a genuine breakthrough.", name: "Abhishek Agarwal", role: "Global Head Compliance · Sutherland", initials: "AA" },
];

export const STANDARDS = [
  { group: "Methodologies & Data", items: ["GHG Protocol", "Ecoinvent", "IPCC", "DEFRA"] },
  { group: "Global Reporting Frameworks", items: ["GRI", "TCFD", "CDP", "IFRS S1/S2", "SBTi", "EUDR", "Dow Jones SI", "EcoVadis"] },
  { group: "Regional Regulation Coverage", items: ["EU CBAM & CSRD", "India BRSR & CCTS", "UK CBAM", "Singapore SGX/ISSB", "UAE Climate Law"] },
  { group: "Security & Data", items: ["ISO 27001", "SOC 2", "GDPR-Compliant", "Data Residency", "99.9% Uptime"] },
];

export const PACKAGES = [
  {
    id: "Starter", tagline: "Begin your ESG journey", price: "€12,000", cadence: "/year", note: "Indicative starting price",
    desc: "For companies taking their first verified steps into ESG.",
    features: ["GHG Scope 1 & 2 baseline", "Single-framework reporting (BRSR or GRI)", "ESG fundamentals training", "Basic platform access", "Dedicated onboarding manager"],
    popular: false,
  },
  {
    id: "Growth", tagline: "Scale compliance & suppliers", price: "€40,000", cadence: "/year", note: "Indicative starting price",
    desc: "For companies scaling compliance and supply-chain engagement.",
    features: ["Full Scope 1, 2 & 3 — all categories", "Product Carbon Footprint (PCF)", "Multi-framework reporting (CSRD + GRI + BRSR)", "SBTi target setting", "Supplier ESG portal (up to 100 suppliers)", "Double materiality assessment", "Managed supplier onboarding support"],
    popular: true,
  },
  {
    id: "Enterprise", tagline: "Global, multi-framework operations", price: "Custom", cadence: "", note: "Scoped to your supply chain",
    desc: "For global operations with complex, multi-tier supply chains.",
    features: ["Everything in Growth, plus:", "Life Cycle Assessment (LCA)", "Unlimited supplier network management", "Ratings optimisation across all agencies", "Board & leadership briefings", "Regulatory change monitoring", "Custom API integrations & dedicated account team"],
    popular: false,
  },
];

export const ADDONS = {
  Advisory: [
    "ESG Training & Capacity Building", "Peer Benchmarking & Performance Scorecard", "Double Materiality Assessment",
    "SBTi Target Setting & Decarbonisation Roadmap", "ESG Framework Set-Up", "Ratings Optimisation",
    "Board & Leadership Briefings", "Stakeholder Communications & Report Design",
  ],
  "ESG Platform": [
    "GHG Inventory (Scope 1 & 2)", "Scope 3 Engine", "Product Carbon Footprint (PCF)", "Life Cycle Assessment",
    "Supplier ESG Assessment Portal", "Multi-Framework Auto-Reporting", "CBAM Certificate Computation",
    "Dashboards & Benchmarking Insights",
  ],
  "Managed Support": [
    "Managed Supplier Activation", "Supplier Training & Capacity Building", "Regulatory Change Monitoring",
    "Third-Party Audit Coordination", "Report Writing & Design",
  ],
};

export const DOSSIER_QUESTIONS = [
  { key: "sector", q: "What sector are you in?", options: ["Automotive & Transportation", "Manufacturing & Industrial", "Healthcare & Pharma", "Financial, IT & Investment", "Beverages & Consumer Goods", "Energy & Utilities"] },
  { key: "region", q: "Where is your primary exposure?", options: ["European Union", "India", "United Kingdom", "Singapore & SEA", "Gulf Region", "Other / Global"] },
  { key: "stage", q: "Where are you on the journey?", options: ["First baseline — just starting", "Scaling compliance & suppliers", "Global, multi-framework operations"] },
  { key: "company_size", q: "How large is your organisation?", options: ["Under 25", "26–99", "100–999", "1000+"] },
];

export const ROLES = ["CFO / Finance", "COO / Operations", "Head of Sustainability", "Procurement", "Other"];
