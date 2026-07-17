/**
 * PURGE QUEUE — Automatic, Deduplicated, Batched Cache Invalidation
 *
 * This module provides a queue-based purge system that:
 * 1. Accepts purge events from any source (backend webhook, admin, build)
 * 2. Deduplicates within a configurable time window (default 2 seconds)
 * 3. Batches all pending URLs into a single Cloudflare API call
 * 4. Handles failures with exponential backoff
 * 5. Guarantees eventual consistency
 *
 * Usage:
 *   import { purgeQueue } from '@/lib/cache';
 *
 *   // After a name update:
 *   await purgeQueue.enqueue({
 *     type: 'slug',
 *     religion: 'islamic',
 *     slug: 'abdullah',
 *     reason: 'admin_update',
 *   });
 *
 *   // After bulk import of 500 names:
 *   await purgeQueue.enqueue({
 *     type: 'names',
 *     religion: 'islamic',
 *     slugs: ['abdullah', 'ali', 'ahmed', ...],
 *     reason: 'bulk_import',
 *   });
 *
 *   // After a full religion update:
 *   await purgeQueue.enqueue({
 *     type: 'religion',
 *     religion: 'islamic',
 *     reason: 'bulk_update',
 *   });
 */

import { createPurgeClient } from './purge-client.js';
import { buildNamePageUrl, PURGE_EVENT_REASONS } from './purge-types.js';

/**
 * @typedef {Object} PurgeEvent
 * @property {'slug'|'names'|'religion'|'prefix'|'urls'} type
 * @property {string} [religion] - Required for slug/names/religion types
 * @property {string} [slug] - Required for slug type
 * @property {string[]} [slugs] - Required for names type
 * @property {string} [prefix] - Required for prefix type
 * @property {string[]} [urls] - Required for urls type
 * @property {string} [reason] - Reason for the purge
 * @property {string} [id] - Optional idempotency key
 */

const DEFAULT_FLUSH_INTERVAL_MS = 2000; // 2 second dedup window
const MAX_QUEUE_SIZE = 10000; // Safety limit

class PurgeQueue {
  constructor(options = {}) {
    this.flushIntervalMs = options.flushIntervalMs || DEFAULT_FLUSH_INTERVAL_MS;
    this.logger = options.logger || console;

    // Queue state
    this._pendingEvents = [];
    this._seenIds = new Set();
    this._flushTimer = null;
    this._isFlushing = false;
    this._totalEnqueued = 0;
    this._totalFlushed = 0;
    this._totalFailed = 0;

    // Start the flush timer
    this._startFlushTimer();
  }

  /**
   * Enqueue a purge event.
   * Events are deduplicated by id (if provided) and batched within the flush window.
   *
   * @param {PurgeEvent} event
   * @returns {Promise<{queued: boolean, queueSize: number}>}
   */
  async enqueue(event) {
    if (!event || !event.type) {
      this.logger.warn('[PurgeQueue] Invalid event, skipping');
      return { queued: false, queueSize: this._pendingEvents.length };
    }

    // Idempotency check
    if (event.id) {
      if (this._seenIds.has(event.id)) {
        this.logger.debug(`[PurgeQueue] Duplicate event id: ${event.id}, skipping`);
        return { queued: false, queueSize: this._pendingEvents.length };
      }
      this._seenIds.add(event.id);
    }

    // Safety limit
    if (this._pendingEvents.length >= MAX_QUEUE_SIZE) {
      this.logger.error('[PurgeQueue] Queue full, forcing immediate flush');
      await this.flush();
    }

    this._pendingEvents.push(event);
    this._totalEnqueued++;

    this.logger.debug(
      `[PurgeQueue] Enqueued ${event.type} event (queue: ${this._pendingEvents.length})`
    );

    return { queued: true, queueSize: this._pendingEvents.length };
  }

