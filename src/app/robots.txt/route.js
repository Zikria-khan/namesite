import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/seo/site';

export const dynamic = 'force-static';

const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /api/og/
Disallow: /_next/static/webpack/
Disallow: /_next/static/chunks/
Allow: /_next/data/
Disallow: /performance
Disallow: /install
Disallow: /*?utm_
Disallow: /*?ref=
Disallow: /*?source=

# Block special-character paths (IPA, Arabic, Urdu) so crawlers never index
# the broken-404 class generated when phonetic/AR text is mistaken for a URL.
Disallow: /*%E1%BD%
Disallow: /*%CA%
Disallow: /*%C9%
Disallow: /*%D9%
Disallow: /*%DA%
Disallow: /*%E2%80%8C*

Sitemap: ${getSiteUrl()}/sitemap.xml
`;

export function GET() {
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
