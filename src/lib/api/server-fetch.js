/**
 * Uses native fetch() with next.revalidate to enable ISR caching.
 * CRITICAL: Using native fetch with next.revalidate tells Next.js
 * this data can be cached, enabling ISR.
 *
 * All these functions must be used in Server Components only.
 * NEVER use axios-based fetches (apiClient) in Server Components.
 */

/**
 * Safe Fetch Utility for ISR - SEO Resilient Implementation
 *
 * CRITICAL: This utility prevents false 404s for transient API failures.
 * - NEVER returns 404 for uncertain data
 * - Only 404 is returned when status is explicitly confirmed by backend
 * - Implements retry logic for network errors and 5xx responses
 * - Prevents caching of failed responses (no poisoned ISR cache)
 */

import { DEFAULT_CACHE_TTL_SECONDS, NAME_DETAIL_TTL_SECONDS, LISTING_PAGE_TTL_SECONDS, SEARCH_TTL_SECONDS } from '@/lib/cache/cache-config.js';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://name-meaning-site-backend.vercel.app').replace(/\/+$/, '');

// Reuse the canonical slug builder so similar-name strings are normalized the
// exact same way the rest of the app links to them.
import { createSlug } from '../seo/url-builder';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

function normalizeReligion(val) {
  if (!val) return 'islamic';
  const n = String(val).toLowerCase();
  if (n === 'muslim' || n === 'islam') return 'islamic';
  if (n === 'christianity') return 'christian';
  if (n === 'hinduism') return 'hindu';
  return VALID_RELIGIONS.includes(n) ? n : 'islamic';
}

/**
 * Safe fetch wrapper with explicit status tracking.
 * Returns:
 *   - { data: T, notFound: false, error: false } on success
 *   - { data: null, notFound: true, error: false } ONLY on explicit 404
 *   - { data: null, notFound: false, error: true } on network/5xx errors
 *
 * IMPORTANT: This function NEVER caches failed responses to prevent ISR poisoning.
 */
async function safeFetch(url, retries = 2, revalidate = DEFAULT_CACHE_TTL_SECONDS, options = {}) {
  const { tags } = options;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchOptions = { next: { revalidate } };
      if (tags && tags.length > 0) {
        fetchOptions.next.tags = tags;
      }
      const res = await fetch(url, fetchOptions);

      // Explicit 404 - backend confirms resource doesn't exist
      if (res.status === 404) {
        return { data: null, notFound: true, error: false };
      }

      // Network/server error - retry these
      if (!res.ok) {
        if (res.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
          continue;
        }
        return { data: null, notFound: false, error: true };
      }

      const json = await res.json();
      return { data: json, notFound: false, error: false };
    } catch (err) {
      // Network error - retry
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        continue;
      }
      return { data: null, notFound: false, error: true };
    }
  }
  return { data: null, notFound: false, error: true };
}

/**
 * Fetch with retry - used for critical name detail lookups.
 * IMPORTANT: Never use revalidate: 0 as it causes "Dynamic server usage"
 * errors during static generation. Always use a positive revalidation time.
 */
