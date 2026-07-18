import GlobalSearchClient from './GlobalSearchClient';
import { Suspense } from 'react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';

const publishedDate = new Date().toISOString().split('T')[0];
const DOMAIN = getSiteUrl();

// Structured data for search page
const searchPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": `${DOMAIN}/search`,
  "name": "NameVerse Cultural Name Research",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${DOMAIN}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

// 30-day cache for search results — single source of truth: src/lib/cache/cache-config.js SEARCH_TTL_SECONDS = 2592000
export const revalidate = 2592000;

export const metadata = {
  title: validateMetaTitle('Search Personal Names — Linguistic Origin Analysis | NameVerse'),
  description: validateMetaDescription(
    'Search 65,000+ personal names with linguistic origin analysis across Islamic, Christian, and Hindu traditions. Find names by linguistic root, cultural context, and semantic meaning. Free cultural onomastics research tool.'
  ),
  keywords: [
    'linguistic origin analysis search',
    'cultural onomastics search',
    'personal name research',
    'name etymology search',
    'Islamic cultural name research',
    'Hindu name linguistic analysis',
    'Christian name etymology',
    'cross-cultural name search',
    'onomastics research tool',
    'NameVerse knowledge base'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Search Personal Names — Linguistic Origin Analysis | NameVerse'),
    description: validateMetaDescription(
      'Search 65,000+ personal names with linguistic origin analysis across Islamic, Christian, and Hindu cultural traditions. Free onomastics research system.'
    ),
    url: `${DOMAIN}/search`,
    type: 'website',
    siteName: 'NameVerse — Cultural Name Knowledge Base',
    image: `${DOMAIN}/og-search.png`
  },
  twitter: {
    card: 'summary_large_image',
    title: validateMetaTitle('Search Cultural Names — NameVerse'),
    description: 'Search 65,000+ personal names with linguistic origin analysis and cultural semantic interpretation.',
    image: `${DOMAIN}/og-search.png`
  },
  alternates: {
    canonical: `${DOMAIN}/search`,
    languages: {
      en: `${DOMAIN}/search`,
      'x-default': `${DOMAIN}/search`
    }
  }
};

export default function SearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchPageStructuredData) }}
      />
      <main>
        <Suspense fallback={<div className="p-6 text-center text-gray-600">Loading search…</div>}>
          <GlobalSearchClient />
        </Suspense>
        
        {/* Content Section with research context */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Cultural Name Research with NameVerse Search
              </h2>
              
              <p className="text-gray-700 mb-6 text-base leading-relaxed">
                NameVerse is a Cultural Name Knowledge Base providing linguistic origin analysis for 65,000+ personal names across Islamic, Christian, and Hindu traditions. Our search engine enables cross-cultural onomastics research by meaning, linguistic root, cultural context, and gender classification.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                How to Research Personal Names
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Enter any personal name to find its linguistic origin analysis</li>
                <li>Search by semantic meaning (e.g., "light", "strength", "peace")</li>
                <li>Filter by cultural tradition: Islamic, Hindu, Christian</li>
                <li>View linguistic root etymology, phonetic structure, and cultural context</li>
                <li>Access complete name profiles with historical evolution data</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Linguistic Name Database
              </h3>
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                NameVerse maintains a comprehensive onomastics database across three major cultural traditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Islamic Onomastics:</strong> 25,000+ names of Arabic and Semitic linguistic origin</li>
                <li><strong>Hindu Onomastics:</strong> 20,000+ names of Sanskrit and Dravidian linguistic origin</li>
                <li><strong>Christian Onomastics:</strong> 15,000+ names of Hebrew, Aramaic, and Greek linguistic origin</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Research Features
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>⚡ <strong>Instant Search:</strong> Real-time filtering across the knowledge base</li>
                <li>🌍 <strong>Multi-Tradition Support:</strong> Research across or within specific cultural traditions</li>
                <li>✓ <strong>Verified Linguistic Data:</strong> 98% accuracy in etymological analysis</li>
                <li>👤 <strong>Gender Classification:</strong> Masculine, Feminine, and Personal name categories</li>
                <li>📚 <strong>Detailed Profiles:</strong> Root etymology, phonetic structure, cultural context, and historical evolution</li>
                <li>📈 <strong>Trending Research:</strong> Discover names gaining scholarly interest in 2026</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Frequently Asked Questions
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I search names by semantic meaning?
                </h4>
                <p className="text-gray-700 text-base">
                  Yes. Our search engine scans through semantic meanings, so you can find names by their cultural interpretation. For example, search "light" to find all names with that semantic meaning across different cultural traditions.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I find names by phonetic structure?
                </h4>
                <p className="text-gray-700 text-base">
                  Yes. Browse names by starting letter in our main research categories, or use our search to quickly find all names starting with a specific letter for phonetic analysis.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How often is the name database updated?
                </h4>
                <p className="text-gray-700 text-base">
                  Our linguistic database is regularly updated with new etymological research, cross-cultural data for 2026, and verified linguistic corrections to ensure scholarly accuracy.
                </p>
              </div>
            </article>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Begin Your Linguistic Name Research Today
              </h3>
              <p className="text-gray-700 mb-6 text-base">
                With 65,000+ personal names across Islamic, Christian, and Hindu traditions, NameVerse provides linguistic origin analysis and cultural semantic interpretation for scholars and researchers.
              </p>
              <a
                href="#search"
                className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition"
              >
                Search Cultural Names
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}