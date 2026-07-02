/**
 * STRUCTURED DATA (Schema.org) for NameVerse name pages
 */
import { getSiteUrl } from '@/lib/seo/site';
import { nameAbsoluteUrl } from '@/lib/seo/url-builder';

const SITE_NAME = 'NameVerse';

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

function getOrigin(nameData) {
  return cleanText(nameData.origin) || 'Multiple linguistic traditions';
}

function getCoreMeaning(nameData) {
  const meaning = cleanText(nameData.short_meaning || nameData.meaning);
  if (!meaning) return 'meaningful cultural name';
  const firstPart = meaning.split(',')[0].split('·')[0].split(';')[0].trim();
  return firstPart || meaning;
}

function getGender(nameData) {
  const gender = cleanText(nameData.gender).toLowerCase();
  if (gender.includes('male')) return 'Male';
  if (gender.includes('female')) return 'Female';
  if (gender.includes('unisex') || gender.includes('neutral')) return 'Unisex';
  return cleanText(nameData.gender) || 'Unisex';
}

function getLanguages(nameData) {
  const languages = Array.isArray(nameData.language)
    ? nameData.language.map(cleanText).filter(Boolean)
    : [];

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
    if (nameData[key]?.name || nameData[key]?.meaning) languages.push(label);
  });

  return Array.from(new Set(languages));
}

function getPronunciation(nameData) {
  return cleanText(nameData.pronunciation?.english || nameData.pronunciation?.ipa);
}

function getPersonalityTraits(nameData) {
  const traits = [];
  if (Array.isArray(nameData.emotional_traits)) traits.push(...nameData.emotional_traits.map(cleanText));
  if (Array.isArray(nameData.hidden_personality_traits)) traits.push(...nameData.hidden_personality_traits.map(cleanText));
  if (cleanText(nameData.personality_traits)) traits.push(cleanText(nameData.personality_traits));
  return Array.from(new Set(traits.filter(Boolean))).slice(0, 8);
}

function getAlternateNames(nameData) {
  const names = [];
  const translationKeys = [
    'in_arabic',
    'in_urdu',
    'in_hindi',
    'in_sanskrit',
    'in_english',
    'in_hebrew',
    'in_greek',
    'in_latin',
    'in_pashto',
    'in_tamil',
    'in_telugu',
    'in_marathi',
    'in_bengali',
    'in_punjabi',
    'in_turkish',
    'in_persian',
    'in_malay',
    'in_indonesian',
    'in_french',
    'in_spanish',
    'in_german',
    'in_italian',
    'in_chinese',
    'in_japanese',
    'in_korean',
    'in_russian',
  ];

  translationKeys.forEach(key => {
    const value = nameData[key];
    if (value?.name && value.name !== nameData.name) names.push(value.name);
  });

  if (Array.isArray(nameData.name_variations)) names.push(...nameData.name_variations.map(cleanText));
  return Array.from(new Set(names.filter(Boolean)));
}

function getPublisher(baseUrl) {
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: SITE_NAME,
    description: 'NameVerse is a cultural name knowledge base for name meanings, origins, pronunciation, lucky numbers, and naming context.',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/NameVerseOfficial',
      'https://facebook.com/NameVerse',
      'https://instagram.com/nameverse',
      'https://linkedin.com/company/nameverse',
    ],
    foundingDate: '2025',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 20 },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@nameverse.com',
      url: `${baseUrl}/contact`,
    },
  };
}

function getAuthor(baseUrl) {
  return {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: SITE_NAME,
    url: baseUrl,
  };
}