async function isrFetchWithRetry(url, retries = 2, revalidate = DEFAULT_CACHE_TTL_SECONDS, options = {}) {
  const { tags } = options;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const result = await safeFetch(url, 0, revalidate, { tags });
    if (result.data || result.notFound) return result;
    if (attempt < retries) {
      await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  return { data: null, notFound: false, error: true };
}

/**
 * Fetch filters for a specific religion
 * Backend: GET /api/v1/names/:religion/filters
 */
export async function serverFetchFilters(religion) {
  if (!religion) return { genders: [], origins: [], letters: [], categories: [], totalNames: 0 };

  const normalizedReligion = normalizeReligion(religion);
  const result = await safeFetch(`${API_BASE}/api/v1/names/${normalizedReligion}/filters`, 2, LISTING_PAGE_TTL_SECONDS);

  if (result.data?.success && result.data.data) {
    return {
      genders: result.data.data.genders || [],
      origins: result.data.data.origins || [],
      letters: result.data.data.letters || [],
      categories: result.data.data.categories || [],
      themes: result.data.data.themes || [],
      languages: result.data.data.languages || [],
      lucky_days: result.data.data.lucky_days || [],
      lucky_colors: result.data.data.lucky_colors || [],
      lucky_stones: result.data.data.lucky_stones || [],
      totalNames: result.data.data.total_names || 0,
    };
  }

  return { genders: [], origins: [], letters: [], categories: [], totalNames: 0 };
}

/**
 * Fetch names by letter with full ISR support
 */
export async function serverFetchNamesByLetter(letter, options = {}) {
  if (!letter) return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: false };

  const { religion = 'islamic', limit = 50, page = 1, sort = 'asc' } = options;
  const normalizedReligion = normalizeReligion(religion);

  const params = new URLSearchParams();
  params.set('alphabet', String(letter).toLowerCase());
  params.set('limit', String(limit));
  params.set('page', String(page));
  params.set('sort', sort);

  const result = await safeFetch(`${API_BASE}/api/v1/names/${normalizedReligion}?${params.toString()}`, 2, LISTING_PAGE_TTL_SECONDS);

  // If explicit 404 or error, return empty state but successful (no 404 page)
  if (result.error || result.notFound) {
    return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: false };
  }

  const names = result.data.data || result.data.names || [];
  const pagination = result.data.pagination || {};

  return {
    data: names,
    pagination: {
      totalPages: pagination.pages || result.data.totalPages || Math.ceil((pagination.total || names.length) / limit),
      totalCount: pagination.total || result.data.totalCount || names.length,
      page,
      limit,
    },
    success: true,
    error: false,
  };
}

/**
 * Fetch names with advanced filters + ISR
 */
export async function serverFetchNamesWithAdvancedFilters(options = {}) {
  const {
    religion,
    page = 1,
    limit = 50,
    sort = 'asc',
    gender,
    origin,
    category,
    alphabet,
  } = options;

  const normalizedReligion = normalizeReligion(religion);
  if (!normalizedReligion) {
    return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: false };
  }

  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  params.set('sort', sort);
  if (gender) params.set('gender', gender);
  if (origin) params.set('origin', origin);
  if (category) params.set('category', category);
  if (alphabet) params.set('startsWith', String(alphabet).toLowerCase());

  const result = await safeFetch(`${API_BASE}/api/v1/names/${normalizedReligion}?${params.toString()}`, 2, LISTING_PAGE_TTL_SECONDS);

  // If explicit 404 or error, return empty state but successful (no 404 page)
  if (result.error || result.notFound) {
    return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], pagination: { totalPages: 1, totalCount: 0 }, success: true, error: false };
  }

  const names = result.data.data || result.data.names || [];
  const pagination = result.data.pagination || {};

  return {
    data: names,
    pagination: {
      totalPages: pagination.pages || result.data.totalPages || Math.ceil((pagination.total || names.length) / limit),
      totalCount: pagination.total || result.data.totalCount || names.length,
      page,
      limit,
    },
    success: true,
    error: false,
  };
}

/**
 * Fetch name detail by religion and slug
 * Backend: GET /api/v1/names/:religion/:slug
 * Used by generateMetadata() and the page component
 * @returns {Promise<{ data: Object|null, notFound: boolean, error: boolean }>}
 */
export async function serverFetchNameDetail(religion, slug) {
  if (!religion || !slug) {
    return { data: null, notFound: false, error: false };
  }

  const normalizedReligion = normalizeReligion(religion);
  const safeSlug = encodeURIComponent(String(slug).trim().toLowerCase());

  // Use retry + 30-day cache for name detail lookups.
  // A single transient error must NOT cause a permanent 404.
  // 30-day fetch cache is free-tier friendly: each function call is cached for 30 days.
  const tag = `name:${normalizedReligion}:${safeSlug}`;
  let result = await isrFetchWithRetry(
    `${API_BASE}/api/v1/names/${normalizedReligion}/${safeSlug}`,
    2,
    NAME_DETAIL_TTL_SECONDS,
    { tags: [tag] }
  );

  // If explicit 404 from primary endpoint, return confirmed 404 (content doesn't exist)
  if (result.notFound) {
    return { data: null, notFound: true, error: false };
  }

  // If no data but error, try fallback endpoint
  if (result.error || (!result.data?.success && !result.data?.data)) {
    const fallbackResult = await isrFetchWithRetry(
      `${API_BASE}/api/names/${normalizedReligion}/${safeSlug}`,
      1,
      NAME_DETAIL_TTL_SECONDS,
      { tags: [tag] }
    );

    // If fallback also returns explicit 404, propagate it
    if (fallbackResult.notFound) {
      return { data: null, notFound: true, error: false };
    }

    // If fallback succeeded, use it
    if (fallbackResult.data?.success && fallbackResult.data?.data) {
      result = fallbackResult;
    } else {
      // Both endpoints failed - return degraded state (no error, no data, no 404)
      return { data: null, notFound: false, error: false };
    }
  }

  if (result.data?.success && result.data?.data) {
    const nameData = result.data.data;
    // Normalize religion (handle "Islam", "Christian", "Hindu" as well)
    if (nameData.religion) {
      const r = String(nameData.religion).toLowerCase();
      if (r === 'islamic' || r === 'muslim' || r === 'islam') nameData.religion = 'islamic';
      else if (r === 'christianity' || r === 'christian') nameData.religion = 'christian';
      else if (r === 'hinduism' || r === 'hindu') nameData.religion = 'hindu';
    }
    return { data: nameData, notFound: false, error: false };
  }

  // Default: degraded state (no confirmed missing, don't return 404)
  return { data: null, notFound: false, error: false };
}

