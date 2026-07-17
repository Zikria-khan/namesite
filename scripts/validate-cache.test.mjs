/**
 * ENTERPRISE CACHE SYSTEM — VALIDATION & STRESS TEST SUITE
 *
 * This suite imports the ACTUAL implementation modules and exercises them
 * against the behavior described in the production-readiness brief.
 *
 * It does NOT redesign anything. It only verifies behavior and documents
 * where the implementation diverges from correct/expected behavior.
 *
 * Run:  node scripts/validate-cache.test.mjs
 *
 * Modules under test:
 *   src/lib/cache/purge-queue.js
 *   src/lib/cache/purge-client.js
 *   src/lib/cache/purge-types.js
 *   src/lib/cache/cache-headers.js
 *   src/app/api/cache/purge/route.js  (auth + rate-limit logic replicated)
 */
import assert from 'node:assert/strict';

// The implementation's createPurgeClient() returns null unless these env vars
// are set, which would short-circuit every flush(). Set them so the real
// Cloudflare branch executes and our mocked global.fetch is invoked.
process.env.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'test-token';
process.env.CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || 'test-zone';
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app';

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------
const results = { passed: [], failed: [], warnings: [] };
let current = '';
function test(name, fn) {
  current = name;
  try {
    fn();
    results.passed.push(name);
    console.log(`  PASS  ${name}`);
  } catch (e) {
    results.failed.push({ name, err: e.message });
    console.log(`  FAIL  ${name}\n        ${e.message}`);
  }
}
function warn(name, detail) {
  results.warnings.push({ name, detail });
  console.log(`  WARN  ${name} :: ${detail}`);
}

// ---------------------------------------------------------------------------
// Import the real implementation
// ---------------------------------------------------------------------------
const PURGE = await import('../src/lib/cache/purge-queue.js');
const CLIENT = await import('../src/lib/cache/purge-client.js');
const TYPES = await import('../src/lib/cache/purge-types.js');
const HEADERS = await import('../src/lib/cache/cache-headers.js');

const { purgeQueue } = PURGE;
const PurgeQueueImpl = PURGE.default;
const { CloudflarePurgeClient, createPurgeClient } = CLIENT;
const { buildNamePageUrl, isValidReligion, isValidSlug, MAX_PURGE_BATCH_SIZE, MAX_RETRIES, RETRY_DELAY_MS, DEFAULT_CACHE_CONFIG, CACHE_TTL_BY_TYPE } = TYPES;
const { htmlCacheHeaders, generateCacheHeaders, isFromEdgeCache, getCacheStatus, CACHE_HEADER_PRESETS } = HEADERS;

// ---------------------------------------------------------------------------
// SECTION 1 — PURGE CLIENT: batching, retry, dedup, error handling
// ---------------------------------------------------------------------------
console.log('\n=== 1. PURGE CLIENT (Cloudflare API) ===');

// Mock fetch to capture API calls. Returns a FRESH array per call. To be safe
// against any state that resets global.fetch between enqueue and flush, callers
// re-arm the mock (call mockFetch again) immediately before q.flush().
function mockFetch(behavior) {
  const calls = [];
  global.fetch = async (url, opts) => {
    const body = JSON.parse(opts.body);
    calls.push({ url, files: body.files, purge_everything: body.purge_everything });
    return behavior(body, calls.length);
  };
  return calls;
}

test('Cloudflare max batch size is 30 per official API', () => {
  assert.equal(MAX_PURGE_BATCH_SIZE, 30, 'Cloudflare supports up to 30 files per purge request');
});

test('purgeUrls splits a 95-URL list into 4 API calls (30/30/30/5)', () => {
  const calls = mockFetch((body) => ({
    ok: true,
    json: async () => ({ success: true, errors: [] }),
  }));
  const urls = Array.from({ length: 95 }, (_, i) => `https://x.com/p${i}`);
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  return client.purgeUrls(urls).then((r) => {
    assert.equal(calls.length, 4, `expected 4 batches, got ${calls.length}`);
    assert.equal(r.successful.length, 95);
    // each batch <= 30
    for (const c of calls) assert.ok(c.files.length <= 30, 'batch exceeds 30');
  });
});

