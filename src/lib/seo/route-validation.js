/**
 * ROUTE VALIDATION SYSTEM — Single source of truth for URL validity
 *
 * Every URL in the system must pass through this validator.
 * Invalid URLs return 410 Gone.
 *
 * VALID ROUTES (discovered from app/ directory):
 *
 * STATIC:
 *   /
 *   /names
 *   /search
 *   /blog
 *   /about
 *   /privacy
 *   /terms
 *   /languages
 *   /popularity
 *   /name-meanings
 *   /names-by-meaning
 *   /unique-names
 *   /trending-names
 *   /advanced-search
 *   /my-names
 *   /popular-by-state
 *   /viral-names
 *   /guides/expert-naming-guide
 *
 * DYNAMIC (backed by real data):
 *   /names/[religion]/[slug]
 *   /names/[religion]/origin/[origin]/[page]
 *   /names/[religion]/categories/[category]/[page]
 *   /names/[religion]/letter/[letter]/[page]
 *   /names/religion/[religion]/[page]
 *   /blog/[slug]
 *   /search/[term]
 *   /guides/[slug]
 *
 * GENDER PAGES:
 *   /islamic/boy-names
 *   /islamic/girl-names
 *   /christian/boy-names
 *   /christian/girl-names
 *   /hindu/boy-names
 *   /hindu/girl-names
 *
 * API/SYSTEM (noindex):
 *   /api/*
 *   /feed.xml
 *   /sitemap.xml
 */

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

const VALID_STATIC_ROUTES = new Set([
  '/',
  '/names',
  '/search',
  '/blog',
  '/about',
  '/privacy',
  '/terms',
  '/languages',
  '/popularity',
  '/name-meanings',
  '/names-by-meaning',
  '/unique-names',
  '/trending-names',
  '/advanced-search',
  '/my-names',
  '/popular-by-state',
  '/viral-names',
  '/guides/expert-naming-guide',
]);

const VALID_GENDER_PAGES = new Set([
  '/islamic/boy-names',
  '/islamic/girl-names',
  '/christian/boy-names',
  '/christian/girl-names',
  '/hindu/boy-names',
  '/hindu/girl-names',
]);

// IPA characters, diacritical marks, and non-ASCII Unicode blocks that should NEVER appear in URLs
// This catches: ˈ ɑː ɪ ɔː ɛ ə ʃ ʒ ʤ ʧ ɹ ɾ ɣ ʔ θ ð ŋ ɲ ɳ ɽ ʈ ɖ ɭ ˞ ˌ ̩ ̍ ḁ ᵊ ̧ ̣ ̩ ̪ ̹ ̟ ̠ ̤ ̥ ̆ ̈ ̃
// Also catches: any character with code point > 127 (non-ASCII)
const INVALID_URL_CHARS = /[^\x00-\x7F]/;

// Dangerous encoded patterns that should never appear
const ENCODED_DANGEROUS = /%[0-9A-Fa-f]{2}/;

/**
 * Check if a URL path contains invalid characters (IPA, Unicode, encoded, etc.)
 */
export function containsInvalidChars(pathname) {
  return INVALID_URL_CHARS.test(pathname) || ENCODED_DANGEROUS.test(pathname);
}

/**
 * Normalize religion name to canonical form
 */
export function normalizeReligion(religion) {
  if (!religion || typeof religion !== 'string') return null;
  const r = religion.toLowerCase().trim();
  if (r === 'islam' || r === 'muslim') return 'islamic';
  if (r === 'hinduism') return 'hindu';
  if (r === 'christianity') return 'christian';
  return VALID_RELIGIONS.includes(r) ? r : null;
}

/**
 * Check if a slug is a valid ASCII slug (lowercase, alphanumeric, hyphens only)
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  if (trimmed.length < 1 || trimmed.length > 100) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
}

/**
 * Validate a page number segment
 */
export function isValidPage(page) {
  if (!page) return false;
  const num = parseInt(String(page), 10);
  return !isNaN(num) && num >= 1 && num <= 1000;
}

/**
 * Validate a letter segment (single A-Z)
 */
export function isValidLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

/**
 * Check if a path should be blocked (system/internal routes)
 */
export function isSystemRoute(pathname) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/feed.xml' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname === '/ads.txt' ||
    pathname === '/robots.txt' ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|json|xml|txt|woff|woff2|ttf|eot)$/i.test(pathname)
  );
}

/**
 * Get the redirect destination for religion normalization
 * Returns the canonical path if a redirect is needed, or null if no redirect needed
 */