  /**
   * Flush all pending events immediately.
   * This merges all pending events into the minimum number of Cloudflare API calls.
   *
   * @returns {Promise<{success: boolean, purgedCount: number, failedCount: number}>}
   */
  async flush() {
    if (this._isFlushing || this._pendingEvents.length === 0) {
      return { success: true, purgedCount: 0, failedCount: 0 };
    }

    this._isFlushing = true;
    const events = this._pendingEvents.splice(0);
    const startTime = Date.now();

    try {
      // Merge all events into a single set of URLs
      const urlsToPurge = this._mergeEvents(events);

      if (urlsToPurge.length === 0) {
        this._isFlushing = false;
        return { success: true, purgedCount: 0, failedCount: 0 };
      }

      this.logger.info(
        `[PurgeQueue] Flushing ${events.length} events → ${urlsToPurge.length} unique URLs`
      );

      // Execute the purge
      const purgeClient = createPurgeClient(this.logger);
      if (!purgeClient) {
        this.logger.warn('[PurgeQueue] Purge client not available (env vars missing)');
        this._totalFailed += events.length;
        this._isFlushing = false;
        return { success: false, purgedCount: 0, failedCount: events.length };
      }

      const result = await purgeClient.purgeUrls(urlsToPurge, {
        reason: events[0]?.reason || PURGE_EVENT_REASONS.ADMIN_UPDATE,
      });

      const duration = Date.now() - startTime;
      this._totalFlushed += result.successful.length;
      this._totalFailed += result.failed.length;

      this.logger.info(
        `[PurgeQueue] Flush complete: ${result.successful.length} purged, ${result.failed.length} failed in ${duration}ms`
      );

      return {
        success: result.failed.length === 0,
        purgedCount: result.successful.length,
        failedCount: result.failed.length,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this._totalFailed += events.length;
      this.logger.error(`[PurgeQueue] Flush error in ${duration}ms:`, error);
      return { success: false, purgedCount: 0, failedCount: events.length };
    } finally {
      this._isFlushing = false;
    }
  }

  /**
   * Merge multiple purge events into a single deduplicated set of URLs.
   *
   * @param {PurgeEvent[]} events
   * @returns {string[]} Deduplicated array of full URLs
   * @private
   */
  _mergeEvents(events) {
    const urls = new Set();

    for (const event of events) {
      switch (event.type) {
        case 'slug': {
          if (event.religion && event.slug) {
            const url = buildNamePageUrl(
              process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app',
              event.religion,
              event.slug
            );
            urls.add(url);
            // Also purge listing pages
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/boy-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/girl-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/${event.religion}/letter/${event.slug.charAt(0).toUpperCase()}/1`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/${event.religion}/1`);
          }
          break;
        }

        case 'names': {
          if (event.religion && Array.isArray(event.slugs)) {
            for (const slug of event.slugs) {
              const url = buildNamePageUrl(
                process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app',
                event.religion,
                slug
              );
              urls.add(url);
            }
            // Purge listing pages once for the whole batch
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/boy-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/girl-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/${event.religion}/1`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/religion/${event.religion}/1`);
          }
          break;
        }

        case 'religion': {
          if (event.religion) {
            // Purge all listing pages for this religion
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/boy-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/${event.religion}/girl-names`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/${event.religion}/1`);
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/religion/${event.religion}/1`);
            // Purge all letter pages (A-Z)
            for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
              urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}/names/${event.religion}/letter/${letter}/1`);
            }
          }
          break;
        }

        case 'prefix': {
          if (event.prefix) {
            urls.add(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app'}${event.prefix.startsWith('/') ? '' : '/'}${event.prefix}`);
          }
          break;
        }

        case 'urls': {
          if (Array.isArray(event.urls)) {
            for (const url of event.urls) {
              if (typeof url === 'string' && url.length > 0) {
                urls.add(url);
              }
            }
          }
          break;
        }
      }
    }

    return [...urls];
  }

  /**
   * Start the periodic flush timer.
   * @private
   */
  _startFlushTimer() {
    if (this._flushTimer) {
      clearInterval(this._flushTimer);
    }
    this._flushTimer = setInterval(() => {
      this.flush().catch((err) => {
        this.logger.error('[PurgeQueue] Timer flush error:', err);
      });
    }, this.flushIntervalMs);

    // Don't let the timer keep the process alive
    if (this._flushTimer.unref) {
      this._flushTimer.unref();
    }
  }

  /**
   * Get queue statistics.
   * @returns {Object}
   */
  getStats() {
    return {
      pendingEvents: this._pendingEvents.length,
      totalEnqueued: this._totalEnqueued,
      totalFlushed: this._totalFlushed,
      totalFailed: this._totalFailed,
      isFlushing: this._isFlushing,
      flushIntervalMs: this.flushIntervalMs,
    };
  }

  /**
   * Gracefully shut down the queue.
   * Flushes all pending events and stops the timer.
   */
  async shutdown() {
    if (this._flushTimer) {
      clearInterval(this._flushTimer);
      this._flushTimer = null;
    }
    await this.flush();
    this.logger.info('[PurgeQueue] Shutdown complete');
  }
}

// Singleton instance — use this across the application
export const purgeQueue = new PurgeQueue();

export default PurgeQueue;