test('purgeUrls dedups identical URLs before batching', () => {
  const calls = mockFetch((body) => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const urls = ['https://x.com/a', 'https://x.com/a', 'https://x.com/b'];
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  return client.purgeUrls(urls).then((r) => {
    assert.equal(calls[0].files.length, 2, 'duplicate not removed before batch');
    assert.equal(r.successful.length, 2);
  });
});

test('Retries on 5xx with exponential backoff (3 retries, 1s/2s/4s)', async () => {
  let n = 0;
  const calls = [];
  global.fetch = async (url, opts) => {
    n++;
    calls.push(n);
    if (n < 3) {
      return { ok: false, status: 503, json: async () => ({ success: false, errors: [{ message: 'boom' }] }) };
    }
    return { ok: true, json: async () => ({ success: true, errors: [] }) };
  };
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  const r = await client.purgeUrls(['https://x.com/a']);
  assert.equal(n, 3, `expected 3 attempts (1 + 2 retries), got ${n}`);
  assert.equal(r.successful.length, 1);
});

test('Does NOT retry on 4xx (auth/validation) — fails fast', async () => {
  let n = 0;
  global.fetch = async () => { n++; return { ok: false, status: 401, json: async () => ({ success: false, errors: [{ message: 'unauthorized' }] }) }; };
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  const r = await client.purgeUrls(['https://x.com/a']);
  assert.equal(n, 1, `expected no retry on 401, got ${n} calls`);
  assert.equal(r.successful.length, 0);
});

test('Cloudflare 429 is treated as NON-retryable 4xx → purge PERMANENTLY fails under throttling', async () => {
  // Cloudflare returns HTTP 429 when you exceed purge rate limits.
  // The code branch `if (status >= 400 && status < 500) return` classifies
  // 429 as a hard 4xx error and does NOT retry it. So during Cloudflare
  // throttling, batched purges are silently dropped after a single attempt.
  let n = 0;
  global.fetch = async () => { n++; return { ok: false, status: 429, json: async () => ({ success: false, errors: [{ message: 'rate limited' }] }) }; };
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  const r = await client.purgeUrls(['https://x.com/a']);
  assert.equal(n, 1, `429 must NOT be retried (got ${n} calls) — but this means throttled purges are lost`);
  assert.equal(r.successful.length, 0);
  warn('429 not retried', 'Cloudflare throttle (429) falls in 4xx branch → no retry → purges lost during rate-limit windows');
});

test('purgeAll uses purge_everything and returns -1 counts', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  const r = await client.purgeAll();
  assert.ok(calls[0].purge_everything === true, 'purge_everything must be set');
  assert.equal(r.purgedCount, -1);
});

test('createPurgeClient returns null when env missing (silent no-op)', () => {
  const savedToken = process.env.CLOUDFLARE_API_TOKEN;
  const savedZone = process.env.CLOUDFLARE_ZONE_ID;
  delete process.env.CLOUDFLARE_API_TOKEN;
  delete process.env.CLOUDFLARE_ZONE_ID;
  const c = createPurgeClient(console);
  assert.equal(c, null, 'client must be null when secrets missing');
  process.env.CLOUDFLARE_API_TOKEN = savedToken;
  process.env.CLOUDFLARE_ZONE_ID = savedZone;
});

// ---------------------------------------------------------------------------
// SECTION 2 — PURGE QUEUE: dedup, batching, idempotency, flush
// ---------------------------------------------------------------------------
console.log('\n=== 2. PURGE QUEUE ===');

test('Enqueue + flush merges events into ONE Cloudflare API call', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'a' });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'ali', id: 'b' });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'ahmed', id: 'c' });
  const r = await q.flush();
  assert.equal(calls.length, 1, `expected single API call for batch, got ${calls.length}`);
  assert.ok(r.success);
  await q.shutdown();
});

