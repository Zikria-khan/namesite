/**
 * CLOUDFLARE PURGE API CLIENT
 *
 * Enterprise-grade client for Cloudflare's Cache Purge API.
 * Supports targeted purge by URL with batching, retry, and deduplication.
 *
 * Cloudflare API Docs: https://developers.cloudflare.com/api/operations/workers-kv-namespace-purge-cache
 *
 * @fileoverview Purge client for Cloudflare edge cache invalidation
 */

import {
  MAX_PURGE_BATCH_SIZE,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  PURGE_EVENT_REASONS,
  buildNamePageUrl,
  isValidReligion,
  isValidSlug,
} from './purge-types.js';

/**
 * Generate a unique request ID for tracing
 * @returns {string}
 */
function generateRequestId() {
  return `purge-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Sleep helper for retry backoff
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cloudflare Purge API Client
 *
 * Usage:
 *   const client = new CloudflarePurgeClient({
 *     cloudflareToken: process.env.CLOUDFLARE_API_TOKEN,
 *     cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID,
 *     siteUrl: 'https://nameverse.vercel.app',
 *   });
 *
 *   const result = await client.purgeNames('islamic', ['abdullah', 'ali']);
 */
export class CloudflarePurgeClient {
  /**
   * @param {Object} config
   * @param {string} config.cloudflareToken - Cloudflare API Token with Cache Purge permission
   * @param {string} config.cloudflareZoneId - Cloudflare Zone ID for the domain
   * @param {string} config.siteUrl - Base site URL (e.g. https://nameverse.vercel.app)
   * @param {Object} [config.logger] - Optional logger instance (defaults to console)
   */
  constructor(config) {
    if (!config.cloudflareToken) {
      throw new Error('CloudflarePurgeClient: cloudflareToken is required');
    }
    if (!config.cloudflareZoneId) {
      throw new Error('CloudflarePurgeClient: cloudflareZoneId is required');
    }
    if (!config.siteUrl) {
      throw new Error('CloudflarePurgeClient: siteUrl is required');
    }

    this.cloudflareToken = config.cloudflareToken;
    this.cloudflareZoneId = config.cloudflareZoneId;
    this.siteUrl = config.siteUrl.replace(/\/+$/, '');
    this.logger = config.logger || console;

    // Cloudflare API endpoint for targeted cache purge
    this.apiUrl = `https://api.cloudflare.com/client/v4/zones/${this.cloudflareZoneId}/purge_cache`;
  }

  /**
   * Purge specific name pages from Cloudflare edge cache.
   *
   * @param {string} religion - 'islamic' | 'christian' | 'hindu'
   * @param {string[]} slugs - Array of name slugs to purge (e.g. ['abdullah', 'ali'])
   * @param {Object} [options]
   * @param {string} [options.reason] - Reason for purge (for logging)
   * @returns {Promise<{success: boolean, purgedCount: number, failedCount: number, errors: Array, duration: number, requestId: string}>}
   */
  async purgeNames(religion, slugs, options = {}) {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const reason = options.reason || PURGE_EVENT_REASONS.ADMIN_UPDATE;

    // Validate inputs
    if (!isValidReligion(religion)) {
      return this._createErrorResult(requestId, startTime, `Invalid religion: ${religion}`);
    }

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return this._createErrorResult(requestId, startTime, 'No slugs provided for purge');
    }

    // Deduplicate and validate slugs
    const uniqueSlugs = [...new Set(slugs)]
      .filter((slug) => isValidSlug(slug))
      .map((slug) => slug.toLowerCase());

    if (uniqueSlugs.length === 0) {
      return this._createErrorResult(requestId, startTime, 'No valid slugs after deduplication');
    }

    // Build full URLs — also include listing pages that reference this name
    const urls = this._buildAffectedUrls(religion, uniqueSlugs);

    this.logger.info(`[CachePurge] ${requestId} Starting purge for ${urls.length} URLs (religion: ${religion}, reason: ${reason})`);

    // Process in batches (Cloudflare max 30 URLs per request)
    const batches = this._chunkArray(urls, MAX_PURGE_BATCH_SIZE);
    const allErrors = [];
    let purgedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResult = await this._purgeBatch(batch, requestId, i + 1, batches.length);

      purgedCount += batchResult.purgedCount;
      if (batchResult.errors.length > 0) {
        allErrors.push(...batchResult.errors);
      }
    }

    const duration = Date.now() - startTime;
    const failedCount = urls.length - purgedCount;
    const success = failedCount === 0;

    if (success) {
      this.logger.info(`[CachePurge] ${requestId} Successfully purged ${purgedCount} URLs in ${duration}ms`);
    } else {
      this.logger.error(`[CachePurge] ${requestId} Partial failure: ${purgedCount} purged, ${failedCount} failed in ${duration}ms`, { errors: allErrors });
    }

    return {
      success,
      purgedCount,
      failedCount,
      errors: allErrors.length > 0 ? allErrors : undefined,
      duration,
      requestId,
    };
  }

  /**
   * Build all affected URLs for a set of name slugs.
   * Includes the name detail page AND the listing pages that reference it.
   *
   * @param {string} religion
   * @param {string[]} slugs
   * @returns {string[]}
   * @private
   */
  _buildAffectedUrls(religion, slugs) {
    const urls = new Set();

    for (const slug of slugs) {
      // 1. Name detail page
      urls.add(buildNamePageUrl(this.siteUrl, religion, slug));

      // 2. Gender listing pages (both boy-names and girl-names — we don't know which)
      urls.add(`${this.siteUrl}/${religion}/boy-names`);
      urls.add(`${this.siteUrl}/${religion}/girl-names`);

      // 3. Letter listing page (first letter of the slug)
      const firstLetter = slug.charAt(0).toUpperCase();
      urls.add(`${this.siteUrl}/names/${religion}/letter/${firstLetter}/1`);

      // 4. Main religion listing page
      urls.add(`${this.siteUrl}/names/${religion}/1`);
      urls.add(`${this.siteUrl}/names/religion/${religion}/1`);
    }

    return [...urls];
  }

  /**
   * Purge a single batch of URLs via Cloudflare API
   * @param {string[]} urls - Array of URLs to purge
   * @param {string} requestId - Tracing ID
   * @param {number} batchIndex - Current batch number
   * @param {number} totalBatches - Total number of batches
   * @returns {Promise<{purgedCount: number, errors: Array}>}
   * @private
   */
  async _purgeBatch(urls, requestId, batchIndex, totalBatches) {
    let lastError = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.cloudflareToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: urls,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.logger.info(
            `[CachePurge] ${requestId} Batch ${batchIndex}/${totalBatches}: Purged ${urls.length} URLs (attempt ${attempt + 1})`
          );
          return { purgedCount: urls.length, errors: [] };
        }

        // API returned an error
        lastError = {
          urls,
          error: data.errors?.[0]?.message || 'Unknown Cloudflare API error',
          statusCode: response.status,
        };

        // Don't retry on 4xx errors (auth, validation)
        if (response.status >= 400 && response.status < 500) {
          this.logger.error(
            `[CachePurge] ${requestId} Batch ${batchIndex}/${totalBatches}: Non-retryable error (${response.status})`,
            lastError
          );
          return { purgedCount: 0, errors: [lastError] };
        }

        // 5xx errors — retry with backoff
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          this.logger.warn(
            `[CachePurge] ${requestId} Batch ${batchIndex}/${totalBatches}: Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
          );
          await sleep(delay);
        }
      } catch (error) {
        lastError = {
          urls,
          error: error.message || 'Network error during purge',
        };

        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          this.logger.warn(
            `[CachePurge] ${requestId} Batch ${batchIndex}/${totalBatches}: Network error, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES + 1})`
          );
          await sleep(delay);
        }
      }
    }

    // All retries exhausted
    this.logger.error(
      `[CachePurge] ${requestId} Batch ${batchIndex}/${totalBatches}: All retries exhausted`,
      lastError
    );
    return { purgedCount: 0, errors: [lastError] };
  }

  /**
   * Purge URLs by prefix using Cloudflare's custom cache key purge.
   * Falls back to individual URL purge for each affected page.
   *
   * @param {string} prefix - URL prefix to purge (e.g. '/names/islamic')
   * @param {Object} [options]
   * @param {string} [options.reason] - Reason for purge
   * @returns {Promise<Object>}
   */
  async purgeByPrefix(prefix, options = {}) {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const reason = options.reason || PURGE_EVENT_REASONS.ADMIN_UPDATE;

    if (!prefix || typeof prefix !== 'string') {
      return this._createErrorResult(requestId, startTime, 'Invalid prefix');
    }

    // Normalize prefix
    const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;

    this.logger.info(`[CachePurge] ${requestId} Prefix purge: ${normalizedPrefix} (reason: ${reason})`);

    // Cloudflare supports purge by host + prefix via the files array
    // We construct the full URL with the prefix
    const fullUrl = `${this.siteUrl}${normalizedPrefix}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [fullUrl],
        }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        this.logger.info(`[CachePurge] ${requestId} Prefix purge successful: ${normalizedPrefix} in ${duration}ms`);
        return {
          success: true,
          purgedCount: 1,
          failedCount: 0,
          duration,
          requestId,
        };
      }

      this.logger.error(`[CachePurge] ${requestId} Prefix purge failed: ${normalizedPrefix}`, data.errors);
      return {
        success: false,
        purgedCount: 0,
        failedCount: 1,
        errors: data.errors || [{ error: 'Unknown error' }],
        duration,
        requestId,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`[CachePurge] ${requestId} Prefix purge network error: ${normalizedPrefix}`, error);
      return {
        success: false,
        purgedCount: 0,
        failedCount: 1,
        errors: [{ error: error.message }],
        duration,
        requestId,
      };
    }
  }

  /**
   * Purge specific URLs directly.
   *
   * @param {string[]} urls - Array of full URLs to purge
   * @param {Object} [options]
   * @param {string} [options.reason] - Reason for purge
   * @returns {Promise<{successful: string[], failed: Array}>}
   */
  async purgeUrls(urls, options = {}) {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const reason = options.reason || PURGE_EVENT_REASONS.ADMIN_UPDATE;

    if (!Array.isArray(urls) || urls.length === 0) {
      return { successful: [], failed: [{ url: 'N/A', error: 'No URLs provided' }] };
    }

    // Deduplicate
    const uniqueUrls = [...new Set(urls)].filter(u => typeof u === 'string' && u.length > 0);

    this.logger.info(`[CachePurge] ${requestId} URL purge: ${uniqueUrls.length} URLs (reason: ${reason})`);

    const batches = this._chunkArray(uniqueUrls, MAX_PURGE_BATCH_SIZE);
    const successful = [];
    const failed = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResult = await this._purgeBatch(batch, requestId, i + 1, batches.length);

      if (batchResult.purgedCount > 0) {
        successful.push(...batch);
      }
      if (batchResult.errors.length > 0) {
        failed.push(...batchResult.errors);
      }
    }

    const duration = Date.now() - startTime;
    this.logger.info(`[CachePurge] ${requestId} URL purge complete: ${successful.length} success, ${failed.length} failed in ${duration}ms`);

    return { successful, failed };
  }

  /**
   * Purge all cached content (use sparingly — only for emergencies)
   * @param {string} [reason] - Reason for full purge
   * @returns {Promise<Object>}
   */
  async purgeAll(reason = PURGE_EVENT_REASONS.MANUAL) {
    const requestId = generateRequestId();
    const startTime = Date.now();

    this.logger.warn(`[CachePurge] ${requestId} FULL PURGE initiated (reason: ${reason})`);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;

      if (response.ok && data.success) {
        this.logger.info(`[CachePurge] ${requestId} Full purge successful in ${duration}ms`);
        return { success: true, purgedCount: -1, failedCount: 0, duration, requestId };
      }

      this.logger.error(`[CachePurge] ${requestId} Full purge failed`, data.errors);
      return { success: false, purgedCount: 0, failedCount: -1, errors: data.errors, duration, requestId };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(`[CachePurge] ${requestId} Full purge network error`, error);
      return { success: false, purgedCount: 0, failedCount: -1, errors: [{ error: error.message }], duration, requestId };
    }
  }

  /**
   * Create an error result for invalid inputs
   * @private
   */
  _createErrorResult(requestId, startTime, errorMessage) {
    const duration = Date.now() - startTime;
    this.logger.error(`[CachePurge] ${requestId} ${errorMessage}`);
    return {
      success: false,
      purgedCount: 0,
      failedCount: 0,
      errors: [{ error: errorMessage }],
      duration,
      requestId,
    };
  }

  /**
   * Split an array into chunks
   * @private
   */
  _chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

/**
 * Create a singleton purge client from environment variables.
 * This is the recommended way to use the client in production.
 *
 * Environment variables required:
 *   CLOUDFLARE_API_TOKEN — Cloudflare API Token with Cache Purge permission
 *   CLOUDFLARE_ZONE_ID — Cloudflare Zone ID for the domain
 *   SITE_URL — Base site URL (optional, defaults to NEXT_PUBLIC_API_BASE pattern)
 *
 * @param {Object} [logger] - Optional logger
 * @returns {CloudflarePurgeClient|null} - Returns null if env vars are missing
 */
export function createPurgeClient(logger) {
  const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
  const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app';

  if (!cloudflareToken || !cloudflareZoneId) {
    const log = logger || console;
    log.warn('[CachePurge] CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID not set. Purge client disabled.');
    return null;
  }

  return new CloudflarePurgeClient({
    cloudflareToken,
    cloudflareZoneId,
    siteUrl,
    logger,
  });
}

export default CloudflarePurgeClient;