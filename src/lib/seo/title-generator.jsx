/**
 * NAME PAGE SEO TITLE + DESCRIPTION GENERATOR
 * Optimized for search intent, CTR, and stable per-name variation.
 */

const RELIGION_LABELS = {
  islamic: {
    display: 'Islamic',
    tradition: 'Islamic',
    defaultOrigin: 'Arabic',
  },
  christian: {
    display: 'Christian',
    tradition: 'Christian',
    defaultOrigin: 'Biblical',
  },
  hindu: {
    display: 'Hindu',
    tradition: 'Hindu',
    defaultOrigin: 'Sanskrit',
  },
};

const TITLE_LIMIT = 58;
const DESCRIPTION_MIN = 145;
const DESCRIPTION_MAX = 155;

function cleanText(text = '') {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '')
    .trim();
}

function normalizeReligion(religion) {
  const r = String(religion || '').toLowerCase();
  if (r === 'islam' || r === 'muslim' || r === 'islamic') return 'islamic';
  if (r === 'christianity' || r === 'christian') return 'christian';
  if (r === 'hinduism' || r === 'hindu') return 'hindu';
  return RELIGION_LABELS[r] ? r : 'islamic';
}

function getReligionLabel(religion) {
  return RELIGION_LABELS[normalizeReligion(religion)]?.display || 'Islamic';
}

function getOrigin(data) {
  return cleanText(data.origin) || RELIGION_LABELS[normalizeReligion(data.religion)]?.defaultOrigin || '';
}

function extractCoreMeaning(meaning) {
  const text = cleanText(meaning);
  if (!text) return '';

  const parts = text
    .split(/[,·|;\n.]/)
    .map(part => cleanText(part))
    .filter(Boolean);

  const core = cleanText(parts[0] || text);
  return cleanText(capitalize(core).replace(/^the name means\s+/i, ''))
    .split(/\s+/)
    .slice(0, 5)
    .join(' ');
}

