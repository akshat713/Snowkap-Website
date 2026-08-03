#!/usr/bin/env node
/**
 * Fill src/i18n/generated/<lang>.json from src/i18n/strings.json using Claude.
 *
 * The site's copy lives in forty components and five data files, so hand-writing
 * six translations of six hundred fragments was never the right shape of work.
 * The hand-written dictionary in src/i18n/languages.js covers the chrome and the
 * headlines — the copy where wording is a brand decision — and this script covers
 * the rest.
 *
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/translate-strings.mjs
 *   ANTHROPIC_API_KEY=... node scripts/translate-strings.mjs de fr    # subset
 *
 * Idempotent: strings already present in a generated file are skipped, so
 * re-running after new copy lands only pays for the new copy. Delete a generated
 * file to force a full retranslation of that language.
 *
 * Anything in languages.js is excluded from the request — those are authored, and
 * the provider layers them over these results anyway, so translating them would
 * be paying for output that gets discarded.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const HERE = dirname(fileURLToPath(import.meta.url));
const I18N = join(HERE, "..", "src", "i18n");

const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5";
const BATCH = 40;

// Kept in step with LANGUAGES in src/i18n/languages.js.
const LANGS = {
  de: "German (de-DE)",
  fr: "French (fr-FR)",
  es: "Spanish (es-ES)",
  hi: "Hindi (hi-IN)",
  zh: "Simplified Chinese (zh-Hans)",
  ar: "Modern Standard Arabic (ar)",
};

const SYSTEM = `You translate website copy for Snowkap, a B2B ESG technology company selling to sustainability, finance and procurement leaders.

Rules, all of them hard:
- Return ONLY a JSON object mapping each input string to its translation. No prose, no code fence, no commentary.
- Every input key must appear in the output, spelled exactly as given.
- Keep the register: confident, specific, corporate but not stiff. This is copy a CFO reads, not a brochure.
- Do NOT translate: the company name Snowkap; client and partner names (JSW Steel, Daimler, Schaeffler, MAHLE, Ather, NRB Bearings, Himalaya, Senco Gold, Varun Beverages, Sutherland, KNPC, and any other company or person name); framework, standard and regulation acronyms (CBAM, CSRD, ESRS, BRSR, CCTS, GRI, IFRS, ISSB, TCFD, CDP, DJSI, SBTi, EUDR, SECR, SEBI, SGX, EcoVadis, Sustainalytics, GHG Protocol, ISO and ISAE numbers, LCA, PCF, MRV, ETS, XBRL, ERP, API, AI, ESG, EHS); institution names; job titles that are proper nouns.
- Keep numbers, currency symbols, units and figures exactly as they are: €75.36/tCO₂e stays €75.36/tCO₂e, "700+" stays "700+", "90%" stays "90%".
- Keep any leading or trailing punctuation and the sentence's own ending punctuation.
- Where a string is a fragment of a longer sentence (it may start lowercase or end without punctuation), translate it as a fragment. Do not add words to make it a sentence.
- Match length where you reasonably can: these strings sit in a fixed layout, and a translation twice as long breaks it.`;

async function translateBatch(client, lang, strings) {
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{
      role: "user",
      content:
        `Translate into ${LANGS[lang]}.\n\nInput strings as a JSON array:\n` +
        JSON.stringify(strings, null, 1),
    }],
  });
  const text = res.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  // Tolerate a stray fence even though the system prompt forbids one.
  const json = text.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "").trim();
  const parsed = JSON.parse(json);
  const out = {};
  for (const s of strings) {
    const v = parsed[s];
    // Drop anything the model skipped or echoed unchanged: an untranslated entry
    // in the dictionary is worse than no entry, because it stops the provider
    // falling back to the source.
    if (typeof v === "string" && v.trim() && v.trim() !== s.trim()) out[s] = v.trim();
  }
  return out;
}

async function main() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error("ANTHROPIC_API_KEY is not set. This script calls the Anthropic API and cannot run without it.");
    process.exit(1);
  }

  const strings = JSON.parse(readFileSync(join(I18N, "strings.json"), "utf8"));
  // The authored dictionary, read as source text so this script needs no bundler
  // to import it. Its keys are the double-quoted strings on the left of a colon.
  const src = readFileSync(join(I18N, "languages.js"), "utf8");
  const authored = new Set();
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)) {
    try { authored.add(JSON.parse(`"${m[1]}"`)); } catch { /* not a plain string key */ }
  }

  const targets = process.argv.slice(2).filter((a) => LANGS[a]);
  const langs = targets.length ? targets : Object.keys(LANGS);
  const client = new Anthropic({ apiKey: key });

  for (const lang of langs) {
    const path = join(I18N, "generated", `${lang}.json`);
    const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
    const todo = strings.filter((s) => !existing[s] && !authored.has(s));

    if (!todo.length) {
      console.log(`${lang}: nothing to do (${Object.keys(existing).length} entries)`);
      continue;
    }
    console.log(`${lang}: ${todo.length} strings to translate in ${Math.ceil(todo.length / BATCH)} batches`);

    for (let i = 0; i < todo.length; i += BATCH) {
      const slice = todo.slice(i, i + BATCH);
      try {
        Object.assign(existing, await translateBatch(client, lang, slice));
      } catch (e) {
        console.error(`  batch ${i / BATCH + 1} failed: ${e.message}`);
        continue;
      }
      // Written after every batch, so an interrupted run loses one batch rather
      // than the whole language.
      writeFileSync(
        path,
        JSON.stringify(Object.fromEntries(Object.entries(existing).sort(([a], [b]) => a.localeCompare(b))), null, 1) + "\n"
      );
      console.log(`  ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
