import { getSiteUrl } from '@/lib/seo/site';

const siteUrl = getSiteUrl();

export const metadata = {
  title: 'Baby Names with Meanings — 65,000+ Islamic, Hindu & Christian Names A–Z 2026 | NameVerse',
  description: 'Discover 65,000+ baby names with authentic meanings, origins & lucky numbers. Browse 18,000+ Islamic Quranic names, 11,000+ Christian Biblical names & 15,000+ Hindu Sanskrit names A–Z. ✓ 98% verified ✓ Trending 2026 ✓ Boy & girl names by letter incl. rare & unique names.',
  alternates: {
    canonical: `${siteUrl}/names`,
  },
  openGraph: {
    title: 'Baby Names with Meanings — 65,000+ Islamic, Hindu & Christian Names A–Z 2026',
    description: 'Discover 65,000+ baby names with authentic meanings, origins & lucky numbers. 18,000+ Islamic Quranic, 11,000+ Christian Biblical & 15,000+ Hindu Sanskrit names A–Z, plus rare and global names.',
    url: `${siteUrl}/names`,
    siteName: 'NameVerse',
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Baby Names with Meanings — Islamic, Hindu & Christian Names A–Z',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baby Names with Meanings — 65,000+ Islamic, Hindu & Christian Names A–Z 2026',
    description: 'Discover 65,000+ baby names 2026 with authentic meanings, origins & lucky numbers. 18,000+ Islamic, 11,000+ Christian & 15,000+ Hindu names A–Z plus rare & unique names. ✓ Verified ✓ Trending.',
    images: [`${siteUrl}/opengraph-image`],
  },
  keywords: 'baby names 2026, islamic baby names, christian baby names, hindu baby names, quranic names, biblical names, sanskrit names, gender neutral names, unique baby names, trending baby names 2026',
  robots: 'index, follow',
  other: {
    'googlebot': 'index, follow',
  },
}

export default function NamesLayout({ children }) {
  return (
    <>
      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Baby Names with Meanings — Islamic, Hindu & Christian Names A–Z",
            "description": "Discover 65,000+ baby names with authentic meanings, origins & lucky numbers across Islamic Quranic, Christian Biblical, and Hindu Sanskrit traditions.",
            "url": `${siteUrl}/names`,
            "about": {
              "@type": "Thing",
              "name": "Baby Names by Religion"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Islamic Names", "url": `${siteUrl}/names/religion/islamic/1` },
                { "@type": "ListItem", "position": 2, "name": "Christian Names", "url": `${siteUrl}/names/religion/christian/1` },
                { "@type": "ListItem", "position": 3, "name": "Hindu Names", "url": `${siteUrl}/names/religion/hindu/1` },
              ]
            }
          })
        }}
      />
      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
              { "@type": "ListItem", "position": 2, "name": "Baby Names", "item": `${siteUrl}/names` },
            ]
          })
        }}
      />
      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "NameVerse",
            "url": siteUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${siteUrl}/?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NameVerse",
            "url": siteUrl,
            "logo": `${siteUrl}/logo.png`,
            "sameAs": [
              "https://twitter.com/nameverse",
              "https://facebook.com/nameverse"
            ]
          })
        }}
      />
      {children}
    </>
  )
}