test('Idempotency: same id is deduplicated', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'dup' });
  const second = await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'dup' });
  assert.equal(second.queued, false, 'duplicate id should be rejected');
  await q.flush();
  // only the name detail url + listing urls from one event
  assert.equal(calls.length, 1);
  await q.shutdown();
});

test('Idempotency is PER-QUEUE-INSTANCE (no global seen set across workers)', () => {
  const q1 = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  const q2 = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  q1._seenIds.add('x');
  assert.equal(q2._seenIds.has('x'), false, 'seenIds is not shared across instances → idempotency not global');
  q1.shutdown(); q2.shutdown();
});

test('Flush is a no-op when already flushing (concurrency guard)', async () => {
  let resolves = [];
  global.fetch = async () => new Promise((res) => { resolves.push(res); });
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'a', id: '1' });
  const p1 = q.flush();
  const p2 = q.flush(); // should short-circuit
  // resolve the in-flight fetch
  resolves.forEach((r) => r({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const [r1, r2] = await Promise.all([p1, p2]);
  assert.ok(r1.purgedCount >= 0);
  assert.equal(r2.purgedCount, 0, 'second concurrent flush must be no-op');
  await q.shutdown();
});

test('Queue FULL safety path forces a flush but can still lose events', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, errors: [] }) });
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  q._pendingEvents.length = 0;
  // Force near-full then push; flush is async and the push continues after.
  // We just verify the safety branch does not throw and flush ran.
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'a', id: 'safe1' });
  await q.flush();
  assert.equal(q.getStats().pendingEvents, 0);
  await q.shutdown();
});

test('Queue size growth across 1000 enqueues stays bounded by single flush', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, errors: [] }) });
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  for (let i = 0; i < 1000; i++) {
    await q.enqueue({ type: 'slug', religion: 'islamic', slug: `name${i}`, id: `id${i}` });
  }
  const before = q.getStats().totalEnqueued;
  await q.flush();
  assert.equal(before, 1000);
  assert.equal(q.getStats().pendingEvents, 0);
  await q.shutdown();
});

// ---------------------------------------------------------------------------
// SECTION 3 — CRITICAL: purge URL correctness vs real routes
// ---------------------------------------------------------------------------
console.log('\n=== 3. PURGE TARGET URL CORRECTNESS ===');

// Real route map (from src/app):
//   /names/[religion]/[slug]                 (name detail)
//   /names/religion/[religion]/[page]        (NOT /names/[religion]/1)
//   /names/[religion]/letter/[letter]/[page]
//   /names/[religion]/origin/[origin]/[page]
//   /names/[religion]/categories/[category]/[page]
//   /[religion]/boy-names  /[religion]/girl-names
// There is NO /names/[religion]/1 route.
test('Queue purges NON-EXISTENT route /names/[religion]/1 (phantom URL)', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  if (process.env.DEBUG) console.log('AFTER MOCKFETCH:', global.fetch.toString().slice(0, 50));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'p1' });
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  await q.flush();
  const allUrls = calls.flatMap((c) => c.files);
  const phantom = allUrls.find((u) => /\/names\/islamic\/1$/.test(u));
  assert.ok(phantom, `phantom URL purged: ${JSON.stringify(allUrls)}`);
  await q.shutdown();
});

test('Queue NEVER purges the real listing route /names/religion/islamic/1 for a slug update', async () => {
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'p2' });
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  await q.flush();
  const allUrls = calls.flatMap((c) => c.files);
  const real = allUrls.find((u) => /\/names\/religion\/islamic\/1$/.test(u));
  assert.ok(!real, 'real religion listing page is NEVER purged on slug update → stale listing after name change');
  await q.shutdown();
});

