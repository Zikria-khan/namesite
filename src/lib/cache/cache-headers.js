/**
 * CACHE HEADER UTILITIES
 *
 * Generates Cache-Control headers for Cloudflare edge caching.
 * These headers control both browser cache and Cloudflare edge cache behavior.
 *
 * Cloudflare respects the following Cache-Control directives:
 *   - max-age: Edge TTL (seconds)
 *   - s-maxage: Edge TTL (overrides max-age for shared caches)
 *   - stale-while-revalidate: Serve stale while revalidating
 *   - stale-if-error: Serve stale if origin returns error
 *   - public: Allow caching by any cache
 *   - private: Only cache in browser
 *   - no-cache: Revalidate before serving
 *   - no-store: Never cache
 *
 * @fileoverview Cache header generation for Cloudflare + Next.js
 */

import { CACHE_TTL_BY_TYPE, DEFAULT_CACHE_CONFIG } from './purge-types.js';

/**
 * Generate Cache-Control header value for HTML pages.
 * These are the most important headers — they control edge caching of
 * name detail pages, listing pages, and all other HTML content.
 *
 * @param {Object} [config] - Cache configuration (defaults to nameDetail config)
 * @param {number} [config.edgeTTL] - Edge cache TTL in seconds
 * @param {number} [config.browserTTL] - Browser cache TTL in seconds
 * @param {number} [config.staleWhileRevalidate] - Stale-while-revalidate TTL
 * @param {number} [config.staleIfError] - Stale-if-error TTL
 * @returns {string} Cache-Control header value
 *
 * @example
 * // Name detail page (365 day edge cache, 1 day browser cache)
 * cacheHeaders.html() // "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=31536000, stale-if-error=31536000"
 *
 * @example
 * // Listing page (30 day edge cache, 1 hour browser cache)
 * cacheHeaders.html(CACHE_TTL_BY_TYPE.listingPages)
 */
