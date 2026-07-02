// lib/seo/name-page-seo.jsx

import { getSiteUrl } from '@/lib/seo/site';
import { nameAbsoluteUrl, nameRelativeUrl } from '@/lib/seo/url-builder';
import { generateCTRTitle, generateCTRDescription, generateKeywords } from '@/lib/seo/title-generator';
import {
  generateNameDatasetSchema,
  generateNameWebPageSchema,
  generateNameArticleSchema,
  generateNameDefinedTermSchema,
  generateNameScholarlyArticle,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';

const SITE_NAME = 'NameVerse';
const siteUrl = getSiteUrl();

function cleanText(text = '') {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeReligion(religion) {
  const r = String(religion || '').toLowerCase();
  if (r === 'islam' || r === 'muslim' || r === 'islamic') return 'islamic';
  if (r === 'christianity' || r === 'christian') return 'christian';
  if (r === 'hinduism' || r === 'hindu') return 'hindu';
  return r;
}

function getReligionLabel(religion) {
  const normalized = normalizeReligion(religion);
  if (normalized === 'islamic') return 'Islamic';
  if (normalized === 'christian') return 'Christian';
  if (normalized === 'hindu') return 'Hindu';
  return cleanText(religion) || 'Cultural';
}

function getOrigin(data) {
  return cleanText(data.origin) || 'multiple linguistic traditions';
}

function getCoreMeaning(data) {
  const meaning = cleanText(data.short_meaning || data.meaning);
  if (!meaning) return 'meaningful cultural name';
  return cleanText(meaning.split(',')[0].split('·')[0].split(';')[0]);
}

function getGender(data) {
  const gender = cleanText(data.gender).toLowerCase();
  if (gender.includes('male')) return 'boy';
  if (gender.includes('female')) return 'girl';
  if (gender.includes('unisex') || gender.includes('neutral')) return 'unisex';
  return 'baby';
}

function getGenderLabel(data) {
  const gender = cleanText(data.gender).toLowerCase();
  if (gender.includes('male')) return 'Male';
  if (gender.includes('female')) return 'Female';
  if (gender.includes('unisex') || gender.includes('neutral')) return 'Unisex';
  return cleanText(data.gender) || 'Unisex';
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

function getLanguages(data) {
  const languages = Array.isArray(data.language) ? data.language.map(cleanText).filter(Boolean) : [];
  const translationKeys = {
    in_arabic: 'Arabic',
    in_urdu: 'Urdu',
    in_hindi: 'Hindi',
    in_sanskrit: 'Sanskrit',
    in_english: 'English',
    in_hebrew: 'Hebrew',
    in_greek: 'Greek',
    in_latin: 'Latin',
    in_pashto: 'Pashto',
    in_tamil: 'Tamil',
    in_telugu: 'Telugu',
    in_marathi: 'Marathi',
    in_bengali: 'Bengali',
    in_punjabi: 'Punjabi',
    in_turkish: 'Turkish',
    in_persian: 'Persian',
    in_malay: 'Malay',
    in_indonesian: 'Indonesian',
    in_french: 'French',
    in_spanish: 'Spanish',
    in_german: 'German',
    in_italian: 'Italian',
    in_chinese: 'Chinese',
    in_japanese: 'Japanese',
    in_korean: 'Korean',
    in_russian: 'Russian',
  };

  Object.entries(translationKeys).forEach(([key, label]) => {
    if (data[key]?.name || data[key]?.meaning) languages.push(label);
  });

  return Array.from(new Set(languages));
}

function getPronunciation(data) {
  return cleanText(data.pronunciation?.english || data.pronunciation?.ipa);
}

function getTraits(data) {
  const traits = [];
  if (Array.isArray(data.emotional_traits)) traits.push(...data.emotional_traits.map(cleanText));
  if (Array.isArray(data.hidden_personality_traits)) traits.push(...data.hidden_personality_traits.map(cleanText));
  if (cleanText(data.personality_traits)) traits.push(cleanText(data.personality_traits));
  return Array.from(new Set(traits.filter(Boolean))).slice(0, 4);
}

function getLuckyNumber(data) {
  return cleanText(data.lucky_number || data.luckyNumber);
}

function getLuckyColors(data) {
  return Array.isArray(data.lucky_colors) ? data.lucky_colors.map(cleanText).filter(Boolean) : [];
}

function getSimilarNames(data) {
  const names = [];
  if (Array.isArray(data.similar_sounding_names)) names.push(...data.similar_sounding_names.map(cleanText));
  if (Array.isArray(data.related_names)) names.push(...data.related_names.map(cleanText));
  if (Array.isArray(data.name_variations)) names.push(...data.name_variations.map(cleanText));
  return Array.from(new Set(names.filter(Boolean))).slice(0, 8);
}

function getPublishedDate(data) {
  return data.published_date || data.created_at || data.updated_at || new Date().toISOString().split('T')[0];
}

function q(question, answer) {
  return { question, answer: cleanText(answer) };
}

function answerMeaning(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(data.religion);
  const gender = getGenderLabel(data);
  return `${name} means ${meaning}. It is a ${gender.toLowerCase()} name from ${origin} origin and is used in ${religionLabel} naming contexts.`;
}

function answerOrigin(data) {
  const name = cleanText(data.name || 'This name');
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(data.religion);
  const languages = getLanguages(data).join(', ');
  return `${name} is listed with ${origin} origin${languages ? ` and appears in ${languages} language contexts` : ''}. NameVerse classifies it as a ${religionLabel.toLowerCase()} name.`;
}

function answerPronunciation(data) {
  const name = cleanText(data.name || 'This name');
  const pronunciation = getPronunciation(data);
  return pronunciation ? `${name} is pronounced ${pronunciation}.` : `NameVerse does not list a pronunciation guide for ${name}.`;
}

function answerTraits(data) {
  const name = cleanText(data.name || 'This name');
  const traits = getTraits(data);
  return traits.length
    ? `${name} is associated with traits such as ${traits.join(', ')}.`
    : `NameVerse does not list specific personality traits for ${name}.`;
}

function answerCulturalSignificance(data) {
  const name = cleanText(data.name || 'This name');
  const meaning = getCoreMeaning(data);
  const origin = getOrigin(data);
  const religionLabel = getReligionLabel(data.religion);
  const culturalImpact = cleanText(data.cultural_impact);
  if (culturalImpact) return `${name} is connected with ${culturalImpact.toLowerCase()} It is also understood through its ${origin} origin, ${religionLabel} context, and meaning "${meaning}".`;
  return `${name} is understood through its ${origin} origin, ${religionLabel} context, meaning "${meaning}", and cultural naming usage.`;
}

function answerSpiritualSignificance(data) {
  const name = cleanText(data.name || 'This name');
  const spiritualMeaning = cleanText(data.spiritual_meaning || data.spiritual_significance);
  return spiritualMeaning
    ? `${name}: ${spiritualMeaning}`
    : `NameVerse does not list a separate spiritual meaning for ${name}.`;
}

function answerSimilarNames(data) {
  const name = cleanText(data.name || 'This name');
  const similar = getSimilarNames(data);
  return similar.length ? `Names related to ${name} include ${similar.join(', ')}.` : `NameVerse does not list similar names for ${name}.`;
}

function answerVariations(data) {
  const name = cleanText(data.name || 'This name');
  const variations = Array.isArray(data.name_variations) ? data.name_variations.map(cleanText).filter(Boolean) : [];
  return variations.length ? `Variations for ${name} include ${variations.join(', ')}.` : `NameVerse does not list spelling variations for ${name}.`;
}

function answerReligion(data) {
  const name = cleanText(data.name || 'This name');
  const religionLabel = getReligionLabel(data.religion);
  const origin = getOrigin(data);
  return `NameVerse classifies ${name} as a ${religionLabel.toLowerCase()} name with ${origin} origin.`;
}

function answerQuranic(data) {
  const name = cleanText(data.name || 'This name');
  if (data.islamic_reference?.is_quranic === true) return `NameVerse marks ${name} as Quranic.`;
  if (data.islamic_reference?.is_quranic === false) return `NameVerse lists ${name} as a traditional Islamic name and does not mark it as Quranic.`;
  return `NameVerse does not provide Quranic-reference data for ${name}.`;
}

function answerBiblical(data) {
  const name = cleanText(data.name || 'This name');
  if (data.biblical_reference || data.bible_reference || data.christian_reference) return `NameVerse provides Christian reference data for ${name}.`;
  if (data.biblical === true) return `NameVerse marks ${name} as biblical.`;
  if (data.biblical === false) return `NameVerse does not mark ${name} as biblical.`;
  return `NameVerse does not list a biblical reference for ${name}.`;
}

function answerSaintAgnes(data) {
  const name = cleanText(data.name || 'This name');
  const longMeaning = cleanText(data.long_meaning || '');
  const text = `${name} ${longMeaning}`.toLowerCase();
  if (text.includes('agnes')) {
    return `NameVerse describes ${name} as a variant of Agnes; this page does not provide a separate Saint Agnes citation.`;
  }
  return `NameVerse does not list a specific saint connection for ${name}.`;
}

function answerVedic(data) {
  const name = cleanText(data.name || 'This name');
  if (data.vedic_reference?.is_vedic === true) return `NameVerse marks ${name} as Vedic.`;
  if (data.vedic_reference?.is_vedic === false) return `NameVerse lists ${name} as a Hindu name and does not mark it as Vedic.`;
  return `NameVerse does not provide Vedic-reference data for ${name}.`;
}

function answerTranslation(data, language) {
  const name = cleanText(data.name || 'This name');
  const key = language === 'Urdu' ? 'in_urdu' : language === 'Arabic' ? 'in_arabic' : language === 'Hindi' ? 'in_hindi' : language === 'Sanskrit' ? 'in_sanskrit' : 'in_english';
  const translation = data[key]?.meaning || data[key]?.long_meaning;
  const meaning = getCoreMeaning(data);

  if ((language === 'Arabic' || language === 'Sanskrit') && cleanText(data.origin).toLowerCase() === language.toLowerCase()) {
    return `${name} is listed as ${language} origin meaning ${meaning}.`;
  }

  return translation ? `${name} in ${language}: ${cleanText(translation)}` : `${name} means ${meaning}; NameVerse does not list a ${language} translation.`;
}

function answerNumerology(data) {
  const name = cleanText(data.name || 'This name');
  const numerology = cleanText(data.numerology_meaning);
  const luckyNumber = getLuckyNumber(data);
  const lifePath = cleanText(data.life_path_number);
  if (numerology) return `${name}: ${numerology}${luckyNumber ? ` Lucky number: ${luckyNumber}.` : ''}${lifePath ? ` Life path number: ${lifePath}.` : ''}`;
  return luckyNumber ? `${name} has lucky number ${luckyNumber}${lifePath ? ` and life path number ${lifePath}.` : '.'}` : `NameVerse does not list numerology details for ${name}.`;
}

function generateBaseFaqItems(data) {
  const name = cleanText(data.name || 'This name');
  const religionLabel = getReligionLabel(data.religion);
  const origin = getOrigin(data);
  const language = getTranslationLanguage(data, data.religion);
  const luckyNumber = getLuckyNumber(data);
  const luckyDay = cleanText(data.lucky_day);
  const luckyColors = getLuckyColors(data);
  const babyGender = getGender(data);

  return [
    q(`What does ${name} mean?`, answerMeaning(data)),
    q(`What is ${name} meaning in ${language || 'English'}?`, answerTranslation(data, language || 'English')),
    q(`Is ${name} a ${religionLabel.toLowerCase()} name?`, answerReligion(data)),
    q(`What is the origin of ${name}?`, `${name} has ${origin} origin according to NameVerse data.`),
    q(`What language is ${name} used in?`, getLanguages(data).length ? `${name} appears in ${getLanguages(data).join(', ')} language contexts.` : `NameVerse does not list language usage for ${name}.`),
    q(`How do you pronounce ${name}?`, answerPronunciation(data)),
    q(`What is the lucky number of ${name}?`, luckyNumber ? `${name} has lucky number ${luckyNumber}.` : `NameVerse does not list a lucky number for ${name}.`),
    q(`What is the lucky day of ${name}?`, luckyDay ? `${name} is associated with ${luckyDay}.` : `NameVerse does not list a lucky day for ${name}.`),
    q(`What is the lucky color of ${name}?`, luckyColors.length ? `${name} is associated with ${luckyColors.join(', ')}.` : `NameVerse does not list lucky colors for ${name}.`),
    q(`What personality traits are associated with ${name}?`, answerTraits(data)),
    q(`Is ${name} a good name for a baby ${babyGender}?`, `${name} is a meaningful ${babyGender} name option with ${origin} origin and the meaning "${getCoreMeaning(data)}".`),
    q(`Is ${name} a boy, girl, or unisex name?`, `${name} is listed as ${getGenderLabel(data).toLowerCase()}.`),
    q(`What are names similar to ${name}?`, answerSimilarNames(data)),
    q(`What are variations of ${name}?`, answerVariations(data)),
    q(`What is the cultural significance of ${name}?`, answerCulturalSignificance(data)),
    q(`What is the spiritual meaning of ${name}?`, answerSpiritualSignificance(data)),
  ];
}

function generateReligionFaqItems(data) {
  const name = cleanText(data.name || 'This name');
  const religion = normalizeReligion(data.religion);
  const longMeaning = cleanText(data.long_meaning || '').toLowerCase();

  if (religion === 'islamic') {
    return [
      q(`Is ${name} mentioned in the Quran?`, answerQuranic(data)),
      q(`What is ${name} meaning in Arabic?`, answerTranslation(data, 'Arabic')),
      q(`What is ${name} meaning in Urdu?`, answerTranslation(data, 'Urdu')),
      q(`What is the numerology meaning of ${name}?`, answerNumerology(data)),
    ];
  }

  if (religion === 'christian') {
    const saintQuestion = /agnes|saint|christian tradition/.test(longMeaning)
      ? `Is ${name} associated with Saint Agnes?`
      : `Does ${name} have a Christian saint connection?`;
    return [
      q(`Is ${name} a biblical name?`, answerBiblical(data)),
      q(saintQuestion, answerSaintAgnes(data)),
      q(`What is ${name} meaning in English?`, answerTranslation(data, 'English')),
      q(`What is the numerology meaning of ${name}?`, answerNumerology(data)),
    ];
  }

  if (religion === 'hindu') {
    return [
      q(`Is ${name} a Hindu name?`, answerReligion(data)),
      q(`What is the Sanskrit meaning of ${name}?`, answerTranslation(data, 'Sanskrit')),
      q(`Is ${name} connected to Vedic traditions?`, answerVedic(data)),
      q(`What is the numerology meaning of ${name}?`, answerNumerology(data)),
    ];
  }

  return [
    q(`What is the cultural origin of ${name}?`, answerOrigin(data)),
    q(`How is ${name} pronounced?`, answerPronunciation(data)),
    q(`What is the lucky number of ${name}?`, getLuckyNumber(data) ? `${name} has lucky number ${getLuckyNumber(data)}.` : `NameVerse does not list a lucky number for ${name}.`),
    q(`What are names similar to ${name}?`, answerSimilarNames(data)),
  ];
}

/**
 * Build FAQ items from real search intent
 */
export function generateDynamicFaqItems(data, religion) {
  const normalizedReligion = normalizeReligion(religion || data.religion);
  const items = [
    ...generateBaseFaqItems({ ...data, religion: normalizedReligion }),
    ...generateReligionFaqItems({ ...data, religion: normalizedReligion }),
  ];

  return items
    .filter(item => item.question && item.answer)
    .slice(0, 20);
}

export function generateOptimizedTitle(data, religion) {
  return generateCTRTitle(data, religion);
}

export function generateOptimizedDescription(data, religion) {
  const description = generateCTRDescription(data, religion);
  return { desktop: description, mobile: description };
}

export function generateOptimizedKeywords(data, religion) {
  return generateKeywords(data, religion);
}

/**
 * Generate ALL structured data schemas for a name page
 */
export function generateOptimizedSchemas(data, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const relativeUrl = nameRelativeUrl(religion, slug);
  const name = data.name;
  const publishedDate = getPublishedDate(data);
  const faqItems = generateDynamicFaqItems(data, religion);

  const datasetSchema = generateNameDatasetSchema(data, religion, slug);
  const webPageSchema = generateNameWebPageSchema(data, religion, slug);
  const articleSchema = generateNameArticleSchema(data, religion, slug);
  const definedTermSchema = generateNameDefinedTermSchema(data, religion, slug);
  const scholarlyArticleSchema = generateNameScholarlyArticle(data, religion, slug);
  const faqSchema = generateFAQSchema(faqItems, publishedDate);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: `${getReligionLabel(religion)} Names`, href: `/names/religion/${normalizeReligion(religion)}/1` },
    { label: name, href: relativeUrl },
  ]);

  return {
    dataset: datasetSchema,
    webPage: webPageSchema,
    article: articleSchema,
    definedTerm: definedTermSchema,
    scholarlyArticle: scholarlyArticleSchema,
    faq: faqSchema,
    faqData: faqItems,
    breadcrumb: breadcrumbSchema,
    pageUrl,
  };
}

