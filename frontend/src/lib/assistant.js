// The Snowkap assistant, answering from the site's own content.
//
// Why this exists
// ---------------
// The widget was built against POST /api/chat/stream, which needs a server
// holding EMERGENT_LLM_KEY. The site is published on GitHub Pages, which is
// static hosting with no server, and REACT_APP_BACKEND_URL still points at an
// ephemeral Emergent preview host. So every message failed and the visitor got
// an apology. Moving the key into the bundle would have made it work today and
// published the key to anyone who opened devtools, so that was never an option.
//
// This answers from the same static content the pages are built from — the FAQ,
// the three pillars, all 21 services with their blurbs, packages and what each
// covers, the six sector playbooks, the five regional regimes, the frameworks,
// the proof numbers, the team and the resource library. Roughly 90 passages, all
// already in the bundle, so there is nothing to host, no key to leak, and no
// per-message cost.
//
// It retrieves rather than generates. It cannot improvise, and it will say so
// when it has nothing; what it does say is drawn verbatim from copy the company
// has already approved, which for a company site is arguably the better
// trade — an LLM with no retrieval will confidently invent a price.
//
// If a real backend appears, ChatWidget prefers it automatically and this
// becomes the fallback. Nothing here needs changing for that.

import { FAQS, PILLARS3, MODULES, METRICS, JOURNEY, TEAM, ADVISORS, TESTIMONIALS } from "@/data/content";
import { ADDONS, PACKAGES, SECTORS, REGIONS, FORCES, STANDARDS, ACTIVATION_PROOF, ACTIVATION_ROI, ACTIVATION_EDGE } from "@/data/site";
import { SECTOR_PLAYBOOK, PACKAGE_COVERS } from "@/data/recommendations";
import { RESOURCES } from "@/data/resources";

// Kept in step with _BLOCK_PATTERNS in backend/server.py, so the boundary holds
// whichever path answers. A visitor should not be able to get code out of this
// by waiting for the backend to go down.
const BLOCKED = new RegExp(
  "(ignore (all |your |the )?(previous|prior|above) (instruction|prompt|rule)" +
    "|disregard (all |your |the )?(previous|prior|above)" +
    "|system prompt|your instructions|repeat (your|the) (prompt|instructions)" +
    "|developer mode|jailbreak|DAN mode" +
    "|you are now|pretend (to be|you are)|act as (a|an) (?!esg|sustainability)" +
    "|write (me )?(a |an )?(script|program|function|code|sql|query|regex)" +
    "|(python|javascript|java|c\\+\\+|bash|sql|html|css) (code|script|function|program)" +
    "|debug (this|my) (code|script)|fix (this|my) code" +
    "|write (me )?(a|an) (essay|poem|story|song|cv|resume|cover letter)" +
    "|translate (this|the following)" +
    ")",
  "i"
);

export const REFUSAL =
  "I only cover Snowkap and ESG — the platform, our advisory and managed support, " +
  "the frameworks we report against, and what clients achieve with us. " +
  "Ask me anything in that space and I'll help. For anything else, " +
  "sales@snowkap.com is the right door.";

const STOP = new Set(
  ("a an and are as at be by do does for from has have how i in is it its me my of on or our " +
    "so that the their them there they this to us we what when where which who why will with you your " +
    "can could would should tell explain about please give show " +
    // Generic asking-words. They carry no topic, and leaving them in wrecked the
    // coverage gate below: "how much does it cost" would score half its terms as
    // unmatched purely because "much" appears nowhere in the copy.
    "much many long take takes need needs want know like get got make made use used " +
    "does doing done work works working help helps thing things lot really actually").split(" ")
);