function getPersonAuthor(baseUrl, authorData) {
  if (!authorData) return getAuthor(baseUrl);
  return {
    '@type': 'Person',
    '@id': `${baseUrl}/authors/${authorData.id || 'editorial-team'}`,
    name: authorData.name || 'NameVerse Editorial Team',
    description: authorData.bio || 'NameVerse editorial team member specializing in name meanings, origins, and cultural context.',
    url: `${baseUrl}/about`,
    knowsAbout: authorData.expertise || ['Name Meanings', 'Cultural Onomastics', 'Linguistic Origins'],
    knowsLanguage: authorData.languages || ['English'],
    alumniOf: authorData.credentials || '',
    sameAs: authorData.linkedin ? [authorData.linkedin] : [],
  };
}

function getSpeakableSchema(pageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
    '@id': `${pageUrl}#speakable`,
    cssSelector: ['.name-hero-title', '.name-meaning-summary', '.name-quick-answer'],
  };
}

function getTermId(pageUrl) {
  return `${pageUrl}#name-term`;
}

/**
 * Generate NameDataset schema for individual name pages
 */
export function generateNameDatasetSchema(nameData, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = cleanText(nameData.name || 'Name');
  const coreMeaning = getCoreMeaning(nameData);
  const origin = getOrigin(nameData);
  const religionLabel = getReligionLabel(nameData.religion || religion);
  const languages = getLanguages(nameData);
  const gender = getGender(nameData);
  const pronunciation = getPronunciation(nameData);
  const traits = getPersonalityTraits(nameData);
  const luckyNumber = nameData.lucky_number || nameData.luckyNumber || '';
  const luckyDay = cleanText(nameData.lucky_day);
  const luckyColors = Array.isArray(nameData.lucky_colors) ? nameData.lucky_colors.map(cleanText).filter(Boolean) : [];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${pageUrl}#dataset`,
    name: `${name} Name Meaning, Origin & Details | ${SITE_NAME}`,
    description: `${SITE_NAME} name entry for ${name}: meaning, ${origin} origin, ${religionLabel} context, pronunciation, lucky number, personality traits, translations, and cultural references.`,
    url: pageUrl,
    version: '1.0',
    dateCreated: nameData.created_at || nameData.published_date || '2025-01-01',
    dateModified: nameData.updated_at || new Date().toISOString().split('T')[0],
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    publisher: getPublisher(getSiteUrl()),
    keywords: [
      name,
      `${name} meaning`,
      `${name} origin`,
      `${name} pronunciation`,
      `${name} lucky number`,
      origin,
      religionLabel,
      ...languages,
      ...traits,
    ].filter(Boolean).join(', '),
    about: {
      '@type': 'DefinedTerm',
      '@id': getTermId(pageUrl),
      name,
      description: coreMeaning,
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: `${SITE_NAME} Cultural Name Knowledge Base`,
      url: getSiteUrl(),
    },
    spatialCoverage: { '@type': 'Place', name: origin || 'Global' },
    inLanguage: 'en',
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Name', value: name },
      { '@type': 'PropertyValue', name: 'Meaning', value: coreMeaning },
      { '@type': 'PropertyValue', name: 'Origin', value: origin },
      { '@type': 'PropertyValue', name: 'Religion', value: religionLabel },
      { '@type': 'PropertyValue', name: 'Language', value: languages.join(', ') },
      { '@type': 'PropertyValue', name: 'Gender', value: gender },
      { '@type': 'PropertyValue', name: 'Pronunciation', value: pronunciation },
      { '@type': 'PropertyValue', name: 'Lucky Number', value: String(luckyNumber) },
      { '@type': 'PropertyValue', name: 'Lucky Day', value: luckyDay },
      { '@type': 'PropertyValue', name: 'Lucky Colors', value: luckyColors.join(', ') },
      { '@type': 'PropertyValue', name: 'Personality Traits', value: traits.join(', ') },
    ].filter(item => cleanText(item.value)),
  };
  return schema;
}

/**
 * Generate WebPage schema
 */
