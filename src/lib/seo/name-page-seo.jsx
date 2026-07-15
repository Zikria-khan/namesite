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
import { generateFAQs } from './faq-engine';

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
  // IMPORTANT: check 'female'/'unisex' before 'male' — the string
  // "female" contains "male" as a substring, so checking male first
  // silently misclassifies every girl/unisex name as a boy.
  if (gender.includes('female')) return 'girl';
  if (gender.includes('unisex') || gender.includes('neutral')) return 'unisex';
  if (gender.includes('male')) return 'boy';
  return 'baby';
}

function getGenderLabel(data) {
  const gender = cleanText(data.gender).toLowerCase();
  if (gender.includes('female')) return 'Female';
  if (gender.includes('unisex') || gender.includes('neutral')) return 'Unisex';
  if (gender.includes('male')) return 'Male';
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

/**
 * Rough content-completeness score for a name record.
 * Pages whose assembled content is too thin tend to be flagged by Google as
 * "Duplicate / alternate canonical" because thousands of them share the same
 * short boilerplate. This score (not a hardcoded list) drives a conditional
 * noindex so genuinely thin records are still rendered but not fully indexed.
 */
function computeContentScore(data) {
  let score = 0;
  let totalChars = 0;
  const tally = (value) => {
    const t = cleanText(typeof value === 'string' ? value : (value && typeof value === 'object' ? JSON.stringify(value) : ''));
    if (!t) return;
    totalChars += t.length;
    score += 1;
    if (t.length >= 60) score += 1;
  };

  tally(data.short_meaning || data.meaning);
  tally(data.long_meaning);
  tally(data.numerology_meaning);
  tally(data.spiritual_meaning || data.spiritual_significance);
  tally(data.cultural_impact);
  tally(data.personality_traits);
  tally(data.emotional_traits);
  tally(data.hidden_personality_traits);
  tally(data.islamic_reference && (data.islamic_reference.note || data.islamic_reference.is_quranic));
  tally(data.vedic_reference && (data.vedic_reference.root_origin || data.vedic_reference.is_vedic));
  if (Array.isArray(data.historical_references)) score += Math.min(data.historical_references.length, 3);
  if (Array.isArray(data.celebrity_usage)) score += Math.min(data.celebrity_usage.length, 3);

  // Translations and lucky details add unique, per-name content.
  score += Math.min(getLanguages(data).length, 5);
  if (cleanText(data.lucky_number || data.luckyNumber)) score += 1;
  if (cleanText(data.lucky_day)) score += 1;
  if (Array.isArray(data.lucky_colors) && data.lucky_colors.length) score += 1;
  if (cleanText(data.lucky_stone)) score += 1;

  return { score, totalChars };
}

// Below this, a name page is considered too thin to index on its own.
const THIN_CONTENT_THRESHOLD = 4;

function q(question, answer) {
  return { question, answer: cleanText(answer) };
}

export function generateDynamicFaqItems(data, religion) {
  const normalizedReligion = normalizeReligion(religion || data.religion);
  const enrichedData = { ...data, religion: normalizedReligion };
  const items = generateFAQs(enrichedData, normalizedReligion);

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

  // Conditional noindex for thin records (see computeContentScore). Thin pages
  // are still rendered but excluded from full indexing to reduce the duplicate
  // / alternate-canonical buckets in GSC.
  const { score: contentScore } = computeContentScore(data);
  const isThin = contentScore < THIN_CONTENT_THRESHOLD;
  const robots = isThin
    ? { index: false, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 }
    : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 };

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
        url: `${siteUrl}/opengraph-image`,
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
      images: [`${siteUrl}/opengraph-image`],
      creator: '@NameVerseOfficial',
      site: '@NameVerseOfficial',
    },
    robots,
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