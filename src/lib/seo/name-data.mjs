/**
 * WORKERS-SAFE NAME DATA LOADER
 *
 * Replaces the fs/path-based reads in sitemap-data.mjs with direct ES module
 * JSON imports so the same data can be consumed inside Server Components and
 * Cloudflare Workers (no Node filesystem APIs). The normalization logic is
 * ported verbatim from sitemap-data.mjs so callers get identical shapes.
 *
 * This module is imported by:
 *   - src/app/names/[religion]/[slug]/page.jsx   (local fallback + static params)
 *   - src/app/meaning/[slug]/page.jsx            (meaning-content + blog posts)
 *   - src/app/religions/[religion]/page.jsx      (all names / detailed / blog)
 *   - src/lib/seo/sitemap-data.mjs               (build-time reads, Node)
 */

// ── Static JSON imports (bundled at build time, no fs) ──
// Relative paths (not the @/ alias) are used deliberately: this module is
// imported both by the Next.js bundle AND by Node build scripts, and raw Node
// does not resolve the @/ alias.
import islamicBoyNames from '../../../public/data/islamic-boy-names.json' with { type: 'json' };
import islamicGirlNames from '../../../public/data/islamic-girl-names.json' with { type: 'json' };
import christianBoyNames from '../../../public/data/christian-boy-names.json' with { type: 'json' };
import christianGirlNames from '../../../public/data/christian-girl-names.json' with { type: 'json' };
import hinduBoyNames from '../../../public/data/hindu-boy-names.json' with { type: 'json' };
import hinduGirlNames from '../../../public/data/hindu-girl-names.json' with { type: 'json' };

import islamicNames from '../../../public/islamic_names.json' with { type: 'json' };
import christianNames from '../../../public/christians_names.json' with { type: 'json' };
import hinduNames from '../../../public/hindu_names.json' with { type: 'json' };

import blogPostsData from '../../../public/data/blog-posts.json' with { type: 'json' };
import meaningContent from '../../../public/data/meaning-content.json' with { type: 'json' };

const RELIGIONS = ['islamic', 'christian', 'hindu'];

// Detailed (object) name files, keyed by religion prefix.
const DETAILED_FILES = {
  islamic: [islamicBoyNames, islamicGirlNames],
  christian: [christianBoyNames, christianGirlNames],
  hindu: [hinduBoyNames, hinduGirlNames],
};

const MIXED_FILES = {
  islamic: islamicNames,
  christian: christianNames,
  hindu: hinduNames,
};

function cleanText(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

/**
 * Create a safe lowercase URL slug from any string.
 */
function createSlug(input = '') {
  if (!input || typeof input !== 'string') return '';

  const cleaned = String(input)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (cleaned.length < 2) return '';
  if (/^\d+$/.test(cleaned)) return '';

  return cleaned;
}

function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const cleaned = slug.toLowerCase().trim();
  if (cleaned.length < 2 || cleaned.length > 100) return false;
  if (/^\d+$/.test(cleaned)) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleaned);
}

function normalizeReligion(value) {
  const r = cleanText(value).toLowerCase();
  if (['islam', 'muslim', 'islamic'].includes(r)) return 'islamic';
  if (['christianity', 'christian'].includes(r)) return 'christian';
  if (['hinduism', 'hindu'].includes(r)) return 'hindu';
  return RELIGIONS.includes(r) ? r : null;
}

function normalizeName(item, religion) {
  if (typeof item === 'string') {
    const slug = createSlug(item);
    if (!slug) return null;
    return { name: item, religion, origin: 'Unknown', short_meaning: '', slug };
  }
  const name = cleanText(item.name || item.title);
  if (!name) return null;
  const slug = cleanText(item.slug) || createSlug(name);
  if (!slug || !isValidSlug(slug)) return null;
  return {
    name,
    slug,
    religion: normalizeReligion(item.religion) || religion,
    origin: cleanText(item.origin || item.origins || 'Unknown'),
    gender: cleanText(item.gender || item.sex || ''),
    short_meaning: cleanText(item.short_meaning || item.meaning || item.meaning_summary || ''),
    meaning: cleanText(item.meaning || item.long_meaning || item.short_meaning || ''),
    lucky_number: item.lucky_number ?? item.luckyNumber,
  };
}

export function loadDetailedNames() {
  const names = [];
  const seen = new Set();
  for (const religion of RELIGIONS) {
    for (const raw of DETAILED_FILES[religion]) {
      for (const item of raw) {
        const normalized = normalizeName(item, religion);
        if (!normalized) continue;
        const key = `${normalized.religion}|${normalized.slug}`;
        if (!seen.has(key)) {
          seen.add(key);
          names.push(normalized);
        }
      }
    }
  }
  return names;
}

export function loadMixedNames() {
  const names = [];
  const seen = new Set();
  for (const religion of RELIGIONS) {
    for (const item of MIXED_FILES[religion]) {
      const normalized = normalizeName(item, religion);
      if (!normalized) continue;
      const key = `${normalized.religion}|${normalized.slug}`;
      if (!seen.has(key)) {
        seen.add(key);
        names.push(normalized);
      }
    }
  }
  return names;
}

export const loadAllNames = loadMixedNames;

export function loadBlogPosts() {
  return (Array.isArray(blogPostsData) ? blogPostsData : [])
    .filter((post) => post.id && post.title)
    .map((post) => ({ ...post, slug: post.id }));
}

export function loadMeaningContent() {
  return Array.isArray(meaningContent) ? meaningContent : [];
}

/**
 * Local fallback for a single name detail. Mirrors the previous
 * loadLocalNameData() behaviour (searches all detailed files by slug).
 */
export function findLocalName(religion, slug) {
  if (!slug) return null;
  const target = createSlug(slug);
  if (!target) return null;
  for (const religionKey of RELIGIONS) {
    for (const raw of DETAILED_FILES[religionKey]) {
      for (const item of raw) {
        const itemName = typeof item === 'string' ? item : item.name;
        if (createSlug(itemName) === target) {
          const cleanedName = String(itemName || '').trim().replace(/^\n+/, '');
          return {
            ...(typeof item === 'string' ? {} : item),
            name: cleanedName,
            religion: normalizeReligion(religion) || religionKey,
            lucky_number: typeof item === 'string' ? undefined : item.luckyNumber,
            short_meaning: typeof item === 'string' ? '' : item.meaning,
          };
        }
      }
    }
  }
  return null;
}

/**
 * Local fallback list of names for a religion (used when trending fetch fails).
 */
export function loadLocalNameList(religion, limit = 8, excludeSlug = '') {
  const seen = new Set();
  const names = [];
  const target = createSlug(excludeSlug);
  for (const file of DETAILED_FILES[normalizeReligion(religion) || 'islamic'] || []) {
    for (const item of file) {
      if (!item.name) continue;
      const slug = createSlug(item.name);
      if (!slug || slug === target || seen.has(slug)) continue;
      seen.add(slug);
      names.push({ name: item.name, slug });
      if (names.length >= limit) return names;
    }
  }
  return names;
}

export { createSlug, isValidSlug, normalizeReligion, RELIGIONS };
