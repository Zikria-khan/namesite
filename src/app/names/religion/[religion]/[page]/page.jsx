import { notFound } from 'next/navigation';
import Link from 'next/link';
import StructuredData from '@/components/SEO/StructuredData.jsx';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.jsx';
import { serverFetchNamesWithAdvancedFilters } from '@/lib/api/server-fetch';
import { validateMetaTitle, validateMetaDescription, generateCanonicalUrl } from '@/lib/seo/meta-helpers';
import { ChevronLeft, ChevronRight, Sparkles, Moon, Globe, BookOpen, Heart, Star, TrendingUp, Users, Languages, Award } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { getSiteUrl } from '@/lib/seo/site';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
const RELIGION_LABELS = {
  islamic: 'Islamic',
  christian: 'Christian',
  hindu: 'Hindu',
};

// ISR with 60-day cache to minimize writes
export const revalidate = 31536000; // 365 days
export const dynamicParams = true;

// Pre-generate religion pages at build time
export async function generateStaticParams() {
  const religions = ['islamic', 'christian', 'hindu'];
  const params = [];

  for (const religion of religions) {
    // Pre-generate first 5 pages for each religion
    for (let page = 1; page <= 5; page++) {
      params.push({
        religion,
        page: String(page),
      });
    }
  }

  return params;
}

function normalizeReligion(religion) {
  if (!religion || typeof religion !== 'string') return null;
  const normalized = religion.toLowerCase();

  // Handle common variations
  if (normalized === 'islam' || normalized === 'muslim') return 'islamic';
  if (normalized === 'hinduism') return 'hindu';
  if (normalized === 'christianity') return 'christian';

  return VALID_RELIGIONS.includes(normalized) ? normalized : null;
}

function normalizePage(page) {
  const pageNumber = parseInt(page, 10);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
}