/**
 * Check whether a single slug actually exists in the backend dataset.
 * Reuses serverFetchNameDetail (with its ISR cache) so we never invent a
 * second client. Returns true only when the backend confirms a record.
 */
export async function serverIsKnownSlug(religion, slug) {
  if (!religion || !slug) return false;
  const result = await serverFetchNameDetail(religion, slug);
  return Boolean(result.data && !result.notFound);
}

/**
 * Filter a list of name strings down to those whose slug resolves to a real
 * backend record. Used to pre-validate similar/related/variation links so the
 * UI never renders an internal <Link> to a non-existent name page.
 *
 * Fetches are deduped by slug and run in parallel; the returned array keeps the
 * original (pre-slugified) name strings in input order, capped to `limit`.
 */
export async function serverFilterKnownSlugs(religion, names, limit = 12) {
  if (!Array.isArray(names) || !names.length) return [];
  const seen = new Set();
  const unique = [];
  for (const name of names) {
    if (typeof name !== 'string') continue;
    const slug = createSlug(name.trim());
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    unique.push({ name, slug });
    if (unique.length >= limit) break;
  }
  const results = await Promise.all(
    unique.map((item) => serverIsKnownSlug(religion, item.slug).then((ok) => (ok ? item.name : null)))
  );
  return results.filter(Boolean);
}

/**
 * Fetch trending names with ISR
 * Backend: GET /api/names?religion=X&limit=20
 */
export async function serverFetchTrendingNames(options = {}) {
  const { religion = 'islamic', page = 1, limit = 20 } = options;
  const validReligion = VALID_RELIGIONS.includes(religion.toLowerCase()) ? religion.toLowerCase() : 'islamic';

  const result = await safeFetch(`${API_BASE}/api/names?religion=${validReligion}&page=${page}&limit=${limit}`, 2, LISTING_PAGE_TTL_SECONDS);

  // If error, return empty but don't mark as failure (graceful degradation)
  if (result.error) {
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 }, religion: validReligion, success: true, error: true };
  }

  if (!result.data) {
    return { data: [], pagination: { page, limit, total: 0, totalPages: 0 }, religion: validReligion, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.names || [],
    pagination: result.data.pagination || { page, limit, total: 0, totalPages: 0 },
    religion: validReligion,
    success: true,
    error: false,
  };
}

/**
 * Fetch related names with ISR
 * Backend: GET /api/names/:religion/:slug/related
 */
export async function serverFetchRelatedNames(religion, slug) {
  if (!religion || !slug) return { data: [], count: 0, success: true, error: false };

  const normalizedReligion = normalizeReligion(religion);
  const safeSlug = encodeURIComponent(String(slug).trim().toLowerCase());

  const result = await safeFetch(`${API_BASE}/api/names/${normalizedReligion}/${safeSlug}/related`, 2, NAME_DETAIL_TTL_SECONDS);

  if (result.error || result.notFound) {
    return { data: [], count: 0, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], count: 0, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.names || [],
    count: result.data.count || result.data.total || (result.data.data ? result.data.data.length : 0),
    success: true,
    error: false,
  };
}