function capitalize(text = '') {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hasPersonality(data) {
  return Boolean(
    (Array.isArray(data.emotional_traits) && data.emotional_traits.length > 0) ||
    (Array.isArray(data.hidden_personality_traits) && data.hidden_personality_traits.length > 0) ||
    cleanText(data.personality_traits)
  );
}

function getPersonalitySummary(data) {
  const traits = [];
  if (Array.isArray(data.emotional_traits)) {
    traits.push(...data.emotional_traits.map(cleanText).filter(Boolean));
  }
  if (Array.isArray(data.hidden_personality_traits)) {
    traits.push(...data.hidden_personality_traits.map(cleanText).filter(Boolean));
  }
  if (cleanText(data.personality_traits)) {
    traits.push(cleanText(data.personality_traits));
  }
  return traits.slice(0, 3).join(', ');
}

function getTranslationLanguage(data, religion) {
  const normalizedReligion = normalizeReligion(religion || data.religion);

  if (data.in_urdu?.meaning || data.in_urdu?.name) return 'Urdu';
  if (normalizedReligion === 'hindu' && (data.in_hindi?.meaning || data.in_hindi?.name)) return 'Hindi';
  if (normalizedReligion === 'christian' && (data.in_english?.meaning || data.in_english?.name)) return 'English';
  if (data.in_arabic?.meaning || data.in_arabic?.name) return 'Arabic';
  if (data.in_sanskrit?.meaning || data.in_sanskrit?.name) return 'Sanskrit';
  if (data.in_hindi?.meaning || data.in_hindi?.name) return 'Hindi';
  if (data.in_english?.meaning || data.in_english?.name) return 'English';

  return '';
}

function getStableHash(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function limitTitle(text, limit = TITLE_LIMIT) {
  const clean = cleanText(text);
  if (!clean) return '';
  if (clean.length <= limit) return clean;

  const cut = clean.substring(0, limit - 3);
  const lastSpace = cut.lastIndexOf(' ');
  return cleanText(`${lastSpace > 10 ? cut.substring(0, lastSpace) : cut}...`);
}

function scoreTitle(title, data, religion, language) {
  const normalizedReligion = normalizeReligion(religion || data.religion);
  const religionLabel = getReligionLabel(normalizedReligion);
  const origin = getOrigin(data);
  const hasLucky = Boolean(data.lucky_number || data.luckyNumber);
  const personality = hasPersonality(data);
  const hasPronunciation = Boolean(data.pronunciation?.english || data.pronunciation?.ipa);

  let score = 0;
  const lower = title.toLowerCase();
  const coreMeaning = extractCoreMeaning(data.short_meaning || data.meaning || '').toLowerCase();

  if (lower.startsWith(`${String(data.name || '').toLowerCase()} `)) score += 10;
  if (lower.includes('name meaning')) score += 22;
  if (lower.includes('meaning in')) score += 15;
  // Titles that state the actual meaning (not just the word "meaning")
  // are more unique across the site and read as more specific/trustworthy
  // in the SERP, which is worth more than the generic phrase.
  if (coreMeaning && lower.includes(coreMeaning.split(' ')[0])) score += 25;
  if (language && lower.includes(` in ${language.toLowerCase()}`)) score += 18;
  if (origin && title.includes(origin)) score += 12;
  if (title.includes(religionLabel)) score += 12;
  if (hasLucky && lower.includes('lucky number')) score += 10;
  if (personality && lower.includes('personality')) score += 8;
  if (hasPronunciation && lower.includes('pronunciation')) score += 8;
  if (lower.includes('quran') || lower.includes('quranic')) score += 6;
  if (lower.includes('biblical') || lower.includes('bible')) score += 6;
  if (lower.includes('vedic') || lower.includes('sanskrit')) score += 6;

  // Prefer titles between 50-58 chars for optimal SERP display
  if (title.length >= 50 && title.length <= TITLE_LIMIT) score += 18;
  else if (title.length >= 40 && title.length <= 49) score += 10;
  else if (title.length < 40) score -= 40 - title.length;
  else score -= (title.length - TITLE_LIMIT) * 3;

  // Penalize keyword stuffing
  const repeated = (title.match(/\b(Name|Meaning|Origin|Lucky|Personality|Details|Pronunciation)\b/gi) || []).length;
  if (repeated > 4) score -= (repeated - 4) * 8;
  if ((title.match(/,/g) || []).length > 3) score -= 5;

  // Penalize ugly truncation — e.g. "...Lucky Number &..." where the cut
  // lands right after a dangling connector. A clean, shorter title should
  // win the tie instead of a longer one that had to be chopped mid-phrase.
  if (/[&,]\s*\.\.\.$/.test(title)) score -= 30;

  // Religion-specific penalties
  if (normalizedReligion !== 'islamic' && lower.includes('quranic')) score -= 15;
  if (normalizedReligion !== 'hindu' && lower.includes('vedic')) score -= 15;
  if (normalizedReligion !== 'christian' && lower.includes('biblical')) score -= 15;

  return score;
}

function buildTitleCandidates(data, religion) {
  const name = cleanText(data.name || 'Name');
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(religion || data.religion);
  const language = getTranslationLanguage(data, religion || data.religion);
  const hasLucky = Boolean(data.lucky_number || data.luckyNumber);
  const personality = hasPersonality(data);
  const hasPronunciation = Boolean(data.pronunciation?.english || data.pronunciation?.ipa);
  const meaning = extractCoreMeaning(data.short_meaning || data.meaning || '');
  const normalizedReligion = normalizeReligion(religion || data.religion);

  const languagePart = language ? ` in ${language}` : '';
  const originPart = origin ? `, ${origin} Origin` : '';
  const luckyPart = hasLucky ? ' & Lucky Number' : '';
  const personalityPart = personality ? ' & Personality' : '';
  const pronunciationPart = hasPronunciation ? ' & Pronunciation' : '';
  const religionPart = religionLabel;

  const candidates = [
    // Primary: Name + Meaning + Language (highest CTR)
    `${name} Name Meaning${languagePart}${originPart}${luckyPart}`,
    `${name} Meaning in ${religionPart}, ${origin || 'Origin'}${luckyPart}${personalityPart}`,
    `${name} Name Meaning, ${religionPart} Origin${luckyPart}${pronunciationPart}`,
    
    // Language-specific variants
    `${name} Name Meaning${languagePart}, ${origin || 'Origin'} Origin & Lucky Number`,
    `${name} Meaning in ${language || religionPart}, ${origin || 'Origin'}${luckyPart}`,
    
    // Feature-specific variants
    `${name} Name Meaning${originPart}${pronunciationPart}${luckyPart}`,
    `${name} Name Meaning${languagePart}, Personality & Lucky Number`,
    `${name} Name Meaning, Lucky Number & ${origin || 'Origin'} Origin`,
    
    // Religion-specific variants
    `${name} Name Meaning, ${religionPart} Origin${luckyPart}${personalityPart}`,
    `${name} Meaning in ${religionPart}, ${origin || 'Origin'} Origin & Lucky Number`,
    `${name} Name Meaning${originPart}, ${religionPart} Details${luckyPart}`,
    `${name} Name Meaning, Origin, Personality & ${religionPart} Details`,
  ];

  // Meaning-led variants: state the actual meaning instead of the generic
  // word "Meaning". This is what the strongest competitor snippets do
  // (e.g. "Kashaf: To Reveal - Arabic Origin"). Because the meaning text
  // differs name to name, these titles are naturally unique instead of a
  // reshuffled formula.
  if (meaning) {
    // Keep the literal phrase "Name Meaning" (it's what people actually
    // type — "faizan name meaning in urdu" was your #1 query) AND state
    // the real meaning value, so the title matches search intent while
    // still being genuinely unique per page.
    candidates.push(`${name} Name Meaning: "${meaning}"${originPart}${luckyPart}`);
    candidates.push(`${name} Name Meaning "${meaning}"${languagePart}${originPart}`);
    candidates.push(`${name} Meaning: "${meaning}" | ${religionPart} Name${luckyPart}`);
    if (language) {
      candidates.push(`${name} Name Meaning "${meaning}" in ${language}${originPart}`);
    }
  }

  // Language-specific additions
  if (language === 'Urdu') {
    candidates.push(`${name} Name Meaning in Urdu, ${origin || 'Origin'} Origin & Lucky Number`);
    candidates.push(`${name} Meaning in Urdu, ${religionPart} Name & Personality`);
    candidates.push(`${name} Meaning in Urdu, English & Arabic | NameVerse`);
  }

  if (language === 'Hindi') {
    candidates.push(`${name} Name Meaning in Hindi, ${origin || 'Origin'} Origin & Lucky Number`);
    candidates.push(`${name} Meaning in Hindi, ${religionPart} Name & Personality`);
  }

  if (language === 'Arabic') {
    candidates.push(`${name} Name Meaning in Arabic, ${origin || 'Origin'} Origin & Lucky Number`);
    if (normalizedReligion === 'islamic') {
      candidates.push(`${name} Meaning in Quran, Urdu & Arabic | NameVerse`);
    }
  }

  if (language === 'English') {
    candidates.push(`${name} Name Meaning in English, ${origin || 'Origin'} Origin & Christian Details`);
  }

  // Pronunciation variant
  if (hasPronunciation) {
    candidates.push(`${name} Name Meaning${languagePart}, Pronunciation & ${origin || 'Origin'} Origin`);
    candidates.push(`${name} Name Meaning, Pronunciation & Lucky Number | NameVerse`);
  }

  // Personality variant
  if (personality) {
    candidates.push(`${name} Name Meaning, Personality & Lucky Number | NameVerse`);
  }

  return Array.from(new Set(candidates.map(candidate => limitTitle(candidate))));
}

/**
 * ===========================
 * TITLE GENERATION
 * ===========================
 */
export function generateCTRTitle(data, religion) {
  const name = cleanText(data.name || 'Name');
  const candidates = buildTitleCandidates(data, religion);

  const ranked = candidates
    .map(title => ({
      title,
      score: scoreTitle(title, data, religion, getTranslationLanguage(data, religion)),
      tieBreaker: getStableHash(`${name}-${title}`),
    }))
    .sort((a, b) => b.score - a.score || a.tieBreaker - b.tieBreaker);

  const best = ranked[0]?.title || `${name} Name Meaning | NameVerse`;
  
  // Ensure no double branding
  const brandPattern = /\| NameVerse\s*\| NameVerse/g;
  const cleaned = best.replace(brandPattern, '| NameVerse');
  
  return cleaned;
}

/**
 * ===========================
 * DESCRIPTION GENERATION
 * ===========================
 *
 * WHY THIS WAS REWRITTEN:
 * The old version built every description from one skeleton sentence with
 * words swapped in ("Discover X name meaning in Y and Z, its W
 * significance, lucky number N, pronunciation P, personality traits T,
 * origin, and cultural background."). Across thousands of pages that
 * produces near-identical structure, word order, and connector phrases —
 * a "mail-merge" fingerprint. Google's indexing systems detect this at
 * scale and stop trusting the tag, silently swapping in their own
 * (often generic, less specific) snippet instead — which is exactly what
 * was suppressing CTR even on pages ranking well.
 *
 * This version fixes two things at once:
 *  1. Leads with the actual meaning, since that's the single strongest
 *     click driver and the thing that makes every page's first ~60
 *     characters genuinely different from every other page.
 *  2. Varies which 2 secondary attributes get mentioned (not always all
 *     five), so the feature-combination itself differs page to page, not
 *     just the nouns slotted into an identical sentence.
 */

// Distinct sentence shapes (not just word substitution — different
// grammar and emphasis) that each foreground the meaning first.
const DESCRIPTION_OPENERS = [
  (name, meaning) => `${name} means "${meaning}."`,
  (name, meaning) => `"${meaning}" — that's the meaning behind the name ${name}.`,
  (name, meaning) => `${name} carries the meaning "${meaning}."`,
  (name, meaning) => `The name ${name} translates to "${meaning}."`,
];

// Pools of short, natural secondary-detail fragments keyed by attribute.
// Two are picked per description (deterministically, but varying which
// ones based on the name+attribute so the combination differs by page).
function buildDetailPool({ origin, religionLabel, language, pronunciation, personality, luckyNumber, genderLabel }) {
  const pool = [];
  if (origin) pool.push(`It has ${origin} origin`);
  if (religionLabel) pool.push(`used in ${religionLabel} naming traditions`);
  if (language) pool.push(`with a ${language} translation available`);
  if (pronunciation) pool.push(`pronounced ${pronunciation}`);
  if (personality) pool.push(`often linked to traits like ${personality}`);
  if (luckyNumber) pool.push(`lucky number ${luckyNumber}`);
  if (genderLabel) pool.push(`a popular choice for a baby ${genderLabel}`);
  return pool;
}

// Natural connector phrasings so the join between fragments isn't always
// the same comma-separated list.
const CONNECTORS = [
  (a, b) => `${a}, and ${b}.`,
  (a, b) => `${a}. Also ${b}.`,
  (a, b) => `${a} — ${b}.`,
  (a, b) => `${a}, plus ${b}.`,
];

// Varied closing fillers used only when a description needs padding to
// reach the minimum length. Rotating these (instead of one fixed
// sentence) avoids reintroducing a new duplicate fingerprint.
const CLOSERS = [
  (name) => `See full origin, pronunciation, and cultural details for ${name} on NameVerse.`,
  (name) => `NameVerse breaks down ${name}'s full cultural and linguistic background.`,
  (name) => `Get the complete picture on ${name}, from origin to modern usage, on NameVerse.`,
];

export function generateCTRDescription(data, religion) {
  const name = cleanText(data.name || 'Name');
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(religion || data.religion);
  const language = getTranslationLanguage(data, religion || data.religion);
  const meaning = extractCoreMeaning(data.short_meaning || data.meaning || '') || 'a meaningful cultural name';
  const pronunciation = data.pronunciation?.english || data.pronunciation?.ipa || '';
  const personality = getPersonalitySummary(data);
  const luckyNumber = data.lucky_number || data.luckyNumber || '';
  const gender = String(data.gender || '').toLowerCase();
  // NOTE: "female" contains the substring "male", so male must never be
  // checked first or every girl name gets misclassified as a boy.
  const genderLabel = gender.includes('female')
    ? 'girl'
    : gender.includes('unisex') || gender.includes('neutral')
      ? ''
      : gender.includes('male')
        ? 'boy'
        : '';

  const seedBase = `${name}-${religionLabel}-${meaning}`;
  const seed = getStableHash(seedBase);

  const opener = DESCRIPTION_OPENERS[seed % DESCRIPTION_OPENERS.length](name, meaning);

  const detailPool = buildDetailPool({ origin, religionLabel, language, pronunciation, personality, luckyNumber, genderLabel });

  // Pick two distinct details, offset by the hash so different pages
  // surface different attribute combinations rather than always
  // front-loading the same two.
  let body = '';
  if (detailPool.length >= 2) {
    const first = detailPool[seed % detailPool.length];
    let secondIndex = (seed >>> 3) % detailPool.length;
    if (detailPool[secondIndex] === first) secondIndex = (secondIndex + 1) % detailPool.length;
    const second = detailPool[secondIndex];
    const connector = CONNECTORS[seed % CONNECTORS.length];
    body = ` ${connector(capitalize(first), second)}`;
  } else if (detailPool.length === 1) {
    body = ` ${capitalize(detailPool[0])}.`;
  }

  let description = fitMetaDescriptionVaried(`${opener}${body}`, name, seed);

  return description;
}

function fitMetaDescriptionVaried(text, name, seed) {
  let description = cleanText(text);
  if (!description) return '';

  if (description.length < DESCRIPTION_MIN) {
    const closer = CLOSERS[seed % CLOSERS.length](name);
    description = `${description} ${closer}`;
  }

  if (description.length > DESCRIPTION_MAX) {
    const cut = description.substring(0, DESCRIPTION_MAX - 3);
    const lastSpace = cut.lastIndexOf(' ');
    description = `${lastSpace > DESCRIPTION_MIN ? cut.substring(0, lastSpace) : cut}...`;
  }

  return description;
}

/**
 * ===========================
 * KEYWORDS GENERATION
 * ===========================
 */
export function generateKeywords(data, religion) {
  const name = cleanText(data.name || '');
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(religion || data.religion);
  const gender = String(data.gender || '').toLowerCase();
  const language = getTranslationLanguage(data, religion || data.religion);
  const personality = hasPersonality(data);
  const luckyNumber = data.lucky_number || data.luckyNumber;

  const base = [
    `${name} meaning`,
    `${name} name meaning`,
    `${name} origin`,
    `${name} pronunciation`,
  ];

  const religious = {
    islamic: [`${name} Islamic name`, `${name} Arabic origin`, `${name} Muslim baby name`],
    christian: [`${name} Christian name`, `${name} Biblical name`, `${name} Christian baby name`],
    hindu: [`${name} Hindu name`, `${name} Sanskrit name`, `${name} Hindu baby name`],
  };

  const genderKw =
    gender.includes('male')
      ? [`${name} boy name`]
      : gender.includes('female')
        ? [`${name} girl name`]
        : [`${name} unisex name`];

  const originKw = origin ? [`${name} ${origin} origin`] : [];
  const languageKw = language ? [`${name} meaning in ${language}`] : [];
  const intentKw = [
    `${name} lucky number`,
    `${name} baby name`,
    `${name} name details`,
  ];

  if (personality) intentKw.push(`${name} personality traits`);
  if (luckyNumber) intentKw.push(`${name} lucky number ${luckyNumber}`);

  const all = [
    ...base,
    ...(religious[normalizeReligion(religion || data.religion)] || religious.islamic),
    ...genderKw,
    ...originKw,
    ...languageKw,
    ...intentKw,
  ];

  return Array.from(new Set(all.map(cleanText).filter(Boolean))).slice(0, 12).join(', ');
}

const titleGenerator = {
  generateCTRTitle,
  generateCTRDescription,
  generateKeywords,
  RELIGION_LABELS,
};

export default titleGenerator;