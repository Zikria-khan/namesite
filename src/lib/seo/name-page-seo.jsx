// lib/seo/name-page-seo-enhanced.jsx
// PRODUCTION-GRADE SEO SYSTEM - Deterministic rotation, E-E-A-T safe, stable indexing

import { getSiteUrl } from '@/lib/seo/site';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';

const siteUrl = getSiteUrl();

/**
 * Deterministic hash function for consistent rotation
 * Same name + religion = same variant every time
 * No Math.random() = SEO stable
 */
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

function formatTraitList(traits = []) {
  const list = Array.isArray(traits) ? traits.filter(Boolean) : [];
  return list.slice(0, 3).join(', ');
}

function getPersonalitySummary(data) {
  const traits = [
    ...(Array.isArray(data.emotional_traits) ? data.emotional_traits : []),
    ...(Array.isArray(data.hidden_personality_traits) ? data.hidden_personality_traits : []),
  ].filter(Boolean);
  return formatTraitList(traits);
}

function formatLanguages(data) {
  if (Array.isArray(data.languages) && data.languages.length > 0) {
    return data.languages.slice(0, 3).join(', ');
  }
  return '';
}

/**
 * Extract clean core emotion from meaning - CTR focused
 * Returns first meaningful part (before comma or '·') up to 5-7 words
 */
function extractCoreEmotion(meaning) {
  if (!meaning || typeof meaning !== 'string') return 'Beautiful';
  
  let cleaned = meaning.trim();
  cleaned = cleaned.split(',')[0];
  cleaned = cleaned.split('·')[0];
  cleaned = cleaned.split('.')[0];
  cleaned = cleaned.split('\n')[0];
  
  // For CTR, we want 5-7 words max for title display
  const words = cleaned.split(' ').filter(w => w.length > 0);
  const coreWords = words.slice(0, 5).join(' ');
  
  if (coreWords.length < 2) return words[0] || 'Meaningful';
  if (coreWords.length > 35) return coreWords.substring(0, 32) + '...';
  
  return coreWords;
}

/**
 * Generate CTR-optimized title for name pages
 * Format: [Name] Meaning in [Religion]: [Short Meaning] | Lucky #[Number] | [Gender] Name
 */
export function generateOptimizedTitle(data, religion) {
  const name = data.name;
  const gender = typeof data.gender === 'string' ? data.gender.toLowerCase() : '';
  const genderLabel = gender === 'male' ? 'Boy' : gender === 'female' ? 'Girl' : '';
  const religionDisplay = religion === 'islamic' ? 'Islam' : 
                          religion === 'christian' ? 'Christianity' : 
                          religion === 'hindu' ? 'Hinduism' : religion;
  const luckyNumber = data.lucky_number ? `Lucky #${data.lucky_number}` : '';
  
  // Extract first meaningful part of meaning
  const shortMeaning = extractCoreEmotion(data.short_meaning || data.meaning || '');
  
  // CTR-optimized format: Name Meaning in Religion: meaning | Lucky #N | Gender Name
  let title;
  if (religion === 'islamic') {
    title = `${name} Meaning in Islam: ${shortMeaning}${luckyNumber ? ` | ${luckyNumber}` : ''} | ${genderLabel} Name`;
  } else if (religion === 'hindu') {
    title = `${name} Meaning in Hindu: ${shortMeaning}${luckyNumber ? ` | ${luckyNumber}` : ''} | ${genderLabel} Name`;
  } else if (religion === 'christian') {
    const origin = data.origin || 'Biblical';
    title = `${name} Meaning: ${shortMeaning} | ${genderLabel} Name of ${origin} Origin${luckyNumber ? ` | ${luckyNumber}` : ''}`;
  } else {
    title = `${name} Meaning: ${shortMeaning}${luckyNumber ? ` | ${luckyNumber}` : ''} | ${genderLabel} Name`;
  }

  return validateMetaTitle(title);
}

/**
 * Generate CTR-optimized description for name pages
 * Desktop: 155-160 chars with full details
 * Mobile: Under 120 chars with essential info
 */
