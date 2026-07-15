import Link from 'next/link';
import { serverFetchNamesWithAdvancedFilters } from '@/lib/api/server-fetch';
import { validateMetaTitle, validateMetaDescription, generateCanonicalUrl } from '@/lib/seo/meta-helpers';
import { getSiteUrl, absoluteUrl } from '@/lib/seo/site';
import { Sparkles, Moon, ChevronLeft, ChevronRight, Search, Grid3X3, BookOpen } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import BlogSection from '@/components/Blog/BlogSection';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
const STATIC_CATEGORIES = ['modern', 'traditional', 'nature', 'religious', 'classical', 'unique'];

// ISR with 60-day cache to minimize writes
export const revalidate = 31536000; // 365 days
export const dynamicParams = true;

// Pre-generate category pages at build time
export async function generateStaticParams() {
  // Disabled pre-generation for category listing pages to stay within the
  // build-time static page budget. These pages will be generated on-demand via ISR.
  return [];
}

function normalizeReligion(religion) {
  if (!religion || typeof religion !== 'string') return null;
  const normalized = religion.toLowerCase();

  // Handle common variations
  if (normalized === 'islam' || normalized === 'muslim') return 'islamic';
  if (normalized === 'hinduism') return 'hindu';
  if (normalized === 'christianity') return 'christian';

  const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
  return VALID_RELIGIONS.includes(normalized) ? normalized : null;
}

function resolveCategory(category, availableCategories) {
  if (!category) return 'modern';
  const normalized = category.toString().trim().toLowerCase();
  const exactMatch = availableCategories.find((value) => String(value).toLowerCase() === normalized);
  if (exactMatch) return String(exactMatch);
  const fallbackMatch = STATIC_CATEGORIES.find((value) => value.toLowerCase() === normalized);
  return fallbackMatch || category.toLowerCase();
}

function validateAndSanitizeParams(params, availableCategories) {
  const { religion, category, page } = params;

  // Handle common variations for religion normalization
  let normalizedReligion = religion?.toLowerCase();
  if (normalizedReligion === 'islam' || normalizedReligion === 'muslim') normalizedReligion = 'islamic';
  if (normalizedReligion === 'hinduism') normalizedReligion = 'hindu';
  if (normalizedReligion === 'christianity') normalizedReligion = 'christian';
  normalizedReligion = VALID_RELIGIONS.includes(normalizedReligion) ? normalizedReligion : 'islamic';
  const normalizedCategory = resolveCategory(category, availableCategories);
  const normalizedPage = parseInt(page) > 0 ? parseInt(page) : 1;

  return {
    religion: normalizedReligion,
    category: normalizedCategory,
    page: normalizedPage,
  };
}

