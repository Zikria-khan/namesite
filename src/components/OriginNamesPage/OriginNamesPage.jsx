import Link from 'next/link';
import { fetchFilters, fetchNamesWithAdvancedFilters } from '@/lib/api/names';
import { Sparkles, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

const DEFAULT_RELIGION = 'islamic';
const STATIC_ORIGINS = ['arabic', 'turkish', 'persian', 'indian', 'english', 'spanish'];

function normalizeOriginValue(originValue) {
  return String(originValue || '').trim().toLowerCase();
}

function resolveOrigin(origin, availableOrigins) {
  if (!origin) return 'arabic';
  const normalized = normalizeOriginValue(origin);
  const exactMatch = availableOrigins.find((value) => normalizeOriginValue(value) === normalized);
  if (exactMatch) return normalizeOriginValue(exactMatch);
  const fallbackMatch = STATIC_ORIGINS.find((value) => normalizeOriginValue(value) === normalized);
  return fallbackMatch || normalized;
}

function validateAndSanitizeParams(params, availableOrigins) {
  const { origin, page } = params;
  const normalizedOrigin = resolveOrigin(origin, availableOrigins);
  const normalizedPage = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;

  return {
    origin: normalizedOrigin,
    page: normalizedPage,
  };
}

function generateSlug(name) {
  if (!name || typeof name !== 'string') return '';
  return createSafeSlug(name);
}

function buildOriginHref(religionRoute, originValue) {
  const normalizedOrigin = normalizeOriginValue(originValue);
  const religionSegment = religionRoute ? String(religionRoute).toLowerCase() : null;
  if (religionSegment) {
    return `/names/${religionSegment}/origin/${normalizedOrigin}/1`;
  }
  return `/names/origin/${normalizedOrigin}/1`;
}

export default async function OriginNamesPage({ religionFromRoute, params }) {
  const religion = religionFromRoute || DEFAULT_RELIGION;
  const filters = await fetchFilters(religion);
  const availableOrigins =
    filters.origins?.map((originValue) => normalizeOriginValue(originValue)).filter(Boolean) || STATIC_ORIGINS;
  const uniqueOrigins = Array.from(new Set(availableOrigins));
  const sortedOrigins = uniqueOrigins.sort();
  const { origin, page } = validateAndSanitizeParams(params, sortedOrigins);

  let names = [];
  let pagination = { totalPages: 1, totalCount: 0 };
  let success = false;

  try {
    const response = await fetchNamesWithAdvancedFilters({
      religion,
      origin,
      page,
      limit: 50,
      sort: 'asc',
    });

    names = Array.isArray(response.data) ? response.data : [];
    names = names.filter((item) => item && typeof item.name === 'string');
    pagination = response.pagination || { totalPages: 1, totalCount: 0 };
    success = response.success !== false;
  } catch (error) {
    success = false;
  }

  if (!success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
  const pageBase = religionFromRoute
    ? `/names/${religion.toLowerCase()}/origin/${origin}`
    : `/names/origin/${origin}`;
  const prevUrl = hasPrev ? `${pageBase}/${page - 1}` : null;
  const nextUrl = hasNext ? `${pageBase}/${page + 1}` : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
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

      <nav className="max-w-7xl mx-auto px-4 py-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={buildOriginHref(religionFromRoute, origin)} className="text-emerald-600 hover:text-emerald-800 font-medium">
              {religionFromRoute ? `${religion.charAt(0).toUpperCase() + religion.slice(1)} Origin` : 'Origin'}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">{origin.charAt(0).toUpperCase() + origin.slice(1)}</li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">Page {page}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {sortedOrigins.map((o) => (
            <Link
              key={o}
              href={buildOriginHref(religionFromRoute, o)}
              className={`px-4 py-2 flex items-center justify-center rounded-lg font-semibold transition-all ${
                o === origin
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {names.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Names Found</h2>
            <p className="text-gray-600">No names found for {origin} origin. Try another origin.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {names.map((nameItem, index) => {
                const displayMeaning = nameItem.short_meaning || nameItem.meaning || nameItem.long_meaning || 'No meaning available';
                const itemKey = nameItem.slug || generateSlug(nameItem.name) || nameItem._id || index;

                const slug = itemKey || generateSlug(nameItem.name) || '';
                return (
                  <Link
                    key={itemKey}
                    href={`/names/${religion}/${slug}`}
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

              <span className="text-gray-600">Page {page} of {totalPages}</span>

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
    </main>
  );
}