export function generateOptimizedDescription(data, religion) {
  const name = data.name;
  const shortMeaning = data.short_meaning || data.meaning || '';
  const religionDisplay = religion === 'islamic' ? 'Islamic' : 
                          religion === 'christian' ? 'Christian' : 
                          religion === 'hindu' ? 'Hindu' : '';
  const gender = typeof data.gender === 'string' ? data.gender.toLowerCase() : '';
  const genderText = gender === 'male' ? 'boy' : gender === 'female' ? 'girl' : 'baby';
  const script = data.arabic_script || data.script || '';
  const pronunciation = data.pronunciation?.english || data.pronunciation || '';
  const origin = data.origin || '';
  const luckyNumber = data.lucky_number || '';
  
  // Extract core meaning for description
  const coreMeaning = extractCoreEmotion(shortMeaning);
  
  // Desktop description (155-160 characters max)
  // Format: Name (script) means meaning in Religion. Lucky number N, origin origin, pronounced pron.
  let desktopDesc;
  if (religion === 'islamic') {
    desktopDesc = `${name}${script ? ` (${script})` : ''} means ${coreMeaning} in ${religionDisplay}. Lucky number ${luckyNumber}, ${origin} origin, pronounced ${pronunciation}.`;
  } else if (religion === 'hindu') {
    desktopDesc = `${name}${script ? ` (${script})` : ''} means ${coreMeaning} in ${religionDisplay}. Lucky number ${luckyNumber}, ${origin} origin, pronounced ${pronunciation}.`;
  } else {
    desktopDesc = `${name}${script ? ` (${script})` : ''} means ${coreMeaning}. Lucky number ${luckyNumber}, ${origin} origin, pronounced ${pronunciation}.`;
  }
  
  // Mobile description (under 120 chars)
  let mobileDesc = `${name} means ${coreMeaning}. Lucky #${luckyNumber}. ${religion} ${genderText} name, ${origin} origin.`;
  
  // Validate and truncate if needed
  if (mobileDesc.length > 120) {
    mobileDesc = `${name} means ${coreMeaning}. Lucky #${luckyNumber}. ${religion} ${genderText} name.`;
  }
  
  // Ensure desktop desc fits within limits
  if (desktopDesc.length > 160) {
    desktopDesc = desktopDesc.substring(0, 157) + '...';
  }
  
  return {
    desktop: validateMetaDescription(desktopDesc),
    mobile: validateMetaDescription(mobileDesc)
  };
}

/**
 * Get stable variant for consistent output
 */
function getSEOStableVariant(name, religion) {
  const stableKey = `${name.toLowerCase()}-${religion}`;
  const hash = getStableHash(stableKey);
  
  const variantMap = {
    0: { type: 'question', style: 'direct' },
    1: { type: 'question', style: 'soft' },
    2: { type: 'statement', style: 'meaning' },
    3: { type: 'statement', style: 'story' }
  };
  
  return variantMap[hash % 4];
}

/**
 * Keywords - minimal, focused, stable (12 max)
*/
export function generateOptimizedKeywords(data, religion) {
  const name = data.name;
  const keywords = new Set();
  const origin = data.origin || '';
  const gender = typeof data.gender === 'string' ? data.gender.toLowerCase() : '';
  const luckyNumber = data.lucky_number || '';
  const luckyColors = Array.isArray(data.lucky_colors) ? data.lucky_colors : [];
  const languageList = Array.isArray(data.languages) ? data.languages : [];
  const personality = getPersonalitySummary(data);
  const religionDisplay = religion === 'islamic' ? 'Islamic' : religion === 'christian' ? 'Christian' : religion === 'hindu' ? 'Hindu' : religion;

  keywords.add(`${name} name meaning`);
  // Religion-aware keyword variants — uses the correct religion label throughout
  const religionLabel = religionDisplay.toLowerCase(); // "islamic" | "christian" | "hindu"
  keywords.add(`${name} ${religionLabel} baby name meaning`);
  if (religion === 'islamic') {
    keywords.add(`${name} Islamic name`);
    keywords.add(`${name} Quranic name meaning`);
  } else if (religion === 'christian') {
    keywords.add(`${name} Christian name`);
    keywords.add(`${name} Biblical name meaning`);
  } else if (religion === 'hindu') {
    keywords.add(`${name} Hindu name`);
    keywords.add(`${name} Sanskrit name meaning`);
  }

  if (gender === 'male') {
    keywords.add(`${religionDisplay} boy name ${name}`);
  } else if (gender === 'female') {
    keywords.add(`${religionDisplay} girl name ${name}`);
  }

  if (luckyNumber) {
    keywords.add(`${name} lucky number`);
    keywords.add(`${name} lucky number meaning`);
  }
  if (luckyColors.length) keywords.add(`${name} lucky colors`);
  if (languageList.length) {
    keywords.add(`${name} name language`);
    // Build language-specific keyword variants from each entry's .code and .name
    // languageList items have shape { code, name, value, flag, key }
    for (const lang of languageList) {
      const langName = typeof lang === 'string' ? lang : (lang.code || lang.name || '');
      if (langName) {
        keywords.add(`${name} ${langName} meaning`);
      }
    }
  }
  if (personality) keywords.add(`${name} personality`);
  keywords.add(`${name} name pronunciation`);
  keywords.add(`what does ${name} mean`);

  return Array.from(keywords).slice(0, 12).join(', ');
}

