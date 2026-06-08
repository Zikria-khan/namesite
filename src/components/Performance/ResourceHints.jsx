/**
 * Resource Hints Component
 * Add preconnect, dns-prefetch, and prefetch hints for better performance
 */

import { env } from '@/config/env';

export default function ResourceHints() {
  const apiBaseUrl = env.api.baseUrl;
  // Removed Supabase references as they're no longer used

  // Extract domains for preconnect - handle invalid URLs gracefully
  let apiDomain = null;
  
  try {
    if (apiBaseUrl && apiBaseUrl.startsWith('http')) {
      apiDomain = new URL(apiBaseUrl).origin;
    }
  } catch (e) {
    // Invalid URL, skip
  }
  
  // Removed Supabase domain extraction as it's no longer used

  return (
    <>
      {/* DNS Prefetch for external domains */}
      {apiDomain && (
        <link rel="dns-prefetch" href={apiDomain} />
      )}

      {/* Preconnect to critical domains */}
      {apiDomain && (
        <link rel="preconnect" href={apiDomain} crossOrigin="anonymous" />
      )}

      {/* Preconnect to Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* ⚡ DNS Prefetch + Preconnect for Revolthem ad network (replaces AdSense) */}
      <link rel="dns-prefetch" href="https://revolthem.com" />
      <link rel="preconnect" href="https://revolthem.com" crossOrigin="anonymous" />

      {/* ⚡ DNS Prefetch + Preconnect for Microsoft Clarity analytics */}
      <link rel="dns-prefetch" href="https://www.clarity.ms" />
      <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />

      {/* ⚡ DNS Prefetch + Preconnect for Ahrefs analytics */}
      <link rel="dns-prefetch" href="https://analytics.ahrefs.com" />
      <link rel="preconnect" href="https://analytics.ahrefs.com" crossOrigin="anonymous" />

      {/* Prefetch critical routes for instant navigation */}
      <link rel="prefetch" href="/names/religion/islamic/1" as="document" />
      <link rel="prefetch" href="/blog" as="document" />
    </>
  );
}