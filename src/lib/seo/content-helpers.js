/**
 * NameVerse SEO Content Engine (PRO VERSION)
 * Goals:
 * - Remove template footprint
 * - Increase content uniqueness at scale
 * - Reduce "crawled - not indexed"
 * - Improve semantic variation
 * - Improve Google trust signals
 */

const SITE_NAME = "NameVerse";

/* -----------------------------------
   UTILS
----------------------------------- */
function clean(text = "") {
  return String(text)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * deterministic variation (prevents random instability)
 */
function stableHash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick(arr, seed = 0) {
  return arr[seed % arr.length];
}

/* -----------------------------------
   VARIATION BANK (ANTI-TEMPLATE CORE FIX)
----------------------------------- */
const INTRO_STYLES = [
  (n, g, o, m) =>
    `${n} is a ${g || "personal"} name rooted in ${o || "diverse cultural traditions"}. It carries the meaning "${m}".`,

  (n, g, o, m) =>
    `The name ${n} comes from ${o || "multiple linguistic backgrounds"} and is used as a ${g || "personal"} name. Its meaning is "${m}".`,

  (n, g, o, m) =>
    `${n} is traditionally associated with ${o || "cultural heritage"} and is given as a ${g || "personal"} name meaning "${m}".`,
];

const CULTURE_STYLES = [
  (n, r, o) =>
    `In ${r || "cultural"} naming traditions, ${n} reflects historical linguistic roots connected to ${o || "regional heritage"}.`,

  (n, r, o) =>
    `${n} has been used across ${r || "different"} communities and reflects naming customs influenced by ${o || "language evolution"}.`,
];

const FAQ_TONE = [
  "commonly understood",
  "often interpreted",
  "traditionally associated",
  "widely considered",
];

/* -----------------------------------
   INTRO (UPGRADED: NON-TEMPLATE STYLE)
----------------------------------- */
export function generateNameIntroduction(name) {
  const n = clean(name.name);
  const g = clean(name.gender);
  const o = clean(name.origin);
  const r = clean(name.religion);
  const m = clean(name.short_meaning || name.meaning || "cultural significance");

  const seed = stableHash(n + r);

  const intro = pick(INTRO_STYLES, seed)(n, g, o, m);

  const extra = [];

  if (name.emotional_traits?.length) {
    extra.push(
      `${n} is sometimes associated with qualities such as ${name.emotional_traits.slice(0, 2).join(", ")} in different cultural interpretations.`
    );
  }

  return [intro, extra.join(" ")].filter(Boolean).join(" ");
}

/* -----------------------------------
   WHY SECTION (LESS SEO-SPAM STYLE)
----------------------------------- */
export function generateWhyChooseContent(name) {
  const n = clean(name.name);
  const seed = stableHash(n);

  const blocks = [];

  if (name.spiritual_meaning) {
    blocks.push(`Spiritual layer: ${name.spiritual_meaning}`);
  }

  if (name.cultural_impact) {
    blocks.push(
      `Cultural usage: ${name.cultural_impact.slice(0, 160)}`
    );
  }

  if (name.lucky_number || name.lucky_day || name.lucky_stone) {
    const lucky = [];
    if (name.lucky_number) lucky.push(`number ${name.lucky_number}`);
    if (name.lucky_day) lucky.push(`day ${name.lucky_day}`);
    if (name.lucky_stone) lucky.push(`stone ${name.lucky_stone}`);

    blocks.push(`Traditional associations include ${lucky.join(", ")}.`);
  }

  return blocks.join("\n\n");
}

/* -----------------------------------
   PRONUNCIATION (SIMPLIFIED + NATURAL)
----------------------------------- */
export function generatePronunciationGuide(name) {
  const n = clean(name.name);

  const p = name.pronunciation || {};

  const lines = [];

  if (p.english) lines.push(`English: ${p.english}`);
  if (p.urdu) lines.push(`Urdu: ${p.urdu}`);
  if (p.arabic) lines.push(`Arabic: ${p.arabic}`);
  if (p.hindi) lines.push(`Hindi: ${p.hindi}`);

  return lines.length
    ? `How to pronounce ${n}\n\n${lines.join("\n")}`
    : `${n} is pronounced naturally across different languages.`;
}

/* -----------------------------------
   FAQ (FIXED: LESS TEMPLATE FOOTPRINT)
----------------------------------- */
export function generateNameFAQ(name) {
  const n = clean(name.name);
  const tone = pick(FAQ_TONE, stableHash(n));

  return [
    {
      question: `What does ${n} mean?`,
      answer: `${n} is ${tone} associated with "${name.short_meaning || name.meaning || "cultural meaning"}".`,
    },
    {
      question: `Where does ${n} come from?`,
      answer: `${n} originates from ${name.origin || "historical linguistic traditions"} and is used in ${name.religion || "multiple"} cultures.`,
    },
    {
      question: `Is ${n} a good name?`,
      answer: `${n} is widely chosen due to its meaning, cultural relevance, and naming tradition significance.`,
    },
    {
      question: `Are there similar names to ${n}?`,
      answer:
        name.similar_sounding_names?.length
          ? name.similar_sounding_names.slice(0, 4).join(", ")
          : `Similar names exist within the same cultural category.`,
    },
  ];
}

/* -----------------------------------
   CULTURAL CONTEXT (REDUCED DUPLICATION)
----------------------------------- */
export function generateCulturalContext(name) {
  const n = clean(name.name);
  const r = clean(name.religion);
  const o = clean(name.origin);

  const seed = stableHash(n + r);

  return pick(CULTURE_STYLES, seed)(n, r, o);
}

/* -----------------------------------
   CONCLUSION (LESS SEO FOOTPRINT)
----------------------------------- */
export function generateConclusion(name) {
  const n = clean(name.name);

  return `${n} connects cultural naming traditions with modern usage. Its meaning and origin make it a recognizable name across different communities.`;
}

/* -----------------------------------
   CONTENT INTRO (SIMPLIFIED)
----------------------------------- */
export function generateContentIntroduction(content) {
  if (!content?.name) return "";

  const n = clean(content.name);

  return `${n} is explored across meaning, origin, and cultural context to understand its linguistic background and usage.`;
}

/* -----------------------------------
   TABLE OF CONTENTS (UNCHANGED - SAFE)
----------------------------------- */
export function generateTableOfContents(headings) {
  if (!headings?.length) return "";

  const items = headings
    .map(
      (h) =>
        `<li><a href="#${h.id}">${h.text}</a></li>`
    )
    .join("\n");

  return `<nav><ol>${items}</ol></nav>`;
}

/* -----------------------------------
   DEFAULT EXPORT
----------------------------------- */
export default {
  generateNameIntroduction,
  generateWhyChooseContent,
  generatePronunciationGuide,
  generateNameFAQ,
  generateCulturalContext,
  generateConclusion,
  generateContentIntroduction,
  generateTableOfContents,
};