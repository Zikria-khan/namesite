import { getSiteUrl } from '@/lib/seo/site';

/**
 * GoogleBotMeta
 * Adds crawl directives and helpful hints for search engine bots.
 */
export default function GoogleBotMeta({ siteUrl }) {
  if (!siteUrl) siteUrl = getSiteUrl();
  const crawlDirectives =
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";

  return (
    <>
      <meta name="googlebot" content={crawlDirectives} />
      <meta name="googlebot-news" content="index, follow" />
      <meta name="bingbot" content={crawlDirectives} />
      <meta name="yandex" content="index, follow" />
      <meta name="robots" content={crawlDirectives} />
      <link
        rel="alternate"
        href={`${siteUrl}/sitemap.xml`}
        type="application/xml"
        title="NameVerse Sitemap"
      />
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
    </>
  );
}
