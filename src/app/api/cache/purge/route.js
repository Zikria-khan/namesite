/**
 * Cache Purge Webhook API Route
 *
 * POST /api/cache/purge   — Purge specific URLs or by type (religion/pages/static)
 * GET  /api/cache/purge   — Dry-run / test endpoint
 *
 * Authentication: X-Purge-Secret header must match PURGE_WEBHOOK_SECRET env var.
 * This route is called by the admin dashboard and the build/cron pipeline.
 */

import { NextResponse } from 'next/server';
import { createPurgeClient, buildNamePageUrl, purgeQueue } from '@/lib/cache';

// Rate limiting: simple in-memory token bucket
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,      // 30 requests per minute
  tokens: new Map(),
};

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  // Clean old entries
  for (const [key, entry] of RATE_LIMIT.tokens) {
    if (entry.resetAt < now) {
      RATE_LIMIT.tokens.delete(key);
    }
  }

  const entry = RATE_LIMIT.tokens.get(ip) || { count: 0, resetAt: now + RATE_LIMIT.windowMs };

  // Reset if window expired
  if (entry.resetAt < now) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT.windowMs;
  }

  entry.count++;
  RATE_LIMIT.tokens.set(ip, entry);

  return {
    allowed: entry.count <= RATE_LIMIT.maxRequests,
    remaining: Math.max(0, RATE_LIMIT.maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Verify the purge secret from request headers.
 * Uses constant-time comparison to prevent timing attacks.
 */
function isAuthorized(request) {
  const secret = process.env.PURGE_WEBHOOK_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get('x-purge-secret');
  if (!authHeader) return false;

  // Constant-time comparison
  if (authHeader.length !== secret.length) return false;
  let result = 0;
  for (let i = 0; i < authHeader.length; i++) {
    result |= authHeader.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return result === 0;
}

/**
 * POST — Execute a cache purge.
 *
 * Request body (JSON):
 *   { type: 'urls', urls: string[] }
 *   { type: 'prefix', prefix: string }
 *   { type: 'religion', religion: 'islamic' | 'christian' | 'hindu' }
 *   { type: 'zone' }                          // Purge everything (use sparingly)
 *   { type: 'slug', religion: string, slug: string }   // Purge a single name page
 *   { type: 'names', religion: string, slugs: string[] } // Purge multiple name pages
 */
export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // Verify authorization
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Provide x-purge-secret header.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type } = body || {};

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const purgeClient = createPurgeClient();
    if (!purgeClient) {
      return NextResponse.json(
        { success: false, error: 'Purge client not configured. Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID.' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app';

    // Track purge results
    const result = {
      success: true,
      type,
      purgedUrls: [],
      error: null,
      skipped: false,
    };

    switch (type) {
      case 'urls': {
        // Purge specific URLs
        const { urls = [] } = body;
        if (!Array.isArray(urls) || urls.length === 0) {
          return NextResponse.json(
            { success: false, error: 'urls must be a non-empty array of URL strings' },
            { status: 400 }
          );
        }

        const batchResult = await purgeClient.purgeUrls(urls);
        result.purgedUrls = batchResult.successful;
        result.error = batchResult.failed.length > 0
          ? `Failed to purge ${batchResult.failed.length} URLs`
          : null;
        break;
      }

      case 'slug': {
        // Purge a single name page by religion + slug
        const { religion, slug } = body;
        if (!religion || !slug) {
          return NextResponse.json(
            { success: false, error: 'Both religion and slug are required for type=slug' },
            { status: 400 }
          );
        }

        const url = buildNamePageUrl(siteUrl, religion, slug);
        if (!url) {
          return NextResponse.json(
            { success: false, error: `Invalid religion/slug combination: ${religion}/${slug}` },
            { status: 400 }
          );
        }

        // Use the purge queue for automatic batching
        await purgeQueue.enqueue({
          type: 'slug',
          religion,
          slug,
          reason: body.reason || 'webhook',
          id: body.id || `slug-${religion}-${slug}-${Date.now()}`,
        });

        // Force immediate flush for webhook requests
        const flushResult = await purgeQueue.flush();
        result.purgedUrls = [`${siteUrl}/names/${religion}/${slug}`];
        result.success = flushResult.success;
        break;
      }

      case 'names': {
        // Purge multiple name pages
        const { religion, slugs = [] } = body;
        if (!religion || !Array.isArray(slugs) || slugs.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Both religion and slugs[] are required for type=names' },
            { status: 400 }
          );
        }

        // Use the purge queue for automatic batching and dedup
        await purgeQueue.enqueue({
          type: 'names',
          religion,
          slugs,
          reason: body.reason || 'webhook',
          id: body.id || `names-${religion}-${slugs.length}-${Date.now()}`,
        });

        // Force immediate flush
        const flushResult = await purgeQueue.flush();
        result.purgedUrls = slugs.map(s => `${siteUrl}/names/${religion}/${s}`);
        result.success = flushResult.success;
        break;
      }

      case 'prefix': {
        // Purge all URLs under a prefix (e.g. /names/islamic)
        const { prefix } = body;
        if (!prefix) {
          return NextResponse.json(
            { success: false, error: 'prefix is required for type=prefix' },
            { status: 400 }
          );
        }

        await purgeClient.purgeByPrefix(prefix);
        result.purgedUrls = [`prefix:${prefix}`];
        break;
      }

      case 'religion': {
        // Purge all name pages for a specific religion
        const { religion } = body;
        if (!religion) {
          return NextResponse.json(
            { success: false, error: 'religion is required for type=religion' },
            { status: 400 }
          );
        }

        const validReligions = ['islamic', 'christian', 'hindu'];
        if (!validReligions.includes(religion.toLowerCase())) {
          return NextResponse.json(
            { success: false, error: `Invalid religion. Must be one of: ${validReligions.join(', ')}` },
            { status: 400 }
          );
        }

        // Purge the listing pages prefix
        await purgeClient.purgeByPrefix(`/names/${religion.toLowerCase()}`);
        result.purgedUrls = [`prefix:/names/${religion.toLowerCase()}`];
        break;
      }

      case 'zone': {
        // Full zone purge — use extremely sparingly
        const { confirm } = body;
        if (confirm !== true) {
          return NextResponse.json(
            {
              success: false,
              error: 'Zone-wide purge requires confirm: true. This is destructive and should be avoided.',
              skipped: true,
            },
            { status: 400 }
          );
        }

        await purgeClient.purgeByPrefix('/');
        result.purgedUrls = ['zone:all'];
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown purge type: ${type}. Valid types: urls, slug, prefix, religion, zone`,
          },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: result.error ? 207 : 200 });
  } catch (error) {
    console.error('[Cache Purge] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET — Health check / dry-run endpoint.
 * Also returns basic purge stats.
 */
export async function GET(request) {
  // Verify authorization for GET too (don't leak purge capability)
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Cache purge endpoint ready',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Execute a cache purge',
        types: ['urls', 'slug', 'prefix', 'religion', 'zone'],
        auth: 'x-purge-secret header',
      },
      GET: {
        description: 'Health check / dry-run',
      },
    },
    note: 'Zone-wide purge requires confirm: true in the request body',
  });
}