/**
 * Build FAQ item list from page data.
 */
function generateDynamicFaqItems(data, religion) {
  const name = data.name || 'This name';
  const origin = data.origin || '';
  const religionDisplay = religion === 'islamic' ? 'Islamic' : religion === 'christian' ? 'Christian' : religion === 'hindu' ? 'Hindu' : religion;
  const simpleMeaning = extractCoreEmotion(data.short_meaning || data.meaning || 'meaningful');
  const gender = typeof data.gender === 'string' ? data.gender.toLowerCase() : '';
  const nameType = gender === 'male' ? 'boy name' : gender === 'female' ? 'girl name' : 'name';
  const pronunciation = data.pronunciation?.english ? `${data.pronunciation.english}${data.pronunciation?.ipa ? ` (${data.pronunciation.ipa})` : ''}` : '';
  const personality = getPersonalitySummary(data);
  const languages = Array.isArray(data.languages) ? data.languages.join(', ') : '';
  const luckDetails = [];
  if (data.lucky_number) luckDetails.push(`lucky number ${data.lucky_number}`);
  if (data.lucky_day) luckDetails.push(`lucky day ${data.lucky_day}`);
  if (data.lucky_colors?.length) luckDetails.push(`lucky colors ${data.lucky_colors.join(', ')}`);
  if (data.lucky_stone) luckDetails.push(`lucky stone ${data.lucky_stone}`);

  const items = [
    {
      q: `What does ${name} mean in ${religionDisplay}?`,
      a: data.short_meaning || data.meaning || `${name} is a ${religionDisplay.toLowerCase()} ${nameType} that suggests ${simpleMeaning}.`,
    },
    {
      q: `Is ${name} an ${religionDisplay.toLowerCase()} ${nameType}?`,
      a: `Yes, ${name} is widely used as an ${religionDisplay.toLowerCase()} ${nameType} and is chosen for its meaningful origin.`,
    },
    {
      q: `What is the origin of the name ${name}?`,
      a: origin ? `${name} comes from ${origin} origin and carries spiritual meaning in ${religionDisplay.toLowerCase()} tradition.` : `${name} has a meaningful origin and is popular in ${religionDisplay.toLowerCase()} communities.`,
    },
    {
      q: `What is ${name}'s lucky number and lucky color?`,
      a: luckDetails.length ? `${name} is associated with ${luckDetails.join(', ')}.` : `${name} does not have a specific lucky number or color listed, but it is valued for its positive meaning.`,
    },
    {
      q: `How do you pronounce ${name}?`,
      a: pronunciation ? `The pronunciation of ${name} is ${pronunciation}.` : `The pronunciation of ${name} is commonly spoken in Arabic and Islamic name traditions.`,
    },
    {
      q: `What personality traits are associated with ${name}?`,
      a: personality ? `${name} is often linked to ${personality}.` : `${name} is believed to reflect positive personality qualities and strong character traits.`,
    },
    {
      q: `What are variations of ${name}?`,
      a: data.name_variations?.length ? `Common variations include ${data.name_variations.slice(0, 5).join(', ')}.` : `There are several variations of ${name} used in different languages and cultures.`,
    },
    {
      q: `Why do parents choose the name ${name}?`,
      a: `${name} is chosen for its spiritual meaning, good origin, and positive cultural associations.`,
    },
  ];

  if (languages) {
    items.push({
      q: `In which languages is ${name} used?`,
      a: `${name} appears in languages such as ${languages}.`,
    });
  }

  if (data.similar_sounding_names?.length) {
    items.push({
      q: `What are names similar to ${name}?`,
      a: `Names similar to ${name} include ${data.similar_sounding_names.slice(0, 5).join(', ')}.`,
    });
  }

  return items.slice(0, 10);
}

/**
 * Generate structured data - stable, clean
 */
