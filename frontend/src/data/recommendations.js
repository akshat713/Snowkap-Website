// Recommendation intelligence for the programme builder and the dossier.
//
// Three things live here:
//   1. PAIRINGS       — which services genuinely belong alongside another
//   2. PACKAGE_GAPS   — what a chosen package leaves out
//   3. recommendPackage() — dossier answers -> tier, reasoning, journey path
//
// The pairings are workflow dependencies, not upsells: a baseline is the input
// to a target, supplier data is the input to Scope 3, product data is the input
// to CBAM. Each carries the reason it is being suggested, because a
// recommendation the reader can't evaluate is just noise.

import { SERVICE_INDEX } from "@/data/site";

/**
 * The pillar a service belongs to, so anything added from a recommendation is
 * filed under Advisory / ESG Platform / Managed Support like every other item
 * rather than under a label describing how it got there.
 */
export const pillarOf = (name) => SERVICE_INDEX[name]?.pillar || "Recommended";

/* ------------------------------------------------------------------ *
 * 1. Service-to-service pairings
 * ------------------------------------------------------------------ */

export const PAIRINGS = {
  // ---- Advisory ----
  "ESG Training & Capacity Building": [
    { name: "ESG Framework Set-Up", why: "Training lands when there's a framework to apply it to." },
    { name: "Peer Benchmarking & Performance Scorecard", why: "A baseline makes the training measurable." },
    { name: "Supplier Training & Capacity Building", why: "The same gap usually exists one tier down." },
  ],
  "Peer Benchmarking & Performance Scorecard": [
    { name: "Ratings Optimisation", why: "Knowing the gap is the input to closing it." },
    { name: "Dashboards & Benchmarking Insights", why: "Keeps peer position live rather than annual." },
  ],
  "Double Materiality Assessment": [
    { name: "ESG Framework Set-Up", why: "Materiality decides what the framework has to cover." },
    { name: "Stakeholder Communications & Report Design", why: "Material topics are what the report is built around." },
  ],
  "SBTi Target Setting & Decarbonisation Roadmap": [
    { name: "GHG Inventory (Scope 1 & 2)", why: "Targets need a verified baseline underneath them." },
    { name: "Scope 3 Engine", why: "SBTi requires Scope 3 once it passes 40% of your footprint." },
    { name: "Board & Leadership Briefings", why: "Targets need sign-off from the people who fund them." },
  ],
  "ESG Framework Set-Up": [
    { name: "Multi-Framework Auto-Reporting", why: "One data entry keeps every later filing cheap." },
    { name: "Double Materiality Assessment", why: "CSRD expects the framework to follow materiality." },
  ],
  "Ratings Optimisation": [
    { name: "Double Materiality Assessment", why: "Ratings move when the material gaps close." },
    { name: "Peer Benchmarking & Performance Scorecard", why: "Shows which gaps are costing you the most score." },
  ],
  "Board & Leadership Briefings": [
    { name: "Dashboards & Benchmarking Insights", why: "Boards ask for the trend line, not the annexe." },
    { name: "Peer Benchmarking & Performance Scorecard", why: "The first question is always where we sit versus peers." },
  ],
  "Stakeholder Communications & Report Design": [
    { name: "Report Writing & Design", why: "Design needs verified content to sit on." },
    { name: "Multi-Framework Auto-Reporting", why: "Keeps the numbers in the report traceable." },
  ],

  // ---- ESG Platform ----
  "GHG Inventory (Scope 1 & 2)": [
    { name: "Scope 3 Engine", why: "Scope 1 & 2 is usually under 10% of the total footprint." },
    { name: "SBTi Target Setting & Decarbonisation Roadmap", why: "A baseline is only useful once it points somewhere." },
    { name: "Multi-Framework Auto-Reporting", why: "The same inventory feeds every disclosure you owe." },
  ],
  "Scope 3 Engine": [
    { name: "Supplier ESG Assessment Portal", why: "Scope 3 is only as good as the supplier data behind it." },
    { name: "Managed Supplier Activation", why: "Most suppliers never respond to a portal on their own." },
    { name: "Product Carbon Footprint (PCF)", why: "Turns category totals into per-product numbers buyers ask for." },
  ],
  "Product Carbon Footprint (PCF)": [
    { name: "CBAM Certificate Computation", why: "CBAM surrender is computed from exactly this product data." },
    { name: "Multi-Framework Auto-Reporting", why: "PCF figures flow straight into your disclosures." },
    { name: "Life Cycle Assessment", why: "Extends cradle-to-gate into full-life claims." },
  ],
  "Life Cycle Assessment": [
    { name: "Product Carbon Footprint (PCF)", why: "PCF is the carbon slice of the same model." },
    { name: "Stakeholder Communications & Report Design", why: "An LCA is the evidence base for public product claims." },
  ],
  "Supplier ESG Assessment Portal": [
    { name: "Managed Supplier Activation", why: "A portal doesn't make anyone answer it. Activation does." },
    { name: "Supplier Training & Capacity Building", why: "Most non-responses are capability, not unwillingness." },
  ],
  "Multi-Framework Auto-Reporting": [
    { name: "Third-Party Audit Coordination", why: "Assured filings need the audit trail built in from the start." },
    { name: "Report Writing & Design", why: "Turns the generated disclosure into something readable." },
    { name: "Dashboards & Benchmarking Insights", why: "Reporting once a year hides the trend in between." },
  ],
  "CBAM Certificate Computation": [
    { name: "Product Carbon Footprint (PCF)", why: "Verified primary data beats default values at any certificate price." },
    { name: "Regulatory Change Monitoring", why: "CBAM scope and price both keep moving." },
    { name: "Third-Party Audit Coordination", why: "Declarations are verified — plan for it." },
  ],
  "Dashboards & Benchmarking Insights": [
    { name: "Peer Benchmarking & Performance Scorecard", why: "Internal trends mean more against a peer set." },
    { name: "Board & Leadership Briefings", why: "Dashboards earn their keep when leadership reads them." },
  ],

  // ---- Managed Support ----
  "Managed Supplier Activation": [
    { name: "Supplier ESG Assessment Portal", why: "Activated suppliers need somewhere to submit." },
    { name: "Supplier Training & Capacity Building", why: "Trained suppliers stay active after the programme ends." },
    { name: "Multi-Framework Auto-Reporting", why: "Gives the collected data somewhere to land." },
  ],
  "Supplier Training & Capacity Building": [
    { name: "Managed Supplier Activation", why: "Training raises quality; activation raises response rate." },
    { name: "Supplier ESG Assessment Portal", why: "Trained suppliers need a place to put the data." },
  ],
  "Regulatory Change Monitoring": [
    { name: "Multi-Framework Auto-Reporting", why: "Knowing a rule moved helps only if filings can absorb it." },
    { name: "Third-Party Audit Coordination", why: "New requirements usually arrive with new assurance." },
  ],
  "Third-Party Audit Coordination": [
    { name: "Multi-Framework Auto-Reporting", why: "Auditors ask for the trail — this keeps it intact." },
    { name: "Report Writing & Design", why: "The assured numbers still have to be published." },
  ],
  "Report Writing & Design": [
    { name: "Stakeholder Communications & Report Design", why: "Writing and design are one workflow, not two." },
    { name: "Multi-Framework Auto-Reporting", why: "Keeps every figure in the report sourced." },
  ],
};

