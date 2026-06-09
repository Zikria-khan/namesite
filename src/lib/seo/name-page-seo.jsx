// lib/seo/name-page-seo.jsx
// CULTURAL ONOMASTICS SEO SYSTEM — UNIFIED URL GENERATION VIA url-builder.js
// ALL URLs: lowercase, no trailing slash, consistent religion names

import { getSiteUrl } from '@/lib/seo/site';
import { nameAbsoluteUrl, nameRelativeUrl } from '@/lib/seo/url-builder';
import { generateCTRTitle, generateCTRDescription, generateKeywords } from '@/lib/seo/title-generator';
import { generateNameDatasetSchema, generateNameScholarlyArticle, generateFAQSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';

const siteUrl = getSiteUrl();

function getStableHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getStableVariantIndex(name, religion, variantsCount) {
  const stableKey = `${name}-${religion}`;
  const hash = getStableHash(stableKey);
  return hash % variantsCount;
}

function extractCoreEmotion(meaning) {
  if (!meaning || typeof meaning !== 'string') return 'meaningful context';
  let cleaned = meaning.trim();
  cleaned = cleaned.split(',')[0];
  cleaned = cleaned.split('·')[0];
  cleaned = cleaned.split('.')[0];
  cleaned = cleaned.split('\n')[0];
  const words = cleaned.split(' ').filter(w => w.length > 0);
  const coreWords = words.slice(0, 5).join(' ');
  if (coreWords.length < 2) return words[0] || 'meaningful';
  if (coreWords.length > 35) return coreWords.substring(0, 32) + '...';
  return coreWords;
}

export function generateOptimizedTitle(data, religion) {
  const name = data.name || '';
  const origin = data.origin || '';
  return generateCTRTitle(data, religion, origin);
}

export function generateOptimizedDescription(data, religion) {
  const description = generateCTRDescription(data, religion);
  return { desktop: description, mobile: description };
}

export function generateOptimizedKeywords(data, religion) {
  return generateKeywords(data, religion);
}

/**
 * Build FAQ items — academic onomastics style
 */
function generateDynamicFaqItems(data, religion) {
  const name = data.name || 'This name';
  const origin = data.origin || '';
  const religionDisplay = religion === 'islamic' ? 'Islamic' : religion === 'christian' ? 'Christian' : religion === 'hindu' ? 'Hindu' : religion;
  const simpleMeaning = extractCoreEmotion(data.short_meaning || data.meaning || 'meaningful');
  const gender = typeof data.gender === 'string' ? data.gender.toLowerCase() : '';
  const nameType = gender === 'male' ? 'masculine personal name' : gender === 'female' ? 'feminine personal name' : 'personal name';
  const pronunciation = data.pronunciation?.english ? `${data.pronunciation.english}${data.pronunciation?.ipa ? ` (${data.pronunciation.ipa})` : ''}` : '';
  const languages = Array.isArray(data.languages) ? data.languages.join(', ') : '';

  const items = [
    {
      q: `What is the linguistic origin of the name ${name}?`,
      a: data.short_meaning || data.meaning || `${name} is a ${nameType} of ${origin || religionDisplay.toLowerCase()} linguistic tradition. Its semantic meaning conveys "${simpleMeaning}".`,
    },
    {
      q: `What is the etymological analysis of ${name}?`,
      a: origin ? `${name} derives from ${origin} linguistic roots and carries semantic meaning within ${religionDisplay.toLowerCase()} cultural context.` : `${name} has meaningful etymological roots in ${religionDisplay.toLowerCase()} naming tradition.`,
    },
    {
      q: `What is the cultural context of the name ${name}?`,
      a: `${name} is used in ${religionDisplay.toLowerCase()} communities as a ${nameType}.${origin ? ` Its ${origin} linguistic origin provides cultural semantic depth.` : ''}`,
    },
    {
      q: `How has the name ${name} evolved historically?`,
      a: `${name} has maintained its cultural significance through historical naming evolution across ${religionDisplay.toLowerCase()} civilizations, reflecting cross-cultural onomastic patterns.`,
    },
    {
      q: `What is the phonetic structure of ${name}?`,
      a: pronunciation ? `The phonetic pronunciation of ${name} is ${pronunciation}.` : `The phonetic structure of ${name} follows ${religionDisplay.toLowerCase()} phonological patterns.`,
    },
    {
      q: `What are regional variations of ${name}?`,
      a: data.name_variations?.length ? `Regional linguistic variations include ${data.name_variations.slice(0, 5).join(', ')}.` : `There are several regional variations of ${name} across different linguistic communities.`,
    },
    {
      q: `What linguistic features characterize ${name}?`,
      a: `${name} exhibits phonetic and morphological features characteristic of ${origin || religionDisplay.toLowerCase()} language family, with cultural semantic layers developed through historical usage.`,
    },
  ];

  if (languages) {
    items.push({
      q: `In which linguistic communities is ${name} used?`,
      a: `${name} appears in linguistic communities including ${languages}.`,
    });
  }

  if (data.similar_sounding_names?.length) {
    items.push({
      q: `What names share linguistic roots with ${name}?`,
      a: `Names sharing etymological affinity with ${name} include ${data.similar_sounding_names.slice(0, 5).join(', ')}.`,
    });
  }

  return items.slice(0, 10);
}

/**
 * Generate ALL structured data schemas for a name page
 * Uses url-builder for consistent URL format
 */
export function generateOptimizedSchemas(data, religion, slug) {
  // 🔥 USE THE SHARED URL BUILDER — single source of truth
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const relativeUrl = nameRelativeUrl(religion, slug);
  const name = data.name;
  const faqItems = generateDynamicFaqItems(data, religion);

  // Generate Dataset schema (primary)
  const datasetSchema = generateNameDatasetSchema(data, religion, slug);

  // Generate ScholarlyArticle schema
  const scholarlyArticleSchema = generateNameScholarlyArticle(data, religion, slug);

  // Generate FAQ schema
  const faqSchema = generateFAQSchema(faqItems);

  // Generate Breadcrumb schema — uses url-builder for ALL links
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: `${religion.charAt(0).toUpperCase() + religion.slice(1)} Names`, href: `/names/religion/${religion}/1` },
    { label: name, href: relativeUrl },
  ]);

  return {
    dataset: datasetSchema,
    scholarlyArticle: scholarlyArticleSchema,
    faq: faqSchema,
    faqData: faqItems,
    breadcrumb: breadcrumbSchema,
  };
}

