import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo/site';
import { generateNamePageMetadata, generateNamePageSchemas } from '@/lib/seo/name-page-seo';
import { serverFetchNameDetail } from '@/lib/api/server-fetch';
import { sanitizeNameData } from '@/lib/utils/sanitizeNameData';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import CulturalNameAnalysisCard from '@/components/name/NameDetail';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

// ISR: 90-day cache to minimize writes
export const revalidate = 7776000; // 90 days
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
    const islamicBoysRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-boy-names.json'), 'utf8');
    JSON.parse(islamicBoysRaw).forEach((n) => {
      if (n.name) {
        const slug = createSafeSlug(n.name);
        if (slug) staticNames.push({ religion: 'islamic', slug });
      }
    });

    const islamicGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-girl-names.json'), 'utf8');
    JSON.parse(islamicGirlsRaw).forEach((n) => {
      if (n.name) {
        const slug = createSafeSlug(n.name);
        if (slug) staticNames.push({ religion: 'islamic', slug });
      }
    });

    try {
      const islamicMixedRaw = fs.readFileSync(path.join(namesDataDir, 'islamic_names.json'), 'utf8');
      JSON.parse(islamicMixedRaw).forEach((n) => {
        if (n.name) {
          const slug = createSafeSlug(n.name);
          if (slug) staticNames.push({ religion: 'islamic', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianBoysRaw = fs.readFileSync(path.join(namesDataDir, 'christian-boy-names.json'), 'utf8');
      JSON.parse(christianBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSafeSlug(n.name);
          if (slug) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'christian-girl-names.json'), 'utf8');
      JSON.parse(christianGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSafeSlug(n.name);
          if (slug) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduBoysRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-boy-names.json'), 'utf8');
      JSON.parse(hinduBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSafeSlug(n.name);
          if (slug) staticNames.push({ religion: 'hindu', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-girl-names.json'), 'utf8');
      JSON.parse(hinduGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSafeSlug(n.name);
          if (slug) staticNames.push({ religion: 'hindu', slug });
        }
      });
    } catch { /* skip */ }
  } catch { /* skip */ }

  const seen = new Set();
  const deduped = [];
  for (const entry of staticNames) {
    const key = `${entry.religion}|${entry.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(entry);
    }
  }

  const limited = {};
  const perReligionLimit = 28;
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
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim().toLowerCase())) return null;
  return slug.trim().toLowerCase();
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const religion = normalizeReligion(resolvedParams?.religion);
  const slug = createSafeSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested linguistic analysis page could not be found on NameVerse.',
    };
  }

  const nameData = await serverFetchNameDetail(religion, slug);
  if (!nameData) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested linguistic analysis page could not be found on NameVerse.',
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
  const slug = createSafeSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return notFound();
  }

  let nameData = await serverFetchNameDetail(religion, slug);
  if (!nameData) {
    return notFound();
  }

  nameData = sanitizeNameData(nameData);

  const pageUrl = `${getSiteUrl()}/names/${religion}/${slug}`;
  const schemas = generateNamePageSchemas(nameData, religion, slug);
  const faqData = schemas.faqData || [];

  return (
    <>
      {schemas.dataset && (
        <Script
          id="dataset-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.dataset) }}
        />
      )}

      {schemas.scholarlyArticle && (
        <Script
          id="scholarly-article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.scholarlyArticle) }}
        />
      )}

      {schemas.faq && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
        />
      )}

      {schemas.breadcrumb && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
        />
      )}

      <CulturalNameAnalysisCard data={nameData} faqData={faqData} pageUrl={pageUrl} />
    </>
  );
}