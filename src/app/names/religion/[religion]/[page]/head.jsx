import React from 'react';
import { generateCanonicalUrl } from '@/lib/seo/meta-helpers';

import { getSiteUrl } from '@/lib/seo/site';
export default function Head({ params }) {
  const religion = params?.religion || 'islamic';
  const page = parseInt(params?.page || '1', 10) || 1;
  const totalPages = parseInt(params?.totalPages || '99', 10) || 99;
  const base = getSiteUrl();

  const canonicalPath = `/names/religion/${religion}/${page}`;
  const canonical = generateCanonicalUrl(canonicalPath, base);

  const prevHref = page > 1 ? generateCanonicalUrl(`/names/religion/${religion}/${page - 1}`, base) : null;
  const nextHref = page < totalPages ? generateCanonicalUrl(`/names/religion/${religion}/${page + 1}`, base) : null;

  const ogImage = `${base}/opengraph-image`;

  return (
    <>
      <link rel="canonical" href={canonical} />
      {prevHref && <link rel="prev" href={prevHref} />}
      {nextHref && <link rel="next" href={nextHref} />}

      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NameVerse" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