// Query terms and document terms have to normalise to the same token, or
// "Scope 3" in a question never matches "Scope 3" in the copy. Framework names
// are the ones that matter most here, because they are how people actually ask.
const SYNONYMS = {
  cost: "pricing", costs: "pricing", price: "pricing", prices: "pricing", pricing: "pricing",
  expensive: "pricing", budget: "pricing", quote: "pricing", "£": "pricing", cheap: "pricing",
  scope3: "scope 3", "scope-3": "scope 3",
  co2: "carbon", ghg: "carbon", emission: "emissions", footprint: "carbon",
  supplier: "suppliers", vendor: "suppliers", vendors: "suppliers", tier: "suppliers",
  framework: "frameworks", report: "reporting", reports: "reporting", disclose: "disclosure",
  disclosures: "disclosure", audit: "assurance", audited: "assurance", assured: "assurance",
  demo: "demo", trial: "demo", onboard: "onboarding", onboarded: "onboarding",
  sector: "sectors", industry: "sectors", industries: "sectors",
  region: "regions", country: "regions", geography: "regions",
  // No mapping for "who": as a generic question word it dragged unrelated
  // questions onto the team page ("who won the world cup" scored on it). The team
  // passage carries "who" in its own keywords instead, so the intent still lands.
  team: "team", founder: "team", founders: "team", leadership: "team",
  secure: "security", safe: "security", privacy: "security", gdpr: "security",
  integrate: "integration", integrations: "integration", api: "integration", erp: "integration",
  start: "getting started", begin: "getting started", "get started": "getting started",
};

const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9+₂%€.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// `expand` is the crucial asymmetry: synonyms map a visitor's wording onto the
// site's wording, so they belong on the query only. Applied to documents as well,
// they fire in reverse — "leadership" in the title "Board & Leadership Briefings"
// became the token "team", and that service outranked the actual team page for
// "who is on your team".
function tokens(text, expand = false) {
  const t = norm(text);
  const raw = t.split(" ").filter(Boolean);
  const out = [];
  for (const w of raw) {
    // Keep the literal word *and* add its mapped form. Replacing it outright
    // broke exact matches in the other direction: "onboarded" mapped to
    // "onboarding", which stopped matching the copy that literally says
    // "700+ suppliers onboarded".
    const pieces = [w];
    if (expand && SYNONYMS[w]) pieces.push(...SYNONYMS[w].split(" "));
    for (const piece of pieces) {
      if (piece && !STOP.has(piece) && piece.length > 1) out.push(piece);
    }
  }
  // Two-word phrases as their own terms, so "scope 3" and "managed support"
  // score as units rather than as loose words that appear all over the copy.
  for (let i = 0; i < raw.length - 1; i++) {
    const bi = `${raw[i]} ${raw[i + 1]}`;
    if (!STOP.has(raw[i]) || !STOP.has(raw[i + 1])) out.push(bi);
  }
  return out;
}

const money = (p) => (p.price === "Custom" ? "priced to your supply chain" : `${p.price}${p.cadence}`);