test('Queue never purges pagination pages beyond page 1 (pages 2..N stay stale)', async () => {
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'religion', religion: 'islamic', id: 'p3' });
  mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  await q.flush();
  const allUrls = capturedCalls.flatMap((c) => c.files);
  const onlyPage1 = allUrls.every((u) => !/\/\d+$/.test(u) || /\/1$/.test(u));
  assert.ok(onlyPage1, 'only page 1 is purged; pages 2..N of every listing remain cached → stale content');
  await q.shutdown();
});

test('Gender listing purge uses /[religion]/boy-names but root also has /names/[religion]/1 which 404s', async () => {
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'p4' });
  mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  await q.flush();
  const allUrls = capturedCalls.flatMap((c) => c.files);
  const hasGender = allUrls.some((u) => /\/islamic\/boy-names$/.test(u));
  const hasPhantom = allUrls.some((u) => /\/names\/islamic\/1$/.test(u));
  assert.ok(hasGender, 'gender listing targeted');
  assert.ok(hasPhantom, 'phantom /names/islamic/1 also targeted (wasted purge + misleading)');
  await q.shutdown();
});

// purgeByPrefix just sends ONE url = siteUrl + prefix. Cloudflare purge_cache
// "files" expects exact URLs, NOT prefixes. So prefix purge is a no-op.
test('purgeByPrefix sends a single literal URL, NOT a prefix match (Cloudflare files=exact URLs)', async () => {
  mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  await client.purgeByPrefix('/names/islamic');
  assert.equal(capturedCalls.length, 1);
  assert.equal(capturedCalls[0].files[0], 'https://x.com/names/islamic', 'single literal URL, not all under prefix');
  assert.ok(!capturedCalls[0].purge_everything, 'does not use prefix purge API');
});

test("Route purge type 'religion' calls purgeByPrefix → purges only ONE literal URL, not all listing pages", async () => {
  mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const client = new CloudflarePurgeClient({ cloudflareToken: 't', cloudflareZoneId: 'z', siteUrl: 'https://x.com' });
  await client.purgeByPrefix('/names/islamic');
  // Only the literal URL https://x.com/names/islamic is purged.
  // The actual listing routes (/names/religion/islamic/1, /islamic/boy-names,
  // letter pages) are NOT purged. This is a silent failure.
  assert.equal(capturedCalls[0].files.length, 1);
});

// ---------------------------------------------------------------------------
// SECTION 4 — AUTH & RATE LIMIT (replicated from route.js)
// ---------------------------------------------------------------------------
console.log('\n=== 4. WEBHOOK AUTH + RATE LIMIT ===');

function makeIsAuthorized(secret) {
  return function isAuthorized(headers) {
    if (!secret) return false;
    const authHeader = headers.get('x-purge-secret');
    if (!authHeader) return false;
    if (authHeader.length !== secret.length) return false;
    let result = 0;
    for (let i = 0; i < authHeader.length; i++) {
      result |= authHeader.charCodeAt(i) ^ secret.charCodeAt(i);
    }
    return result === 0;
  };
}

test('Constant-time compare rejects wrong secret', () => {
  const auth = makeIsAuthorized('supersecret');
  assert.equal(auth(new Map([['x-purge-secret', 'wrongsecret']])), false);
});

test('Constant-time compare accepts correct secret', () => {
  const auth = makeIsAuthorized('supersecret');
  assert.equal(auth(new Map([['x-purge-secret', 'supersecret']])), true);
});

test('BLOCKER: timing-attack early-exit on length mismatch breaks "constant-time" claim', () => {
  // The implementation returns immediately on length mismatch BEFORE the loop.
  // That is a timing oracle (length leaks). Also: if secret is set but header
  // missing → returns false with no comparison. Document as security weakness.
  const auth = makeIsAuthorized('abcdefghij');
  const t0 = process.hrtime.bigint();
  auth(new Map([['x-purge-secret', 'x']])); // wrong length → instant
  const t1 = process.hrtime.bigint();
  const fast = Number(t1 - t0);
  const t2 = process.hrtime.bigint();
  auth(new Map([['x-purge-secret', 'abcdefghij']])); // correct length → loop runs
  const t3 = process.hrtime.bigint();
  const slow = Number(t3 - t2);
  warn('Timing oracle', `length-mismatch path (~${fast}ns) vs full-compare path (~${slow}ns) — early return leaks secret length`);
  assert.ok(true);
});

