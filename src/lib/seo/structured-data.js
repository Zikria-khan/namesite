/**
 * STRUCTURED DATA (Schema.org) — Cultural & Linguistic Knowledge Graph
 * Replaced: Product/Article schema types
 * With: Dataset, ScholarlyArticle, Linguistic system schemas
 */
import { getSiteUrl, absoluteUrl } from '@/lib/seo/site';

/**
 * Generate NameDataset schema for individual name pages
 * Structured cultural and linguistic analysis of personal names across civilizations.
 * @param {Object} nameData - Name data
 * @param {string} religion - Religion category
 * @param {string} slug - Name slug
 * @returns {Object} Dataset schema
 */
export function generateNameDatasetSchema(nameData, religion, slug) {
  const pageUrl = absoluteUrl(`/names/${religion}/${slug}`);
  const name = nameData.name || '';
  const coreMeaning = nameData.short_meaning || nameData.meaning || '';
  const origin = nameData.origin || 'Multiple linguistic traditions';
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `${name} — Linguistic Origin Analysis | NameVerse`,
    description: `Structured cultural and linguistic analysis of the personal name "${name}" across civilizations. Covers: root language etymology, phonetic structure analysis, cultural semantic interpretation, historical naming evolution, and cross-cultural onomastic patterns.`,
    url: pageUrl,
    version: '1.0',
    dateCreated: nameData.created_at || nameData.published_date || '2025-01-01',
    dateModified: nameData.updated_at || new Date().toISOString().split('T')[0],
    creator: {
      '@type': 'Organization',
      name: 'NameVerse',
      url: getSiteUrl()
    },
    publisher: {
      '@type': 'Organization',
      name: 'NameVerse',
      description: 'Cultural Name Knowledge Base — Multilingual Onomastics System'
    },
    keywords: [
      'linguistic origin analysis',
      'cultural semantic interpretation',
      'historical naming evolution',
      'cross-cultural onomastic study',
      name,
      `${name} etymology`,
      `${name} linguistic root`,
      `${name} cultural context`,
      origin
    ].filter(Boolean).join(', '),
    about: {
      '@type': 'Thing',
      name: 'Cultural Onomastics',
      description: 'Structured cultural and linguistic analysis of personal names across civilizations.'
    },
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'NameVerse Cultural Name Knowledge Base',
      url: getSiteUrl()
    },
    spatialCoverage: {
      '@type': 'Place',
      name: origin || 'Global'
    },
    inLanguage: 'en',
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'linguisticOrigin',
        value: origin
      },
      {
        '@type': 'PropertyValue',
        name: 'semanticMeaning',
        value: coreMeaning
      },
      {
        '@type': 'PropertyValue',
        name: 'culturalContext',
        value: nameData.religion || religion || 'Multicultural'
      },
      {
        '@type': 'PropertyValue',
        name: 'phoneticStructure',
        value: nameData.pronunciation?.english || ''
      },
      {
        '@type': 'PropertyValue',
        name: 'languageFamily',
        value: nameData.language_family || nameData.origin_language || ''
      },
      {
        '@type': 'PropertyValue',
        name: 'regionalUsage',
        value: Array.isArray(nameData.regional_usage) ? nameData.regional_usage.join(', ') : ''
      }
    ]
  };

  return schema;
}

/**
 * Generate ScholarlyArticle schema for name pages
 * Replaces the old "Article" basic SEO spam type
 */
export function generateNameScholarlyArticle(nameData, religion, slug) {
  const pageUrl = absoluteUrl(`/names/${religion}/${slug}`);
  const name = nameData.name || '';
  const coreMeaning = nameData.short_meaning || nameData.meaning || '';
  const origin = nameData.origin || '';
  const publishedDate = nameData.published_date || nameData.created_at || new Date().toISOString().split('T')[0];
  const modifiedDate = nameData.updated_at || publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: `${name} — Cultural & Linguistic Origin Analysis | NameVerse`,
    name: `${name} — Linguistic Origin Analysis`,
    description: `Linguistic origin analysis of the name "${name}": root language etymology, phonetic structure, cultural semantic interpretation across traditions, and historical naming evolution through civilizations. Part of the NameVerse multilingual onomastics knowledge base.`,
    url: pageUrl,
    image: absoluteUrl('/logo.png'),
    datePublished: publishedDate,
    dateModified: modifiedDate,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'NameVerse',
      description: 'Cultural Name Knowledge Base'
    },
    publisher: {
      '@type': 'Organization',
      name: 'NameVerse',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
        width: 512,
        height: 512
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    about: {
      '@type': 'Thing',
      name: 'Onomastics — Cultural Name Research',
      description: 'Structured cultural and linguistic analysis of personal names across civilizations.'
    },
    articleSection: 'Cultural Onomastics',
    keywords: `linguistic origin analysis, cultural semantic interpretation, ${name} etymology, ${origin ? `${origin} linguistics, ` : ''}historical naming evolution, cross-cultural onomastic study`,
    wordCount: 500,
    citation: {
      '@type': 'CreativeWork',
      name: 'NameVerse — Cultural Name Knowledge Base',
      url: getSiteUrl()
    }
  };
}

/**
 * Generate FAQPage schema
 * @param {Array} faqs - Array of {question, answer} objects
 * @returns {Object} FAQPage schema
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
      author: {
        '@type': 'Organization',
        name: 'NameVerse'
      },
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a,
        datePublished: publishedDate,
        upvoteCount: 0,
        author: {
          '@type': 'Organization',
          name: 'NameVerse'
        }
      }
    }))
  };
}

/**
 * Generate BreadcrumbList schema
 * @param {Array} items - Breadcrumb items [{label, href}]
 * @returns {Object} BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getSiteUrl()
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && { item: absoluteUrl(item.href) })
      }))
    ]
  };
}

/**
 * Generate CollectionPage schema for category pages
 * @param {Object} data - Collection data
 * @returns {Object} CollectionPage schema
 */
export function generateCollectionSchema(data) {
  const religion = data.religion || '';
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.title || `${(religion.charAt(0).toUpperCase() + religion.slice(1))} — Linguistic Name Collection`,
    description: data.description || `Structured cultural and linguistic analysis of ${religion} personal names. Browse cross-cultural onomastic data with etymological roots, semantic meanings, and regional variations.`,
    url: absoluteUrl(data.url || '/names'),
    isPartOf: {
      '@type': 'WebSite',
      name: 'NameVerse',
      description: 'Cultural Name Knowledge Base — Multilingual Onomastics Research System',
      url: getSiteUrl()
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
          url: absoluteUrl('/names/' + (religion || name.religion) + '/' + name.slug)
        }
      }))
    }
  };
}

/**
 * Render JSON-LD script tag
 * @param {Object} schema - Schema object
 * @returns {JSX} Script element
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

export default {
  generateNameDatasetSchema,
  generateNameScholarlyArticle,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateCollectionSchema,
  renderSchema,
};