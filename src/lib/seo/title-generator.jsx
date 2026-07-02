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

  if (lower.startsWith(`${String(data.name || '').toLowerCase()} `)) score += 10;
  if (lower.includes('name meaning')) score += 30;
  if (lower.includes('meaning in')) score += 15;
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

function fitMetaDescription(text) {
  let description = cleanText(text);
  if (!description) return '';

  if (description.length < DESCRIPTION_MIN) {
    description += ' Explore NameVerse for origin, lucky number, pronunciation, personality traits, and translations.';
  }

  if (description.length > DESCRIPTION_MAX) {
    const cut = description.substring(0, DESCRIPTION_MAX - 3);
    const lastSpace = cut.lastIndexOf(' ');
    description = `${lastSpace > DESCRIPTION_MIN ? cut.substring(0, lastSpace) : cut}...`;
  }

  return description;
}

function scoreDescription(description) {
  let score = 0;
  const lower = description.toLowerCase();

  if (lower.includes('name meaning')) score += 20;
  if (lower.includes('origin')) score += 12;
  if (lower.includes('islamic') || lower.includes('christian') || lower.includes('hindu')) score += 12;
  if (lower.includes('lucky number')) score += 12;
  if (lower.includes('pronunciation')) score += 10;
  if (lower.includes('personality')) score += 10;
  if (lower.includes('translation')) score += 10;
  if (lower.includes('cultural') || lower.includes('culture')) score += 8;
  if (lower.includes('meaningful') || lower.includes('beautiful') || lower.includes('unique')) score += 6;
  if (description.length >= DESCRIPTION_MIN && description.length <= DESCRIPTION_MAX) score += 20;
  else if (description.length > DESCRIPTION_MAX) score -= (description.length - DESCRIPTION_MAX) * 2;
  else score -= (DESCRIPTION_MIN - description.length);

  if ((description.match(/,/g) || []).length > 5) score -= 5;
  if (description.endsWith('...')) score -= 3;
  return score;
}

/**
 * ===========================
 * DESCRIPTION GENERATION
 * ===========================
 */
export function generateCTRDescription(data, religion) {
  const name = cleanText(data.name || 'Name');
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(religion || data.religion);
  const language = getTranslationLanguage(data, religion || data.religion);
  const meaning = extractCoreMeaning(data.short_meaning || data.meaning || '');
  const pronunciation = data.pronunciation?.english || data.pronunciation?.ipa || '';
  const personality = getPersonalitySummary(data);
  const luckyNumber = data.lucky_number || data.luckyNumber || '';
  const gender = String(data.gender || '').toLowerCase();
  const genderLabel = gender.includes('male') ? 'boy' : gender.includes('female') ? 'girl' : 'baby';

  const originPhrase = origin ? `${origin} origin` : `${religionLabel.toLowerCase()} origin`;
  const languagePhrase = language ? `${language} translation` : 'translation';
  const pronunciationPhrase = pronunciation ? `pronunciation ${pronunciation}` : 'pronunciation';
  const personalityPhrase = personality ? `personality traits ${personality}` : 'personality traits';
  const luckyPhrase = luckyNumber ? `lucky number ${luckyNumber}` : 'lucky number';

  const variants = [
    `Discover ${name} name meaning in ${language || 'English'} and ${origin}, its ${religionLabel} significance, ${luckyPhrase}, ${pronunciationPhrase}, ${personalityPhrase}, origin, and cultural background.`,
    `${name} name meaning, ${originPhrase}, ${religionLabel} significance, ${luckyPhrase}, ${pronunciationPhrase}, ${personalityPhrase}, and ${languagePhrase} for parents choosing a meaningful ${genderLabel} name.`,
    `Learn what ${name} means in ${language || 'English'}, where it comes from, how it is pronounced, its ${originPhrase}, ${religionLabel} context, ${luckyPhrase}, and personality traits.`,
    `${name} is a ${originPhrase} ${genderLabel} name meaning "${meaning}". Explore its ${religionLabel} significance, ${luckyPhrase}, ${pronunciationPhrase}, ${personalityPhrase}, and ${languagePhrase} on NameVerse.`,
    `Find ${name} name meaning, ${originPhrase}, ${religionLabel} details, ${luckyPhrase}, ${pronunciationPhrase}, personality traits, and ${languagePhrase} in one clear baby-name guide.`,
    `${name} means "${meaning}" in ${origin || religionLabel} tradition. Discover pronunciation, lucky number ${luckyNumber || 'N/A'}, personality traits, and cultural significance.`,
  ];

  const ranked = variants
    .map(description => ({
      description: fitMetaDescription(description),
      score: 0,
      tieBreaker: 0,
    }))
    .map(item => ({
      ...item,
      score: scoreDescription(item.description),
      tieBreaker: getStableHash(`${name}-${item.description}`),
    }))
    .sort((a, b) => b.score - a.score || a.tieBreaker - b.tieBreaker);

  return ranked[0]?.description || fitMetaDescription(`Discover ${name} name meaning, origin, religion, lucky number, pronunciation, personality traits, and translations on NameVerse.`);
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