// ---------------------------------------------------------------------------
// The corpus. Every passage is copy that already exists on the site.
// ---------------------------------------------------------------------------
function buildCorpus() {
  const docs = [];
  const add = (id, title, body, extra = "", follow = []) =>
    docs.push({ id, title, body, hay: `${title} ${body} ${extra}`, follow });

  FAQS.forEach((f, i) => add(`faq-${i}`, f.q, f.a, "faq question"));

  PILLARS3.forEach((p) =>
    add(
      `pillar-${p.n}`,
      p.title,
      `${p.desc} It covers ${p.items.join(", ")}.`,
      `${p.tag} pillar capability offering what we do`,
      ["What does the platform cover?", "How much does it cost?"]
    )
  );

  MODULES.forEach((m, i) =>
    add(`module-${i}`, m.title, m.body, "platform product feature module capability")
  );

  Object.entries(ADDONS).forEach(([pillar, items]) =>
    items.forEach((s) =>
      add(
        `svc-${s.name}`,
        s.name,
        `${s.blurb} It sits under ${pillar}, and you can add it to a programme on the pricing page.`,
        `service offering ${pillar}`,
        ["How much does it cost?", "What's in the Growth package?"]
      )
    )
  );

  PACKAGES.forEach((p) =>
    add(
      `pkg-${p.id}`,
      `${p.id} package`,
      `${p.desc} ${money(p.price === "Custom" ? p : p)} — ${p.note.toLowerCase()}. It includes ${p.features.join("; ")}.`,
      `pricing package tier plan ${p.tagline} ${(PACKAGE_COVERS[p.id] || []).join(" ")}`,
      ["What's not included?", "Can I add services to a package?"]
    )
  );

  add(
    "pricing-overview",
    "How pricing works",
    `Three tiers. ${PACKAGES.map((p) => `${p.id} at ${money(p)}`).join(", ")}. ` +
      "Every price is an indicative starting point — the programme builder on the pricing page turns a selection into a scoped brief rather than a bill, and you can build line by line from all 21 services instead of taking a tier.",
    "pricing cost how much budget quote packages",
    ["What's in the Growth package?", "Can I build a custom programme?"]
  );

  // Overview passages. Without them, "what sectors do you serve?" matched six
  // individual sector pages weakly and cleared none of them — the general form of
  // the question needs a doc that answers the general question.
  add(
    "sectors-overview",
    "Sectors we serve",
    `Six: ${SECTORS.map((s) => s.name).join(", ")}. Each one arrives with different pressure, so the ` +
      "starting point differs — ask me about yours and I'll give you the specifics, or use Find Your Sector on the home page.",
    "sectors industries verticals which who do you serve work with",
    ["Do you work with automotive companies?", "Which frameworks apply to us?"]
  );

  add(
    "regions-overview",
    "Regions and regimes we cover",
    `Five: ${REGIONS.map((r) => `${r.name} (${r.note})`).join("; ")}. ` +
      "Each moves on its own timeline and often demands the same underlying data, which is the whole reason for one data entry across frameworks.",
    "regions regimes countries geographies where do you operate global coverage",
    ["Which frameworks does Snowkap support?"]
  );

  add(
    "cbam",
    "CBAM — the EU carbon border adjustment",
    "CBAM prices the embedded carbon in imported goods at the EU border. The certificate price is €75.36/tCO₂e as of Q1 2026, and UK CBAM follows in January 2027. " +
      "Where you cannot supply verified primary data, the regulator applies default values — which assume the worst case, so a data gap becomes a line item rather than a reporting problem. " +
      "We compute cradle-to-border product footprints, run CBAM Certificate Computation off that same data, and activate the suppliers the numbers depend on. " +
      "On 10,000 tonnes, verified primary data instead of defaults is roughly €612K a year.",
    "cbam border carbon adjustment mechanism eu import steel aluminium certificate exposure affect business tariff",
    ["What is Product Carbon Footprint?", "How do you handle Scope 3 data?"]
  );

  SECTORS.forEach((s) => {
    const play = SECTOR_PLAYBOOK[s.name];
    add(
      `sector-${s.id}`,
      s.name,
      `${s.note} ${play ? play.pressure : ""} The pressures we see most: ${s.bullets.join("; ")}.` +
        (play ? ` We would usually start with ${play.services.join(", ")}.` : ""),
      `sector industry vertical ${s.id}`,
      ["What would our first step be?", "Which frameworks apply to us?"]
    );
  });

  REGIONS.forEach((r) =>
    add(
      `region-${r.code}`,
      r.name,
      `${r.note}. Status: ${r.status}.`,
      `region regulation regime ${r.code} compliance`,
      ["Which frameworks does Snowkap support?"]
    )
  );

  FORCES.forEach((f) => add(`force-${f.n}`, f.title, f.body, "pressure why now driver market"));

  add(
    "frameworks",
    "Frameworks and standards we support",
    STANDARDS.map((g) => `${g.group}: ${g.items.join(", ")}`).join(". ") +
      ". One data entry auto-populates every applicable framework, with a live regulation watch tracking updates.",
    "frameworks standards csrd brsr gri cbam ifrs tcfd cdp ecovadis reporting compliance disclosure",
    ["How does CBAM affect my business?", "How do you handle Scope 3?"]
  );

  add(
    "managed-activation",
    "Managed Supplier Activation — why software alone isn't enough",
    `A meaningful share of suppliers across emerging markets never respond to a self-serve portal. ` +
      ACTIVATION_PROOF.map((r) => `${r.label}: ${r.value}`).join(". ") +
      `. ${ACTIVATION_ROI.figure} ${ACTIVATION_ROI.caption} — ${ACTIVATION_ROI.body} ` +
      ACTIVATION_EDGE.map((e) => `${e.title}: ${e.body}`).join(" "),
    "suppliers response rate activation managed support people problem roi payback",
    ["How do you handle Scope 3 data?", "What does onboarding look like?"]
  );

  add(
    "proof",
    "Proof — footprints, suppliers and clients to date",
    METRICS.map((m) => `${m.prefix || ""}${m.value.toLocaleString()}${m.suffix} ${m.label.toLowerCase()}`).join(", ") +
      ". Clients span automotive, manufacturing, pharma, financial services, consumer goods and energy.",
    "proof numbers results outcomes achieved achievements impact track record clients customers delivered onboarded counts scale volume",
    ["Who are your customers?", "What have clients achieved?"]
  );

  add(
    "journey",
    "How an engagement runs",
    JOURNEY.map((j) => `${j.step}: ${j.body}`).join(" ") +
      " Guided onboarding takes you from setup to first report, with a dedicated onboarding manager and embedded support from day one.",
    "journey process onboarding implementation timeline what happens getting started steps",
    ["How long does a baseline take?", "How much does it cost?"]
  );

  add(
    "company",
    "About Snowkap",
    "Snowkap is a global ESG technology company combining expert advisory, an AI-powered platform, and embedded managed support — converting ESG complexity into measurable business performance. We operate across India, the GCC, SE Asia and Europe, with teams embedded in the manufacturing regions that feed global supply chains.",
    "about company who snowkap what do you do offices locations",
    ["What are the three pillars?", "Who is on the team?"]
  );

  add(
    "team",
    "Team and advisors",
    `Leadership: ${TEAM.map((t) => `${t.name} (${t.role})`).join(", ")}. ` +
      `Advisory board: ${ADVISORS.map((a) => `${a.name} — ${a.role}`).join(", ")}.`,
    "team leadership founders who runs advisors board people",
    ["About Snowkap", "Can I talk to someone?"]
  );

  add(
    "clients-say",
    "What clients say",
    TESTIMONIALS.map((t) => `${t.name}, ${t.role} at ${t.company}: "${t.quote}"`).join(" "),
    "testimonial reference quote clients say customers experience achieved outcomes results",
    ["Who are your customers?"]
  );

  add(
    "contact",
    "Getting in touch with Snowkap",
    "Use the Book a Demo button below this chat and someone will come back to you within one business day, or email sales@snowkap.com. For anything about an existing engagement, support@snowkap.com. You can also leave your work email here and I'll pass it on.",
    "contact demo call talk sales email advisor meeting book",
    []
  );

  RESOURCES.forEach((r) =>
    add(
      `res-${r.slug}`,
      r.title,
      `${r.excerpt} Read it under Resources${r.category ? ` (${r.category})` : ""}.`,
      `resource ${r.category} ${(r.tags || []).join(" ")}`,
      []
    )
  );

  return docs;
}

