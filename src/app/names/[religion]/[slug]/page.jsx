import { notFound } from 'next/navigation';
import { createSlug, nameAbsoluteUrl, isValidSlug } from '@/lib/seo/url-builder';
import { generateNamePageMetadata, generateNamePageSchemas } from '@/lib/seo/name-page-seo';
import { serverFetchNameDetail, serverFetchTrendingNames } from '@/lib/api/server-fetch';
import { sanitizeNameData } from '@/lib/utils/sanitizeNameData';
import CulturalNameAnalysisCard from '@/components/name/NameDetail';
import Script from 'next/script';
import fs from 'fs';
import path from 'path';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

// Allow dynamic slugs beyond generateStaticParams()
export const dynamicParams = true;

// 30-day cache: pages are generated once and cached for 30 days.
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

function loadLocalNameList(religion, limit = 8, excludeSlug = '') {
  try {
    const namesDataDir = path.join(process.cwd(), 'public', 'data');
    const files = [
      'islamic-boy-names.json',
      'islamic-girl-names.json',
      'christian-boy-names.json',
      'christian-girl-names.json',
      'hindu-boy-names.json',
      'hindu-girl-names.json',
    ].filter(file => file.startsWith(`${religion}-`));

    const seen = new Set();
    const names = [];
    for (const file of files) {
      const raw = fs.readFileSync(path.join(namesDataDir, file), 'utf8');
      const parsed = JSON.parse(raw);
      for (const item of parsed) {
        if (!item.name) continue;
        const slug = createSlug(item.name);
        if (!slug || slug === excludeSlug || seen.has(slug)) continue;
        seen.add(slug);
        names.push({ name: item.name, slug });
        if (names.length >= limit) return names;
      }
    }
    return names;
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const namesDataDir = path.join(process.cwd(), 'public', 'data');
  const staticNames = [];

  try {
    const islamicBoysRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-boy-names.json'), 'utf8');
    JSON.parse(islamicBoysRaw).forEach((n) => {
      if (n.name) {
        const slug = createSlug(n.name);
        if (slug && isValidSlug(slug)) staticNames.push({ religion: 'islamic', slug });
      }
    });

    const islamicGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'islamic-girl-names.json'), 'utf8');
    JSON.parse(islamicGirlsRaw).forEach((n) => {
      if (n.name) {
        const slug = createSlug(n.name);
        if (slug && isValidSlug(slug)) staticNames.push({ religion: 'islamic', slug });
      }
    });

    try {
      const islamicMixedRaw = fs.readFileSync(path.join(namesDataDir, 'islamic_names.json'), 'utf8');
      JSON.parse(islamicMixedRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug && isValidSlug(slug)) staticNames.push({ religion: 'islamic', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianBoysRaw = fs.readFileSync(path.join(namesDataDir, 'christian-boy-names.json'), 'utf8');
      JSON.parse(christianBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug && isValidSlug(slug)) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const christianGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'christian-girl-names.json'), 'utf8');
      JSON.parse(christianGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug && isValidSlug(slug)) staticNames.push({ religion: 'christian', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduBoysRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-boy-names.json'), 'utf8');
      JSON.parse(hinduBoysRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug && isValidSlug(slug)) staticNames.push({ religion: 'hindu', slug });
        }
      });
    } catch { /* skip */ }

    try {
      const hinduGirlsRaw = fs.readFileSync(path.join(namesDataDir, 'hindu-girl-names.json'), 'utf8');
      JSON.parse(hinduGirlsRaw).forEach((n) => {
        if (n.name) {
          const slug = createSlug(n.name);
          if (slug && isValidSlug(slug)) staticNames.push({ religion: 'hindu', slug });
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

  if (!religion || !slug || !isValidSlug(slug)) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested linguistic analysis page could not be found on NameVerse.',
      robots: { index: false, follow: false },
    };
  }

  const fetchResult = await serverFetchNameDetail(religion, slug);
  
  // Explicit 404 from backend - content confirmed missing
  if (fetchResult.notFound) {
    return {
      title: 'Name Not Found | NameVerse',
      description: 'The requested name page does not exist on NameVerse.',
      robots: { index: false, follow: false },
    };
  }
  
  let nameData = fetchResult.data;
  
  // Fallback to local data if API failed (degraded state)
  if (!nameData) {
    nameData = loadLocalNameData(religion, slug);
  }

  // If no data found anywhere, return 404
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

  if (!religion || !slug || !isValidSlug(slug)) {
    return notFound();
  }

  const fetchResult = await serverFetchNameDetail(religion, slug);
  
  // Explicit 404 from backend - content confirmed missing in DB
  if (fetchResult.notFound) {
    return notFound();
  }
  
  let nameData = fetchResult.data;
  
  // Fallback to local data if API failed (degraded state)
  if (!nameData) {
    nameData = loadLocalNameData(religion, slug);
  }

  // If still no data, check if this is a truly missing entry or degraded state
  if (!nameData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Name Data</h1>
          <p className="text-gray-600 mb-6">
            We're experiencing connectivity issues. Please refresh the page or try again later.
          </p>
          <a 
            href={`/names/${religion}/letter/a/1`} 
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
          >
            Browse All {religion.charAt(0).toUpperCase() + religion.slice(1)} Names
          </a>
        </div>
      </div>
    );
  }

  nameData = sanitizeNameData(nameData);

  const pageUrl = nameAbsoluteUrl(religion, slug);
  const schemas = generateNamePageSchemas(nameData, religion, slug);
  const faqData = schemas.faqData || [];

  const trendingResult = await serverFetchTrendingNames({ religion, limit: 8 });
  const apiTrendingNames = (trendingResult.data || [])
    .map((item) => {
      const name = typeof item === 'object' ? item.name : item;
      const slugValue = typeof item === 'object' ? item.slug : '';
      const safeSlug = slugValue || createSlug(name);
      return { name, slug: safeSlug };
    })
    .filter((item) => item.name && item.slug && item.slug.length >= 2 && isValidSlug(item.slug));
  const fallbackTrendingNames = apiTrendingNames.length > 0
    ? apiTrendingNames
    : loadLocalNameList(religion, 8, slug);
  const trendingNamesSource = apiTrendingNames.length > 0 && !trendingResult.error ? 'trending' : 'suggested';

  return (
    <>
      {/* Canonical tag */}
      <link rel="canonical" href={pageUrl} />
      
      {/* hreflang tags for multilingual support */}
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="alternate" hrefLang="x-default" href={pageUrl} />
      {nameData.in_urdu && (
        <link rel="alternate" hrefLang="ur" href={pageUrl} />
      )}
      {nameData.in_arabic && (
        <link rel="alternate" hrefLang="ar" href={pageUrl} />
      )}
      {nameData.in_hindi && (
        <link rel="alternate" hrefLang="hi" href={pageUrl} />
      )}
      {nameData.in_bengali && (
        <link rel="alternate" hrefLang="bn" href={pageUrl} />
      )}
      {nameData.in_turkish && (
        <link rel="alternate" hrefLang="tr" href={pageUrl} />
      )}
      {nameData.in_persian && (
        <link rel="alternate" hrefLang="fa" href={pageUrl} />
      )}

      {schemas.dataset && (
        <Script
          id="dataset-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.dataset) }}
        />
      )}

      {schemas.webPage && (
        <Script
          id="webpage-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webPage) }}
        />
      )}

      {schemas.article && (
        <Script
          id="article-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.article) }}
        />
      )}

      {schemas.definedTerm && (
        <Script
          id="definedterm-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.definedTerm) }}
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

      <CulturalNameAnalysisCard
        data={nameData}
        faqData={faqData}
        pageUrl={pageUrl}
        trendingNames={fallbackTrendingNames}
        trendingNamesSource={trendingNamesSource}
      />
    </>
  );
}