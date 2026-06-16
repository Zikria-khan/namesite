/**
 * StructuredData Component
 * Generates JSON-LD structured data — Cultural & Linguistic Knowledge Graph
 * Replaced: weak WebPage/Article schema types with Dataset + ScholarlyArticle
 */

import { getSiteUrl } from '@/lib/seo/site';

export default function StructuredData({
  organization = false,
  website = false,
  breadcrumbs = [],
  collectionPage = null,
  faq = null
}) {
  const siteUrl = getSiteUrl();

  const schemas = [];

  if (organization) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "NameVerse",
      "alternateName": "NameVerse — Cultural Name Knowledge Base",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 192,
        "height": 192
      },
      "description": "NameVerse is a Cultural Name Knowledge Base and Multilingual Onomastics System for structured cultural and linguistic analysis of personal names across civilizations.",
      "sameAs": [
        "https://twitter.com/NameVerseOfficial"
      ],
      "knowsAbout": {
        "@type": "Thing",
        "name": "Cultural Onomastics",
        "description": "Structured cultural and linguistic analysis of personal names across civilizations."
      }
    });
  }

  if (website) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "NameVerse",
      "alternateName": "NameVerse — Cultural Name Knowledge Base",
      "url": siteUrl,
      "description": "A structured cultural and linguistic knowledge graph for human names. Multilingual onomastics system for cross-cultural name research and analysis.",
      "publisher": {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`
      },
      "inLanguage": "en-US",
      "about": {
        "@type": "Thing",
        "name": "Cultural Onomastics — Linguistic Name Analysis",
        "description": "Structured cultural and linguistic analysis of personal names across civilizations."
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    });
  }

  if (collectionPage) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": collectionPage.name,
      "description": collectionPage.description,
      "url": collectionPage.url,
      "isPartOf": {
        "@type": "WebSite",
        "name": "NameVerse — Cultural Name Knowledge Base",
        "url": siteUrl
      },
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": (collectionPage.items || []).slice(0, 20).map((item, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.title || item.name,
          "url": `${siteUrl}/${item.path || (item.slug ? `names/${item.slug}` : item._id ? `names/${item._id}` : '')}`
        }))
      }
    });
  }

  if (faq && Array.isArray(faq) && faq.length > 0) {
    const publishedDate = new Date().toISOString().split('T')[0];
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map((q, idx) => ({
        "@type": "Question",
        "name": q.question,
        "datePublished": publishedDate,
        "author": {
          "@type": "Organization",
          "name": "NameVerse"
        },
        "answerCount": 1,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer,
          "datePublished": publishedDate,
          "upvoteCount": 0,
          "author": {
            "@type": "Organization",
            "name": "NameVerse"
          }
        }
      }))
    });
  }

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`ld-${schema['@type']}-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}