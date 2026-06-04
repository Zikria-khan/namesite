/**
 * CULTURAL ONOMASTICS TITLE GENERATOR
 * Dynamic title templates for linguistic origin analysis and cultural semantic research
 * All "baby name" terminology replaced with academic onomastics language
 */

const TITLE_MODIFIERS = {
  islamic: [
    'Linguistic Origin Analysis',
    'Arabic Root Etymology',
    'Semantic Meaning Context',
    'Cultural Interpretation',
    'Historical Evolution',
    'Cross-Cultural Study',
  ],
  christian: [
    'Biblical Linguistic Analysis',
    'Hebrew Root Etymology',
    'Cultural Semantic Context',
    'Historical Name Evolution',
    'Cross-Cultural Study',
  ],
  hindu: [
    'Sanskrit Linguistic Analysis',
    'Vedic Root Etymology',
    'Cultural Semantic Context',
    'Historical Name Evolution',
    'Cross-Cultural Study',
  ],
};

const RELIGION_LABELS = {
  islamic: {
    display: 'Islamic',
    alt: ['Arabic', 'Quranic', 'Semitic'],
    genderLabels: { male: 'masculine', female: 'feminine', other: 'personal' },
  },
  christian: {
    display: 'Christian',
    alt: ['Biblical', 'Hebrew', 'Aramaic'],
    genderLabels: { male: 'masculine', female: 'feminine', other: 'personal' },
  },
  hindu: {
    display: 'Hindu',
    alt: ['Sanskrit', 'Vedic', 'Dravidian'],
    genderLabels: { male: 'masculine', female: 'feminine', other: 'personal' },
  },
};

const CHAR_LIMIT = 60;