export async function generateMetadata({ params }) {
  const rawParams = await params;
  const religion = VALID_RELIGIONS.includes(rawParams.religion?.toLowerCase()) ? rawParams.religion.toLowerCase() : 'islamic';
  const category = resolveCategory(rawParams.category, STATIC_CATEGORIES);
  const religionLabel = religion.charAt(0).toUpperCase() + religion.slice(1);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const page = parseInt(rawParams.page, 10) > 0 ? parseInt(rawParams.page, 10) : 1;

  // Fetch pagination data for prev/next
  const response = await serverFetchNamesWithAdvancedFilters({ religion, category, page, limit: 50 });
  const pagination = response.pagination || { totalPages: 1, totalCount: 0 };
  const totalPages = pagination.totalPages || 1;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevPageUrl = hasPrev ? absoluteUrl(`/names/${religion}/categories/${category}/${page - 1}`) : null;
  const nextPageUrl = hasNext ? absoluteUrl(`/names/${religion}/categories/${category}/${page + 1}`) : null;

  const canonical = generateCanonicalUrl(`/names/${religion}/categories/${category}/${page}`);
  const ogImage = `${getSiteUrl()}/opengraph-image`;
  const categoryName = categoryLabel === 'Name' ? '' : ` ${categoryLabel}`;

  const titleRaw = page === 1
    ? `${religionLabel}${categoryName} Baby Names with Meanings & Origins | NameVerse`
    : `${religionLabel}${categoryName} Baby Names - Page ${page} | NameVerse`;

  const descRaw = page === 1
    ? `Discover beautiful ${religionLabel}${categoryName.toLowerCase()} baby names with authentic meanings, cultural origins, gender details, and lucky numbers. Browse our curated collection of ${religionLabel}${categoryName.toLowerCase()} names on NameVerse — trusted by parents worldwide.`
    : `Browse page ${page} of ${religionLabel}${categoryName.toLowerCase()} baby names. Find detailed meanings, cultural origins, and lucky numbers for the perfect ${religionLabel} name.`;

  return {
    title: validateMetaTitle(titleRaw),
    description: validateMetaDescription(descRaw),
    keywords: [
      `${religionLabel}${categoryName.toLowerCase()} baby names`,
      `${categoryLabel.toLowerCase()} ${religionLabel} names with meanings`,
      `${religionLabel} names by category`,
      `find ${categoryLabel.toLowerCase()} baby names`,
      `${categoryLabel.toLowerCase()} name meanings and origins`,
      `best ${categoryLabel.toLowerCase()} ${religionLabel} names`,
      `unique ${religionLabel}${categoryName.toLowerCase()} names`,
      `top ${categoryLabel.toLowerCase()} baby names 2026`,
      `NameVerse`,
      `baby names with lucky numbers`
    ].join(', '),
    openGraph: {
      title: validateMetaTitle(`${religionLabel}${categoryName} Baby Names with Meanings | NameVerse`),
      description: validateMetaDescription(
        `Explore ${religionLabel}${categoryName.toLowerCase()} baby names with authentic meanings, origin details, and naming inspiration on NameVerse.`
      ),
      url: canonical,
      type: 'website',
      siteName: 'NameVerse',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${religionLabel}${categoryName.toLowerCase()} baby names | NameVerse`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: validateMetaTitle(`${religionLabel}${categoryName} Baby Names | NameVerse`),
      description: validateMetaDescription(
        `Discover ${religionLabel}${categoryName.toLowerCase()} baby names with authentic meanings and origins on NameVerse.`
      ),
      images: [ogImage],
    },
    alternates: {
      canonical,
      languages: {
        en: canonical,
        'x-default': canonical,
      },
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

export default async function CategoryNamesPage({ params }) {
  const rawParams = await params;
  const availableCategories = STATIC_CATEGORIES;
  const { religion, category, page } = validateAndSanitizeParams(rawParams, availableCategories);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  let names = [];
  let pagination = { totalPages: 1, totalCount: 0 };

  const response = await serverFetchNamesWithAdvancedFilters({
    religion,
    category,
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Category</h1>
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

  const prevUrl = hasPrev ? `/names/${religion}/categories/${category}/${page - 1}` : null;
  const nextUrl = hasNext ? `/names/${religion}/categories/${category}/${page + 1}` : null;

  const canonical = generateCanonicalUrl(`/names/${religion}/categories/${category}/${page}`);

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
      { '@type': 'ListItem', position: 2, name: `${religionLabel} Names`, item: absoluteUrl(`/names/${religion}`) },
      { '@type': 'ListItem', position: 3, name: 'Categories', item: absoluteUrl(`/names/${religion}/categories/modern/1`) },
      { '@type': 'ListItem', position: 4, name: `${categoryLabel} Names`, item: absoluteUrl(`/names/${religion}/categories/${category}/1`) },
      ...(page > 1 ? [{ '@type': 'ListItem', position: 5, name: `Page ${page}`, item: absoluteUrl(`/names/${religion}/categories/${category}/${page}`) }] : [])
    ],
  };

  // Collection page schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${religionLabel} ${categoryLabel} Baby Names`,
    description: `A curated collection of ${religionLabel} baby names in the ${categoryLabel.toLowerCase()} category, each with authentic meanings, origins, and cultural significance.`,
    url: canonical,
  };

  // FAQ items for collection page
  const faqItems = [
    {
      question: `What are the most popular ${religionLabel} ${categoryLabel.toLowerCase()} baby names?`,
      answer: `Our collection features ${totalCount}+ ${religionLabel} ${categoryLabel.toLowerCase()} baby names, each carefully curated for authentic meaning and cultural relevance. These names represent traditional and modern choices within the ${categoryLabel.toLowerCase()} category.`,
    },
    {
      question: `What makes a ${religionLabel} name ${categoryLabel.toLowerCase()}?`,
      answer: `${religionLabel} ${categoryLabel.toLowerCase()} names are characterized by their distinctive qualities, whether modern appeal, traditional roots, nature-inspired meanings, religious significance, classical elegance, or unique characteristics. Each name reflects the values and preferences associated with its category.`,
    },
    {
      question: `How do I choose the perfect ${categoryLabel.toLowerCase()} ${religionLabel} name?`,
      answer: `Consider the name's meaning, pronunciation ease, family traditions, cultural heritage, and long-term suitability. Browse our collection to discover names that resonate with your values and preferences, then verify the meaning and origin before making your final choice.`,
    },
    {
      question: `Are ${categoryLabel.toLowerCase()} ${religionLabel} names suitable for both boys and girls?`,
      answer: `Many ${categoryLabel.toLowerCase()} ${religionLabel} names work beautifully for any gender. Gender-specific variations exist within each category. Use our filters to browse names by gender, or explore the full collection to find unisex options.`,
    },
    {
      question: `What cultural significance do ${categoryLabel.toLowerCase()} ${religionLabel} names hold?`,
      answer: `${categoryLabel.toLowerCase().charAt(0).toUpperCase() + categoryLabel.toLowerCase().slice(1)} names in ${religionLabel} tradition carry deep cultural and often spiritual meanings. They connect your child to heritage and reflect values important to your family.`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>{totalCount} Names Found</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Names in {category.charAt(0).toUpperCase() + category.slice(1)} Category
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            Page {page} of {totalPages} • Discover beautiful names in the {category} category
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
          <li><Link href={`/names/${religion}/categories/modern/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">Categories</Link></li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/names/${religion}/categories/${category}/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">{categoryLabel} Names</Link></li>
          {page > 1 && <><li className="text-gray-400">/</li><li className="text-emerald-700 font-semibold">Page {page}</li></>}
        </ol>
      </nav>

      {/* REVENUE BANNERS — center of category listing content */}


      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {availableCategories.map((cat) => (
            <Link
              key={cat}
              href={`/names/${religion}/categories/${cat}/1`}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                cat === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {names.slice(0, Math.ceil(names.length / 2)).map((item, index) => (
            <article
              key={`${item.name || item.id || index}-${index}`}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                  {item.gender && (
                    <p className="text-sm text-gray-500 mt-1">{item.gender}</p>
                  )}
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {item.origin || religion.charAt(0).toUpperCase() + religion.slice(1)}
                </span>
              </div>
              {item.meaning && (
                <p className="text-gray-600 mb-4 line-clamp-3">{item.meaning}</p>
              )}
              <Link
                href={`/names/${religion}/${item.slug || createSafeSlug(item.name || '')}`}
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900"
              >
                View name details
              </Link>
            </article>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {names.slice(Math.ceil(names.length / 2)).map((item, index) => (
            <article
              key={`${item.name || item.id || index}-${index}`}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                  {item.gender && (
                    <p className="text-sm text-gray-500 mt-1">{item.gender}</p>
                  )}
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {item.origin || religion.charAt(0).toUpperCase() + religion.slice(1)}
                </span>
              </div>
              {item.meaning && (
                <p className="text-gray-600 mb-4 line-clamp-3">{item.meaning}</p>
              )}
              <Link
                href={`/names/${religion}/${item.slug || createSafeSlug(item.name || '')}`}
                className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900"
              >
                View name details
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {hasPrev && (
            <Link
              href={prevUrl}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Link>
          )}

          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>

          {hasNext && (
            <Link
              href={nextUrl}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

      </section>

      {/* Rich Content Section - Category Specific */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding {religionLabel} {categoryLabel} Baby Names
          </h2>
          <p className="text-gray-600 mb-4">
            The {categoryLabel.toLowerCase()} category in {religionLabel} naming tradition represents names that are carefully selected for their distinctive qualities and characteristics. Choosing a {categoryLabel.toLowerCase()} name for your baby means selecting a name that carries specific cultural, spiritual, or aesthetic significance within the rich heritage of {religionLabel} naming customs. Each generation of parents within the {religionLabel} community has contributed to shaping which names are considered {categoryLabel.toLowerCase()}, with preferences evolving while maintaining deep respect for tradition.
          </p>
          <p className="text-gray-600 mb-4">
            {categoryLabel} names often reflect particular values or preferences that parents seek for their children. Whether you are drawn to modern interpretations, traditional choices, nature-inspired meanings, religious significance, classical elegance, or unique qualities, our collection of {totalCount}+ {religionLabel} {categoryLabel.toLowerCase()} names offers something special for every family seeking meaningful naming options. Parents today increasingly look for names that balance individuality with cultural connection, and {categoryLabel.toLowerCase()} names within {religionLabel} tradition excel at both.
          </p>
          <p className="text-gray-600 mb-4">
            When exploring {religionLabel} names in the {categoryLabel.toLowerCase()} category, consider how the name aligns with your family's values and the message you wish to convey about your child's identity. Many {categoryLabel.toLowerCase()} names carry meanings rooted in virtues such as strength, wisdom, compassion, and faith — qualities that transcend cultural boundaries while remaining deeply meaningful within {religionLabel} communities worldwide.
          </p>
          <p className="text-gray-600 mb-4">
            The popularity of {categoryLabel.toLowerCase()} names often varies across regions and communities. Some {religionLabel} {categoryLabel.toLowerCase()} names have gained international recognition for their elegant simplicity, while others remain cherished within specific cultural or linguistic subgroups. Our curated database includes verified meanings, pronunciation guides, and origin details for every name, ensuring you have access to authentic information when making this important decision.
          </p>
          <p className="text-gray-600">
            Each name in this collection comes with verified meaning, origin details, and cultural context. We encourage parents to research thoroughly before making their final selection, considering how the name will be perceived throughout their child's life journey — at home, in school, in professional settings, and across different cultural contexts. A well-chosen {categoryLabel.toLowerCase()} name becomes a source of pride and identity that your child carries with them always.
          </p>
        </div>
      </section>

      {/* Naming Tips Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Choosing the Perfect {categoryLabel} {religionLabel} Name
          </h2>
          <p className="text-gray-600 mb-4">
            When selecting a {categoryLabel.toLowerCase()} name, consider these essential factors: the authentic meaning behind the name, its cultural and linguistic origin, ease of pronunciation for your family and community, spelling simplicity, potential nickname variations, and how it pairs with your surname. The best {religionLabel} {categoryLabel.toLowerCase()} names balance all of these considerations harmoniously.
          </p>
          <p className="text-gray-600 mb-4">
            Many parents appreciate {categoryLabel.toLowerCase()} names for their distinctive style and memorable qualities. These names often stand out in positive ways, offering children names that feel both special and meaningful. Consider whether the name's meaning aligns with the qualities you hope to instill in your child — whether that's courage, kindness, wisdom, or devotion. The {religionLabel} naming tradition offers thousands of {categoryLabel.toLowerCase()} options, each with its own story and significance.
          </p>
          <p className="text-gray-600 mb-4">
            Family naming traditions play an important role in {religionLabel} culture. Many families choose to honor ancestors, religious figures, or cultural heroes by selecting {categoryLabel.toLowerCase()} names with historical significance. Others prefer names that reflect contemporary values while maintaining a respectful connection to {religionLabel} heritage. Whatever your preference, our database provides the context and meaning you need to make an informed choice.
          </p>
          <p className="text-gray-600 mb-4">
            We also recommend saying candidate names aloud, considering how they sound with your last name and with potential middle names. Test the name's flow in both formal and informal settings — you will be using it millions of times over your child's lifetime. Use our lucky number feature and explore sibling name combinations to create a harmonious family naming theme.
          </p>
          <p className="text-gray-600">
            Browse our complete collection of {religionLabel} {categoryLabel.toLowerCase()} names and use our tools to save favorites, compare meanings, and explore related names across different categories and origins. Our community of parents and naming enthusiasts has helped verify and refine the meanings of every name in our database, ensuring accuracy and cultural sensitivity.
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
            <Link href={`/names/${religion}/origin/arabic/1`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
              <Grid3X3 className="w-3.5 h-3.5" /> Browse by Origin
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