import { LANG_CODES } from "./languages";

// Working out what language a visitor probably reads, from three signals in
// increasing order of cost.
//
// 1. The browser's own language list. This is the strongest signal there is —
//    the visitor set it — and it costs nothing.
// 2. The IANA time zone, via Intl. This is a location signal derived locally:
//    Asia/Kolkata is India whether or not the browser is set to Hindi, and it
//    needs no third party and no network request. It is what makes "based on
//    location" work without shipping every visitor's IP to someone else.
// 3. An IP geolocation lookup, but ONLY if REACT_APP_GEO_ENDPOINT is configured.
//    Off by default on purpose: an unconditional call would send every visitor's
//    address to a third party for a signal the first two usually already give,
//    and it would block the first paint on a network round trip.
//
// The result is a suggestion, never a decision. The provider offers it and the
// visitor accepts or declines; an explicit choice always wins and is remembered.

// Time zones → the language most likely to be read there. Keyed on region, or on
// the specific zone where a region spans languages.
const ZONE_LANG = {
  // German-speaking Europe — Snowkap's EU entry markets
  "Europe/Berlin": "de", "Europe/Vienna": "de", "Europe/Zurich": "de", "Europe/Busingen": "de",
  // French
  "Europe/Paris": "fr", "Europe/Brussels": "fr", "Europe/Luxembourg": "fr", "Europe/Monaco": "fr",
  "Africa/Casablanca": "fr", "Africa/Abidjan": "fr", "Africa/Dakar": "fr",
  // Spanish
  "Europe/Madrid": "es", "America/Mexico_City": "es", "America/Bogota": "es",
  "America/Lima": "es", "America/Santiago": "es", "America/Argentina/Buenos_Aires": "es",
  // India
  "Asia/Kolkata": "hi", "Asia/Calcutta": "hi",
  // Greater China
  "Asia/Shanghai": "zh", "Asia/Chongqing": "zh", "Asia/Harbin": "zh",
  "Asia/Taipei": "zh", "Asia/Hong_Kong": "zh", "Asia/Macau": "zh", "Asia/Singapore": "zh",
  // Gulf and the wider Arabic-reading region
  "Asia/Dubai": "ar", "Asia/Riyadh": "ar", "Asia/Qatar": "ar", "Asia/Bahrain": "ar",
  "Asia/Kuwait": "ar", "Asia/Muscat": "ar", "Asia/Baghdad": "ar", "Asia/Amman": "ar",
  "Asia/Beirut": "ar", "Africa/Cairo": "ar", "Africa/Tunis": "ar", "Africa/Algiers": "ar",
  "Africa/Tripoli": "ar", "Africa/Khartoum": "ar",
};

// ISO country → language, for the optional IP lookup.
const COUNTRY_LANG = {
  DE: "de", AT: "de", CH: "de", LI: "de",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr", MA: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", UY: "es", EC: "es",
  IN: "hi",
  CN: "zh", TW: "zh", HK: "zh", MO: "zh", SG: "zh",
  AE: "ar", SA: "ar", QA: "ar", BH: "ar", KW: "ar", OM: "ar", JO: "ar",
  LB: "ar", EG: "ar", IQ: "ar", TN: "ar", DZ: "ar", LY: "ar", SD: "ar",
};

const supported = (code) => (code && LANG_CODES.includes(code) ? code : null);

/** The base language of a BCP-47 tag: "de-AT" → "de", "zh-Hans-CN" → "zh". */
const base = (tag) => String(tag || "").toLowerCase().split("-")[0];

export function fromNavigator() {
  const list = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language];
  for (const tag of list) {
    // English is an answer, not a miss — stop looking rather than falling through
    // to a second, weaker preference further down the list.
    const b = base(tag);
    if (b === "en") return "en";
    const hit = supported(b);
    if (hit) return hit;
  }
  return null;
}

export function fromTimeZone() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return supported(ZONE_LANG[zone]);
  } catch {
    return null;
  }
}

/**
 * Optional IP geolocation. Requires REACT_APP_GEO_ENDPOINT to return JSON
 * carrying a two-letter country code under `country`, `country_code` or
 * `countryCode` — the shape every common geo service uses.
 */
export async function fromIp(signal) {
  const endpoint = process.env.REACT_APP_GEO_ENDPOINT;
  if (!endpoint) return null;
  try {
    const res = await fetch(endpoint, { signal });
    if (!res.ok) return null;
    const j = await res.json();
    const cc = String(j.country_code || j.countryCode || j.country || "").toUpperCase().slice(0, 2);
    return supported(COUNTRY_LANG[cc]);
  } catch {
    return null;
  }
}

/**
 * The suggestion.
 *
 * Location leads. Someone in Dubai on a laptop that shipped with en-US has
 * Asia/Dubai resolved and English requested, and Arabic is worth *offering* —
 * en-US is very often a factory default rather than a decision, and the offer
 * costs the reader one click to decline, permanently. Where the time zone says
 * nothing (most of the English-speaking world is not in the table) the browser's
 * own list decides, which is the strongest signal available.
 *
 * Note this only ever produces an offer. Nothing here changes what a visitor
 * sees; TranslationProvider surfaces the result in the banner and waits.
 */
export function detectSync() {
  return fromTimeZone() || fromNavigator() || "en";
}