/* ------------------------------------------------------------------ *
 * 2. Package coverage and gaps
 * ------------------------------------------------------------------ */

// What each package already includes, so it is never recommended back.
const STARTER_COVERS = [
  "GHG Inventory (Scope 1 & 2)",
  "ESG Training & Capacity Building",
  "ESG Framework Set-Up",
];
const GROWTH_COVERS = [
  ...STARTER_COVERS,
  "Scope 3 Engine",
  "Product Carbon Footprint (PCF)",
  "Multi-Framework Auto-Reporting",
  "SBTi Target Setting & Decarbonisation Roadmap",
  "Supplier ESG Assessment Portal",
  "Double Materiality Assessment",
  "Managed Supplier Activation",
];
const ENTERPRISE_COVERS = [
  ...GROWTH_COVERS,
  "Life Cycle Assessment",
  "Ratings Optimisation",
  "Board & Leadership Briefings",
  "Regulatory Change Monitoring",
];

export const PACKAGE_COVERS = {
  Starter: STARTER_COVERS,
  Growth: GROWTH_COVERS,
  Enterprise: ENTERPRISE_COVERS,
};

// What a package most often needs adding on top.
export const PACKAGE_GAPS = {
  Starter: [
    { name: "Scope 3 Engine", why: "Starter covers Scope 1 & 2 — Scope 3 is where buyers actually push." },
    { name: "Supplier ESG Assessment Portal", why: "The moment a customer asks for supplier data, you'll need this." },
  ],
  Growth: [
    { name: "CBAM Certificate Computation", why: "Growth produces the PCF data CBAM surrender runs on." },
    { name: "Third-Party Audit Coordination", why: "Multi-framework filings at this scale get assured." },
  ],
  Enterprise: [
    { name: "CBAM Certificate Computation", why: "Priced per exposure rather than bundled — added by most EU-facing clients." },
    { name: "Supplier Training & Capacity Building", why: "The lever that keeps a large activated network reporting." },
  ],
};