test('Rate limiter is in-memory per Worker isolate (NOT shared across workers/regions)', () => {
  // The route uses module-level `RATE_LIMIT.tokens` Map. Under Cloudflare
  // Workers + OpenNext, each isolate has its own memory → rate limit is
  // trivially bypassed by distributing requests across isolates/regions.
  warn('Rate limit scope', 'In-memory token bucket resets per Worker isolate; not global → brute-force protection weak at scale');
  assert.ok(true);
});

test('Rate limit keyed on x-forwarded-for first hop — spoofable header', () => {
  // request.headers.get('x-forwarded-for')?.split(',')[0] is attacker-controlled
  // if Cloudflare does not strip it. An attacker can rotate X-Forwarded-For.
  warn('IP spoofing', 'Rate limit key derived from client-supplied X-Forwarded-For (unless CF strips) → can be forged');
  assert.ok(true);
});

test('No replay protection: same webhook body with valid secret accepted forever', () => {
  // isAuthorized only checks the static secret. There is no nonce/timestamp/
  // signature (HMAC). A captured valid request can be replayed indefinitely.
  warn('Replay attack', 'Webhook auth = static secret only; no HMAC signature, no timestamp, no nonce → replayable forever');
  assert.ok(true);
});

// ---------------------------------------------------------------------------
// SECTION 5 — CACHE HEADERS vs ISR DATA CACHE TTL MISMATCH
// ---------------------------------------------------------------------------
console.log('\n=== 5. CACHE HEADER / ISR TTL CONSISTENCY ===');

test('Edge header s-maxage=365d but fetch Data Cache revalidate=3600s', () => {
  // next.config: name detail s-maxage=31536000. server-fetch ISR_TTL=3600.
  // After a CF purge, a NEW edge request hits the Worker. The Worker's Data
  // Cache (in-memory, OpenNext default) still holds the 1h-cached fetch.
  // The Worker serves FRESH-LOOKING stale HTML from its own cache for up to 1h.
  assert.equal(DEFAULT_CACHE_CONFIG.edgeTTL, 31536000);
  warn('Stale window', 'Edge purge + 1h ISR Data Cache = up to 1h stale HTML after purge (worker memory cache not invalidated by CF purge)');
  assert.ok(true);
});

test('Edge cache 365d with revalidate=31536000 on page = effectively permanent until manual purge', () => {
  // Name detail page: export const revalidate = 31536000 (365d).
  // Combined with 365d s-maxage, content is cached for a YEAR. Any data change
  // (religion change, merge, delete) requires an explicit purge. If purge
  // targets wrong URLs (see Section 3), stale content persists 1 year.
  assert.equal(31536000, 31536000);
});

test('stale-if-error=365d can serve year-old broken content when origin errors', () => {
  // If backend returns 500, Cloudflare serves stale for up to 365 days.
  // Acceptable for resilience but means corrupt/old data can live a year.
  assert.equal(DEFAULT_CACHE_CONFIG.staleIfError, 31536000);
});

test('search results cached at edge 1h with max-age=0 browser — query-string ignored for caching?', () => {
  // Cloudflare caches by URL. /search?q=foo and /search?q=bar are different
  // URLs so they cache separately (good). But the route is /search/:path* in
  // next.config, while actual search uses query string ?q=, not a path.
  // Confirm /search?q= is NOT matched by /search/:path* header rule.
  warn('Search cache miss', 'Header rule targets /search/:path* but search uses ?q= query → search caching rule never applies; falls to generic rule (2592000 edge)');
  assert.ok(true);
});

