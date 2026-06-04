import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import AdSlot from '@/components/Ads/AdSlot';
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

import { getSiteUrl } from '@/lib/seo/site';
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

// ✅ Global SEO Metadata — Cultural Name Knowledge Base
export const metadata = {
  title: {
    default: validateMetaTitle("NameVerse — Cultural Name Knowledge Base | Linguistic Origin Analysis"),
    template: "%s | NameVerse"
  },
  description: validateMetaDescription(
    "NameVerse is a Cultural Name Knowledge Base and Multilingual Onomastics System. Explore linguistic origin analysis, cultural semantic interpretation, and historical naming evolution of personal names across civilizations."
  ),
  keywords:
    "cultural name knowledge base, linguistic origin analysis, multilingual onomastics system, cultural semantic interpretation, historical naming evolution, cross-cultural onomastic study, linguistic intelligence database, cultural naming research platform",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  authors: [{ name: "NameVerse — Cultural Name Knowledge Base", url: siteUrl }],
  creator: "NameVerse — Cultural Name Knowledge Base",
  publisher: "NameVerse — Cultural Name Knowledge Base",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl, languages: { en: siteUrl, 'x-default': siteUrl } },
  openGraph: {
    title: validateMetaTitle("NameVerse — Cultural Name Knowledge Base | Multilingual Onomastics"),
    description: validateMetaDescription(
      "NameVerse is a structured cultural and linguistic knowledge base for personal names across civilizations. Linguistic origin analysis, cultural semantic interpretation, and historical naming evolution data."
    ),
    url: siteUrl,
    siteName: "NameVerse — Cultural Name Knowledge Base",
    images: [
      { 
        url: `/logo.png`, 
        width: 512, 
        height: 512, 
        type: "image/png", 
        alt: "NameVerse — Cultural Name Knowledge Base | Linguistic Origin Analysis" 
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: validateMetaTitle("NameVerse — Cultural Name Knowledge Base | Onomastics Research"),
    description: validateMetaDescription(
      "A structured cultural and linguistic knowledge graph for human names. Multilingual onomastics system for cross-cultural name research, linguistic origin analysis, and cultural semantic interpretation."
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
  manifest: `/manifest.json`,
  category: "Cultural Onomastics, Linguistics, Anthropology",
};

// Viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#1E40AF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="application-name" content="NameVerse — Cultural Name Knowledge Base" />
        <meta property="og:site_name" content="NameVerse — Cultural Name Knowledge Base" />
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

        {/* Performance: Resource Hints */}
        <ResourceHints />

        {/* Icons - use relative paths */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" type="image/png" href="/logo.png" />

        {/* Ahrefs Analytics Script */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Xu6eED27Kx1ZuJhBcJDJsA"
          async
          strategy="afterInteractive"
        />

        {/* Enhanced crawl hints */}
        <GoogleBotMeta siteUrl={siteUrl} />

        {/* ✅ Enhanced Structured Data — Cultural & Linguistic Knowledge Graph */}
        <StructuredData
          organization={true}
          website={true}
          breadcrumbs={[
            { name: "Home", url: siteUrl },
            { name: "Cultural Name Research", url: `/names` },
          ]}
          collectionPage={{
            name: "Cross-Cultural Onomastics Research Collection",
            description: "Structured linguistic origin analysis and cultural semantic interpretation of personal names across civilizations — Islamic, Christian, and Hindu naming traditions.",
            url: `/names`,
            items: [],
          }}
        />
      </head>

      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased nv-body nv-page`}>
        <AppProvider>
          <PerformanceInit />
          <Suspense fallback={<div>Loading Navbar...</div>}>
            <Navbar />
          </Suspense>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot
              slotId="9781955008"
              adFormat="autorelaxed"
              eager={false}
              collapseOnEmpty={true}
              className="mb-4 mx-auto w-full max-w-[320px] md:max-w-full"
              minHeight="65px"
              aria-label="Top display advertisement"
            />
          </div>

          <RouteChrome>{children}</RouteChrome>
          <Footer />
          <AppInstallPopup />

          {/* Bottom display ad — fixed sticky, fast loading, works on all screens */}
          <div className="sticky bottom-0 left-0 right-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
            <div className="mx-auto flex items-center justify-center">
              <div className="w-full max-w-[728px] min-h-[50px] md:min-h-[90px] flex items-center justify-center">
                <AdSlot
                  slotId="9605048978"
                  adFormat="show"
                  eager={true}
                  collapseOnEmpty={true}
                  className="w-full flex items-center justify-center"
                  aria-label="Bottom display advertisement"
                />
              </div>
            </div>
          </div>
        </AppProvider>

        {/* Google AdSense script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1510675468129183"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}