/* ------------------------------------------------------------------ *
 * 3. Sector playbooks — pressure, services, journey
 * ------------------------------------------------------------------ */

export const SECTOR_PLAYBOOK = {
  "Automotive & Transportation": {
    pressure:
      "OEMs are cascading verified Scope 3 requirements down to Tier 2 and Tier 3, and CBAM lands on every imported steel and aluminium component.",
    services: ["Scope 3 Engine", "Product Carbon Footprint (PCF)", "Supplier ESG Assessment Portal"],
    journey: [
      { phase: "Baseline", detail: "Scope 1 & 2 across plants, then a per-component PCF for the parts your OEMs are asking about." },
      { phase: "Activate", detail: "Open the portal to Tier 1, then run Managed Activation on whoever doesn't respond." },
      { phase: "Report", detail: "One data entry answering CBAM, CSRD and each OEM's own template." },
    ],
  },
  "Manufacturing & Industrial": {
    pressure:
      "Energy-intensive operations feed global supply chains under both CBAM and domestic carbon pricing, while plant reporting is still spreadsheet-bound.",
    services: ["GHG Inventory (Scope 1 & 2)", "Product Carbon Footprint (PCF)", "Supplier ESG Assessment Portal"],
    journey: [
      { phase: "Baseline", detail: "Close the Scope 1 & 2 gaps plant by plant and get off spreadsheets." },
      { phase: "Quantify", detail: "Per-product footprints for the SKUs facing a carbon price at the border." },
      { phase: "Scale", detail: "Extend to suppliers, then automate the filings that consume the same data." },
    ],
  },
  "Healthcare & Pharma": {
    pressure:
      "Complex global sourcing and cold-chain logistics sit inside several reporting regimes at once, with traceability expected for every active ingredient.",
    services: ["Multi-Framework Auto-Reporting", "Life Cycle Assessment", "Double Materiality Assessment"],
    journey: [
      { phase: "Frame", detail: "Double materiality first — it decides which of the parallel regimes actually bind you." },
      { phase: "Model", detail: "LCA across cold chain and sourcing, where most of the footprint hides." },
      { phase: "Consolidate", detail: "Collapse CSRD, GRI and ISSB onto one dataset instead of three exercises." },
    ],
  },
  "Financial, IT & Investment": {
    pressure:
      "Financed emissions — Scope 3, Category 15 — now drive investor screening, and IFRS S1/S2 alignment is being asked for by LPs directly.",
    services: ["Multi-Framework Auto-Reporting", "Dashboards & Benchmarking Insights", "Ratings Optimisation"],
    journey: [
      { phase: "Position", detail: "Benchmark your disclosure quality against the peers your LPs compare you to." },
      { phase: "Automate", detail: "IFRS S1/S2 and TCFD from a single entry rather than parallel workstreams." },
      { phase: "Improve", detail: "Ratings work against the gaps that are actually costing you capital access." },
    ],
  },
  "Beverages & Consumer Goods": {
    pressure:
      "Upstream agriculture and packaging dominate the footprint, EUDR adds deforestation-free sourcing obligations, and retailers run their own scorecards.",
    services: ["Scope 3 Engine", "Supplier ESG Assessment Portal", "Ratings Optimisation"],
    journey: [
      { phase: "Trace", detail: "Map upstream agricultural and packaging emissions — the bulk of the footprint." },
      { phase: "Engage", detail: "Bring growers and packaging suppliers onto the portal with real support." },
      { phase: "Score", detail: "Convert verified data into the retailer and rating scorecards that gate shelf space." },
    ],
  },
  "Energy & Utilities": {
    pressure:
      "Direct emissions intensity sits under several overlapping carbon-pricing regimes at once, and decarbonisation decisions are capital-intensive.",
    services: [
      "GHG Inventory (Scope 1 & 2)",
      "SBTi Target Setting & Decarbonisation Roadmap",
      "Regulatory Change Monitoring",
    ],
    journey: [
      { phase: "Measure", detail: "Defensible Scope 1 & 2 with grid factors that survive an audit." },
      { phase: "Plan", detail: "SBTi-aligned roadmap costed against your capital plan, not separate from it." },
      { phase: "Track", detail: "Monitor the regimes you price against, because several are still moving." },
    ],
  },
};

export const REGION_PRESSURE = {
  "European Union": "CBAM is live at €75.36/tCO₂e and CSRD is in force — both run off one underlying dataset.",
  India: "BRSR Core assurance and CCTS binding targets both expect verified primary data.",
  "United Kingdom": "UK CBAM takes effect in January 2027, and the data work has to start well before that.",
  "Singapore & SEA": "SGX/ISSB reporting is mandatory and Vietnam's ETS is already live.",
  "Gulf Region": "The UAE Climate Law plus Qatar and Saudi disclosure regimes are advancing in parallel.",
  "Other / Global": "Across jurisdictions the strictest regime sets your data standard — plan to that, not the average.",
};

