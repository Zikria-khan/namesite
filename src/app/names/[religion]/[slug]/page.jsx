import { notFound } from 'next/navigation';
import { getSiteUrl } from '@/lib/seo/site';
import { createSlug } from '@/lib/seo/url-builder';
import { generateNamePageMetadata, generateNamePageSchemas } from '@/lib/seo/name-page-seo';
import { serverFetchNameDetail } from '@/lib/api/server-fetch';
import { sanitizeNameData } from '@/lib/utils/sanitizeNameData';
import CulturalNameAnalysisCard from '@/components/name/NameDetail';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

// Allow dynamic slugs beyond generateStaticParams() — only 28 per religion are pre-rendered
// This does NOT make every page call a serverless function.
// Pages are rendered once and cached for revalidate seconds.
// Only the FIRST visit triggers a function call; subsequent visits use cache.
export const dynamicParams = true;

// 30-day cache: pages are generated once and cached for 30 days.
// Free tier friendly: 100 function calls/day, each cached for 30 days.
// Over 30 days, you can serve 3,000 unique page visits without extra cost.
export const revalidate = 2592000;

// Load local name data as fallback
function loadLocalNameData(religion, slug) {
  try {
    const namesDataDir = path.join(process.cwd(), 'public', 'data');
    const files = [
      'islamic-boy-names.json',
      'islamic-girl-names.json',
      'christian-boy-names.json',
      'christian-girl-names.json',
      'hindu-boy-names.json',
      'hindu-girl-names.json',
    ];
    
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(namesDataDir, file), 'utf8');
        const names = JSON.parse(raw);
        const found = names.find(n => createSlug(n.name) === slug);
        if (found) {
          return {
            ...found,
            religion: religion,
            lucky_number: found.luckyNumber,
            short_meaning: found.meaning,
          };
        }
      } catch { /* continue */ }
    }
  } catch { /* continue */ }
  return null;
}

export async function generateStaticParams() {
  const namesDataDir = path.join(process.cwd(), 'public', 'data');
  const staticNames = [];

  try {
    const islamicBoysRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-boy-names.json'), 'utf8');
    JSON.parse(islamicBoysRaw).forEach((n) => {
      if (n.name) {
        const slug = createSlug(n.name);
        if (slug) staticNames.push({ religion: 'islamic', slug });
      }
    });

    const islamicGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-girl-names.json'), 'utf8');
    JSON.parse(islamicGirlsRaw).forEach((n) => {
      if (n.name) {
        const slug = createSlug(n.name);
        if (slug) staticNames.push({ religion: 'islamic', slug });
      }
    });

    try {
      const islamicMixedRaw = fs.readFileSync(path.join(namesDataDir, 'islamic_names.json'), 'utf8');
      JSON.parse(islamicMixedRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug) staticNames.push({ religion: 'islamic', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianBoysRaw = fs.readFileSync(path.join(namesDataDir, 'christian-boy-names.json'), 'utf8');
      JSON.parse(christianBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'christian-girl-names.json'), 'utf8');
      JSON.parse(christianGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduBoysRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-boy-names.json'), 'utf8');
      JSON.parse(hinduBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug) staticNames.push({ religion: 'hindu', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-girl-names.json'), 'utf8');
      JSON.parse(hinduGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
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

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const religion = normalizeReligion(resolvedParams?.religion);
  const slug = createSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested linguistic analysis page could not be found on NameVerse.',
      robots: { index: false, follow: false },
    };
  }

  let nameData = await serverFetchNameDetail(religion, slug);
  
  // Fallback to local data if API fails
  if (!nameData) {
    nameData = loadLocalNameData(religion, slug);
  }

  if (!nameData) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested name page does not exist on NameVerse.',
      robots: { index: false, follow: false },
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
  const slug = createSlug(resolvedParams?.slug);

  if (!religion || !slug) {
    return notFound();
  }

  let nameData = await serverFetchNameDetail(religion, slug);
  
  // Fallback to local data if API fails
  if (!nameData) {
    nameData = loadLocalNameData(religion, slug);
  }

  // If no data found anywhere, return 404 — never serve fake/garbage content
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