export function generateNameWebPageSchema(nameData, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = cleanText(nameData.name || 'Name');
  const coreMeaning = getCoreMeaning(nameData);
  const origin = getOrigin(nameData);
  const religionLabel = getReligionLabel(nameData.religion || religion);
  const luckyNumber = nameData.lucky_number || nameData.luckyNumber || '';
  const pronunciation = getPronunciation(nameData);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    name: `${name} Name Meaning, Origin & Details | ${SITE_NAME}`,
    description: `Name page for ${name} with meaning, ${origin} origin, ${religionLabel} context, pronunciation, lucky number, personality traits, translations, and cultural background.`,
    url: pageUrl,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${getSiteUrl()}/#website`,
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    mainEntity: {
      '@type': 'DefinedTerm',
      '@id': getTermId(pageUrl),
      name,
      description: coreMeaning,
    },
    about: {
      '@type': 'DefinedTerm',
      '@id': getTermId(pageUrl),
      name,
      description: `${name} means ${coreMeaning}. Origin: ${origin}. Religion: ${religionLabel}. Pronunciation: ${pronunciation || 'not listed'}. Lucky number: ${luckyNumber || 'not listed'}.`,
    },
  };
}

/**
 * Generate Article schema
 */
export function generateNameArticleSchema(nameData, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = cleanText(nameData.name || 'Name');
  const origin = getOrigin(nameData);
  const religionLabel = getReligionLabel(nameData.religion || religion);
  const coreMeaning = getCoreMeaning(nameData);
  const publishedDate = nameData.published_date || nameData.created_at || new Date().toISOString().split('T')[0];
  const modifiedDate = nameData.updated_at || publishedDate;
  const baseUrl = getSiteUrl();
  const keywords = [
    `${name} meaning`,
    `${name} origin`,
    `${name} pronunciation`,
    `${name} lucky number`,
    `${origin} names`,
    `${religionLabel} baby names`,
  ].filter(Boolean).join(', ');

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: `${name} Name Meaning, Origin, Pronunciation & Lucky Number | ${SITE_NAME}`,
    name: `${name} Name Meaning and Origin`,
    description: `A clear guide to ${name}: meaning, ${origin} origin, ${religionLabel} context, pronunciation, lucky number, personality traits, translations, and cultural background.`,
    url: pageUrl,
    image: `${baseUrl}/logo.png`,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    inLanguage: 'en',
    author: getAuthor(baseUrl),
    publisher: getPublisher(baseUrl),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${pageUrl}#webpage` },
    about: {
      '@type': 'DefinedTerm',
      '@id': getTermId(pageUrl),
      name,
      description: coreMeaning,
    },
    articleSection: 'Name Meaning',
    keywords,
  };
}

/**
 * Generate DefinedTerm schema
 */
export function generateNameDefinedTermSchema(nameData, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = cleanText(nameData.name || 'Name');
  const origin = getOrigin(nameData);
  const religionLabel = getReligionLabel(nameData.religion || religion);
  const languages = getLanguages(nameData);
  const gender = getGender(nameData);
  const pronunciation = getPronunciation(nameData);
  const coreMeaning = getCoreMeaning(nameData);
  const luckyNumber = nameData.lucky_number || nameData.luckyNumber || '';
  const luckyDay = cleanText(nameData.lucky_day);
  const luckyColors = Array.isArray(nameData.lucky_colors) ? nameData.lucky_colors.map(cleanText).filter(Boolean) : [];
  const traits = getPersonalityTraits(nameData);

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': getTermId(pageUrl),
    name,
    text: coreMeaning,
    description: `${name} is a ${gender.toLowerCase()} name from ${origin} origin, used in ${religionLabel} contexts. It means ${coreMeaning}. Pronunciation: ${pronunciation || 'not listed'}. Lucky number: ${luckyNumber || 'not listed'}.`,
    alternateName: getAlternateNames(nameData),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Origin', value: origin },
      { '@type': 'PropertyValue', name: 'Religion', value: religionLabel },
      { '@type': 'PropertyValue', name: 'Language', value: languages.join(', ') },
      { '@type': 'PropertyValue', name: 'Gender', value: gender },
      { '@type': 'PropertyValue', name: 'Pronunciation', value: pronunciation },
      { '@type': 'PropertyValue', name: 'Lucky Number', value: String(luckyNumber) },
      { '@type': 'PropertyValue', name: 'Lucky Day', value: luckyDay },
      { '@type': 'PropertyValue', name: 'Lucky Colors', value: luckyColors.join(', ') },
      { '@type': 'PropertyValue', name: 'Personality Traits', value: traits.join(', ') },
    ].filter(item => cleanText(item.value)),
  };
}