/**
 * Main metadata generator
 * Uses url-builder for canonical, OG, and all URLs
 */
export async function generateNamePageMetadata(data, religion, slug) {
  // 🔥 USE THE SHARED URL BUILDER
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = data.name;
  const shortMeaning = data.short_meaning || data.meaning || '';
  const origin = data.origin || '';
  const religionDisplay = religion === 'islamic' ? 'Islamic' : religion === 'christian' ? 'Christian' : religion === 'hindu' ? 'Hindu' : religion;
  const publishedDate = data.published_date || data.created_at || data.updated_at || new Date().toISOString().split('T')[0];
  const modifiedDate = data.updated_at || data.published_date || data.created_at || new Date().toISOString().split('T')[0];

  const safeMeaning = extractCoreEmotion(shortMeaning);
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
      siteName: 'NameVerse — Cultural Name Knowledge Base',
      type: 'article',
      images: [{
        url: `${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(safeMeaning.substring(0, 40))}&religion=${religion}`,
        width: 1200,
        height: 630,
        alt: `${name} — Linguistic Origin Analysis & Cultural Context | NameVerse`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(safeMeaning.substring(0, 40))}&religion=${religion}`],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    other: {
      'theme-color': '#D97706',
      'article:section': 'Cultural Onomastics',
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
      'citation:linguistic_origin': origin,
      'citation:cultural_context': religionDisplay,
    },
  };
}

export function generateNamePageSchemas(data, religion, slug) {
  return generateOptimizedSchemas(data, religion, slug);
}