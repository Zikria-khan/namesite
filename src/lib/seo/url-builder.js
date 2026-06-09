/**
 * SINGLE SOURCE OF TRUTH for all NameVerse URLs
 * 
 * Every URL on the site MUST go through this file.
 * Database, sitemap, internal links, breadcrumbs, canonicals,
 * structured data — ALL use the same builder.
 * 
 * RULES ENFORCED:
 * 1. Lowercase only
 * 2. No trailing slashes
 * 3. Only valid ASCII a-z0-9-hyphen slugs
 * 4. Absolute URLs for canonicals
 * 5. Relative paths for internal links
 * 6. Consistent religion names: islamic, christian, hindu
 */

import { getSiteUrl } from './site';

// Valid route prefixes (must match middleware whitelist)
const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

// Valid slug pattern
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Create a safe lowercase URL slug from any string
 */
export function createSlug(input = '') {
  if (!input) return '';
  return String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate a slug follows canonical format
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const cleaned = slug.toLowerCase().trim();
  if (cleaned.length < 2 || cleaned.length > 50) return false;
  return VALID_SLUG.test(cleaned);
}

/**
 * Normalize religion name to canonical form
 */
export function normalizeReligion(religion) {
  if (!religion) return null;
  const r = religion.toLowerCase().trim();
  if (r === 'islam' || r === 'muslim') return 'islamic';
  if (r === 'christianity') return 'christian';
  if (r === 'hinduism') return 'hindu';
  return VALID_RELIGIONS.includes(r) ? r : null;
}

/**
 * Build a RELATIVE URL for a name page
 * Used by: internal links, breadcrumbs, navigation
 * 
 * @param {string} religion - islamic/christian/hindu
 * @param {string} slug - valid lowercase slug
 * @returns {string} e.g. /names/islamic/abdullah
 */
export function nameRelativeUrl(religion, slug) {
  const r = normalizeReligion(religion);
  const s = createSlug(slug);
  if (!r || !s || !isValidSlug(s)) return null;
  return /names/religion/islamic/1;
}

/**
 * Build an ABSOLUTE URL for a name page
 * Used by: canonical tags, sitemap, structured data, OG tags
 * 
 * @param {string} religion - islamic/christian/hindu
 * @param {string} slug - valid lowercase slug
 * @returns {string} e.g. https://nameverse.vercel.app/names/islamic/abdullah
 */
export function nameAbsoluteUrl(religion, slug) {
  const relative = nameRelativeUrl(religion, slug);
  if (!relative) return null;
  return `${getSiteUrl()}${relative}`;
}

/**
 * Build a RELATIVE URL for a collection/listing page
 * 
 * @param {string} type - religion/letter/origin/categories
 * @param {string} religion - islamic/christian/hindu
 * @param {string} value - letter, origin, or category name
 * @param {number} page - page number (default 1)
 * @returns {string} e.g. /names/religion/islamic/1
 */
export function collectionRelativeUrl(type, religion, value, page = 1) {
  const r = normalizeReligion(religion);
  if (!r) return null;
  
  const typeMap = {
    religion: `/names/religion/${r}`,
    letter: `/names/${r}/letter/${(value || '').toUpperCase()}`,
    origin: `/names/${r}/origin/${createSlug(value || '')}`,
    categories: `/names/${r}/categories/${createSlug(value || '')}`,
  };
  
  const base = typeMap[type];
  if (!base) return null;
  
  const p = parseInt(page) || 1;
  return `${base}/${p}`;
}

export default {
  createSlug,
  isValidSlug,
  normalizeReligion,
  nameRelativeUrl,
  nameAbsoluteUrl,
  collectionRelativeUrl,
};