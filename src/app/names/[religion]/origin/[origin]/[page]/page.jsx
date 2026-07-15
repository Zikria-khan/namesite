import Link from 'next/link';
import { Sparkles, Moon, ChevronLeft, ChevronRight, Search, Grid3X3, BookOpen } from 'lucide-react';
import { getSiteUrl, absoluteUrl } from '@/lib/seo/site';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import { validateMetaTitle, validateMetaDescription, generateCanonicalUrl } from '@/lib/seo/meta-helpers';
import { serverFetchNamesWithAdvancedFilters } from '@/lib/api/server-fetch';
import BlogSection from '@/components/Blog/BlogSection';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
const STATIC_ORIGINS = ['arabic', 'persian', 'turkish', 'indian', 'english', 'other'];

// ISR with 60-day cache to minimize writes
export const revalidate = 31536000; // 365 days
export const dynamicParams = true;

// Pre-generate origin pages at build time
export async function generateStaticParams() {
  // Disabled pre-generation for origin listing pages to stay within static page budget.
  // Origin pages will be generated on-demand via ISR.
  return [];
}

function resolveOrigin(origin, availableOrigins) {
  if (!origin) return 'arabic';
  const normalized = origin.toString().trim().toLowerCase();
  const exactMatch = availableOrigins.find((value) => String(value).toLowerCase() === normalized);
  if (exactMatch) return String(exactMatch);
  const fallbackMatch = STATIC_ORIGINS.find((value) => value.toLowerCase() === normalized);
  return fallbackMatch || origin.toLowerCase();
}