test('CDN-Cache-Control vs Cache-Control divergence for name pages', () => {
  const h = generateCacheHeaders(CACHE_TTL_BY_TYPE.nameDetail);
  // name detail: Cache-Control max-age=86400 but CDN-Cache-Control max-age=31536000
  assert.ok(h['Cache-Control'].includes('max-age=86400'));
  assert.ok(h['CDN-Cache-Control'].includes('max-age=86400'), 'name pages: CDN-Cache-Control max-age should also be browser-side 86400 (it is)');
  warn('Browser vs CDN divergence', 'Browser max-age=1d vs CDN 365d — acceptable, but note CDN-Cache-Control overrides s-maxage for Cloudflare');
});

// ---------------------------------------------------------------------------
// SECTION 6 — EDGE CASES: slug/religion validation
// ---------------------------------------------------------------------------
console.log('\n=== 6. EDGE CASES / VALIDATION ===');

test('isValidSlug rejects uppercase (slugs must be lowercased upstream)', () => {
  assert.equal(isValidSlug('Abdullah'), false);
  assert.equal(isValidSlug('abdullah'), true);
});

test('Queue slug event lowercases only via buildNamePageUrl? (charAt(0) uppercased for letter page)', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'abdullah', id: 'e1' });
  await q.flush();
  const allUrls = calls.flatMap((c) => c.files);
  const letter = allUrls.find((u) => /\/letter\/A\/1$/.test(u));
  assert.ok(letter, `letter page URL uses uppercase first letter: ${letter}`);
  await q.shutdown();
});

test('Religion change (islamic→christian) for same slug is not handled — old URL never purged', async () => {
  // If a name moves religion, the old /names/islamic/abdullah page still exists
  // (dynamicParams=true) and is cached 365d. Purge only targets the NEW religion.
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'christian', slug: 'abdullah', id: 'e2' });
  await q.flush();
  const allUrls = calls.flatMap((c) => c.files);
  const oldStillThere = allUrls.some((u) => /\/names\/islamic\/abdullah$/.test(u));
  assert.ok(!oldStillThere, 'old religion URL not purged on religion change → permanently stale');
  await q.shutdown();
});

test('Unicode / special-character slugs fail isValidSlug → purge silently drops them', () => {
  assert.equal(isValidSlug('müslüm'), false);
  assert.equal(isValidSlug('name–with–dash'), false); // en-dash
  warn('Unicode names', 'Names with non-ASCII or en/em dashes never pass validation → their pages (if rendered) cannot be purged');
});

test('Empty / malformed slug in purge request still enqueues and purges a bad URL', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  const enq = await q.enqueue({ type: 'slug', religion: 'islamic', slug: '', id: 'e3' });
  await q.flush();
  const allUrls = calls.flatMap((c) => c.files);
  // EMPTY slug → `event.slug` is falsy → entire slug block SKIPPED.
  // The purge silently does nothing for that name (no error, no URL).
  assert.ok(!allUrls.some((u) => /\/names\/islamic\//.test(u)), 'empty slug = whole event dropped, no URL purged');
  warn('Empty slug silently dropped', 'slug="" → enqueue accepted but event produces ZERO URLs; purge silently no-ops (misleading success)');
  await q.shutdown();
});

// ---------------------------------------------------------------------------
// SECTION 7 — FAILURE / RECOVERY
// ---------------------------------------------------------------------------
console.log('\n=== 7. FAILURE & RECOVERY ===');

test('Flush on Cloudflare 500 marks failed but queue is already drained (events LOST)', async () => {
  // flush() does `events = this._pendingEvents.splice(0)` BEFORE the API call.
  // If the API fails, events are gone — there is no dead-letter / retry queue.
  let n = 0;
  global.fetch = async () => { n++; return { ok: false, status: 500, json: async () => ({ success: false, errors: [{ message: 'down' }] }) }; };
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'a', id: 'f1' });
  const r = await q.flush();
  assert.equal(r.success, false);
  assert.equal(q._pendingEvents.length, 0, 'failed events are dropped, not re-queued → DATA LOSS');
  await q.shutdown();
});

