/**
 * SEARCH INTENT ENGINE
 * Generates natural content that satisfies every major search intent for a name.
 * 
 * Features:
 * - 16 search intent categories
 * - AI-friendly summaries (40, 80, 150 words)
 * - Voice search answers
 * - Featured snippet answers
 * - Entity-rich content
 * - Query coverage validation
 */

const SITE_NAME = 'NameVerse';

function cleanText(text = '') {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function capitalize(text = '') {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getReligionLabel(religion) {
  const r = String(religion || '').toLowerCase();
  if (r === 'islam' || r === 'muslim' || r === 'islamic') return 'Islamic';
  if (r === 'christianity' || r === 'christian') return 'Christian';
  if (r === 'hinduism' || r === 'hindu') return 'Hindu';
  return capitalize(religion) || 'Cultural';
}

function getGenderLabel(gender) {
  const g = String(gender || '').toLowerCase();
  if (g.includes('male')) return 'boy';
  if (g.includes('female')) return 'girl';
  return 'baby';
}

function getOrigin(data) {
  return cleanText(data.origin) || 'multiple linguistic traditions';
}

function getCoreMeaning(data) {
  const meaning = cleanText(data.short_meaning || data.meaning);
  if (!meaning) return 'a meaningful cultural name';
  return meaning.split(',')[0].split('·')[0].split(';')[0].trim() || meaning;
}

function getPronunciation(data) {
  return cleanText(data.pronunciation?.english || data.pronunciation?.ipa);
}

function getLuckyNumber(data) {
  return cleanText(data.lucky_number || data.luckyNumber);
}

function getTraits(data) {
  const traits = [];
  if (Array.isArray(data.emotional_traits)) traits.push(...data.emotional_traits.map(cleanText));
  if (Array.isArray(data.hidden_personality_traits)) traits.push(...data.hidden_personality_traits.map(cleanText));
  if (cleanText(data.personality_traits)) traits.push(cleanText(data.personality_traits));
  return Array.from(new Set(traits.filter(Boolean)));
}

function getLanguages(data) {
  const languages = [];
  const keys = {
    in_urdu: 'Urdu', in_arabic: 'Arabic', in_hindi: 'Hindi',
    in_sanskrit: 'Sanskrit', in_english: 'English', in_pashto: 'Pashto',
    in_persian: 'Persian', in_turkish: 'Turkish', in_bengali: 'Bengali',
    in_malay: 'Malay', in_hebrew: 'Hebrew', in_greek: 'Greek',
    in_latin: 'Latin', in_tamil: 'Tamil', in_telugu: 'Telugu',
    in_marathi: 'Marathi', in_punjabi: 'Punjabi', in_french: 'French',
    in_spanish: 'Spanish', in_german: 'German', in_italian: 'Italian',
    in_chinese: 'Chinese', in_japanese: 'Japanese', in_russian: 'Russian',
  };
  Object.entries(keys).forEach(([key, label]) => {
    if (data[key]?.name || data[key]?.meaning) languages.push(label);
  });
  return Array.from(new Set(languages));
}

function getTranslation(data, language) {
  const key = {
    'Urdu': 'in_urdu', 'Arabic': 'in_arabic', 'Hindi': 'in_hindi',
    'Sanskrit': 'in_sanskrit', 'English': 'in_english', 'Pashto': 'in_pashto',
    'Persian': 'in_persian', 'Turkish': 'in_turkish', 'Bengali': 'in_bengali',
    'Malay': 'in_malay',
  }[language];
  if (!key) return null;
  return data[key]?.meaning || data[key]?.name || null;
}

/**
 * Generate a 40-word AI-friendly summary
 */
export function generateShortSummary(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  
  let summary = `${name} is a ${gender} name of ${origin} origin, used in ${religion} traditions. It means "${meaning}".`;
  if (pronunciation) summary += ` It is pronounced as "${pronunciation}".`;
  if (luckyNumber) summary += ` The lucky number associated with ${name} is ${luckyNumber}.`;
  return summary;
}

/**
 * Generate an 80-word AI-friendly summary
 */
export function generateMediumSummary(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  const languages = getLanguages(data);
  
  let summary = `${name} is a ${gender} name with ${origin} origin, commonly used in ${religion} communities. The name means "${meaning}".`;
  if (pronunciation) summary += ` Pronunciation: ${pronunciation}.`;
  if (luckyNumber) summary += ` Lucky number: ${luckyNumber}.`;
  if (traits.length) summary += ` Personality traits associated with ${name} include ${traits.slice(0, 3).join(', ')}.`;
  if (languages.length) summary += ` The name appears in ${languages.slice(0, 3).join(', ')} language contexts.`;
  return summary;
}

/**
 * Generate a 150-word AI-friendly summary
 */
export function generateLongSummary(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  const languages = getLanguages(data);
  const spiritual = cleanText(data.spiritual_meaning || data.spiritual_significance);
  const cultural = cleanText(data.cultural_impact);
  
  let summary = `${name} is a ${gender} name originating from ${origin} linguistic traditions. It holds significance in ${religion} culture and carries the meaning "${meaning}".`;
  
  if (pronunciation) summary += ` The name is pronounced as "${pronunciation}" in English.`;
  if (languages.length) summary += ` ${name} appears in ${languages.join(', ')} language traditions, reflecting its cross-cultural usage.`;
  if (luckyNumber) summary += ` In numerology, ${name} is associated with lucky number ${luckyNumber}.`;
  if (traits.length) summary += ` People named ${name} are often associated with traits such as ${traits.slice(0, 4).join(', ')}.`;
  if (spiritual) summary += ` ${spiritual}`;
  if (cultural) summary += ` ${cultural}`;
  
  summary += ` ${name} continues to be a meaningful choice for parents seeking a name with deep cultural roots and positive associations.`;
  return summary;
}

/**
 * Generate Featured Snippet answer
 */
export function generateFeaturedSnippet(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  
  return {
    question: `What does the name ${name} mean?`,
    answer: `${name} is a ${religion.toLowerCase()} name of ${origin} origin meaning "${meaning}".${pronunciation ? ` It is pronounced ${pronunciation}.` : ''}${luckyNumber ? ` Its lucky number is ${luckyNumber}.` : ''}`,
  };
}

/**
 * Generate Voice Search answer
 */
export function generateVoiceSearchAnswer(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  
  return `${name} is a ${gender} name of ${origin} origin, used in ${religion} communities. It means ${meaning}.${pronunciation ? ` It is pronounced as ${pronunciation}.` : ''}`;
}

/**
 * Generate AI Overview answer
 */
export function generateAIOverviewAnswer(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  
  let answer = `${name} is a ${gender} name from ${origin} origin, meaning "${meaning}". It is used in ${religion} naming traditions.`;
  if (pronunciation) answer += ` The pronunciation is ${pronunciation}.`;
  if (luckyNumber) answer += ` Lucky number: ${luckyNumber}.`;
  if (traits.length) answer += ` Associated traits: ${traits.slice(0, 3).join(', ')}.`;
  return answer;
}

/**
 * Generate Quick Facts table
 */
export function generateQuickFacts(data) {
  const name = cleanText(data.name || '');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  const languages = getLanguages(data);
  
  return [
    { label: 'Name', value: name },
    { label: 'Meaning', value: meaning },
    { label: 'Origin', value: origin },
    { label: 'Religion', value: religion },
    { label: 'Gender', value: capitalize(gender) },
    ...(pronunciation ? [{ label: 'Pronunciation', value: pronunciation }] : []),
    ...(luckyNumber ? [{ label: 'Lucky Number', value: luckyNumber }] : []),
    ...(traits.length ? [{ label: 'Personality Traits', value: traits.slice(0, 4).join(', ') }] : []),
    ...(languages.length ? [{ label: 'Languages', value: languages.join(', ') }] : []),
  ];
}

/**
 * Generate Meaning section content
 */
export function generateMeaningSection(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const longMeaning = cleanText(data.long_meaning || data.meaning);
  const spiritual = cleanText(data.spiritual_meaning || data.spiritual_significance);
  
  const sections = [];
  
  // Core meaning
  sections.push({
    heading: `What Does ${name} Mean?`,
    content: `${name} means "${meaning}" in its original ${origin} context. The name carries deep significance in ${religion} tradition and is chosen by parents who value its cultural and spiritual associations.`,
  });
  
  // Long meaning if available
  if (longMeaning && longMeaning.length > meaning.length + 10) {
    sections.push({
      heading: `Detailed Meaning of ${name}`,
      content: longMeaning,
    });
  }
  
  // Spiritual meaning
  if (spiritual) {
    sections.push({
      heading: `Spiritual Meaning of ${name}`,
      content: spiritual,
    });
  }
  
  return sections;
}

/**
 * Generate Translation section
 */
export function generateTranslationSection(data) {
  const name = cleanText(data.name || '');
  const translations = [];
  const languages = getLanguages(data);
  
  const langMap = {
    'Urdu': 'in_urdu', 'Arabic': 'in_arabic', 'Hindi': 'in_hindi',
    'Sanskrit': 'in_sanskrit', 'English': 'in_english', 'Pashto': 'in_pashto',
    'Persian': 'in_persian', 'Turkish': 'in_turkish', 'Bengali': 'in_bengali',
    'Malay': 'in_malay',
  };
  
  languages.forEach(lang => {
    const key = langMap[lang];
    if (key && data[key]) {
      translations.push({
        language: lang,
        meaning: data[key]?.meaning || '',
        name: data[key]?.name || '',
      });
    }
  });
  
  return translations;
}

/**
 * Generate Pronunciation section
 */
export function generatePronunciationSection(data) {
  const name = cleanText(data.name || '');
  const pronunciation = data.pronunciation || {};
  const items = [];
  
  if (pronunciation.english) items.push({ language: 'English', text: pronunciation.english });
  if (pronunciation.ipa) items.push({ language: 'IPA', text: pronunciation.ipa });
  if (pronunciation.urdu) items.push({ language: 'Urdu', text: pronunciation.urdu });
  if (pronunciation.arabic) items.push({ language: 'Arabic', text: pronunciation.arabic });
  if (pronunciation.hindi) items.push({ language: 'Hindi', text: pronunciation.hindi });
  
  return items;
}

/**
 * Generate Origin section
 */
export function generateOriginSection(data) {
  const name = cleanText(data.name || 'This name');
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const etymology = cleanText(data.etymology || data.linguistic_history);
  
  const sections = [];
  
  sections.push({
    heading: `Origin of ${name}`,
    content: `${name} has ${origin} origins and is primarily used in ${religion} naming traditions. The name reflects the linguistic and cultural heritage of its region of origin.`,
  });
  
  if (etymology) {
    sections.push({
      heading: `Etymology of ${name}`,
      content: etymology,
    });
  }
  
  return sections;
}

/**
 * Generate Popularity section
 */
export function generatePopularitySection(data) {
  const name = cleanText(data.name || 'This name');
  const popularity = data.popularity || {};
  const items = [];
  
  if (popularity.rank) items.push({ country: 'Global', rank: popularity.rank });
  if (popularity.us_rank) items.push({ country: 'United States', rank: popularity.us_rank });
  if (popularity.uk_rank) items.push({ country: 'United Kingdom', rank: popularity.uk_rank });
  if (popularity.pakistan_rank) items.push({ country: 'Pakistan', rank: popularity.pakistan_rank });
  if (popularity.india_rank) items.push({ country: 'India', rank: popularity.india_rank });
  if (popularity.uae_rank) items.push({ country: 'UAE', rank: popularity.uae_rank });
  if (popularity.saudi_rank) items.push({ country: 'Saudi Arabia', rank: popularity.saudi_rank });
  if (popularity.canada_rank) items.push({ country: 'Canada', rank: popularity.canada_rank });
  if (popularity.australia_rank) items.push({ country: 'Australia', rank: popularity.australia_rank });
  
  return items;
}

/**
 * Generate Personality section
 */
export function generatePersonalitySection(data) {
  const name = cleanText(data.name || 'This name');
  const traits = getTraits(data);
  const numerology = cleanText(data.numerology_meaning);
  const luckyNumber = getLuckyNumber(data);
  const luckyDay = cleanText(data.lucky_day);
  const luckyColors = Array.isArray(data.lucky_colors) ? data.lucky_colors.map(cleanText).filter(Boolean) : [];
  const luckyStone = cleanText(data.lucky_stone);
  const luckyMetal = cleanText(data.lucky_metal);
  
  const sections = [];
  
  if (traits.length) {
    sections.push({
      heading: `Personality of ${name}`,
      content: `Individuals named ${name} are often associated with traits such as ${traits.join(', ')}. These characteristics reflect the name's cultural and linguistic heritage.`,
    });
  }
  
  if (numerology) {
    sections.push({
      heading: `Numerology of ${name}`,
      content: numerology,
    });
  }
  
  const luckyItems = [];
  if (luckyNumber) luckyItems.push(`Lucky Number: ${luckyNumber}`);
  if (luckyDay) luckyItems.push(`Lucky Day: ${luckyDay}`);
  if (luckyColors.length) luckyItems.push(`Lucky Colors: ${luckyColors.join(', ')}`);
  if (luckyStone) luckyItems.push(`Lucky Stone: ${luckyStone}`);
  if (luckyMetal) luckyItems.push(`Lucky Metal: ${luckyMetal}`);
  
  if (luckyItems.length) {
    sections.push({
      heading: `Lucky Associations for ${name}`,
      content: luckyItems.join('. ') + '.',
    });
  }
  
  return sections;
}

/**
 * Generate Famous People section
 */
export function generateFamousPeopleSection(data) {
  const name = cleanText(data.name || '');
  const famous = [];
  
  if (Array.isArray(data.famous_people)) {
    data.famous_people.forEach(person => {
      if (typeof person === 'string') famous.push({ name: person });
      else if (person.name) famous.push(person);
    });
  }
  
  if (Array.isArray(data.historical_figures)) {
    data.historical_figures.forEach(person => {
      if (typeof person === 'string') famous.push({ name: person });
      else if (person.name) famous.push(person);
    });
  }
  
  return famous.slice(0, 10);
}

/**
 * Generate Variants section
 */
export function generateVariantsSection(data) {
  const name = cleanText(data.name || '');
  const variants = [];
  
  if (Array.isArray(data.name_variations)) {
    data.name_variations.forEach(v => {
      if (typeof v === 'string') variants.push({ name: v, type: 'Variation' });
    });
  }
  
  if (Array.isArray(data.alternative_spellings)) {
    data.alternative_spellings.forEach(v => {
      if (typeof v === 'string') variants.push({ name: v, type: 'Alternative Spelling' });
    });
  }
  
  if (Array.isArray(data.nicknames)) {
    data.nicknames.forEach(v => {
      if (typeof v === 'string') variants.push({ name: v, type: 'Nickname' });
    });
  }
  
  if (Array.isArray(data.short_forms)) {
    data.short_forms.forEach(v => {
      if (typeof v === 'string') variants.push({ name: v, type: 'Short Form' });
    });
  }
  
  return variants;
}

/**
 * Generate Related Names section
 */
export function generateRelatedNamesSection(data) {
  const names = [];
  
  if (Array.isArray(data.similar_sounding_names)) {
    data.similar_sounding_names.forEach(n => {
      if (typeof n === 'string') names.push({ name: n, type: 'Similar Sounding' });
    });
  }
  
  if (Array.isArray(data.related_names)) {
    data.related_names.forEach(n => {
      if (typeof n === 'string') names.push({ name: n, type: 'Related' });
    });
  }
  
  if (Array.isArray(data.sibling_names)) {
    data.sibling_names.forEach(n => {
      if (typeof n === 'string') names.push({ name: n, type: 'Sibling Name' });
    });
  }
  
  if (Array.isArray(data.middle_names)) {
    data.middle_names.forEach(n => {
      if (typeof n === 'string') names.push({ name: n, type: 'Middle Name' });
    });
  }
  
  return names;
}

/**
 * Generate Parent Advice section
 */
export function generateParentAdvice(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  const traits = getTraits(data);
  
  const pros = [];
  const considerations = [];
  
  pros.push(`${name} has a beautiful meaning: "${meaning}"`);
  pros.push(`The name has strong ${origin} cultural roots and ${religion} heritage`);
  if (traits.length) pros.push(`Associated with positive traits like ${traits.slice(0, 3).join(', ')}`);
  pros.push(`${name} is a meaningful choice that connects your child to their cultural heritage`);
  
  considerations.push(`Consider how ${name} pairs with your surname and potential middle names`);
  considerations.push(`Check the pronunciation in your local language to ensure it works well`);
  considerations.push(`Think about potential nicknames your child might be called`);
  
  return {
    heading: `Should You Choose ${name} for Your Baby?`,
    pros,
    considerations,
    summary: `${name} is a beautiful ${gender} name with deep ${origin} roots and ${religion} significance. Its meaning "${meaning}" carries positive associations that can inspire your child throughout their life.`,
  };
}

/**
 * Generate FAQ items for a name
 */
export function generateIntentFAQs(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  const languages = getLanguages(data);
  const gender = getGenderLabel(data);
  
  const faqs = [
    {
      question: `What does ${name} mean?`,
      answer: `${name} means "${meaning}" in its original ${origin} context. It is a ${gender} name used in ${religion} traditions.`,
    },
    {
      question: `How do you pronounce ${name}?`,
      answer: pronunciation ? `${name} is pronounced as "${pronunciation}".` : `${name} is pronounced according to its ${origin} linguistic origins.`,
    },
    {
      question: `Where does the name ${name} come from?`,
      answer: `${name} has ${origin} origins and is primarily used in ${religion} naming traditions.`,
    },
    {
      question: `What is the lucky number for ${name}?`,
      answer: luckyNumber ? `The lucky number associated with ${name} is ${luckyNumber}.` : `NameVerse does not list a specific lucky number for ${name}.`,
    },
    {
      question: `Is ${name} a ${religion.toLowerCase()} name?`,
      answer: `Yes, ${name} is classified as a ${religion.toLowerCase()} name with ${origin} origin.`,
    },
  ];
  
  if (traits.length) {
    faqs.push({
      question: `What personality traits are associated with ${name}?`,
      answer: `Individuals named ${name} are often associated with traits such as ${traits.slice(0, 4).join(', ')}.`,
    });
  }
  
  if (languages.length) {
    faqs.push({
      question: `What languages is ${name} used in?`,
      answer: `${name} appears in ${languages.join(', ')} language contexts.`,
    });
  }
  
  return faqs;
}

/**
 * Validate query coverage for a name
 */
export function validateQueryCoverage(data) {
  const name = cleanText(data.name || '');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religion = getReligionLabel(data.religion);
  const pronunciation = getPronunciation(data);
  const luckyNumber = getLuckyNumber(data);
  const traits = getTraits(data);
  const languages = getLanguages(data);
  
  const coverage = {
    'meaning': Boolean(meaning),
    'translation': languages.length > 0,
    'pronunciation': Boolean(pronunciation),
    'origin': Boolean(origin),
    'religion': Boolean(religion),
    'personality': traits.length > 0,
    'lucky_number': Boolean(luckyNumber),
    'variants': Array.isArray(data.name_variations) && data.name_variations.length > 0,
    'famous_people': Array.isArray(data.famous_people) && data.famous_people.length > 0,
    'related_names': Array.isArray(data.similar_sounding_names) && data.similar_sounding_names.length > 0,
    'faqs': true, // Always generated
    'voice_search': true, // Always generated
    'featured_snippet': true, // Always generated
    'ai_overview': true, // Always generated
  };
  
  const total = Object.keys(coverage).length;
  const covered = Object.values(coverage).filter(Boolean).length;
  const score = Math.round((covered / total) * 100);
  
  return {
    score,
    covered: Object.entries(coverage).filter(([, v]) => v).map(([k]) => k),
    missing: Object.entries(coverage).filter(([, v]) => !v).map(([k]) => k),
    total,
    covered_count: covered,
  };
}

const searchIntentEngine = {
  generateShortSummary,
  generateMediumSummary,
  generateLongSummary,
  generateFeaturedSnippet,
  generateVoiceSearchAnswer,
  generateAIOverviewAnswer,
  generateQuickFacts,
  generateMeaningSection,
  generateTranslationSection,
  generatePronunciationSection,
  generateOriginSection,
  generatePopularitySection,
  generatePersonalitySection,
  generateFamousPeopleSection,
  generateVariantsSection,
  generateRelatedNamesSection,
  generateParentAdvice,
  generateIntentFAQs,
  validateQueryCoverage,
};

export default searchIntentEngine;