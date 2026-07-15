import { notFound } from 'next/navigation';
import { createSlug, nameAbsoluteUrl, isValidSlug } from '@/lib/seo/url-builder';
import { generateNamePageMetadata, generateNamePageSchemas } from '@/lib/seo/name-page-seo';
import { serverFetchNameDetail, serverFetchTrendingNames, serverFilterKnownSlugs } from '@/lib/api/server-fetch';
import { sanitizeNameData } from '@/lib/utils/sanitizeNameData';
import CulturalNameAnalysisCard from '@/components/name/NameDetail';
import Script from 'next/script';
import { findLocalName, loadLocalNameList, loadDetailedNames, loadMixedNames } from '@/lib/seo/name-data.mjs';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];

// Allow dynamic slugs beyond generateStaticParams()
export const dynamicParams = true;

// 30-day cache: pages are generated once and cached for 30 days.
export const revalidate = 31536000; // 365 days

// Local name data fallback — sourced from the bundled (Workers-safe) data module.
function loadLocalNameData(religion, slug) {
  return findLocalName(religion, slug);
}

export async function generateStaticParams() {
  // Build slug list from bundled detailed + mixed name data (no fs).
  const allNames = [...loadDetailedNames(), ...loadMixedNames()];
  const seen = new Set();
  const deduped = [];
  for (const name of allNames) {
    if (!name.slug || !isValidSlug(name.slug)) continue;
    const key = `${name.religion}|${name.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push({ religion: name.religion, slug: name.slug });
    }
  }

  // Cap static generation per religion to stay well within Cloudflare Pages
  // per-deployment file limits. Remaining slugs render on-demand via ISR.
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

  // Clean name field before metadata generation
  if (nameData?.name && typeof nameData.name === 'string') {
    nameData.name = nameData.name.trim().replace(/^\n+/, '');
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

  // Pre-validate similar/related/variation links against the backend so the page
  // only renders internal <Link>s to name pages that actually exist (fixes a
  // long-standing source of 404s from similar_sounding_names).
  const [filteredSimilar, filteredRelated, filteredVariations] = await Promise.all([
    serverFilterKnownSlugs(religion, nameData.similar_sounding_names),
    serverFilterKnownSlugs(religion, nameData.related_names),
    serverFilterKnownSlugs(religion, nameData.name_variations),
  ]);
  nameData = {
    ...nameData,
    similar_sounding_names: filteredSimilar,
    related_names: filteredRelated,
    name_variations: filteredVariations,
  };

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
      
      {/* hreflang tags — only en and x-default until translation routes exist */}
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="alternate" hrefLang="x-default" href={pageUrl} />

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