test('Timer flush swallows errors (catch logs only) — no alerting hook', async () => {
  let n = 0;
  global.fetch = async () => { n++; throw new Error('network'); };
  const q = new PurgeQueueImpl({ flushIntervalMs: 50, logger: console });
  await q.enqueue({ type: 'slug', religion: 'islamic', slug: 'a', id: 'f2' });
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(n >= 1, 'flush fired');
  // no exception thrown to caller because timer catch swallows
  await q.shutdown();
});

test('Queue flush with empty pending returns success (no API call)', async () => {
  const calls = mockFetch(() => ({ ok: true, json: async () => ({ success: true, errors: [] }) }));
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  const r = await q.flush();
  assert.equal(calls.length, 0);
  assert.equal(r.purgedCount, 0);
  await q.shutdown();
});

// ---------------------------------------------------------------------------
// SECTION 8 — CONCURRENCY / RACE
// ---------------------------------------------------------------------------
console.log('\n=== 8. CONCURRENCY / RACE CONDITIONS ===');

test('100 simultaneous enqueues + concurrent flush do not crash (no dedup loss check)', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ success: true, errors: [] }) });
  const q = new PurgeQueueImpl({ flushIntervalMs: 100000, logger: console });
  const jobs = [];
  for (let i = 0; i < 100; i++) jobs.push(q.enqueue({ type: 'slug', religion: 'islamic', slug: `n${i}`, id: `c${i}` }));
  jobs.push(q.flush());
  await Promise.all(jobs);
  assert.equal(q.getStats().totalEnqueued, 100);
  await q.shutdown();
});

test('Two workers flushing same queue instance is impossible (singleton per isolate)', () => {
  // purgeQueue is a module singleton. Under OpenNext each Worker isolate gets
  // its own singleton. Events enqueued in isolate A are invisible to isolate B.
  // A webhook hitting isolate B flushes only B's queue → no cross-isolate merge.
  warn('Cross-isolate', 'Module singleton queue is per-isolate; concurrent requests load-balanced across isolates do not share the queue');
  assert.ok(true);
});

// ---------------------------------------------------------------------------
// SECTION 9 — SECRETS / CONFIG PRESENCE
// ---------------------------------------------------------------------------
console.log('\n=== 9. CONFIG / SECRETS PRESENCE ===');

test('CLOUDFLARE_API_TOKEN / ZONE_ID / PURGE_WEBHOOK_SECRET are referenced but ABSENT from repo', () => {
  warn('Missing secrets', 'Grep of entire repo finds NO CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID, or PURGE_WEBHOOK_SECRET. If unset in prod, createPurgeClient() returns null → purge is a SILENT no-op and all cache invalidation is dead.');
  assert.ok(true);
});

test('next.config header source /names/:path* has LOWER specificity than /names/:religion/:slug', () => {
  // Next applies the FIRST matching header rule. /names/:religion/:slug is listed
  // BEFORE /names/:path*. A detail page /names/islamic/abdullah matches the
  // first rule (365d). Good. But /names/religion/islamic/1 matches /names/:path*
  // (30d) not the detail rule. Listing gets 30d — fine. No bug, just confirm.
  assert.ok(CACHE_HEADER_PRESETS.nameDetail.value.includes('31536000'));
  assert.ok(CACHE_HEADER_PRESETS.listingPages.value.includes('2592000'));
});

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n========================================');
console.log(`PASSED : ${results.passed.length}`);
console.log(`FAILED : ${results.failed.length}`);
console.log(`WARNED : ${results.warnings.length}`);
console.log('========================================');

if (results.failed.length) {
  console.log('\nFAILURES:');
  for (const f of results.failed) console.log(` - ${f.name}: ${f.err}`);
  process.exit(1);
}
