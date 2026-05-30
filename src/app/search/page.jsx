import GlobalSearchClient from './GlobalSearchClient';
import { Suspense } from 'react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';

const publishedDate = new Date().toISOString().split('T')[0];
const DOMAIN = getSiteUrl();

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Search Baby Names by Meaning, Origin & Religion | NameVerse'),
  description: validateMetaDescription(
    'Search 65,000+ verified Islamic, Hindu & Christian baby names instantly. Filter by religion, gender, meaning, origin, and trending names for 2026. Fast, accurate, free name search.'
  ),
  keywords: [
    'search baby names',
    'baby name search engine',
    'find baby names by meaning',
    'search names by origin',
    'search baby names by religion',
    'Islamic baby name search',
    'Hindu baby name search',
    'Christian baby name search',
    'trending baby names 2026',
    'NameVerse search',
    'baby name finder',
    'name search with meanings',
    'find perfect baby name',
    'baby name generator search'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Search Baby Names by Meaning, Origin & Religion | NameVerse'),
    description: validateMetaDescription(
      'Discover 65,000+ verified baby names across Islamic, Hindu & Christian traditions. Search by meaning, origin, gender, and find trending names with authentic information.'
    ),
    url: `${DOMAIN}/search`,
    type: 'website',
    siteName: 'NameVerse',
    image: `${DOMAIN}/og-search.png`
  },
  twitter: {
    card: 'summary_large_image',
    title: validateMetaTitle('Search Baby Names - NameVerse'),
    description: 'Search 65,000+ Islamic, Hindu & Christian baby names with meanings and origins',
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

const searchPageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${DOMAIN}/search/#webpage`,
      "url": `${DOMAIN}/search`,
      "name": "Baby Name Search - NameVerse",
      "description": "Search 65,000+ verified Islamic, Hindu & Christian baby names instantly with meanings, origins, and trending data",
      "isPartOf": { "@id": `${DOMAIN}/#website` },
      "primaryImageOfPage": { "@id": `${DOMAIN}/#primaryImage` },
      "breadcrumb": { "@id": `${DOMAIN}/search/#breadcrumb` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${DOMAIN}/search/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": DOMAIN
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Search",
          "item": `${DOMAIN}/search`
        }
      ]
    },
    {
      "@type": "SearchAction",
      "@id": `${DOMAIN}/search/#search-action`,
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${DOMAIN}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string",
      "description": "Search baby names on NameVerse"
    },
    {
      "@type": "FAQPage",
      "@id": `${DOMAIN}/search/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I search for baby names on NameVerse?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply type a baby name in the search box to instantly find results. You can filter by religion (Islamic, Hindu, Christian) to narrow your search. Results include name meanings, origin, gender, and other relevant details.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "Can I search baby names by meaning or origin?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our search engine scans through name meanings and origins. You can search for names by their meaning (e.g., 'light', 'strong'), and NameVerse will display all names with that meaning across different religions and traditions.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "Is the NameVerse baby name search free?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, NameVerse search is completely free. Access 65,000+ verified baby names with authentic meanings and information at no cost. No registration required.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "How many baby names can I search on NameVerse?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NameVerse features 65,000+ verified baby names including 25,000+ Islamic Quranic names, 20,000+ Hindu Sanskrit names, and 15,000+ Christian Biblical names. All names are authentic with verified meanings and origins.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "What are the trending baby names in 2026?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Popular baby names trending in 2026 include Muhammad, Rayan, and Aisha (Islamic), Liam, Noah, and Emma (Christian), and Vihaan, Arjun, and Ananya (Hindu). Search NameVerse to discover more trending names and their meanings.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "Can I filter baby names by gender?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, each search result shows the gender of the name (Boy/Girl/Unisex). You can browse baby names by religion and see gender information for each name along with its meaning and origin.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "Are the baby name meanings verified?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. NameVerse verifies Islamic names against Quranic text and Arabic dictionaries, Christian names against Biblical concordances, and Hindu names against Sanskrit etymological references. Our verification accuracy rate is 98%.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        },
        {
          "@type": "Question",
          "name": "How does NameVerse instant search work?",
          "answerCount": 1,
          "datePublished": publishedDate,
          "author": { "@type": "Organization", "name": "NameVerse" },
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "NameVerse uses a fast, client-side search that instantly filters through 65,000+ names as you type. Simply select your preferred religion filter (Islamic, Hindu, Christian, or All) and start typing to see real-time results with meanings and details.",
            "datePublished": publishedDate,
            "author": { "@type": "Organization", "name": "NameVerse" }
          }
        }
      ]
    }
  ]
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
        
        {/* Content Section with FAQs and Information */}
        <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Content */}
            <article className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Find the Perfect Baby Name with NameVerse Search
              </h2>
              
              <p className="text-gray-700 mb-6 text-base leading-relaxed">
                NameVerse Search is your comprehensive baby name discovery tool with access to 65,000+ verified names from Islamic, Hindu, and Christian traditions. Our powerful search engine helps you find the perfect name by meaning, origin, religion, and gender in real-time.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                How to Search Baby Names
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Enter any baby name in the search box to find instant results</li>
                <li>Search by name meaning (e.g., "light", "strong", "peaceful")</li>
                <li>Filter by religion: Islamic, Hindu, Christian, or browse all</li>
                <li>View detailed information including gender, origin, and cultural significance</li>
                <li>Click any result to see the complete name profile with extended meanings</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Our Baby Name Database
              </h3>
              <p className="text-gray-700 mb-4 text-base leading-relaxed">
                NameVerse maintains a comprehensive database of baby names across three major traditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Islamic Names:</strong> 25,000+ Quranic and Arabic names with verified meanings</li>
                <li><strong>Hindu Names:</strong> 20,000+ Sanskrit and Vedic names with cultural context</li>
                <li><strong>Christian Names:</strong> 15,000+ Biblical and modern Christian names</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Search Features
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>⚡ <strong>Instant Search:</strong> Real-time filtering as you type</li>
                <li>🌍 <strong>Multi-Religion Support:</strong> Search across or within specific traditions</li>
                <li>✓ <strong>Verified Meanings:</strong> 98% accuracy in name meanings and origins</li>
                <li>👶 <strong>Gender Information:</strong> Boy, Girl, and Unisex name categories</li>
                <li>📚 <strong>Detailed Profiles:</strong> Extended meanings, origins, and cultural significance</li>
                <li>🔥 <strong>Trending Names:</strong> Discover popular baby names for 2026</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Why Choose NameVerse Search?
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Comprehensive database with 65,000+ verified names</li>
                <li>Fast, user-friendly search interface</li>
                <li>Accurate meanings verified against authentic sources</li>
                <li>Completely free access to all baby names</li>
                <li>No registration or account required</li>
                <li>Mobile-friendly search experience</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                Frequently Asked Questions
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  What if I search for a meaning instead of a name?
                </h4>
                <p className="text-gray-700 text-base">
                  Our search engine scans through name meanings, so you can search for names by their meaning. For example, search "light" to find all names with that meaning across different religions.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I find names by letter?
                </h4>
                <p className="text-gray-700 text-base">
                  Yes! Browse names by starting letter in our main name categories, or use our search to quickly find all names starting with a specific letter.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  How often is the name database updated?
                </h4>
                <p className="text-gray-700 text-base">
                  Our database is regularly updated with new names, trending information for 2026, and verified meaning corrections to ensure accuracy.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 my-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I save or compare names?
                </h4>
                <p className="text-gray-700 text-base">
                  Click on any name result to view its complete profile. You can browse multiple names across different traditions to compare meanings and origins.
                </p>
              </div>
            </article>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Start Searching for the Perfect Baby Name Today
              </h3>
              <p className="text-gray-700 mb-6 text-base">
                With 65,000+ verified names across Islamic, Hindu, and Christian traditions, NameVerse helps you find a meaningful name with authentic cultural significance.
              </p>
              <a
                href="#search"
                className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition"
              >
                Search Baby Names Now
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