function generateSlug(name) {
  if (!name || typeof name !== 'string') return '';
  return createSafeSlug(name);
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const religion = normalizeReligion(awaitedParams?.religion);
  const page = normalizePage(awaitedParams?.page);
  const label = RELIGION_LABELS[religion] || 'Baby';
  const canonical = generateCanonicalUrl(`/names/religion/${religion}/${page}`);

  // Guard: if religion is invalid, don't generate metadata
  if (!religion || !VALID_RELIGIONS.includes(religion)) {
    return {
      title: validateMetaTitle('Baby Names — NameVerse'),
      description: validateMetaDescription('Browse baby names on NameVerse'),
      robots: { index: false, follow: false },
    };
  }

  // Fetch pagination data for prev/next
  const response = await serverFetchNamesWithAdvancedFilters({ religion, page, limit: 50 });
  const pagination = response.pagination || { totalPages: 1, totalCount: 0 };
  const totalPages = pagination.totalPages || 1;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevPageUrl = hasPrev ? generateCanonicalUrl(`/names/religion/${religion}/${page - 1}`) : null;
  const nextPageUrl = hasNext ? generateCanonicalUrl(`/names/religion/${religion}/${page + 1}`) : null;

  // Religion-specific keywords with 30+ engaging terms
  const religionKeywords = {
    islamic: [
      'islamic baby names',
      'quranic names',
      'muslim baby names',
      'arabic baby names',
      'urdu baby names',
      'islamic boy names',
      'islamic girl names',
      'quran names',
      'muslim names with meaning',
      'arabic names with meanings',
      'urdu names with meanings',
      'islamic name search',
      'quranic baby names',
      'muslim name finder',
      'arabic name origins',
      'islamic spiritual names',
      'muslim traditional names',
      'islamic modern names',
      'prophet names islamic',
      'quranic boy names',
      'quranic girl names',
      'arabic boy names',
      'arabic girl names',
      'urdu boy names',
      'urdu girl names',
      'islamic cultural names',
      'muslim faith names',
      'islamic name database',
      'quran inspired names',
      'hadith names',
      'islamic name meanings',
      'arabic name meanings',
      'urdu name meanings',
      'islamic baby name meanings',
      'muslim baby name origins',
      'islamic naming traditions',
      'arabic naming culture',
      'muslim naming customs',
      'quranic naming guide',
      'islamic name pronunciation',
      'arabic name pronunciation',
      'urdu name pronunciation'
    ],
    hindu: [
      'hindu baby names',
      'sanskrit names',
      'vedic names',
      'indian baby names',
      'hindi baby names',
      'hindu boy names',
      'hindu girl names',
      'sanskrit baby names',
      'vedic baby names',
      'hindu names with meaning',
      'sanskrit names with meanings',
      'indian names with meanings',
      'hindu name search',
      'sanskrit name finder',
      'hindu spiritual names',
      'indian traditional names',
      'hindu modern names',
      'vedic god names',
      'hindu mythological names',
      'sanskrit boy names',
      'sanskrit girl names',
      'indian boy names',
      'indian girl names',
      'hindi boy names',
      'hindi girl names',
      'hindu cultural names',
      'vedic naming traditions',
      'hindu naming customs',
      'sanskrit naming guide',
      'hindu name pronunciation',
      'sanskrit name origins',
      'indian name meanings',
      'hindu baby name meanings',
      'vedic baby name origins',
      'hindu faith names',
      'indian spiritual names',
      'sanskrit divine names',
      'hindu auspicious names',
      'vedic sacred names',
      'hindu name database',
      'sanskrit name search'
    ],
    christian: [
      'christian baby names',
      'biblical names',
      'bible names',
      'christian boy names',
      'christian girl names',
      'biblical boy names',
      'biblical girl names',
      'christian names with meaning',
      'bible names with meanings',
      'christian name search',
      'biblical name finder',
      'christian spiritual names',
      'bible traditional names',
      'christian modern names',
      'jesus names',
      'apostle names',
      'saint names christian',
      'christian boy names biblical',
      'christian girl names biblical',
      'christian faith names',
      'biblical naming traditions',
      'christian naming customs',
      'bible naming guide',
      'christian name pronunciation',
      'biblical name origins',
      'christian baby name meanings',
      'bible baby name origins',
      'christian cultural names',
      'biblical prophet names',
      'christian disciple names',
      'saint inspired names',
      'christian blessed names',
      'bible verse names',
      'christian sacred names',
      'biblical name database',
      'christian name search tool',
      'bible name meanings',
      'christian name etymology',
      'biblical name history'
    ]
  };

  const keywords = religionKeywords[religion] || [
    'baby names',
    'name search',
    'baby name meanings',
    'cultural names',
    'spiritual names'
  ];

  const pageTitle = `${RELIGION_LABELS[religion]} Baby Names - Boy & Girl Names with Meanings | NameVerse`;
  const religionCounts = { islamic: '18,000+', hindu: '15,000+', christian: '11,000+' };
  const nameType = { islamic: 'Quranic', hindu: 'Vedic', christian: 'Biblical' };
  const pageDescription = validateMetaDescription(
    `Browse ${religionCounts[religion]} verified ${RELIGION_LABELS[religion]} baby names. ${nameType[religion]} boy & girl names with meanings, lucky numbers & origins. Page ${page} — NameVerse.`
  );

  return {
    title: validateMetaTitle(pageTitle),
    description: pageDescription,
    keywords: keywords.join(', '),
    openGraph: {
      title: validateMetaTitle(`${RELIGION_LABELS[religion]} Baby Names — NameVerse`),
      description: pageDescription.substring(0, 180),
      url: canonical,
      type: 'website',
      siteName: 'NameVerse',
      images: [
        { url: `${getSiteUrl()}/opengraph-image`, width: 1200, height: 630 }
      ]
    },
    alternates: {
      canonical,
      languages: { en: canonical, 'x-default': canonical },
    },
    robots: { index: true, follow: true },
    other: {
      ...(hasPrev ? { 'link-prev': `<${prevPageUrl}>; rel="prev"` } : {}),
      ...(hasNext ? { 'link-next': `<${nextPageUrl}>; rel="next"` } : {}),
    },
  };
}

