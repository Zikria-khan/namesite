// src/app/names/categories/[category]/[page]/page.jsx
import Link from 'next/link';
import { serverFetchNamesWithAdvancedFilters } from '@/lib/api/server-fetch';
import { validateMetaTitle, validateMetaDescription, generateCanonicalUrl } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { Sparkles, Moon, ChevronLeft, ChevronRight, Search, Grid3X3, BookOpen } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import BlogSection from '@/components/Blog/BlogSection';
import AdBanner from '@/components/Ads/AdBanner';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
const STATIC_CATEGORIES = ['modern', 'traditional', 'nature', 'religious', 'classical', 'unique'];

// ISR with 60-day cache to minimize writes
export const revalidate = 5184000; // 60 days
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
  const canonical = generateCanonicalUrl(`/names/religion/${religion}/1`);
  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  const ogImage = `${getSiteUrl()}/api/og?section=categories&religion=${religion}&category=${encodeURIComponent(categoryLabel)}`;
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
  };
}

export default async function CategoryNamesPage({ params }) {
  const rawParams = await params;
  const availableCategories = STATIC_CATEGORIES;
  const { religion, category, page } = validateAndSanitizeParams(rawParams, availableCategories);

  let names = [];
  let pagination = { totalPages: 1, totalCount: 0 };
  let success = false;

  try {
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
    success = response.success || false;
  } catch (error) {
    success = false;
  }

  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Names</h1>
          <p className="text-gray-600">Unable to load names at this time. Please try again later.</p>
        </div>
      </div>
    );
  }

  const { totalPages = 1, totalCount = 0 } = pagination;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const prevUrl = hasPrev ? `/names/religion/${religion}/1` : null;
  const nextUrl = hasNext ? `/names/religion/${religion}/1` : null;

  function generateSlug(name) {
    if (!name || typeof name !== 'string') return '';
    return createSafeSlug(name);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
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
          <li><Link href={`/names/religion/${religion}/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">All Names</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">Categories</li>
          <li className="text-gray-400">/</li>
          <li><Link href={`/names/religion/${religion}/${category}/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</Link></li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">Page {page}</li>
        </ol>
      </nav>

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

        <AdBanner />
      </section>

      {/* Cross-page internal links */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Explore More Ways to Browse</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link href={`/names/${religion}/letter/A/1`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs font-semibold text-slate-600 hover:text-indigo-700">
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