function validateAndSanitizeParams(params, availableOrigins) {
  const { religion, origin, page } = params;

  // Handle common variations for religion normalization
  let normalizedReligion = religion?.toLowerCase();
  if (normalizedReligion === 'islam' || normalizedReligion === 'muslim') normalizedReligion = 'islamic';
  if (normalizedReligion === 'hinduism') normalizedReligion = 'hindu';
  if (normalizedReligion === 'christianity') normalizedReligion = 'christian';
  normalizedReligion = VALID_RELIGIONS.includes(normalizedReligion) ? normalizedReligion : 'islamic';
  const normalizedOrigin = resolveOrigin(origin, availableOrigins);
  const normalizedPage = parseInt(page) > 0 ? parseInt(page) : 1;

  return {
    religion: normalizedReligion,
    origin: normalizedOrigin,
    page: normalizedPage,
  };
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const religion = VALID_RELIGIONS.includes(awaitedParams.religion?.toLowerCase()) ? awaitedParams.religion.toLowerCase() : 'islamic';
  const origin = resolveOrigin(awaitedParams.origin, STATIC_ORIGINS);
  const page = parseInt(awaitedParams.page, 10) > 0 ? parseInt(awaitedParams.page, 10) : 1;
  const religionLabel = religion.charAt(0).toUpperCase() + religion.slice(1);
  const originLabel = origin.charAt(0).toUpperCase() + origin.slice(1);

  // Fetch pagination data for prev/next
  const response = await serverFetchNamesWithAdvancedFilters({ religion, origin, page, limit: 50 });
  const pagination = response.pagination || { totalPages: 1, totalCount: 0 };
  const totalPages = pagination.totalPages || 1;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevPageUrl = hasPrev ? absoluteUrl(`/names/${religion}/origin/${origin}/${page - 1}`) : null;
  const nextPageUrl = hasNext ? absoluteUrl(`/names/${religion}/origin/${origin}/${page + 1}`) : null;

  const canonical = generateCanonicalUrl(`/names/${religion}/origin/${origin}/${page}`);
  const ogImage = `${getSiteUrl()}/opengraph-image`;

  const titleRaw = page === 1
    ? `${originLabel} Origin ${religionLabel} Baby Names with Meanings & Lucky Numbers | NameVerse`
    : `${originLabel} Origin ${religionLabel} Baby Names - Page ${page} | NameVerse`;

  const descRaw = page === 1
    ? `Discover authentic ${religionLabel} baby names from ${originLabel} origin with detailed meanings, pronunciation, lucky numbers, and cultural background. Browse our curated collection of ${originLabel} origin ${religionLabel} names on NameVerse — trusted by parents worldwide.`
    : `Browse page ${page} of ${religionLabel} baby names from ${originLabel} origin. Find detailed name meanings, pronunciation guides, lucky numbers, and cultural origins for the perfect ${religionLabel} name.`;

  const seoTitle = validateMetaTitle(titleRaw);
  const seoDescription = validateMetaDescription(descRaw);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      `${originLabel} origin ${religionLabel} baby names`,
      `${religionLabel} names from ${originLabel}`,
      `${originLabel} name meanings and origins`,
      `${originLabel} origin baby name list`,
      `${religionLabel} baby names with lucky numbers ${originLabel}`,
      `2026 ${originLabel} origin ${religionLabel} names`,
      `${religionLabel} baby names from ${originLabel}`,
      `NameVerse`
    ].join(', '),
    alternates: {
      canonical,
      languages: {
        en: canonical,
        'x-default': canonical,
      },
    },
    openGraph: {
      title: validateMetaTitle(`${originLabel} Origin ${religionLabel} Baby Names with Meanings | NameVerse`),
      description: validateMetaDescription(
        `Discover authentic ${religionLabel} baby names from ${originLabel} origin with meanings, pronunciation, and lucky numbers on NameVerse.`
      ),
      url: canonical,
      type: 'website',
      siteName: 'NameVerse',
      images: [
        {
          url: ogImage,
          alt: `${originLabel} origin ${religionLabel} baby names | NameVerse`,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: validateMetaTitle(`${originLabel} Origin ${religionLabel} Baby Names | NameVerse`),
      description: validateMetaDescription(
        `Find authentic ${religionLabel} baby names from ${originLabel} origin with meanings and lucky numbers on NameVerse.`
      ),
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    other: {
      ...(hasPrev ? { 'link-prev': `<${prevPageUrl}>; rel="prev"` } : {}),
      ...(hasNext ? { 'link-next': `<${nextPageUrl}>; rel="next"` } : {}),
    },
  };
}

function generateSlug(name) {
  if (!name || typeof name !== 'string') return '';
  return createSafeSlug(name);
}

export default async function OriginNamesPage({ params }) {
  const rawParams = await params;
  const availableOrigins = STATIC_ORIGINS;
  const { religion, origin, page } = validateAndSanitizeParams(rawParams, availableOrigins);
  const religionLabel = religion.charAt(0).toUpperCase() + religion.slice(1);
  const originLabel = origin.charAt(0).toUpperCase() + origin.slice(1);

  let names = [];
  let pagination = { totalPages: 1, totalCount: 0 };

  const response = await serverFetchNamesWithAdvancedFilters({
    religion,
    origin,
    page,
    limit: 50,
    sort: 'asc',
  });

  names = response.data || [];
  names = names.filter(item => item.name && typeof item.name === 'string');
  pagination = response.pagination || { totalPages: 1, totalCount: 0 };

  // If backend is in degraded state, show loading UI instead of error page
  // NEVER return 404 for uncertain data
  if (response.error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Origin</h1>
          <p className="text-gray-600 mb-6">
            We're experiencing connectivity issues. Please refresh the page or try again later.
          </p>
          <Link
            href={`/names/${religion}/letter/a/1`}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            Browse All Names
          </Link>
        </div>
      </main>
    );
  }

  const { totalPages = 1, totalCount = 0 } = pagination;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const prevUrl = hasPrev ? `/names/${religion}/origin/${origin}/${page - 1}` : null;
  const nextUrl = hasNext ? `/names/${religion}/origin/${origin}/${page + 1}` : null;

  const canonical = generateCanonicalUrl(`/names/${religion}/origin/${origin}/${page}`);

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: `${religionLabel} Names`, item: absoluteUrl(`/names/${religion}`) },
      { '@type': 'ListItem', position: 3, name: 'Origins', item: absoluteUrl(`/names/${religion}/origin/arabic/1`) },
      { '@type': 'ListItem', position: 4, name: `${originLabel} Origin`, item: absoluteUrl(`/names/${religion}/origin/${origin}/1`) },
      ...(page > 1 ? [{ '@type': 'ListItem', position: 5, name: `Page ${page}`, item: canonical }] : [])
    ],
  };

  // Collection page schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${religionLabel} Baby Names from ${originLabel} Origin`,
    description: `A curated collection of ${religionLabel} baby names of ${originLabel} origin, each with authentic meanings, cultural significance, and lucky numbers.`,
    url: canonical,
  };

  // FAQ items for collection page
  const faqItems = [
    {
      question: `What are the most popular ${religionLabel} baby names from ${originLabel} origin?`,
      answer: `Our collection features ${totalCount}+ ${religionLabel} baby names of ${originLabel} origin. These names are cherished for their connection to ${originLabel} linguistic and cultural heritage, offering families meaningful naming choices that honor tradition while staying relevant.`,
    },
    {
      question: `What cultural significance do ${originLabel} origin ${religionLabel} names have?`,
      answer: `${originLabel} origin names within ${religionLabel} tradition carry the rich linguistic heritage and cultural stories of their source. Parents choose these names to connect their children to specific historical, geographical, or ethnic roots while maintaining the spiritual framework of ${religionLabel} naming customs.`,
    },
    {
      question: `How do I choose a ${originLabel} origin ${religionLabel} name?`,
      answer: `Consider the name's authentic meaning in its original language, ease of pronunciation in your household, potential nickname variations, family traditions, and how the name sounds with your surname. Research the historical context and verify that the meaning aligns with your values.`,
    },
    {
      question: `Are ${originLabel} origin ${religionLabel} names suitable for both genders?`,
      answer: `Many ${originLabel} origin names work beautifully for any gender. Some are distinctly masculine or feminine in their cultural context, while others are versatile. Check the gender classification on each name card and explore the full collection to find options that match your preferences.`,
    },
    {
      question: `What is the meaning behind ${originLabel} language names?`,
      answer: `{originLabel} names are rooted in rich linguistic traditions spanning centuries. Their meanings often reflect nature, spirituality, virtues, or aspirations. Understanding the original meaning helps parents connect more deeply with their chosen name's significance.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>{totalCount} Names Found</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Names from {origin.charAt(0).toUpperCase() + origin.slice(1)} Origin
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            Page {page} of {totalPages} • Discover beautiful names from {origin} origin
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li><Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">Home</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/names/${religion}/letter/a/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">All Names</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/names/${religion}/origin/arabic/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">Origins</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/names/${religion}/origin/${origin}/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">{originLabel} Origin</Link></li>
          {page > 1 && <><li className="text-gray-400">/</li><li className="text-emerald-700 font-semibold">Page {page}</li></>}
        </ol>
      </nav>

      {/* REVENUE BANNERS — center of origin listing content */}


      {/* Origin Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {availableOrigins.map((ori) => (
            <Link
              key={ori}
              href={`/names/${religion}/origin/${ori}/1`}
              className={`px-4 py-2 flex items-center justify-center rounded-lg font-semibold transition-all ${
                ori === origin
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {ori.charAt(0).toUpperCase() + ori.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {/* Names Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        {names.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Names Found</h2>
            <p className="text-gray-600">No names found from {origin} origin. Try another origin.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {names.slice(0, Math.ceil(names.length / 2)).map((nameItem, index) => {
                const displayMeaning = nameItem.short_meaning || nameItem.meaning || nameItem.long_meaning || 'No meaning available';
                const itemKey = nameItem.slug || generateSlug(nameItem.name) || nameItem._id || index;

                return (
                  <Link
                    key={itemKey}
                    href={`/names/${religion}/${generateSlug(nameItem.name || '')}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:border-emerald-300 group hover:-translate-y-1 block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {nameItem.name || 'Unknown'}
                        </h3>
                        {nameItem.quranicReference && (
                          <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                            Quranic
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Moon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>

                    <p className="text-emerald-600 font-semibold text-lg mb-4">
                      "{displayMeaning}"
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Origin:</span>
                        <span>{nameItem.origin || 'Unknown'}</span>
                      </div>
                      {nameItem.luckyNumber && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Lucky Number:</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full font-bold">
                            {nameItem.luckyNumber || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {names.slice(Math.ceil(names.length / 2)).map((nameItem, index) => {
                const displayMeaning = nameItem.short_meaning || nameItem.meaning || nameItem.long_meaning || 'No meaning available';
                const itemKey = nameItem.slug || generateSlug(nameItem.name) || nameItem._id || index;
                return (
                  <Link
                    key={itemKey}
                    href={`/names/${religion}/${generateSlug(nameItem.name || '')}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:border-emerald-300 group hover:-translate-y-1 block"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {nameItem.name || 'Unknown'}
                        </h3>
                        {nameItem.quranicReference && (
                          <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                            Quranic
                          </span>
                        )}
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Moon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>

                    <p className="text-emerald-600 font-semibold text-lg mb-4">
                      "{displayMeaning}"
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Origin:</span>
                        <span>{nameItem.origin || 'Unknown'}</span>
                      </div>
                      {nameItem.luckyNumber && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Lucky Number:</span>
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full font-bold">
                            {nameItem.luckyNumber || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4">
              {hasPrev && (
                <Link
                  href={prevUrl}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Link>
              )}

              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>

              {hasNext && (
                <Link
                  href={nextUrl}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </>
        )}
      </section>


      {/* Rich Content Section - Origin Specific */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            The History &amp; Culture of {originLabel} Origin {religionLabel} Baby Names
          </h2>
          <p className="text-gray-600 mb-4">
            The {originLabel} origin represents one of the richest linguistic and cultural traditions in naming history. Names from this region have shaped identities across {totalCount}+ entries in our database, spanning centuries of cultural exchange, migration, and adaptation. The historical depth of {originLabel} naming traditions connects modern families to ancient civilizations that flourished along trade routes, in fertile river valleys, and within vibrant urban centers that served as centers of learning and culture.
          </p>
          <p className="text-gray-600 mb-4">
            {originLabel} names within the {religionLabel} tradition blend beautifully with religious naming customs, creating a unique synthesis of spiritual significance and linguistic beauty. These names maintain their authentic linguistic meaning while fitting seamlessly into {religionLabel} cultural and spiritual contexts. The combination creates names that feel both historically rooted and contemporary — suitable for global families who want their children to carry a piece of this rich heritage forward into the modern world.
          </p>
          <p className="text-gray-600 mb-4">
            Throughout history, {originLabel} naming conventions were deeply influenced by regional dialects, ruling dynasties, religious scholarship, and poetic movements. Many {originLabel} names were originally given based on specific circumstances of birth, family aspirations, or spiritual significance. The poetic nature of {originLabel} languages means that even practical names carry layers of metaphorical meaning — from nature imagery and celestial references to virtues like generosity, patience, and wisdom.
          </p>
          <p className="text-gray-600 mb-4">
            Popular {originLabel} names in {religionLabel} tradition often reflect core values: strength, beauty, devotion, knowledge, and grace. Names like those in our collection of {totalCount}+ {religionLabel} {originLabel} origin names have been carefully researched for accuracy in meaning and cultural context. Each one represents a story — of families who chose it, communities who cherished it, and children who have proudly borne it across generations.
          </p>
          <p className="text-gray-600">
            Preserving these naming traditions in a global context is more important than ever. As families dispersed across continents, {originLabel} names traveled with them, adapting to new languages while retaining their essential character. Today, {religionLabel} parents choosing {originLabel} origin names are participating in a rich living tradition — connecting their children to a heritage that spans continents and centuries while celebrating the universal values that all cultures share.
          </p>
        </div>
      </section>

      {/* Naming Tips Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Popular {originLabel} Names &amp; Naming Traditions for {religionLabel} Families
          </h2>
          <p className="text-gray-600 mb-4">
            When selecting a {originLabel} origin name, consider these important factors: understand the authentic meaning in its original language, practice pronouncing it easily, consider family and cultural connections, evaluate potential nicknames, and think about how it sounds across a lifetime. Many {originLabel} names have beautiful phonetic qualities — the melodic sounds of {origin === 'arabic' ? 'Arabic script and Arabic-derived languages' : origin === 'persian' ? 'Persian poetry and Farsi literature' : origin === 'turkish' ? 'Turkish vowels and Ottoman tradition' : origin === 'indian' ? 'Sanskrit syllables and Hindi phonetics' : origin === 'english' ? 'English phonetics and Anglo-Saxon roots' : 'various linguistic traditions'} make them particularly appealing for families who appreciate linguistic beauty.
          </p>
          <p className="text-gray-600 mb-4">
            Many parents appreciate {originLabel} origin names for their melodic quality and rich historical associations. These names often have beautiful phonetic structures that work well across different languages and cultures, making them excellent choices for multicultural families. The flexibility of {originLabel} names means they can be easily combined with middle names from other traditions, allowing for creative and deeply personal naming choices that honor multiple heritages.
          </p>
          <p className="text-gray-600 mb-4">
            Use our tools to save favorites, compare meanings, and explore sibling name options. Each {originLabel} name includes lucky number associations and origin details to enrich your naming journey. Consider how the meaning of a potential name might resonate with your hopes for your child — whether you hope they grow into qualities like wisdom, kindness, leadership, or creativity. Many {religionLabel} families choose {originLabel} names specifically for the virtues they embody.
          </p>
          <p className="text-gray-600">
            The process of choosing a {originLabel} origin {religionLabel} name is deeply personal but can also be a shared family experience. Grandparents, siblings, and extended family members often contribute suggestions and stories about names that have special significance across generations. We encourage you to use our database as a starting point for these important conversations, and to trust your instincts as you narrow down the perfect name for your little one.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {faqItems.map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left font-semibold text-gray-900 hover:text-emerald-700 transition-colors list-none">
                <span className="pr-4">{faq.question}</span>
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-open:rotate-180 transition-transform text-lg font-light">
                  ⌄
                </span>
              </summary>
              <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-emerald-50 pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Cross-page internal links */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Explore More Ways to Browse</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href={`/names/${religion}/letter/a/1`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
              <Grid3X3 className="w-3.5 h-3.5" /> Browse by Letter
            </Link>
            <Link href={`/names/${religion}/categories/modern/1`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
              <Grid3X3 className="w-3.5 h-3.5" /> Browse by Category
            </Link>
            <Link href="/search" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
              <Search className="w-3.5 h-3.5" /> Search All Names
            </Link>
            <Link href="/names" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
              <BookOpen className="w-3.5 h-3.5" /> All Traditions
            </Link>
          </div>
        </div>
      </section>

      <BlogSection religion={religion} title={`${religion.charAt(0).toUpperCase() + religion.slice(1)} Name Guides`} />
    </main>
  );
}