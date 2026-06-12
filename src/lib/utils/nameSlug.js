/**
 * SINGLE SOURCE OF TRUTH for name slug resolution.
 *
 * Every name link on the site MUST go through this module.
 * Rules:
 * 1. The slug field from the API/DB is always preferred
 * 2. createSafeSlug() is ONLY used as fallback when API slug is absent
 * 3. No two names should share the same slug within a religion
 * 4. Frontend NEVER uses display name directly for API calls
 */

import { createSafeSlug } from './createSafeSlug';

/**
 * Extract the canonical slug from a name object.
 * Priority: item.slug (from DB/API) > createSafeSlug(item.name) > null
 *
 * @param {Object} nameItem - Name object from API
 * @returns {string|null} - Valid slug or null if none could be resolved
 */
export function getCanonicalSlug(nameItem) {
  if (!nameItem) return null;

  // Priority 1: Use the slug field directly from the database/API
  if (nameItem.slug && typeof nameItem.slug === 'string') {
    const cleaned = nameItem.slug.trim().toLowerCase();
    if (cleaned && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleaned)) {
      return cleaned;
    }
  }

  // Priority 2: Generate from name using the standardized slug function
  if (nameItem.name && typeof nameItem.name === 'string') {
    const generated = createSafeSlug(nameItem.name);
    if (generated && generated.length >= 2) {
      return generated;
    }
  }

  return null;
}

/**
 * Build a safe name page URL using the canonical slug.
 *
 * @param {string} religion - islamic/christian/hindu
 * @param {Object} nameItem - Name object from API (must have slug or name)
 * @returns {string|null} - e.g. "/names/islamic/maaida" or null if invalid
 */
export function buildNameUrl(religion, nameItem) {
  const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
  const normalizedReligion = (religion || '').toLowerCase();

  if (!VALID_RELIGIONS.includes(normalizedReligion)) return null;

  const slug = getCanonicalSlug(nameItem);
  if (!slug) return null;

  return `/names/${normalizedReligion}/${slug}`;
}

/**
 * Validate that a slug string is in canonical format.
 * Used by middleware, link components, and API calls.
 *
 * @param {string} slug
 * @returns {boolean}
 */
export function isValidNameSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const trimmed = slug.trim();
  if (trimmed.length < 2 || trimmed.length > 100) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed);
}

/**
 * Normalize a slug from URL parameter.
 * Ensures consistent format before API lookup.
 *
 * @param {string} rawSlug - The slug from the URL
 * @returns {string|null} - Normalized slug or null if invalid
 */
export function normalizeUrlSlug(rawSlug) {
  if (!rawSlug || typeof rawSlug !== 'string') return null;
  const cleaned = rawSlug.trim().toLowerCase();
  if (!isValidNameSlug(cleaned)) return null;
  return cleaned;
}

export default {
  getCanonicalSlug,
  buildNameUrl,
  isValidNameSlug,
  normalizeUrlSlug,
};