export function htmlCacheHeaders(config = CACHE_TTL_BY_TYPE.nameDetail) {
  const {
    edgeTTL = DEFAULT_CACHE_CONFIG.edgeTTL,
    browserTTL = DEFAULT_CACHE_CONFIG.browserTTL,
    staleWhileRevalidate = DEFAULT_CACHE_CONFIG.staleWhileRevalidate,
    staleIfError = DEFAULT_CACHE_CONFIG.staleIfError,
  } = config;

  return [
    'public',
    `max-age=${browserTTL}`,
    `s-maxage=${edgeTTL}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
    `stale-if-error=${staleIfError}`,
  ].join(', ');
}

/**
 * Generate Cache-Control header for API responses.
 * API responses should NOT be cached at the edge.
 * They are only cached via Next.js ISR (fetch cache).
 *
 * @returns {string} Cache-Control header value
 */
export function apiCacheHeaders() {
  return 'no-store, max-age=0, must-revalidate';
}

/**
 * Generate Cache-Control header for static assets.
 * These are immutable and can be cached forever.
 *
 * @returns {string} Cache-Control header value
 */
export function staticAssetCacheHeaders() {
  const config = CACHE_TTL_BY_TYPE.staticAssets;
  return [
    'public',
    `max-age=${config.browserTTL}`,
    `s-maxage=${config.edgeTTL}`,
    'immutable',
  ].join(', ');
}

/**
 * Generate Cache-Control header for sitemaps.
 * Sitemaps change daily, so cache for 1 day at edge.
 *
 * @returns {string} Cache-Control header value
 */
export function sitemapCacheHeaders() {
  const config = CACHE_TTL_BY_TYPE.sitemaps;
  return [
    'public',
    `max-age=${config.browserTTL}`,
    `s-maxage=${config.edgeTTL}`,
    `stale-while-revalidate=${config.staleWhileRevalidate}`,
    `stale-if-error=${config.staleIfError}`,
  ].join(', ');
}

/**
 * Generate Cache-Control header for search results.
 * Searches are cached briefly since queries vary.
 *
 * @returns {string} Cache-Control header value
 */
export function searchCacheHeaders() {
  const config = CACHE_TTL_BY_TYPE.searchResults;
  return [
    'public',
    `max-age=${config.browserTTL}`,
    `s-maxage=${config.edgeTTL}`,
    `stale-while-revalidate=${config.staleWhileRevalidate}`,
    `stale-if-error=${config.staleIfError}`,
  ].join(', ');
}

/**
 * Generate a complete set of cache headers for a response.
 * Includes Cache-Control, CDN-Cache-Control, and Cloudflare-specific headers.
 *
 * @param {Object} [config] - Cache configuration
 * @returns {Object} Headers object
 */
export function generateCacheHeaders(config) {
  return {
    'Cache-Control': htmlCacheHeaders(config),
    // Cloudflare-specific header for explicit edge TTL
    'CDN-Cache-Control': htmlCacheHeaders(config),
    // Tell Cloudflare to respect the origin Cache-Control
    'Cloudflare-CDN-Cache-Control': htmlCacheHeaders(config),
  };
}

/**
 * Generate cache headers for a name detail page.
 * This is the most common use case.
 *
 * @returns {Object} Headers object
 */
export function nameDetailCacheHeaders() {
  return generateCacheHeaders(CACHE_TTL_BY_TYPE.nameDetail);
}

/**
 * Generate cache headers for a listing page.
 *
 * @returns {Object} Headers object
 */
export function listingPageCacheHeaders() {
  return generateCacheHeaders(CACHE_TTL_BY_TYPE.listingPages);
}

/**
 * Check if a response came from Cloudflare edge cache.
 * Useful for monitoring and debugging.
 *
 * @param {Object} headers - Response headers
 * @returns {boolean} True if response was served from edge cache
 */
export function isFromEdgeCache(headers) {
  const cfCacheStatus = headers.get('CF-Cache-Status');
  return cfCacheStatus === 'HIT' || cfCacheStatus === 'STALE';
}

/**
 * Get the cache status from Cloudflare headers.
 * Returns one of: HIT, MISS, STALE, REVALIDATED, UPDATING, DYNAMIC, EXPIRED, NONE
 *
 * @param {Object} headers - Response headers
 * @returns {string|null} Cache status or null if not available
 */
export function getCacheStatus(headers) {
  return headers.get('CF-Cache-Status') || null;
}

/**
 * Cache header presets for different content types.
 * Use these in next.config.mjs headers() function.
 */
export const CACHE_HEADER_PRESETS = {
  // Name detail pages: /names/:religion/:slug
  nameDetail: {
    key: 'Cache-Control',
    value: htmlCacheHeaders(CACHE_TTL_BY_TYPE.nameDetail),
  },
  // Listing pages: /names/religion/:religion/:page, /names/:religion/letter/:letter/:page, etc.
  listingPages: {
    key: 'Cache-Control',
    value: htmlCacheHeaders(CACHE_TTL_BY_TYPE.listingPages),
  },
  // Search results: /search/:term
  searchResults: {
    key: 'Cache-Control',
    value: searchCacheHeaders(),
  },
  // Static assets: /_next/static/*, /images/*
  staticAssets: {
    key: 'Cache-Control',
    value: staticAssetCacheHeaders(),
  },
  // Sitemaps: /sitemap.xml, /sitemap-*.xml
  sitemaps: {
    key: 'Cache-Control',
    value: sitemapCacheHeaders(),
  },
  // API routes: /api/*
  api: {
    key: 'Cache-Control',
    value: apiCacheHeaders(),
  },
};

export default {
  htmlCacheHeaders,
  apiCacheHeaders,
  staticAssetCacheHeaders,
  sitemapCacheHeaders,
  searchCacheHeaders,
  generateCacheHeaders,
  nameDetailCacheHeaders,
  listingPageCacheHeaders,
  isFromEdgeCache,
  getCacheStatus,
  CACHE_HEADER_PRESETS,
};