export function getReligionRedirect(pathname) {
  // Check /names/islam/... → /names/religion/islamic/1/...
  const islamMatch = pathname.match(/^\/names\/(islam|muslim)(\/.+)$/i);
  if (islamMatch) {
    const rest = islamMatch[2];
    const redirect = `/names/religion/islamic/1${rest}`;
    return redirect !== pathname.toLowerCase() ? redirect : null;
  }

  // Check /names/religion/christian/1ity/... → /names/religion/christian/1/...
  const christianMatch = pathname.match(/^\/names\/christianity(\/.+)$/i);
  if (christianMatch) {
    const rest = christianMatch[1];
    return `/names/religion/christian/1${rest}`;
  }

  // Check /names/religion/hindu/1ism/... → /names/religion/hindu/1/...
  const hinduMatch = pathname.match(/^\/names\/hinduism(\/.+)$/i);
  if (hinduMatch) {
    const rest = hinduMatch[1];
    return `/names/religion/hindu/1${rest}`;
  }

  return null;
}

/**
 * Full route validation for a pathname.
 *
 * Returns:
 *   { valid: true } — allow the request through
 *   { valid: false, status: 410 } — return 410 Gone
 *   { valid: false, redirect: '/path' } — 301 redirect to canonical URL
 *   { valid: false, status: 404 } — let Next.js handle as not-found
 */
export function validateRoute(pathname) {
  const path = pathname.toLowerCase();

  // Skip double slashes (should be normalized)
  if (path.includes('//') && path !== '/') {
    const normalized = path.replace(/\/+/g, '/');
    if (normalized !== path) {
      return { valid: false, redirect: normalized };
    }
  }

  // Remove trailing slash (except root)
  if (path.length > 1 && path.endsWith('/')) {
    return { valid: false, redirect: path.slice(0, -1) };
  }

  // System routes — allow through
  if (isSystemRoute(path)) {
    return { valid: true };
  }

  // Check for invalid characters (IPA, Unicode, encoded)
  if (containsInvalidChars(path)) {
    return { valid: false, status: 410 };
  }

  // Religion normalization redirects
  const religionRedirect = getReligionRedirect(path);
  if (religionRedirect) {
    return { valid: false, redirect: religionRedirect };
  }

  // Static routes — allow through
  if (VALID_STATIC_ROUTES.has(path)) {
    return { valid: true };
  }

  // Gender pages — allow through
  if (VALID_GENDER_PAGES.has(path)) {
    return { valid: true };
  }

  const segments = path.split('/').filter(Boolean);

  // /names/[religion]/[slug]
  if (segments[0] === 'names' && segments.length === 3) {
    const religion = normalizeReligion(segments[1]);
    if (!religion) return { valid: false, status: 410 };
    const slug = segments[2];
    if (!isValidSlug(slug)) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /names/[religion]/letter/[letter]/[page]
  if (segments[0] === 'names' && segments[2] === 'letter' && segments.length === 5) {
    const religion = normalizeReligion(segments[1]);
    if (!religion) return { valid: false, status: 410 };
    if (!isValidLetter(segments[3])) return { valid: false, status: 410 };
    if (!isValidPage(segments[4])) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /names/[religion]/origin/[origin]/[page]
  if (segments[0] === 'names' && segments[2] === 'origin' && segments.length === 5) {
    const religion = normalizeReligion(segments[1]);
    if (!religion) return { valid: false, status: 410 };
    const origin = segments[3];
    if (!isValidSlug(origin)) return { valid: false, status: 410 };
    if (!isValidPage(segments[4])) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /names/[religion]/categories/[category]/[page]
  if (segments[0] === 'names' && segments[2] === 'categories' && segments.length === 5) {
    const religion = normalizeReligion(segments[1]);
    if (!religion) return { valid: false, status: 410 };
    const category = segments[3];
    if (!isValidSlug(category)) return { valid: false, status: 410 };
    if (!isValidPage(segments[4])) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /names/religion/[religion]/[page]
  if (segments[0] === 'names' && segments[1] === 'religion' && segments.length === 4) {
    const religion = normalizeReligion(segments[2]);
    if (!religion) return { valid: false, status: 410 };
    if (!isValidPage(segments[3])) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /blog/[slug]
  if (segments[0] === 'blog' && segments.length === 2) {
    const slug = segments[1];
    if (!isValidSlug(slug)) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /search/[term] — allow any reasonable search term (ASCII only)
  if (segments[0] === 'search' && segments.length === 2) {
    const term = segments[1];
    if (!term || term.length > 200) return { valid: false, status: 410 };
    if (INVALID_URL_CHARS.test(term)) return { valid: false, status: 410 };
    return { valid: true };
  }

  // /guides/[slug]
  if (segments[0] === 'guides' && segments.length === 2) {
    const slug = segments[1];
    if (!isValidSlug(slug)) return { valid: false, status: 410 };
    return { valid: true };
  }

  // Unknown route — 404 (let Next.js handle it)
  return { valid: false, status: 404 };
}

export default {
  validateRoute,
  containsInvalidChars,
  normalizeReligion,
  isValidSlug,
  isValidPage,
  isValidLetter,
  isSystemRoute,
  getReligionRedirect,
  VALID_RELIGIONS,
};