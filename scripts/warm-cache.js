/**
 * Cache Warming Script
 *
 * Pre-warms the Cloudflare edge cache for critical pages after deployment.
 * Run this after a successful build/deploy to ensure the most important
 * pages are cached at the edge before real users request them.
 *
 * Usage:
 *   node scripts/warm-cache.js                    # Warm all critical pages
 *   node scripts/warm-cache.js --religion islamic  # Warm only one religion
 *   node scripts/warm-cache.js --dry-run           # Print URLs without fetching
 *
 * Environment variables:
 *   SITE_URL       — Base URL (default: https://nameverse.vercel.app)
 *   WARM_CONCURRENCY — Number of parallel requests (default: 5)
 */

const SITE_URL = (process.env.SITE_URL || 'https://nameverse.vercel.app').replace(/\/+$/, '');
const CONCURRENCY = parseInt(process.env.WARM_CONCURRENCY || '5', 10);
const TIMEOUT_MS = 10000; // 10 second timeout per request

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

// Parse CLI args
const args = process.argv.slice(2);
const targetReligion = args.includes('--religion')
  ? args[args.indexOf('--religion') + 1]
  : null;
const isDryRun = args.includes('--dry-run');

/**
 * Build the list of critical URLs to warm.
 * These are the highest-traffic pages that should always be edge-cached.
 */
function buildUrlList() {
  const religions = targetReligion
    ? [targetReligion]
    : VALID_RELIGIONS;

  const urls = [];

  // 1. Homepage
  urls.push('/');

  // 2. Main listing pages (page 1 of each religion)
  for (const religion of religions) {
    urls.push(`/names/${religion}/1`);
    urls.push(`/names/religion/${religion}/1`);
  }

  // 3. Gender-based listing pages (page 1)
  for (const religion of religions) {
    urls.push(`/${religion}/boy-names`);
    urls.push(`/${religion}/girl-names`);
  }

  // 4. Letter-based listing pages (A-Z for each religion)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (const religion of religions) {
    for (const letter of letters) {
      urls.push(`/names/${religion}/letter/${letter}/1`);
    }
  }

  // 5. Blog and guide pages
  urls.push('/blog');
  urls.push('/blog/1');
  urls.push('/guides/expert-naming-guide');

  // 6. Static pages
  urls.push('/about');
  urls.push('/privacy');
  urls.push('/terms');
  urls.push('/trending-names');
  urls.push('/unique-names');
  urls.push('/names-by-meaning');
  urls.push('/languages');

  // 7. Sitemaps
  urls.push('/sitemap.xml');
  urls.push('/robots.txt');

  return urls;
}

/**
 * Fetch a URL with timeout and log the result.
 */
async function warmUrl(url) {
  const fullUrl = `${SITE_URL}${url}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const start = Date.now();
  try {
    const response = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'NameVerse-CacheWarmer/1.0',
        'Accept': 'text/html,application/xhtml+xml',
        'X-Cache-Warmer': 'true',
      },
    });
    const duration = Date.now() - start;
    const status = response.status;
    const cfCache = response.headers.get('CF-Cache-Status') || 'MISS';
    const cacheControl = response.headers.get('Cache-Control') || 'N/A';

    console.log(
      `[${status}] ${cfCache.padEnd(10)} ${duration.toString().padStart(4)}ms  ${url}`
    );

    return { url, status, cfCache, duration, success: status < 500 };
  } catch (error) {
    const duration = Date.now() - start;
    if (error.name === 'AbortError') {
      console.log(`[TIMEOUT] ${duration}ms  ${url}`);
    } else {
      console.log(`[ERROR]  ${error.message.slice(0, 60)}  ${url}`);
    }
    return { url, status: 0, cfCache: 'ERROR', duration, success: false };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Process URLs with concurrency control.
 */
async function warmCache(urls) {
  const results = [];
  const queue = [...urls];

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      const result = await warmUrl(url);
      results.push(result);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker());
  await Promise.all(workers);

  return results;
}

/**
 * Main entry point.
 */
async function main() {
  console.log('='.repeat(70));
  console.log('  NameVerse Cache Warmer');
  console.log('='.repeat(70));
  console.log(`  Site URL:     ${SITE_URL}`);
  console.log(`  Concurrency:  ${CONCURRENCY}`);
  console.log(`  Dry run:      ${isDryRun}`);
  console.log(`  Target:       ${targetReligion || 'all religions'}`);
  console.log('='.repeat(70));
  console.log('');

  const urls = buildUrlList();
  console.log(`  Total URLs to warm: ${urls.length}`);
  console.log('');

  if (isDryRun) {
    console.log('  DRY RUN — URLs that would be warmed:');
    console.log('');
    for (const url of urls) {
      console.log(`    ${SITE_URL}${url}`);
    }
    console.log('');
    console.log(`  Total: ${urls.length} URLs`);
    return;
  }

  console.log('  Warming cache...');
  console.log('');

  const results = await warmCache(urls);

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const cached = results.filter(r => r.cfCache === 'HIT' || r.cfCache === 'REVALIDATED').length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log('');
  console.log('='.repeat(70));
  console.log('  Cache Warming Complete');
  console.log('='.repeat(70));
  console.log(`  Total:        ${results.length}`);
  console.log(`  Successful:   ${successful}`);
  console.log(`  Failed:       ${failed}`);
  console.log(`  Edge Cached:  ${cached}`);
  console.log(`  Avg Duration: ${Math.round(avgDuration)}ms`);
  console.log('='.repeat(70));

  // Exit with error code if too many failures
  if (failed > results.length * 0.2) {
    console.error('\n  WARNING: High failure rate — check site availability.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Cache warming failed:', error);
  process.exit(1);
});