/**
 * Main metadata generator
 */
export async function generateNamePageMetadata(data, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = data.name;
  const shortMeaning = data.short_meaning || data.meaning || '';
  const origin = data.origin || '';
  const religionDisplay = getReligionLabel(religion || data.religion);
  const publishedDate = data.published_date || data.created_at || data.updated_at || new Date().toISOString().split('T')[0];
  const modifiedDate = data.updated_at || data.published_date || data.created_at || new Date().toISOString().split('T')[0];
  const gender = getGender(data);
  const genderLabel = gender === 'boy' ? 'Boy' : gender === 'girl' ? 'Girl' : 'Baby';
  const language = getTranslationLanguage(data, religion);
  const luckyNumber = getLuckyNumber(data);
  const pronunciation = getPronunciation(data);

  const safeMeaning = cleanText(shortMeaning).slice(0, 80);
  const title = generateOptimizedTitle(data, religion);
  const descriptionObj = generateOptimizedDescription(data, religion);
  const description = descriptionObj.desktop;
  const keywords = generateOptimizedKeywords(data, religion);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: `${SITE_NAME} — Name Meaning & Origin Guides`,
      type: 'article',
      locale: 'en_US',
      images: [{
        url: `${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(safeMeaning)}&religion=${normalizeReligion(religion)}`,
        width: 1200,
        height: 630,
        alt: `${name} name meaning, ${origin || 'origin'}, lucky number and pronunciation | ${SITE_NAME}`,
      }],
      article: {
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        section: 'Name Meaning',
        tag: [religionDisplay, origin, `${genderLabel} Names`, `${religionDisplay} Baby Names`],
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(safeMeaning)}&religion=${normalizeReligion(religion)}`],
      creator: '@NameVerseOfficial',
      site: '@NameVerseOfficial',
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    other: {
      'theme-color': '#D97706',
      'article:section': 'Name Meaning',
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
      'article:tag': `${religionDisplay}, ${origin}, ${genderLabel} Names`,
      'citation:linguistic_origin': origin,
      'citation:cultural_context': religionDisplay,
      'citation:pronunciation': pronunciation,
      'citation:lucky_number': luckyNumber,
      'citation:author': 'NameVerse Editorial Team',
      'citation:publication_date': publishedDate,
    },
  };
}

export function generateNamePageSchemas(data, religion, slug) {
  return generateOptimizedSchemas(data, religion, slug);
}

const namePageSeo = {
  generateNamePageMetadata,
  generateNamePageSchemas,
  generateDynamicFaqItems,
};

export default namePageSeo;