export default async function ReligionByPage({ params }) {
  const awaitedParams = await params;
  const religion = normalizeReligion(awaitedParams?.religion);
  const page = normalizePage(awaitedParams?.page);

  if (!religion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invalid Religion</h1>
          <p className="text-gray-600 mb-6">
            The requested religion is not valid. Please select from Islamic, Hindu, or Christian names.
          </p>
          <Link
            href="/names/islamic/letter/a/1"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            Browse Names
          </Link>
        </div>
      </div>
    );
  }

  const response = await serverFetchNamesWithAdvancedFilters({
    religion,
    page,
    limit: 50,
    sort: 'asc',
  });

  // If backend is in degraded state, show loading UI instead of 404
  // NEVER return 404 for uncertain data
  if (response.error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Content</h1>
          <p className="text-gray-600 mb-6">
            We're experiencing connectivity issues. Please refresh the page or try again later.
          </p>
          <Link
            href={`/names/${religion}/letter/a/1`}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            Browse All {RELIGION_LABELS[religion]} Names
          </Link>
        </div>
      </main>
    );
  }

  // If backend fails, don't return 404 - show empty state
  const names = Array.isArray(response.data) ? response.data : [];
  const pagination = response.pagination || { page: 1, limit: 50, totalCount: 0, totalPages: 1 };
  const { totalPages = 1, totalCount = 0 } = pagination;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevUrl = hasPrev ? `/names/religion/${religion}/${page - 1}` : null;
  const nextUrl = hasNext ? `/names/religion/${religion}/${page + 1}` : null;
  const title = `${RELIGION_LABELS[religion]} Names`;
  const canonical = generateCanonicalUrl(`/names/religion/${religion}/${page}`);

  return (
    <>
      <StructuredData
        organization={true}
        website={true}
        breadcrumbs={[
          { name: 'Home', url: getSiteUrl() },
          { name: `${RELIGION_LABELS[religion]} Names`, url: canonical }
        ]}
        collectionPage={{
          name: title,
          description: `A curated list of ${RELIGION_LABELS[religion]} baby names with meanings and origins. Page ${page}.`,
          url: canonical,
          items: (names || []).slice(0, 20).map((n) => ({
            title: n.name || n.title,
            path: `names/${religion}/${(n.slug || createSafeSlug(n.name || n.title || ''))}`
          }))
        }}
      />
    
    <main className="nv-page min-h-screen">
      <section className="nv-container nv-section">
        <div className="nv-card relative overflow-hidden p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(14,165,164,0.18),transparent_44%),radial-gradient(circle_at_90%_10%,rgba(79,70,229,0.14),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.18),transparent_46%)]" />
          <div className="relative">
            <Breadcrumbs items={[{ label: 'Names', href: '/names' }, { label: RELIGION_LABELS[religion], href: `/names/religion/${religion}/1` }]} className="mb-4" />
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <Sparkles className="h-4 w-4" />
              <span>{RELIGION_LABELS[religion]} Names</span>
            </div>
            <h1 className="nv-display mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {religion === 'islamic' && 'Islamic Baby Names - Quranic & Arabic Names with Meanings'}
              {religion === 'hindu' && 'Hindu Baby Names - Sanskrit & Vedic Names with Spiritual Significance'}
              {religion === 'christian' && 'Christian Baby Names - Biblical Names with Faith & Heritage'}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {religion === 'islamic' && `Explore ${totalCount} authentic Islamic baby names from the Quran and Islamic tradition. Discover Quranic names with Arabic and Urdu meanings, perfect for Muslim families seeking spiritual baby names with deep cultural significance.`}
              {religion === 'hindu' && `Browse ${totalCount} beautiful Hindu baby names rooted in Sanskrit and Vedic traditions. Find meaningful names with Hindi translations, connecting your child to Hindu heritage and spiritual wisdom.`}
              {religion === 'christian' && `Discover ${totalCount} meaningful Christian baby names inspired by the Bible and Christian faith. Choose biblical names with spiritual depth, perfect for families seeking faith-based naming inspiration.`}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Page {page} of {totalPages} • Comprehensive {RELIGION_LABELS[religion]} Name Database
            </p>

          {/* Religion Navigation Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {[
                { id: 'islamic', name: 'Islamic Names', icon: Globe, color: 'emerald' },
                { id: 'hindu', name: 'Hindu Names', icon: Sparkles, color: 'orange' },
                { id: 'christian', name: 'Christian Names', icon: BookOpen, color: 'blue' }
              ].map((rel) => {
                const Icon = rel.icon;
                const isActive = rel.id === religion;
                return (
                  <Link
                    key={rel.id}
                    href={`/names/religion/${rel.id}/1`}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-[rgba(15,23,42,0.14)] bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {rel.name}
                    {isActive && <span className="text-xs">(Current)</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Religion Statistics & Features */}
      <section className="nv-container pb-0">
        <div className="nv-card-solid">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="nv-display text-2xl font-semibold text-slate-900">{totalCount.toLocaleString()}</div>
              <div className="mt-1 text-sm text-slate-600">Total Names</div>
            </div>
            <div className="text-center">
              <div className="nv-display text-2xl font-semibold text-slate-900">{totalPages}</div>
              <div className="mt-1 text-sm text-slate-600">Pages Available</div>
            </div>
            <div className="text-center">
              <div className="nv-display text-2xl font-semibold text-slate-900">50</div>
              <div className="mt-1 text-sm text-slate-600">Names Per Page</div>
            </div>
            <div className="text-center">
              <div className="nv-display text-2xl font-semibold text-slate-900">100%</div>
              <div className="mt-1 text-sm text-slate-600">Authentic Meanings</div>
            </div>
          </div>
        </div>
      </section>

      {/* REVENUE BANNERS — center of religion listing content */}


      {/* Why Choose This Religion Section */}
      <section className="nv-container">
        <div className="nv-card">
          <div className="mb-10 text-center">
            <h2 className="nv-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              Why Choose {RELIGION_LABELS[religion]} Names?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {religion === 'islamic' && 'Islamic names carry profound spiritual meaning from the Quran and Islamic tradition, connecting your child to faith and heritage.'}
              {religion === 'hindu' && 'Hindu names draw from ancient Sanskrit wisdom and Vedic traditions, offering spiritual depth and cultural richness.'}
              {religion === 'christian' && 'Christian names reflect Biblical heritage and faith values, providing timeless spiritual significance and family legacy.'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {religion === 'islamic' && [
              {
                icon: Globe,
                title: 'Quranic Origins',
                description: 'Names directly from the Holy Quran with authentic Arabic meanings and Islamic significance.'
              },
              {
                icon: Languages,
                title: 'Arabic & Urdu',
                description: 'Beautiful names with meanings in Arabic script and Urdu translations for global Muslim communities.'
              },
              {
                icon: Heart,
                title: 'Spiritual Connection',
                description: 'Each name carries blessings and connects your child to Islamic faith and Prophet Muhammad (PBUH).'
              }
            ].map((feature, index) => (
              <div key={index} className="nv-card-solid p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}

            {religion === 'hindu' && [
              {
                icon: Star,
                title: 'Sanskrit Heritage',
                description: 'Ancient Sanskrit names with profound meanings rooted in Vedic wisdom and Hindu philosophy.'
              },
              {
                icon: Award,
                title: 'Auspicious Meanings',
                description: 'Names chosen for their positive vibrations and spiritual significance in Hindu culture.'
              },
              {
                icon: Users,
                title: 'Cultural Legacy',
                description: 'Connect your child to rich Hindu traditions, mythology, and divine qualities.'
              }
            ].map((feature, index) => (
              <div key={index} className="nv-card-solid p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}

            {religion === 'christian' && [
              {
                icon: BookOpen,
                title: 'Biblical Foundation',
                description: 'Names inspired by the Bible, carrying stories of faith, virtue, and divine purpose.'
              },
              {
                icon: Heart,
                title: 'Faith Values',
                description: 'Christian names that reflect virtues like love, hope, faith, and spiritual strength.'
              },
              {
                icon: TrendingUp,
                title: 'Timeless Appeal',
                description: 'Classic names with enduring spiritual significance across generations of Christian families.'
              }
            ].map((feature, index) => (
              <div key={index} className="nv-card-solid p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More Section */}
      <section className="nv-container">
        <div className="nv-card">
          <div className="mb-8 text-center">
            <h2 className="nv-display text-xl font-semibold text-slate-900 sm:text-2xl">
              Explore {RELIGION_LABELS[religion]} Names by Category
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Discover more ways to find the perfect {RELIGION_LABELS[religion].toLowerCase()} name for your baby
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Link
              href={`/names/${religion}/letter/a/1`}
              className="nv-card-solid p-4 text-center transition hover:-translate-y-0.5"
            >
              <div className="nv-display text-2xl font-semibold text-slate-900">A–Z</div>
              <div className="mt-1 text-sm text-slate-600">Browse by Letter</div>
            </Link>

            <Link
              href={`/names/${religion}/categories/modern/1`}
              className="nv-card-solid p-4 text-center transition hover:-translate-y-0.5"
            >
              <div className="nv-display text-2xl font-semibold text-slate-900">Categories</div>
              <div className="mt-1 text-sm text-slate-600">Browse Categories</div>
            </Link>

            <Link
              href={`/names/${religion}/origin/arabic/1`}
              className="nv-card-solid p-4 text-center transition hover:-translate-y-0.5"
            >
              <div className="nv-display text-2xl font-semibold text-slate-900">Origins</div>
              <div className="mt-1 text-sm text-slate-600">Browse Origins</div>
            </Link>

            <Link
              href={`/search`}
              className="nv-card-solid p-4 text-center transition hover:-translate-y-0.5"
            >
              <div className="nv-display text-2xl font-semibold text-slate-900">🔍</div>
              <div className="mt-1 text-sm text-slate-600">Search Names</div>
            </Link>
          </div>
        </div>
      </section>

      <section className="nv-container nv-section">
        {names.length === 0 ? (
          <div className="nv-card text-center">
            <h2 className="nv-display text-2xl font-semibold text-slate-900">No names found</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">No names were returned for this page. Try another page or check the religion value.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {names.map((nameItem, index) => {
 const displayName = nameItem.name || nameItem.title || `Name ${index + 1}`;
                  const displayMeaning = nameItem.short_meaning || nameItem.meaning || nameItem.long_meaning || 'Meaning not available';
                  const slug = nameItem.slug || generateSlug(displayName) || createSafeSlug(displayName) || '';

                return (
                  <Link
                    key={slug}
                    href={`/names/${religion}/${slug}`}
                    className="nv-card-solid group block p-6 transition hover:-translate-y-0.5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="nv-display text-2xl font-semibold text-slate-900 group-hover:text-[color:var(--nv-accent-2)]">{displayName}</h2>
                        <p className="mt-2 text-sm text-slate-500">{nameItem.origin || 'Unknown origin'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FavoriteButton
                          nameData={{
                            name: displayName,
                            slug: slug,
                            religion: religion,
                            meaning: displayMeaning,
                            origin: nameItem.origin
                          }}
                          size="small"
                        />
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <Moon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-600 transition-colors hover:text-[color:var(--nv-accent-2)]">
                      {displayMeaning}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
              {hasPrev ? (
                <Link
                  href={prevUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <span className="text-sm text-slate-500">No previous page</span>
              )}

              <span className="text-sm text-slate-600">
                Showing page {page} of {totalPages}
              </span>

              {hasNext ? (
                <Link
                  href={nextUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-sm text-slate-500">No next page</span>
              )}
            </div>
          </>
        )}
      </section>

      {/* Related Content & Learning Section */}
      <section className="nv-container nv-section">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="nv-card">
            <h3 className="nv-display text-xl font-semibold text-slate-900">
                Learn More About {RELIGION_LABELS[religion]} Naming
            </h3>
            <div className="mt-5 space-y-3">
                {religion === 'islamic' && [
                  { title: 'Islamic Naming Traditions', desc: 'Understanding the importance of names in Islamic culture' },
                  { title: 'Quranic Name Meanings', desc: 'Deep dive into names from the Holy Quran' },
                  { title: 'Prophet Names & Stories', desc: 'Learn about names of Islamic prophets and their significance' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={`/blog/best-islamic-baby-names-2026`}
                    className="nv-card-solid block p-4 transition hover:-translate-y-0.5"
                  >
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </Link>
                ))}

                {religion === 'hindu' && [
                  { title: 'Hindu Naming Ceremony', desc: 'Traditional Hindu naming rituals and customs' },
                  { title: 'Sanskrit Name Origins', desc: 'The linguistic roots of Hindu names' },
                  { title: 'Vedic Name Significance', desc: 'Understanding auspicious meanings in Hindu tradition' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={`/blog/baby-names-that-mean-strength`}
                    className="nv-card-solid block p-4 transition hover:-translate-y-0.5"
                  >
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </Link>
                ))}

                  {religion === 'christian' && [
                  { title: 'Biblical Name Stories', desc: 'The stories behind Christian biblical names' },
                  { title: 'Christian Saints & Names', desc: 'Names inspired by Christian saints and martyrs' },
                  { title: 'Faith-Based Naming Guide', desc: 'Choosing names that reflect Christian values' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    href={`/blog/baby-names-inspired-by-nature`}
                    className="nv-card-solid block p-4 transition hover:-translate-y-0.5"
                  >
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </Link>
                ))}
              </div>
          </div>

          <div className="nv-card">
            <h3 className="nv-display text-xl font-semibold text-slate-900">
                Popular {RELIGION_LABELS[religion]} Names
            </h3>
            <div className="nv-card-solid mt-5 p-5">
              <div className="grid grid-cols-2 gap-3">
{religion === 'islamic' && [
                     { name: 'Muhammad', meaning: 'Praiseworthy' },
                     { name: 'Fatima', meaning: 'One who abstains' },
                     { name: 'Aisha', meaning: 'Living, prosperous' },
                     { name: 'Ali', meaning: 'Exalted, noble' },
                     { name: 'Omar', meaning: 'Long-lived' },
                     { name: 'Zahra', meaning: 'Radiant, bright' }
                  ].map((nameItem, index) => {
                      const slug = createSafeSlug(nameItem.name);
                      return (
                        <div
                          key={index}
                          className="relative rounded-2xl bg-white/40 p-3 text-center transition hover:bg-white"
                        >
                          <div className="absolute top-2 right-2">
                            <FavoriteButton
                              nameData={{
                                name: nameItem.name,
                                slug: slug,
                                religion: 'islamic',
                                meaning: nameItem.meaning
                              }}
                              size="small"
                            />
                          </div>
                          <Link href={`/names/islamic/${slug}`}>
                            <div className="font-semibold text-slate-900">{nameItem.name}</div>
                            <div className="mt-1 text-xs text-slate-600">{nameItem.meaning}</div>
                          </Link>
                        </div>
                      );
                    })}

                    {religion === 'hindu' && [
                      { name: 'Aarav', meaning: 'Peaceful' },
                      { name: 'Saanvi', meaning: 'Goddess Lakshmi' },
                      { name: 'Vihaan', meaning: 'Dawn' },
                      { name: 'Ananya', meaning: 'Unique' },
                      { name: 'Arjun', meaning: 'White, clear' },
                      { name: 'Diya', meaning: 'Light' }
                    ].map((nameItem, index) => {
                      const slug = createSafeSlug(nameItem.name);
                      return (
                        <div
                          key={index}
                          className="relative rounded-2xl bg-white/40 p-3 text-center transition hover:bg-white"
                        >
                          <div className="absolute top-2 right-2">
                            <FavoriteButton
                              nameData={{
                                name: nameItem.name,
                                slug: slug,
                                religion: 'hindu',
                                meaning: nameItem.meaning
                              }}
                              size="small"
                            />
                          </div>
                          <Link href={`/names/hindu/${slug}`}>
                            <div className="font-semibold text-slate-900">{nameItem.name}</div>
                            <div className="mt-1 text-xs text-slate-600">{nameItem.meaning}</div>
                          </Link>
                        </div>
                      );
                    })}

                    {religion === 'christian' && [
                      { name: 'Noah', meaning: 'Rest, comfort' },
                      { name: 'Sophia', meaning: 'Wisdom' },
                      { name: 'James', meaning: 'Supplanter' },
                      { name: 'Mary', meaning: 'Beloved' },
                      { name: 'David', meaning: 'Beloved' },
                      { name: 'Sarah', meaning: 'Princess' }
                    ].map((nameItem, index) => {
                      const slug = createSafeSlug(nameItem.name);
                      return (
                        <div
                          key={index}
                          className="relative rounded-2xl bg-white/40 p-3 text-center transition hover:bg-white"
                        >
                          <div className="absolute top-2 right-2">
                            <FavoriteButton
                              nameData={{
                                name: nameItem.name,
                                slug: slug,
                                religion: 'christian',
                                meaning: nameItem.meaning
                              }}
                              size="small"
                            />
                          </div>
                          <Link href={`/names/christian/${slug}`}>
                            <div className="font-semibold text-slate-900">{nameItem.name}</div>
                            <div className="mt-1 text-xs text-slate-600">{nameItem.meaning}</div>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
      </section>
    </main>
    </>
  );
}