/**
 * Generate ScholarlyArticle schema
 */
export function generateNameScholarlyArticle(nameData, religion, slug) {
  const pageUrl = nameAbsoluteUrl(religion, slug);
  const name = cleanText(nameData.name || 'Name');
  const origin = getOrigin(nameData);
  const religionLabel = getReligionLabel(nameData.religion || religion);
  const coreMeaning = getCoreMeaning(nameData);
  const publishedDate = nameData.published_date || nameData.created_at || new Date().toISOString().split('T')[0];
  const modifiedDate = nameData.updated_at || publishedDate;
  const baseUrl = getSiteUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': `${pageUrl}#scholarly-article`,
    headline: `${name} — Name Meaning, Origin & Cultural Context | ${SITE_NAME}`,
    name: `${name} — Name Meaning and Origin`,
    description: `Name meaning and origin analysis for ${name}: ${origin} origin, ${religionLabel} context, pronunciation, lucky number, translations, personality traits, and cultural references.`,
    url: pageUrl,
    image: `${baseUrl}/logo.png`,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    inLanguage: 'en',
    author: getAuthor(baseUrl),
    publisher: getPublisher(baseUrl),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${pageUrl}#webpage` },
    about: {
      '@type': 'DefinedTerm',
      '@id': getTermId(pageUrl),
      name,
      description: coreMeaning,
    },
    articleSection: 'Name Meaning',
    keywords: `${name} meaning, ${name} origin, ${origin} linguistics, ${religionLabel} names, pronunciation, lucky number, cultural context`,
    wordCount: 500,
    citation: { '@type': 'CreativeWork', name: `${SITE_NAME} — Cultural Name Knowledge Base`, url: baseUrl },
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs, pageDate = null) {
  if (!faqs || faqs.length === 0) return null;
  const publishedDate = pageDate || new Date().toISOString().split('T')[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question || faq.q,
      datePublished: publishedDate,
      author: { '@type': 'Organization', name: SITE_NAME },
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a,
        datePublished: publishedDate,
        author: { '@type': 'Organization', name: SITE_NAME },
      },
    })),
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && { item: item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}` }),
      })),
    ],
  };
}

/**
 * Generate CollectionPage schema
 */
export function generateCollectionSchema(data) {
  const religion = data.religion || '';
  const baseUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title || `${(religion.charAt(0).toUpperCase() + religion.slice(1))} — Name Collection`,
    description: data.description || `Name meanings, origins, pronunciation, lucky numbers, and cultural context for ${religion} names.`,
    url: `${baseUrl}${data.url || '/names'}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      description: 'NameVerse cultural name knowledge base',
      url: baseUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.totalNames || data.count || 0,
      itemListElement: (data.names || []).slice(0, 10).map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: name.name,
          description: name.short_meaning || name.meaning || '',
          url: `${baseUrl}/names/${(religion || name.religion)}/${name.slug}`
        },
      })),
    },
  };
}

/**
 * Render JSON-LD script tag
 */
export function renderSchema(schema) {
  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const structuredData = {
  generateNameDatasetSchema,
  generateNameWebPageSchema,
  generateNameArticleSchema,
  generateNameDefinedTermSchema,
  generateNameScholarlyArticle,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateCollectionSchema,
  renderSchema,
};

export default structuredData;
