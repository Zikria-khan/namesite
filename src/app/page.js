import HomePageClient from "../components/HomePage/Homepage";
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import fs from 'fs';
import path from 'path';
import HeroSection from '@/components/HomePage/HeroSection';
import ContentSection from '@/components/HomePage/ContentSection';
import AuthorityStats from '@/components/HomePage/AuthorityStats';
import SearchTools from '@/components/HomePage/SearchTools';
import ReligiousNamesSection from '@/components/HomePage/ReligiousNamesSection';
import dynamic from 'next/dynamic';
import { getSiteUrl } from '@/lib/seo/site';

// ISR with 30-day cache
export const revalidate = 2592000; // 30 days

const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();

// Read blog posts data server-side
const blogPostsPath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
let latestArticles = [];
try {
  const fileContents = fs.readFileSync(blogPostsPath, 'utf8');
  const allPosts = JSON.parse(fileContents);
  const sortedPosts = allPosts
    .filter(post => post.publishDate)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  latestArticles = sortedPosts.slice(0, 6);
} catch (error) {
}

const publishedDate = new Date().toISOString().split('T')[0];

export const metadata = {
  title: validateMetaTitle('NameVerse — Cultural Name Knowledge Base | Linguistic Origin Analysis'),
  description: validateMetaDescription(
    'NameVerse is a Cultural Name Knowledge Base and Multilingual Onomastics System for structured cultural and linguistic analysis of personal names across civilizations. Explore linguistic origin analysis, cultural semantic interpretation, and historical naming evolution.'
  ),
  keywords: [
    'cultural name knowledge base',
    'linguistic origin analysis',
    'multilingual onomastics system',
    'cultural semantic interpretation',
    'historical naming evolution',
    'cross-cultural onomastic study',
    'linguistic intelligence database',
    'cultural naming research platform',
    'Islamic onomastics',
    'Christian onomastics',
    'Hindu onomastics',
    'name etymology research'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('NameVerse — Cultural Name Knowledge Base | Multilingual Onomastics'),
    description: validateMetaDescription(
      'A structured cultural and linguistic knowledge graph for human names. Multilingual onomastics system for cross-cultural name research, linguistic origin analysis, and cultural semantic interpretation.'
    ),
    url: `${DOMAIN}/`,
    type: 'website',
    siteName: 'NameVerse — Cultural Name Knowledge Base',
    images: [
      { url: `${DOMAIN}/logo.png`, width: 512, height: 512, alt: 'NameVerse — Cultural Name Knowledge Base' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: validateMetaTitle('NameVerse — Cultural Name Knowledge Base'),
    description: 'A structured cultural and linguistic knowledge graph for human names. Multilingual onomastics system for cross-cultural name research and analysis.'
  },
  alternates: {
    canonical: `${DOMAIN}/`,
    languages: { en: `${DOMAIN}/`, 'x-default': `${DOMAIN}/` }
  }
};

const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${DOMAIN}/#website`,
      "url": DOMAIN,
      "name": "NameVerse — Cultural Name Knowledge Base",
      "description": "A structured cultural and linguistic knowledge graph for human names. Multilingual onomastics system for cross-cultural name research, linguistic origin analysis, cultural semantic interpretation, and historical naming evolution across civilizations.",
      "inLanguage": "en-US",
      "publisher": {
        "@id": `${DOMAIN}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${DOMAIN}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "about": {
        "@type": "Thing",
        "name": "Cultural Onomastics — Linguistic and Cultural Name Analysis",
        "description": "Structured cultural and linguistic analysis of personal names across civilizations."
      }
    },
    {
      "@type": "Organization",
      "@id": `${DOMAIN}/#organization`,
      "name": "NameVerse",
      "alternateName": "NameVerse — Cultural Name Knowledge Base",
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.png`,
        "width": 512,
        "height": 512,
        "caption": "NameVerse — Cultural Name Knowledge Base"
      },
      "description": "NameVerse is a Cultural Name Knowledge Base and Multilingual Onomastics System for structured cultural and linguistic analysis of personal names across civilizations.",
      "foundingDate": "2025",
      "founders": [{ "@type": "Person", "name": "Zakriya Khan" }]
    },
    {
      "@type": "FAQPage",
      "@id": `${DOMAIN}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is NameVerse?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "upvoteCount": 0,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NameVerse is a Cultural Name Knowledge Base and Multilingual Onomastics System. It provides structured cultural and linguistic analysis of personal names across civilizations — including Islamic, Christian, and Hindu naming traditions — with linguistic origin analysis, cultural semantic interpretation, and historical naming evolution data.",
            "datePublished": publishedDate,
            "upvoteCount": 0,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "What types of linguistic analysis does NameVerse provide?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "upvoteCount": 0,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NameVerse provides comprehensive linguistic origin analysis including root language etymology, phonetic structure analysis, cultural semantic interpretation, historical naming evolution tracking, and cross-cultural onomastic patterns for personal names across multiple linguistic traditions.",
            "datePublished": publishedDate,
            "upvoteCount": 0,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "Are NameVerse linguistic analyses verified?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "upvoteCount": 0,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, NameVerse verifies linguistic analyses against authoritative sources: Islamic names against Quranic Arabic and classical dictionaries, Christian names against Biblical Hebrew and Greek concordances, and Hindu names against Sanskrit etymological references.",
            "datePublished": publishedDate,
            "upvoteCount": 0,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "How do I research names by cultural tradition on NameVerse?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "upvoteCount": 0,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can browse names by cultural tradition — Islamic (Arabic/Semitic linguistic roots), Christian (Biblical Hebrew/Aramaic/Greek roots), and Hindu (Sanskrit/Dravidian linguistic roots). Each section provides linguistic origin analysis, cultural semantic interpretation, and phonetic structure data.",
            "datePublished": publishedDate,
            "upvoteCount": 0,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${DOMAIN}/#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN },
        { "@type": "ListItem", "position": 2, "name": "Islamic Onomastics", "item": `${DOMAIN}/names/religion/islamic/1` },
        { "@type": "ListItem", "position": 3, "name": "Christian Onomastics", "item": `${DOMAIN}/names/religion/christian/1` },
        { "@type": "ListItem", "position": 4, "name": "Hindu Onomastics", "item": `${DOMAIN}/names/religion/hindu/1` }
      ]
    }
  ]
};

export default async function HomePage() {
  return <HomePageClient latestArticles={latestArticles} />;
}