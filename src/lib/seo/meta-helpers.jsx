/**
 * Meta description validation and generation utilities
 * Updated for Cultural Onomastics — NameVerse = Cultural Name Knowledge Base
 */
import { getSiteUrl } from '@/lib/seo/site';

/**
 * Validate meta title length (up to 60 characters)
 * @param {string} title - Meta title to validate
 * @returns {string} Validated title
 */
export function validateMetaTitle(title) {
  if (!title) return 'NameVerse — Cultural Name Knowledge Base';

  const cleaned = title.trim();
  if (cleaned.length <= 60) return cleaned;

  const truncated = cleaned.substring(0, 57);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`;
}

/**
 * Validate meta description length (160-300 characters)
 */
export function validateMetaDescription(description) {
  if (!description) return 'NameVerse is a structured cultural and linguistic knowledge base for personal names across civilizations. Explore linguistic origin analysis, cultural semantic interpretation, and historical naming evolution.';

  description = description.trim();

  if (description.length < 160) {
    const suffix = ' Part of the NameVerse multilingual onomastics system — a cultural naming research platform for linguistic intelligence and cross-cultural analysis.';
    description = (description + suffix).slice(0, 300);
  } else if (description.length > 300) {
    description = description.slice(0, 300);
  }

  return description;
}

/**
 * Generate canonical URL ensuring no trailing slashes
 */
export function generateCanonicalUrl(path, baseUrl) {
  const cleanPath = path.replace(/\/+$|^\s+|\s+$/g, '');
  const cleanBase = (baseUrl || getSiteUrl()).replace(/\/+$|^\s+|\s+$/g, '');
  return `${cleanBase}${cleanPath}`;
}

/**
 * Generate meta description for name pages — academic onomastics style
 */
export function generateNameMetaDescription(data) {
  const name = data.name || 'this name';
  const religion = data.religion || 'multicultural';
  const gender = data.gender || 'personal';
  const meaning = data.short_meaning || 'meaningful cultural context';
  const origin = data.origin || 'multiple linguistic traditions';

  return `Linguistic origin analysis of ${name}: a ${gender} personal name of ${origin} origin within ${religion} cultural context. Semantic interpretation: "${meaning}". Part of the NameVerse Cultural Name Knowledge Base — cross-cultural onomastics research.`;
}