export function generateOptimizedSchemas(data, religion, slug) {
  const pageUrl = `${siteUrl}/names/${religion}/${slug}`;
  const name = data.name;
  const shortMeaning = data.short_meaning || data.meaning || '';
  const coreEmotion = extractCoreEmotion(shortMeaning);
  const faqItems = generateDynamicFaqItems(data, religion);

  const languageSnippet = formatLanguages(data);
  const personality = getPersonalitySummary(data);
  const luckyPieces = [];
  if (data.lucky_number) luckyPieces.push(`lucky number ${data.lucky_number}`);
  if (data.lucky_day) luckyPieces.push(`lucky day ${data.lucky_day}`);
  if (data.lucky_colors?.length) luckyPieces.push(`lucky colors ${data.lucky_colors.slice(0, 3).join(', ')}`);

  const descriptionParts = [`${name} means "${coreEmotion}"`, `${religion} name`];
  if (data.origin) descriptionParts.push(`${data.origin} origin`);
  if (personality) descriptionParts.push(`personality ${personality}`);
  if (languageSnippet) descriptionParts.push(`used in ${languageSnippet}`);
  if (luckyPieces.length) descriptionParts.push(luckyPieces.slice(0, 2).join(', '));

  const religionDisplay = religion === 'islamic' ? 'Islamic' :
                          religion === 'christian' ? 'Christian' :
                          religion === 'hindu' ? 'Hindu' : religion;

  // Build the article/OG description once and reuse it everywhere
  const outputDescription = generateOptimizedDescription(data, religion);
  const schemaDescription = `${name} — ${religionDisplay} baby name meaning: "${extractCoreEmotion(shortMeaning)}". Origin: ${data.origin || 'various'}.${data.lucky_number ? ` Lucky number ${data.lucky_number}.` : ''} Discover meaning, pronunciation, and cultural significance on NameVerse.`;

  const publishedDate = data.published_date || data.created_at || data.updated_at || new Date().toISOString().split('T')[0];
  const modifiedDate = data.updated_at || data.published_date || data.created_at || new Date().toISOString().split('T')[0];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": generateOptimizedTitle(data, religion),
    "description": schemaDescription,
    "url": pageUrl,
    "image": `${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(coreEmotion.substring(0, 40))}&religion=${religion}`,
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "inLanguage": "en",
    "author": { "@type": "Organization", "name": "NameVerse" },
    "publisher": {
      "@type": "Organization",
      "name": "NameVerse",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png`, "width": 512, "height": 512 }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "datePublished": publishedDate,
      "author": {
        "@type": "Organization",
        "name": "NameVerse"
      },
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
        "datePublished": publishedDate,
        "upvoteCount": 0,
        "author": {
          "@type": "Organization",
          "name": "NameVerse"
        }
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
      { "@type": "ListItem", "position": 2, "name": `${religion.charAt(0).toUpperCase() + religion.slice(1)} Names`, "item": `${siteUrl}/names/${religion}` },
      { "@type": "ListItem", "position": 3, "name": name, "item": pageUrl },
    ],
  };

  return {
    article: articleSchema,
    faq: faqSchema,
    faqData: faqItems,
    breadcrumb: breadcrumbSchema,
  };
}

/**
 * Main metadata generator - Stable, deterministic, SEO-safe
 */
export async function generateNamePageMetadata(data, religion, slug) {
  const pageUrl = `${siteUrl}/names/${religion}/${slug}`;
  const name = data.name;
  const shortMeaning = data.short_meaning || data.meaning || '';
  const religionDisplay = religion === 'islamic' ? 'Islamic' : religion === 'christian' ? 'Christian' : religion === 'hindu' ? 'Hindu' : religion;
  const publishedDate = data.published_date || data.created_at || data.updated_at || new Date().toISOString().split('T')[0];
  const modifiedDate = data.updated_at || data.published_date || data.created_at || new Date().toISOString().split('T')[0];

  // Safe meaning extraction for OG image
  const safeMeaning = extractCoreEmotion(shortMeaning);

  const title = generateOptimizedTitle(data, religion);
  const descriptionObj = generateOptimizedDescription(data, religion);
  const description = descriptionObj.desktop; // Use desktop description for default
  const keywords = generateOptimizedKeywords(data, religion);

  // Stable OG title (deterministic, not random)
  const ogTitle = `${name} Meaning in ${religion.charAt(0).toUpperCase() + religion.slice(1)}`;

  return {
    title,
    description: description,
    keywords,
    alternates: { canonical: pageUrl },

    openGraph: {
      title: ogTitle,
      description: description,
      url: pageUrl,
      siteName: 'NameVerse',
      type: 'website',
      images: [{
        url: `${siteUrl}/api/og?name=${encodeURIComponent(name)}&meaning=${encodeURIComponent(safeMeaning.substring(0, 40))}&religion=${religion}`,
        width: 1200,
        height: 630,
        alt: `${name} — ${religionDisplay} baby name meaning on NameVerse`,
      }],
    },

    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: description,
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
      'article:section': 'Baby Names',
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
    },
  };
}

export function generateNamePageSchemas(data, religion, slug) {
  return generateOptimizedSchemas(data, religion, slug);
}
