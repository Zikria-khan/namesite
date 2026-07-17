/**
 * ENTERPRISE CACHE INVALIDATION SYSTEM — TypeScript Interfaces
 *
 * These interfaces define the contract between:
 * - Backend (Express.js) → Admin updates names → Triggers purge
 * - Purge Client → Cloudflare API → Purges specific URLs
 * - Monitoring → Logs purge events
 *
 * @fileoverview Type definitions for the cache invalidation system
 */

/**
 * @typedef {Object} PurgeRequest
 * @property {string} religion - 'islamic' | 'christian' | 'hindu'
 * @property {string[]} names - Array of name slugs to purge (e.g. ['abdullah', 'ali'])
 * @property {string} [reason] - Optional reason for the purge (e.g. 'admin_update', 'bulk_import')
 * @property {string} [timestamp] - ISO timestamp of the update event
 * @property {string} [signature] - HMAC signature for webhook verification
 */

/**
 * @typedef {Object} PurgeResult
 * @property {boolean} success - Whether the purge was successful
 * @property {number} purgedCount - Number of URLs successfully purged
 * @property {number} failedCount - Number of URLs that failed to purge
 * @property {PurgeError[]} [errors] - Array of errors for failed purges
 * @property {number} duration - Time taken in ms
 * @property {string} requestId - Unique request identifier for tracing
 */

/**
 * @typedef {Object} PurgeError
 * @property {string} url - The URL that failed to purge
 * @property {string} error - Error message
 * @property {number} [statusCode] - HTTP status code if applicable
 */

/**
 * @typedef {Object} CacheConfig
 * @property {number} edgeTTL - Edge cache TTL in seconds
 * @property {number} browserTTL - Browser cache TTL in seconds
 * @property {number} staleWhileRevalidate - Stale-while-revalidate TTL in seconds
 * @property {number} staleIfError - Stale-if-error TTL in seconds
 */

/**
 * @typedef {Object} PurgeLogEntry
 * @property {string} requestId - Unique request identifier
 * @property {string} action - 'purge_triggered' | 'purge_success' | 'purge_failed'
 * @property {PurgeRequest} request - The purge request
 * @property {PurgeResult} [result] - The purge result
 * @property {string} timestamp - ISO timestamp
 * @property {number} duration - Duration in ms
 */

/**
 * @typedef {Object} CacheMetrics
 * @property {number} cacheHitRatio - Cache hit ratio (0-1)
 * @property {number} totalRequests - Total number of requests
 * @property {number} cachedRequests - Number of cache hits
 * @property {number} uncachedRequests - Number of cache misses
 * @property {number} purgeCount - Total number of purge events
 * @property {number} avgRegenerationTime - Average regeneration time in ms
 * @property {number} avgWorkerCpuTime - Average worker CPU time in ms
 * @property {number} backendRequests - Number of backend API requests
 */

// Note: For TypeScript usage, define these as interfaces and export:
//
// export interface PurgeRequest {
//   religion: 'islamic' | 'christian' | 'hindu';
//   names: string[];
//   reason?: string;
//   timestamp?: string;
//   signature?: string;
// }
//
// export interface PurgeResult {
//   success: boolean;
//   purgedCount: number;
//   failedCount: number;
//   errors?: PurgeError[];
//   duration: number;
//   requestId: string;
// }
//
// export interface PurgeError {
//   url: string;
//   error: string;
//   statusCode?: number;
// }
//
// export interface CacheConfig {
//   edgeTTL: number;
//   browserTTL: number;
//   staleWhileRevalidate: number;
//   staleIfError: number;
// }
//
// For JSDoc usage, the @typedef above provides type checking in supported editors.

/**
 * VALID_RELIGIONS — Canonical religion identifiers used across the system
 * All URLs use these normalized forms.
 */
export const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

/**
 * DEFAULT_CACHE_CONFIG — Production cache TTLs
 * Optimized for 99%+ cache hit ratio with minimal origin traffic.
 *
 * Edge TTL: 365 days — Content changes rarely, maximize edge caching
 * Browser TTL: 1 day — Allows fast page loads while enabling timely updates
 * Stale-while-revalidate: 365 days — Serve stale immediately, revalidate async
 * Stale-if-error: 365 days — Never show errors, serve stale if origin down
 */
export const DEFAULT_CACHE_CONFIG = {
  edgeTTL: 31536000,        // 365 days
  browserTTL: 86400,         // 1 day
  staleWhileRevalidate: 31536000, // 365 days
  staleIfError: 31536000,    // 365 days
};

/**
 * CACHE_TTL_BY_TYPE — Different TTLs for different content types
 */
export const CACHE_TTL_BY_TYPE = {
  // Name detail pages — rarely change
  nameDetail: {
    edgeTTL: 31536000,       // 365 days
    browserTTL: 86400,        // 1 day
    staleWhileRevalidate: 31536000,
    staleIfError: 31536000,
  },
  // Listing pages (religion, letter, origin, category) — content changes via admin
  listingPages: {
    edgeTTL: 2592000,         // 30 days
    browserTTL: 3600,         // 1 hour
    staleWhileRevalidate: 2592000,
    staleIfError: 2592000,
  },
  // Search results — cached briefly since queries vary
  searchResults: {
    edgeTTL: 3600,            // 1 hour
    browserTTL: 0,
    staleWhileRevalidate: 3600,
    staleIfError: 86400,
  },
  // Static assets — immutable, cache forever
  staticAssets: {
    edgeTTL: 31536000,        // 365 days
    browserTTL: 31536000,     // 365 days
    staleWhileRevalidate: 31536000,
    staleIfError: 31536000,
  },
  // Sitemaps — generated daily
  sitemaps: {
    edgeTTL: 86400,           // 1 day
    browserTTL: 3600,         // 1 hour
    staleWhileRevalidate: 86400,
    staleIfError: 604800,     // 7 days
  },
};

/**
 * PURGE_EVENT_REASONS — Standardized reasons for purge events
 */
export const PURGE_EVENT_REASONS = {
  ADMIN_UPDATE: 'admin_update',
  BULK_IMPORT: 'bulk_import',
  WEBHOOK: 'webhook',
  MANUAL: 'manual',
};

/**
 * MAX_PURGE_BATCH_SIZE — Maximum number of URLs to purge in a single API call
 * Cloudflare API supports up to 30 URLs per request for targeted purge.
 */
export const MAX_PURGE_BATCH_SIZE = 30;

/**
 * MAX_RETRIES — Maximum retry attempts for failed purge requests
 */
export const MAX_RETRIES = 3;

/**
 * RETRY_DELAY_MS — Base delay between retries (exponential backoff)
 */
export const RETRY_DELAY_MS = 1000;

/**
 * Build a name page URL from religion and slug
 * @param {string} siteUrl - Base site URL (e.g. https://nameverse.vercel.app)
 * @param {string} religion - Canonical religion (islamic/christian/hindu)
 * @param {string} slug - Name slug (e.g. abdullah)
 * @returns {string} Full URL (e.g. https://nameverse.vercel.app/names/islamic/abdullah)
 */
export function buildNamePageUrl(siteUrl, religion, slug) {
  return `${siteUrl}/names/${religion}/${slug}`;
}

/**
 * Validate a religion string
 * @param {string} religion
 * @returns {boolean}
 */
export function isValidReligion(religion) {
  return VALID_RELIGIONS.includes(religion);
}

/**
 * Validate a name slug
 * @param {string} slug
 * @returns {boolean}
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 2;
}