function truncateToChars(text, limit = CHAR_LIMIT) {
  if (text.length <= limit) return text;
  const truncated = text.substring(0, limit - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 10 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
}

function getStableVariantIndex(name, religion, count) {
  let hash = 0;
  const key = `${name}-${religion}`;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % count;
}

function extractCoreMeaning(meaning) {
  if (!meaning) return '';
  const cleaned = meaning.trim();
  const firstPart = cleaned.split(/[,·|\n.]/)[0];
  const words = firstPart.split(/\s+/).filter(Boolean);
  return words.slice(0, 4).join(' ');
}

function buildBaseTitle(name, modifier, meaningFragment, luckyFragment, genderLabel) {
  const parts = [name, modifier];
  if (meaningFragment) parts.push(meaningFragment);
  if (luckyFragment) parts.push(luckyFragment);
  if (genderLabel) parts.push(genderLabel);

  return truncateToChars(parts.join(' — '), CHAR_LIMIT);
}

export function generateCTRTitle(data, religion, origin) {
  const name = data.name || '';
  const gender = (data.gender || 'other').toLowerCase();
  const luckyNumber = data.lucky_number;
  const meaning = extractCoreMeaning(data.short_meaning || data.meaning || '');
  const religionConfig = RELIGION_LABELS[religion] || RELIGION_LABELS.islamic;
  const genderLabel = religionConfig.genderLabels[gender] || 'personal';

  const luckyFragment = luckyNumber ? `Lucky #${luckyNumber}` : null;
  const variant = getStableVariantIndex(name, religion, 6);

  const titleTemplates = {
    islamic: [
      () => buildBaseTitle(name, 'Linguistic Origin Analysis', meaning ? `Root: ${origin || 'Arabic'}` : null, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Arabic Root Etymology', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Semantic Meaning Context', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Cultural Interpretation', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Historical Evolution', meaning, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Cross-Cultural Study', meaning, luckyFragment, null),
    ],
    christian: [
      () => buildBaseTitle(name, 'Biblical Linguistic Analysis', meaning, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Hebrew Root Etymology', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Cultural Semantic Context', meaning, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Historical Name Evolution', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Etymological Analysis', origin || meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Linguistic Context', meaning, luckyFragment, genderLabel),
    ],
    hindu: [
      () => buildBaseTitle(name, 'Sanskrit Linguistic Analysis', meaning, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Vedic Root Etymology', meaning, luckyFragment, genderLabel),
      () => buildBaseTitle(name, 'Cultural Semantic Context', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Historical Name Evolution', meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Etymological Analysis', origin || meaning, luckyFragment, null),
      () => buildBaseTitle(name, 'Linguistic Context', meaning, luckyFragment, genderLabel),
    ],
  };

  const templates = titleTemplates[religion] || titleTemplates.islamic;
  const title = templates[variant]();

  return title || `${name} — Cultural & Linguistic Origin Analysis | NameVerse`;
}

export function generateCTRDescription(data, religion) {
  const name = data.name || '';
  const meaning = extractCoreMeaning(data.short_meaning || data.meaning || '');
  const origin = data.origin || '';
  const luckyNumber = data.lucky_number;
  const luckyDay = data.lucky_day;
  const luckyStone = data.lucky_stone;
  const pronunciation = data.pronunciation?.english || '';
  const script = data.arabic_script || data.script || '';
  const gender = (data.gender || 'personal').toLowerCase();
  const religionDisplay = RELIGION_LABELS[religion]?.display || 'Islamic';

  const descriptionVariants = [];

  // Variant 1: Linguistic origin focused (155-160 chars)
  descriptionVariants.push(
    `Linguistic origin analysis of ${name}${script ? ` (${script})` : ''}: root language etymology in ${origin || religionDisplay} tradition. Phonetic structure${pronunciation ? `: ${pronunciation}` : ''}. Cultural semantic interpretation and historical naming evolution.`,
  );

  // Variant 2: Semantic meaning focused (155-160 chars)
  descriptionVariants.push(
    `${name} — cultural semantic interpretation from ${origin || religionDisplay} linguistic tradition. Root etymology: "${meaning}". Historical naming evolution across civilizations and cross-cultural onomastic patterns.`,
  );

  // Variant 3: Cultural context focused (155-160 chars)
  descriptionVariants.push(
    `${name}: ${gender} personal name in ${religionDisplay} cultural context. Linguistic origin: ${origin || religionDisplay}.${luckyNumber ? ` Numerological association: ${luckyNumber}.` : ''}${luckyDay ? ` Cultural day association: ${luckyDay}.` : ''}`,
  );

  // Variant 4: Historical evolution focused (155-160 chars)
  descriptionVariants.push(
    `${name} — historical naming evolution of this ${gender} personal name. ${origin ? `${origin} linguistic root. ` : ''}Cultural semantic meaning: "${meaning}". Cross-cultural onomastic analysis on NameVerse.`,
  );

  // Select stable variant
  const variant = getStableVariantIndex(name, religion, 4);
  let description = descriptionVariants[variant] || descriptionVariants[0];

  // Length validation: 140-160 for optimal CTR
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  } else if (description.length < 140) {
    const suffix = ' Part of NameVerse — Cultural Name Knowledge Base for multilingual onomastics research.';
    description = ((description + suffix).substring(0, 160));
  }

  return description;
}

export function generateKeywords(data, religion) {
  const keywords = new Set();
  const name = data.name || '';
  const origin = data.origin || '';
  const gender = (data.gender || '').toLowerCase();
  const religionDisplay = RELIGION_LABELS[religion]?.display || '';

  // Core onomastics keywords
  keywords.add(`${name} linguistic origin analysis`);
  keywords.add(`${name} cultural semantic interpretation`);
  keywords.add(`${name} etymology`);
  keywords.add(`${name} historical naming evolution`);

  // Religion-specific linguistic keywords
  if (religion === 'islamic') {
    keywords.add(`${name} Arabic root etymology`);
    keywords.add(`${name} Quranic linguistic analysis`);
    keywords.add(`${name} Semitic language origin`);
    keywords.add(`Islamic onomastics ${name}`);
  } else if (religion === 'christian') {
    keywords.add(`${name} Biblical linguistic analysis`);
    keywords.add(`${name} Hebrew root etymology`);
    keywords.add(`${name} Aramaic linguistic context`);
    keywords.add(`Christian onomastics ${name}`);
  } else if (religion === 'hindu') {
    keywords.add(`${name} Sanskrit linguistic analysis`);
    keywords.add(`${name} Vedic root etymology`);
    keywords.add(`${name} Dravidian linguistic context`);
    keywords.add(`Hindu onomastics ${name}`);
  }

  // Gender keywords
  if (gender === 'male') {
    keywords.add(`${religionDisplay} masculine personal name ${name}`);
  } else if (gender === 'female') {
    keywords.add(`${religionDisplay} feminine personal name ${name}`);
  }

  // Lucky number keywords
  if (data.lucky_number) {
    keywords.add(`${name} numerological association`);
    keywords.add(`${name} cultural number symbolism`);
  }

  // Origin keywords
  if (origin) {
    keywords.add(`${name} ${origin} linguistic root`);
    keywords.add(`${origin} etymological analysis`);
  }

  return Array.from(keywords).slice(0, 12).join(', ');
}