const CORPUS = buildCorpus();

// Inverse document frequency, so a term like "esg" — which is in almost every
// passage — cannot outweigh a term like "cbam" that identifies one.
const IDF = (() => {
  const df = new Map();
  CORPUS.forEach((d) => {
    new Set(tokens(d.hay)).forEach((t) => df.set(t, (df.get(t) || 0) + 1));
  });
  const n = CORPUS.length;
  const map = new Map();
  df.forEach((count, term) => map.set(term, Math.log(1 + n / count)));
  return map;
})();

// Every token the corpus knows. A question whose topic words are mostly absent
// from it is not a question this assistant can answer, however well one stray
// word happens to score — that is what let "what is the capital of France?" be
// answered out of the Capital Market Access passage.
const VOCAB = (() => {
  const v = new Set();
  CORPUS.forEach((d) => tokens(d.hay).forEach((t) => v.add(t)));
  return v;
})();

const PREPARED = CORPUS.map((d) => ({
  ...d,
  titleTerms: new Set(tokens(d.title)),
  hayTerms: new Set(tokens(d.hay)),
}));

function rank(query) {
  const qt = tokens(query, true);
  if (!qt.length) return [];
  const seen = new Set();
  const terms = qt.filter((t) => (seen.has(t) ? false : seen.add(t)));

  return PREPARED.map((d) => {
    let score = 0;
    for (const t of terms) {
      const idf = IDF.get(t) ?? Math.log(1 + CORPUS.length);
      // A hit in the title is a much stronger signal than one in the body.
      if (d.titleTerms.has(t)) score += 3.2 * idf;
      else if (d.hayTerms.has(t)) score += 1.0 * idf;
    }
    // Normalise lightly by term count so a long passage does not win on length
    // alone, but not fully, or a one-line service blurb beats the FAQ entry that
    // actually answers the question.
    return { doc: d, score: score / Math.sqrt(2 + d.hayTerms.size / 30) };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

const DEFAULT_FOLLOWUPS = [
  "What does the Snowkap platform do?",
  "How do you handle Scope 3 data?",
  "How does pricing work?",
];

/**
 * Answer a visitor message from the site's own content.
 * @returns {{text: string, suggestions: string[], kind: "refusal"|"answer"|"unknown"}}
 */
export function answerLocally(message) {
  const q = String(message || "").trim();
  if (!q) return { text: REFUSAL, suggestions: DEFAULT_FOLLOWUPS, kind: "refusal" };
  if (BLOCKED.test(q)) return { text: REFUSAL, suggestions: DEFAULT_FOLLOWUPS, kind: "refusal" };

  // The panel invites "or drop your email in the chat", so an address has to be
  // acknowledged. Without this it fell through to "I don't have that on hand",
  // which breaks a promise the interface just made and loses the lead. The
  // handoff is Book a Demo, because with no backend there is nothing here that
  // can post the address anywhere.
  const email = q.match(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/);
  if (email) {
    return {
      text:
        `Thanks — ${email[0]}. I can't pass that to the team from here, so the quickest route is the ` +
        `Book a Demo button just below this chat: it goes straight to them with your address, and ` +
        `someone comes back within one business day. sales@snowkap.com reaches them directly too. ` +
        `In the meantime, ask me anything about the platform, the services or pricing.`,
      suggestions: ["How does pricing work?", "What does the Snowkap platform do?"],
      kind: "lead",
    };
  }

  // Unigram topic words only — bigrams would double-count and generic asking
  // words are already gone.
  const topic = [...new Set(tokens(q, true).filter((t) => !t.includes(" ")))];
  const known = topic.filter((t) => VOCAB.has(t));
  const coverage = topic.length ? known.length / topic.length : 0;

  const hits = rank(q);
  const best = hits[0];

  // Threshold, not just best-match. Without one, an off-topic question would be
  // answered with whichever passage happened to share a stray word, which reads
  // far worse than admitting there is nothing.
  if (!best || best.score < 1.15 || (topic.length > 1 && coverage <= 0.5)) {
    return {
      text:
        "I don't have that on hand. I can cover the platform and what it does, our advisory and " +
        "managed support, any of the 21 services and how they're packaged, the frameworks we " +
        "report against — CBAM, CSRD, BRSR, GRI, IFRS and more — the sectors and regions we work " +
        "in, and what clients have achieved. For anything outside that, sales@snowkap.com reaches " +
        "the team directly.",
      suggestions: DEFAULT_FOLLOWUPS,
      kind: "unknown",
    };
  }

  let text = best.doc.body;
  // A clearly-second relevant passage gets one appended line. More than that and
  // the reply becomes a wall rather than an answer.
  const second = hits[1];
  if (second && second.score > best.score * 0.62 && second.doc.id !== best.doc.id) {
    text += `\n\nAlso relevant — ${second.doc.title}: ${second.doc.body}`;
  }

  const suggestions = (best.doc.follow.length ? best.doc.follow : DEFAULT_FOLLOWUPS)
    .filter((s) => norm(s) !== norm(q))
    .slice(0, 3);

  return { text, suggestions, kind: "answer" };
}

// Exposed for the test harness, so coverage can be checked without a browser.
export const __corpusSize = CORPUS.length;