/* ------------------------------------------------------------------ *
 * 4. Package recommendation from dossier answers
 * ------------------------------------------------------------------ */

// Stage dominates: it describes scope of work more directly than anything else.
const STAGE_SCORE = {
  "First baseline — just starting": 0,
  "Scaling compliance & suppliers": 3,
  "Global, multi-framework operations": 6,
};

// Headcount is a proxy for how large the supplier network gets.
const SIZE_SCORE = { "Under 25": 0, "26–99": 1, "100–999": 2, "1000+": 3 };

// Sectors with multi-tier chains or overlapping carbon regimes need more scope.
const SECTOR_SCORE = {
  "Healthcare & Pharma": 2,
  "Energy & Utilities": 2,
  "Automotive & Transportation": 1,
  "Manufacturing & Industrial": 1,
  "Financial, IT & Investment": 1,
  "Beverages & Consumer Goods": 1,
};

// Regions where two or more regimes bind at once score higher.
const REGION_SCORE = {
  "European Union": 2,
  "Other / Global": 2,
  "United Kingdom": 1,
  "Singapore & SEA": 1,
  "Gulf Region": 1,
  India: 1,
};

/**
 * Turn dossier answers into a recommended package plus the reasoning behind it.
 * Pure and synchronous — the published site has no backend to ask.
 */
export function recommendPackage(answers = {}) {
  const { sector, region, stage, company_size: size } = answers;

  const score =
    (STAGE_SCORE[stage] ?? 0) +
    (SIZE_SCORE[size] ?? 0) +
    (SECTOR_SCORE[sector] ?? 1) +
    (REGION_SCORE[region] ?? 1);

  const tier = score <= 3 ? "Starter" : score <= 8 ? "Growth" : "Enterprise";

  // Only the inputs that actually pushed the result, phrased for a reader.
  const reasons = [];
  if (stage === "Global, multi-framework operations") {
    reasons.push("you're already running multi-framework operations globally");
  } else if (stage === "Scaling compliance & suppliers") {
    reasons.push("you're scaling beyond a first baseline into supplier engagement");
  } else if (stage) {
    reasons.push("you're establishing a first verified baseline");
  }
  if ((SIZE_SCORE[size] ?? 0) >= 2) reasons.push(`at ${size} people your supplier network is substantial`);
  if ((SECTOR_SCORE[sector] ?? 0) === 2) reasons.push(`${sector} carries overlapping regimes and deep sourcing`);
  if ((REGION_SCORE[region] ?? 0) === 2) {
    reasons.push(region === "Other / Global" ? "multi-jurisdiction exposure raises the bar" : "EU exposure means CBAM and CSRD together");
  }

  const playbook = SECTOR_PLAYBOOK[sector] || null;

  return {
    tier,
    score,
    reasons,
    pressure: playbook?.pressure || null,
    regionNote: REGION_PRESSURE[region] || null,
    journey: playbook?.journey || [],
    services: playbook?.services || [],
  };
}

/* ------------------------------------------------------------------ *
 * 5. What to recommend in the tray
 * ------------------------------------------------------------------ */

/**
 * Build the tray's suggestions from everything known about the visitor:
 * the line items they picked, the package they chose, and their dossier.
 * Anything already selected — or already inside the chosen package — is
 * filtered out, so every suggestion is genuinely additive.
 */
export function recommendFor({ tray = [], selectedPackage = null, dossier = null, limit = 3 } = {}) {
  const have = new Set(tray.map((t) => t.name));
  const covered = new Set(selectedPackage ? PACKAGE_COVERS[selectedPackage] || [] : []);
  const out = [];
  const seen = new Set();

  const push = (name, why, source) => {
    if (!name || have.has(name) || covered.has(name) || seen.has(name)) return;
    seen.add(name);
    out.push({ name, why, source });
  };

  // Pairings off what they've actually selected come first — most specific.
  tray.forEach((item) => (PAIRINGS[item.name] || []).forEach((p) => push(p.name, p.why, item.name)));

  // Then the gaps their package leaves open.
  if (selectedPackage) (PACKAGE_GAPS[selectedPackage] || []).forEach((p) => push(p.name, p.why, `${selectedPackage} package`));

  // Then the sector priorities from the dossier, for anyone who hasn't picked much.
  if (dossier?.sector) {
    const pb = SECTOR_PLAYBOOK[dossier.sector];
    (pb?.services || []).forEach((name) => push(name, `A priority for ${dossier.sector}.`, "your dossier"));
  }

  return out.slice(0, limit);
}