/**
 * Fetch similar names with ISR
 * Backend: GET /api/names/:religion/:slug/similar
 */
export async function serverFetchSimilarNames(religion, slug) {
  if (!religion || !slug) return { data: [], count: 0, success: true, error: false };

  const normalizedReligion = normalizeReligion(religion);
  const safeSlug = encodeURIComponent(String(slug).trim().toLowerCase());

  const result = await safeFetch(`${API_BASE}/api/names/${normalizedReligion}/${safeSlug}/similar`, 2, NAME_DETAIL_TTL_SECONDS);

  if (result.error || result.notFound) {
    return { data: [], count: 0, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], count: 0, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.names || [],
    count: result.data.count || result.data.total || (result.data.data ? result.data.data.length : 0),
    success: true,
    error: false,
  };
}

/**
 * Fetch names by category with ISR
 * Backend: GET /api/v1/names?religion=X&category=Y&page=1&limit=20
 */
export async function serverFetchNamesByCategory(religion, category, options = {}) {
  if (!religion || !category) {
    return { data: [], pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 }, success: true, error: false };
  }

  const { page = 1, perPage = 20 } = options;
  const result = await safeFetch(`${API_BASE}/api/v1/names?religion=${religion}&page=${page}&limit=${perPage}&category=${encodeURIComponent(category)}`, 2, LISTING_PAGE_TTL_SECONDS);

  if (result.error || result.notFound) {
    return { data: [], pagination: { page, perPage, total: 0, totalPages: 0 }, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], pagination: { page, perPage, total: 0, totalPages: 0 }, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.names || [],
    pagination: result.data.pagination || { page, perPage, total: 0, totalPages: 0 },
    category,
    success: true,
    error: false,
  };
}

/**
 * Fetch names by origin with ISR
 * Backend: GET /api/v1/names?religion=X&origin=Y&page=1&limit=50
 */
export async function serverFetchNamesByOrigin(religion, origin, options = {}) {
  if (!religion || !origin) {
    return { data: [], pagination: { page: 1, perPage: 50, total: 0, totalPages: 0 }, success: true, error: false };
  }

  const { page = 1, perPage = 50 } = options;
  const result = await safeFetch(`${API_BASE}/api/v1/names?religion=${religion}&page=${page}&limit=${perPage}&origin=${encodeURIComponent(origin)}`, 2, LISTING_PAGE_TTL_SECONDS);

  if (result.error || result.notFound) {
    return { data: [], pagination: { page, perPage, total: 0, totalPages: 0 }, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], pagination: { page, perPage, total: 0, totalPages: 0 }, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.names || [],
    pagination: result.data.pagination || { page, perPage, total: 0, totalPages: 0 },
    origin,
    success: true,
    error: false,
  };
}

/**
 * Search names with ISR (cached briefly since searches are more dynamic)
 * Backend: GET /api/v1/names/search?q=...
 * Uses shorter revalidation (1 hour) since search queries vary widely
 */
export async function serverSearchNames(query, options = {}) {
  if (!query || query.trim().length < 2) {
    return { data: [], count: 0, success: true, error: false };
  }

  const { religion, limit = 8 } = options;
  const trimmedQuery = query.trim();

  const params = new URLSearchParams();
  params.set('q', trimmedQuery);
  params.set('limit', String(limit));
  if (religion) params.set('religion', religion);

  const result = await safeFetch(`${API_BASE}/api/v1/names/search?${params.toString()}`, 2, SEARCH_TTL_SECONDS);

  if (result.error || result.notFound) {
    return { data: [], count: 0, success: true, error: result.error };
  }

  if (!result.data) {
    return { data: [], count: 0, success: true, error: false };
  }

  return {
    data: result.data.data || result.data.results || [],
    count: result.data.count || result.data.total || result.data.data?.length || 0,
    success: true,
    error: false,
  };
}

// Export all server fetch functions
const serverAPI = {
  serverFetchFilters,
  serverFetchNamesByLetter,
  serverFetchNamesWithAdvancedFilters,
  serverFetchNameDetail,
  serverIsKnownSlug,
  serverFilterKnownSlugs,
  serverFetchTrendingNames,
  serverFetchRelatedNames,
  serverFetchSimilarNames,
  serverFetchNamesByCategory,
  serverFetchNamesByOrigin,
  serverSearchNames,
};

export default serverAPI;