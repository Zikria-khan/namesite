import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AppInstallPopup from "./install";
import Script from 'next/script';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import ResourceHints from "@/components/Performance/ResourceHints";
import PerformanceInit from "./performance";
import StructuredData from "@/components/SEO/StructuredData";
import GoogleBotMeta from "@/components/SEO/GoogleBotMeta";
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { AppProvider } from "@/contexts/AppContext";
import LoadingWrapper from "@/components/LoadingAnimation/LoadingWrapper";
import { Suspense } from 'react';
import RouteChrome from "@/components/Layout/RouteChrome";
import MonetagAd from "@/components/Ads/MonetagAd";
import AdRefreshHandler from "@/components/Ads/AdRefreshHandler";

import { getSiteUrl } from '@/lib/seo/site';
// Use environment variable or default - will be overridden client-side if needed
const siteUrl = getSiteUrl();

const displayFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

// ✅ Global SEO Metadata
export const metadata = {
  title: {
    default: validateMetaTitle("NameVerse — 65,000+ Verified Baby Names with Meanings"),
    template: "%s | NameVerse"
  },
  description: validateMetaDescription(
    "Discover 65,000+ baby names across Islamic, Hindu & Christian traditions. Verified meanings, lucky numbers, origins & 2026 trending data. Trusted by 500,000+ parents."
  ),
  keywords:
    "baby names, baby names 2026, islamic baby names, hindu baby names, christian baby names, quranic names, biblical names, sanskrit names, muslim baby names, baby name meanings, lucky numbers, baby name generator, name suggestions, trending baby names 2026",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  authors: [{ name: "NameVerse", url: siteUrl }],
  creator: "NameVerse",
  publisher: "NameVerse",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl, languages: { en: siteUrl, 'x-default': siteUrl } },
  openGraph: {
    title: validateMetaTitle("NameVerse — 65,000+ Verified Baby Names | Islamic, Hindu, Christian"),
    description: validateMetaDescription(
      "65,000+ baby names with verified meanings, lucky numbers & origins. Islamic Quranic, Hindu Vedic, Christian Biblical. 98% verified accuracy. Trusted by parents worldwide."
    ),
    url: siteUrl,
    siteName: "NameVerse",
    images: [
      { 
        url: `/logo.png`, 
        width: 512, 
        height: 512, 
        type: "image/png", 
        alt: "NameVerse — 65,000+ Baby Names with Meanings" 
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: validateMetaTitle("Baby Names 2026 — 65,000+ Islamic, Hindu, Christian Names"),
    description: validateMetaDescription(
      "65,000+ verified baby names with meanings, lucky numbers & numerology. Islamic, Hindu, Christian. 98% accuracy. Start exploring now!"
    ),
    images: [`/logo.png`],
    creator: "@NameVerseOfficial",
    site: "@NameVerseOfficial",
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: [
      { url: '/apple-touch.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo.png', sizes: '152x152', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.png',
      },
    ],
  },
  manifest: `/manifest.json`, // Use relative path to avoid CORS issues
  category: "Baby Names, Culture, Religion",
};

// Viewport configuration (Next.js App Router)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1E40AF",
};

export default function RootLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Trigger ad refresh on route change
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
      // Note: Monetag refresh would require their specific API
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="NameVerse" />
        <meta property="og:site_name" content="NameVerse" />
        <meta name="content-language" content="en" />
        <meta name="theme-color" content="#4F46E5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="google-site-verification" content="iPU1wdP26kg58gDN3U4H39YuS20alsLvjfXRM-QtKLw" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="NameVerse" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="ahrefs-site-verification" content="650afaf6635223ff618a281883a22b69b937a121e933b19907debeca67754cd4" />

        {/* ✅ Performance: Resource Hints */}
        <ResourceHints />

        {/* ✅ Icons - use relative paths */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/logo.png" />

        {/* ✅ Ahrefs Analytics Script */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Xu6eED27Kx1ZuJhBcJDJsA"
          async
          strategy="afterInteractive"
        />
        {/* ✅ Google AdSense Script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1510675468129183"
          async
          crossorigin="anonymous"
          strategy="afterInteractive"
        />

        {/* ✅ Enhanced crawl hints */}
        <GoogleBotMeta siteUrl={siteUrl} />

        {/* ✅ Enhanced Structured Data — single source of truth for all JSON-LD schemas */}
        <StructuredData
          organization={true}
          website={true}
          breadcrumbs={[
            { name: "Home", url: siteUrl },
            { name: "Baby Names", url: `/names` },
          ]}
          collectionPage={{
            name: "Popular Baby Names by Religion",
            description: "Browse top baby names from different faiths — Muslim, Hindu, and Christian — with meanings and translations.",
            url: `/names`,
            items: [],
          }}
        />
      </head>

      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased nv-body nv-page`}>
        <div id="temp-wrapper">
          <AppProvider>
            <PerformanceInit />
            <Suspense fallback={<div>Loading Navbar...</div>}>
              <Navbar />
            </Suspense>
            <RouteChrome>{children}</RouteChrome>
            <Footer />
            <AppInstallPopup />
          </AppProvider>
        </div>

        {/* Monetag In-Page Push Ad — loaded at bottom, after all content */}
        {/* This ensures ads don't block rendering and don't affect LCP/CLS */}
        <MonetagAd />
      </body>
    </html>
  );
}