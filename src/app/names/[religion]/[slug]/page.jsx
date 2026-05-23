import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo/site';
import { generateNamePageMetadata, generateNamePageSchemas } from '@/lib/seo/name-page-seo';
import { serverFetchNameDetail } from '@/lib/api/server-fetch';
import { sanitizeNameData } from '@/lib/utils/sanitizeNameData';
import NameDetail from '@/components/name/NameDetail';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

// ISR: 30-day cache
export const revalidate = 2592000; // 30 days
export const dynamicParams = true;

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

/**
 * Pre-build the most popular names at deploy time so Google
 * can index them immediately without waiting for first SSR visit.
 * All remaining ~42K names are served via ISR on first request.
 */
export async function generateStaticParams() {
  const namesDataDir = path.join(process.cwd(), 'public', 'data');
  const staticNames = [];

  try {
    // islamic-boy-names.json — all entries are islamic/boy
    const islamicBoysRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-boy-names.json'), 'utf8');
    JSON.parse(islamicBoysRaw).forEach((n) => {
      if (n.name) staticNames.push({ religion: 'islamic', slug: n.name.toLowerCase().trim() });
    });

    // islamic-girl-names.json — all entries are islamic/girl
    const islamicGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-girl-names.json'), 'utf8');
    JSON.parse(islamicGirlsRaw).forEach((n) => {
      if (n.name) staticNames.push({ religion: 'islamic', slug: n.name.toLowerCase().trim() });
    });

    // islamic_names.json — may contain mixed genders
    try {
      const islamicMixedRaw = fs.readFileSync(path.join(namesDataDir, 'islamic_names.json'), 'utf8');
      JSON.parse(islamicMixedRaw).forEach((n) => {
        if (n.name) staticNames.push({ religion: 'islamic', slug: n.name.toLowerCase().trim() });
      });
    } catch { /* file absent or malformed — skip */ }

    // christian-boy-names.json
    try {
      const christianBoysRaw = fs.readFileSync(path.join(namesDataDir, 'christian-boy-names.json'), 'utf8');
      JSON.parse(christianBoysRaw).forEach((n) => {
        if (n.name) staticNames.push({ religion: 'christian', slug: n.name.toLowerCase().trim() });
      });
    } catch { /* skip */ }

    // christian-girl-names.json
    try {
      const christianGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'christian-girl-names.json'), 'utf8');
      JSON.parse(christianGirlsRaw).forEach((n) => {
        if (n.name) staticNames.push({ religion: 'christian', slug: n.name.toLowerCase().trim() });
      });
    } catch { /* skip */ }

    // hindu-boy-names.json
    try {
      const hinduBoysRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-boy-names.json'), 'utf8');
      JSON.parse(hinduBoysRaw).forEach((n) => {
        if (n.name) staticNames.push({ religion: 'hindu', slug: n.name.toLowerCase().trim() });
      });
    } catch { /* skip */ }

    // hindu-girl-names.json
    try {
      const hinduGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-girl-names.json'), 'utf8');
      JSON.parse(hinduGirlsRaw).forEach((n) => {
        if (n.name) staticNames.push({ religion: 'hindu', slug: n.name.toLowerCase().trim() });
      });
    } catch { /* skip */ }

  } catch { /* namesDataDir not found — return empty so ISR handles everything */ }

  // Deduplicate (a name may appear in multiple source files)
  const seen = new Set();
  const deduped = [];
  for (const entry of staticNames) {
    const key = `${entry.religion}|${entry.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(entry);
    }
  }

  // Limit to 50 popular names per religion (150 total) to keep build under 250 pages
  // Remaining names will be generated on-demand via ISR
  const limited = {};
  const perReligionLimit = 50;
  
  for (const entry of deduped) {
    if (!limited[entry.religion]) limited[entry.religion] = [];
    if (limited[entry.religion].length < perReligionLimit) {
      limited[entry.religion].push(entry);
    }
  }

  return Object.values(limited).flat();
}

function normalizeSlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  // Reject any slug containing non-ASCII characters (IPA, macrons, Arabic script, etc.)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim().toLowerCase())) return null;
  return slug.trim().toLowerCase();
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const religion = normalizeReligion(resolvedParams?.religion);
  const slug = normalizeSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested baby name page could not be found on NameVerse.',
      keywords: ['NameVerse', 'baby names', 'name meaning site'],
    };
  }

  const nameData = await serverFetchNameDetail(religion, slug);
  if (!nameData) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested baby name page could not be found on NameVerse.',
      keywords: ['NameVerse', 'name not found', 'baby name meanings'],
    };
  }

  return generateNamePageMetadata(nameData, religion, slug);
}

function normalizeReligion(religion) {
  if (!religion || typeof religion !== 'string') return null;
  const normalized = religion.toLowerCase();

  if (normalized === 'islam' || normalized === 'muslim') return 'islamic';
  if (normalized === 'hinduism') return 'hindu';
  if (normalized === 'christianity') return 'christian';

  return VALID_RELIGIONS.includes(normalized) ? normalized : null;
}

export default async function NameDetailPage({ params }) {
  const resolvedParams = await params;
  const religion = normalizeReligion(resolvedParams?.religion);
  const slug = normalizeSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return notFound();
  }

  let nameData = await serverFetchNameDetail(religion, slug);
  if (!nameData) {
    return notFound();
  }

  // Sanitize data to ensure all fields are React-renderable
  nameData = sanitizeNameData(nameData);

  const pageUrl = `${getSiteUrl()}/names/${religion}/${slug}`;
  const schemas = generateNamePageSchemas(nameData, religion, slug);
  const faqData = schemas.faqData || [];

  return (
    <>
      {schemas.faq && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
        />
      )}

      {schemas.article && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
        />
      )}

      {schemas.breadcrumb && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
        />
      )}

      <NameDetail data={nameData} faqData={faqData} pageUrl={pageUrl} />
    </>
  );
}