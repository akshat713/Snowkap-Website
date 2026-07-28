// Snowkap resource library — blogs, whitepapers, press, events, webinars.
//
// This is the site's own copy of the content that previously lived only in the
// backend's `resources` collection (server.py's SEED_RESOURCES, mirrored here
// verbatim). Keeping it in the repo lets the static build serve the library
// with no API round-trip, which is what the GitHub Pages deployment needs.
//
// Order is meaningful: the list runs newest-first, and both the Resources page
// and the homepage preview render it as-is.
//
// `slug` is generated with the same rule the backend used, so existing
// /resources/<slug> links keep working.

export const RESOURCES = [
  {
    type: "blog",
    category: "Carbon & Finance",
    title: "Your Carbon Numbers are a Financial Asset. Most Companies Still Treat them Like Paperwork.",
    excerpt: "Verified carbon data now prices debt, wins tenders, and moves valuations. Why the smartest CFOs treat the carbon ledger like the general ledger.",
    date_label: "Jul 2026",
    read_time: "7 min read",
    tags: [
      "Carbon",
      "Finance"
    ],
    external_url: "https://snowkap.com/your-carbon-numbers-are-a-financial-asset/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/07/Thumbnail-image.png",
    body: "Carbon numbers have quietly crossed over from compliance paperwork to financial infrastructure. Lenders price sustainability-linked debt on them, OEMs award contracts on them, and investors screen on them. This piece makes the case for treating your carbon ledger with the same rigour as your general ledger — and shows what changes when you do.",
    slug: "your-carbon-numbers-are-a-financial-asset-most-companies-still-treat-them-like-p",
    id: "your-carbon-numbers-are-a-financial-asset-most-companies-still-treat-them-like-p",
    gated: false
  },
  {
    type: "blog",
    category: "Sector Deep Dive",
    title: "Carbon Is Becoming the Next Real Estate Cost Variable",
    excerpt: "Embodied carbon, energy performance, and disclosure rules are rewriting how real estate is valued, leased, and financed.",
    date_label: "Jul 2026",
    read_time: "6 min read",
    tags: [
      "Real Estate",
      "Carbon"
    ],
    external_url: "https://snowkap.com/carbon-is-becoming-the-next-real-estate-cost-variable/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/07/Thumbnail-Image.jpg",
    body: "From embodied carbon in construction to operational energy performance, carbon is becoming a line item in every real-estate decision. This deep dive covers the regulations, the valuation impact, and what asset owners should measure now.",
    slug: "carbon-is-becoming-the-next-real-estate-cost-variable",
    id: "carbon-is-becoming-the-next-real-estate-cost-variable",
    gated: false
  },
  {
    type: "blog",
    category: "Regulatory Intelligence",
    title: "Carbon at the Border: Why CBAM Is Really a Supply Chain Data Regulation",
    excerpt: "CBAM is framed as a tariff, but it operates as a data regulation. The importers who win will be the ones with verified supplier data.",
    date_label: "May 2026",
    read_time: "8 min read",
    tags: [
      "CBAM",
      "Supply Chain"
    ],
    external_url: "https://snowkap.com/carbon-at-the-border/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/CBAM-A-Trade-Regulation-banner.png",
    body: "The EU's Carbon Border Adjustment Mechanism is usually described as a carbon tariff. In practice it is a supply-chain data regulation: the cost you pay depends on the quality of the emissions data you can produce. This article unpacks the mechanics, the default-value penalty, and the data infrastructure importers need.",
    slug: "carbon-at-the-border-why-cbam-is-really-a-supply-chain-data-regulation",
    id: "carbon-at-the-border-why-cbam-is-really-a-supply-chain-data-regulation",
    gated: false
  },
  {
    type: "blog",
    category: "Carbon & Finance",
    title: "Data-Driven Decarbonization: How Carbon Accounting is Reshaping Finance and Insurance",
    excerpt: "Financed and insured emissions are now board-level numbers. How financial institutions are operationalising carbon accounting.",
    date_label: "Jan 2026",
    read_time: "7 min read",
    tags: [
      "Finance",
      "Carbon Accounting"
    ],
    external_url: "https://snowkap.com/data-driven-decarbonization-how-carbon-accounting-is-reshaping-finance-and-insurance/",
    body: "Financial institutions are discovering that their largest emissions sit in their portfolios, not their offices. This piece covers PCAF methodology, data sourcing across portfolio companies, and how carbon accounting is reshaping underwriting and lending.",
    slug: "data-driven-decarbonization-how-carbon-accounting-is-reshaping-finance-and-insur",
    id: "data-driven-decarbonization-how-carbon-accounting-is-reshaping-finance-and-insur",
    gated: false
  },
  {
    type: "blog",
    category: "AI & Platform",
    title: "How Artificial Intelligence is Powering Sustainability",
    excerpt: "From AI-OCR data extraction to predictive emission forecasting — where AI genuinely moves the needle in ESG operations.",
    date_label: "Jan 2026",
    read_time: "6 min read",
    tags: [
      "AI",
      "ESG"
    ],
    external_url: "https://snowkap.com/how-artificial-intelligence-is-powering-sustainability/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/01/How-Artificial-Intelligence-is-Powering-Sustainability-option-3.png",
    body: "AI is often overhyped in sustainability — and simultaneously underused where it matters. This article maps the genuinely high-leverage applications: document extraction, anomaly detection, framework auto-mapping, and predictive forecasting.",
    slug: "how-artificial-intelligence-is-powering-sustainability",
    id: "how-artificial-intelligence-is-powering-sustainability",
    gated: false
  },
  {
    type: "blog",
    category: "Regulatory Intelligence",
    title: "The Great Unlocking: Why India's CCUS Moment Is Real This Time",
    excerpt: "Policy, price signals, and industrial demand are converging on carbon capture in India. What business leaders should watch.",
    date_label: "Apr 2026",
    read_time: "9 min read",
    tags: [
      "India",
      "CCUS"
    ],
    external_url: "https://snowkap.com/the-great-unlocking-why-indias-ccus-moment-is-real-this-time/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/04/Blog-Image-1.png",
    body: "India's carbon capture, utilisation and storage moment has been announced many times before. This time, policy incentives, carbon pricing signals, and hard-to-abate industrial demand are aligning. Here's what the unlock looks like.",
    slug: "the-great-unlocking-why-india-s-ccus-moment-is-real-this-time",
    id: "the-great-unlocking-why-india-s-ccus-moment-is-real-this-time",
    gated: false
  },
  {
    type: "blog",
    category: "Carbon & Finance",
    title: "Decarbonizing the Balance Sheet: A Strategic Guide to GHG Emissions for India's Business Leaders",
    excerpt: "A CXO-level guide connecting GHG baselines, BRSR Core, and CCTS to capital access and valuation.",
    date_label: "Jan 2026",
    read_time: "10 min read",
    tags: [
      "India",
      "BRSR",
      "GHG"
    ],
    external_url: "https://snowkap.com/decarbonizing-the-balance-sheet-a-strategic-guide-to-ghg-emissions-for-indias-business-leaders/",
    body: "For India's business leaders, GHG emissions have moved from the sustainability report to the balance sheet. This strategic guide connects emissions baselines to BRSR Core assurance, CCTS obligations, capital access, and enterprise value.",
    slug: "decarbonizing-the-balance-sheet-a-strategic-guide-to-ghg-emissions-for-india-s-b",
    id: "decarbonizing-the-balance-sheet-a-strategic-guide-to-ghg-emissions-for-india-s-b",
    gated: false
  },
  {
    type: "blog",
    category: "Regulatory Intelligence",
    title: "The Snowkap Guide to a Post-COP30 World: Key Outcomes and Business Implications",
    excerpt: "What actually changed at COP30 — and the three decisions every enterprise should make in response.",
    date_label: "Dec 2025",
    read_time: "8 min read",
    tags: [
      "COP30",
      "Policy"
    ],
    external_url: "https://snowkap.com/the-snowkap-guide-to-a-post-cop30-world-key-outcomes-and-business-implications/",
    body: "COP30 produced fewer headlines and more operational consequences than any COP before it. This guide separates signal from noise and lays out the three decisions every enterprise should make in response.",
    slug: "the-snowkap-guide-to-a-post-cop30-world-key-outcomes-and-business-implications",
    id: "the-snowkap-guide-to-a-post-cop30-world-key-outcomes-and-business-implications",
    gated: false
  },
  {
    type: "whitepaper",
    category: "Finance",
    title: "Your Climate Disclosure Now Prices Your Debt",
    excerpt: "How lenders read climate disclosure quality — and the measurable spread between leaders and laggards.",
    tags: [
      "Finance",
      "Disclosure"
    ],
    gated: true,
    external_url: "https://snowkap.com/your-climate-disclosure-now-prices-your-debt/",
    body: "A finance-facing brief on how climate disclosure quality flows into the cost of debt, with the data lenders actually look at.",
    slug: "your-climate-disclosure-now-prices-your-debt",
    id: "your-climate-disclosure-now-prices-your-debt"
  },
  {
    type: "whitepaper",
    category: "Supply Chain",
    title: "The Supplier's Emissions Playbook",
    excerpt: "A practical playbook for suppliers asked to produce verified emissions data by their OEM customers.",
    tags: [
      "Scope 3",
      "Suppliers"
    ],
    gated: true,
    external_url: "https://snowkap.com/the-suppliers-emissions-playbook/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/06/Supplier-Emission.jpg",
    body: "OEMs increasingly make verified emissions data a condition of contract. This playbook walks suppliers through baselining, evidence, and submission — step by step.",
    slug: "the-supplier-s-emissions-playbook",
    id: "the-supplier-s-emissions-playbook"
  },
  {
    type: "whitepaper",
    category: "Pharma",
    title: "The Indian Pharma Decade",
    excerpt: "Why the next decade of Indian pharma growth runs through ESG — regulatory exposure, buyer expectations, and the data to win.",
    tags: [
      "Pharma",
      "India"
    ],
    gated: true,
    external_url: "https://snowkap.com/the-indian-pharma-decade/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/Pharma-Decade.jpg",
    body: "Indian pharmaceutical exporters face converging ESG expectations from regulators and global buyers. This whitepaper maps the exposure and the opportunity.",
    slug: "the-indian-pharma-decade",
    id: "the-indian-pharma-decade"
  },
  {
    type: "whitepaper",
    category: "India Reporting",
    title: "The BRSR Guide",
    excerpt: "Everything a reporting team needs on BRSR and BRSR Core: scope, assurance, timelines, and the data model to satisfy it.",
    tags: [
      "BRSR",
      "India"
    ],
    gated: true,
    external_url: "https://snowkap.com/brsr-guide/",
    image: "https://snowkaplive.b-cdn.net/wp-content/uploads/2026/05/BRSR-Guide.jpg",
    body: "A complete practitioner's guide to BRSR and BRSR Core — scope, assurance requirements, timelines, and the underlying data model.",
    slug: "the-brsr-guide",
    id: "the-brsr-guide"
  },
  {
    type: "webinar",
    category: "AI & Automation",
    title: "Harnessing AI and Automation to Accelerate ESG Goals",
    excerpt: "How AI is reshaping ESG compliance, reporting, and sustainability planning — automation, regulatory adaptability, risk management, and predictive sustainability.",
    date_label: "60 min",
    status_label: "on-demand",
    tags: [
      "Webinar",
      "AI"
    ],
    external_url: "https://snowkap.com/webinars/",
    body: "Key highlights: AI in ESG compliance — automating data collection, assessment workflows, and multi-framework reporting · Regulatory adaptability — real-time response to evolving standards like BRSR, CSRD, and CDP · Risk management — AI-driven insights to mitigate ESG-related legal and reputational risk · Predictive sustainability — computational AI for emission forecasting and target setting.",
    slug: "harnessing-ai-and-automation-to-accelerate-esg-goals",
    id: "harnessing-ai-and-automation-to-accelerate-esg-goals",
    gated: false
  },
  {
    type: "webinar",
    category: "Scope 3",
    title: "Scope 3: A Step-by-Step Roadmap for Pharma and Chemical Suppliers",
    excerpt: "A practical session for pharma and chemical suppliers building their first credible Scope 3 baseline.",
    date_label: "45 min",
    status_label: "on-demand",
    tags: [
      "Webinar",
      "Scope 3"
    ],
    external_url: "https://snowkap.com/scope-3-a-step-by-step-roadmap-for-pharma-and-chemical-suppliers/",
    body: "A step-by-step roadmap covering supplier data collection, emission factor selection, and audit-ready consolidation for pharma and chemical value chains.",
    slug: "scope-3-a-step-by-step-roadmap-for-pharma-and-chemical-suppliers",
    id: "scope-3-a-step-by-step-roadmap-for-pharma-and-chemical-suppliers",
    gated: false
  },
  {
    type: "press",
    category: "In the News",
    title: "Post Budget 2025: What the Union Budget Means for India's Sustainability Agenda",
    excerpt: "Snowkap leadership on how Budget 2025 reshapes clean energy, carbon markets, and enterprise ESG incentives.",
    date_label: "2025",
    tags: [
      "Press"
    ],
    external_url: "https://snowkap.com/press/",
    body: "Snowkap's leadership commentary on Union Budget 2025 and its implications for clean energy, carbon markets, and enterprise ESG.",
    slug: "post-budget-2025-what-the-union-budget-means-for-india-s-sustainability-agenda",
    id: "post-budget-2025-what-the-union-budget-means-for-india-s-sustainability-agenda",
    gated: false
  },
  {
    type: "press",
    category: "In the News",
    title: "Why The World Needs More Women In Sustainability",
    excerpt: "Snowkap voices on representation, leadership, and why diverse teams build better climate outcomes.",
    date_label: "2025",
    tags: [
      "Press"
    ],
    external_url: "https://snowkap.com/press/",
    body: "Snowkap contributions on representation and leadership in sustainability.",
    slug: "why-the-world-needs-more-women-in-sustainability",
    id: "why-the-world-needs-more-women-in-sustainability",
    gated: false
  },
  {
    type: "press",
    category: "In the News",
    title: "2025 Business Trends: Sustainability Moves to the Core of Strategy",
    excerpt: "Press coverage featuring Snowkap on the year sustainability stopped being a side function.",
    date_label: "2025",
    tags: [
      "Press"
    ],
    external_url: "https://snowkap.com/press/",
    body: "Coverage featuring Snowkap on sustainability's move into core business strategy.",
    slug: "2025-business-trends-sustainability-moves-to-the-core-of-strategy",
    id: "2025-business-trends-sustainability-moves-to-the-core-of-strategy",
    gated: false
  },
  {
    type: "event",
    category: "Executive Briefing",
    title: "CBAM Readiness Briefing for Exporters and EU Importers",
    excerpt: "A 45-minute executive briefing on CBAM exposure, default-value penalties, and the verified-data advantage.",
    date_label: "Quarterly",
    location: "Virtual · Live",
    status_label: "upcoming",
    tags: [
      "Event",
      "CBAM"
    ],
    external_url: "https://snowkap.com/events-webinars/",
    body: "Quarterly executive briefing on CBAM exposure and readiness, hosted by Snowkap's regulatory team.",
    slug: "cbam-readiness-briefing-for-exporters-and-eu-importers",
    id: "cbam-readiness-briefing-for-exporters-and-eu-importers",
    gated: false
  }
];

export const RESOURCE_TYPES = ["blog", "whitepaper", "press", "event", "webinar"];

export const resourcesByType = (type) => RESOURCES.filter((r) => r.type === type);

export const resourceBySlug = (slug) => RESOURCES.find((r) => r.slug === slug) || null;
