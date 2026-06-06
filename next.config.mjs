const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'https://name-meaning-site-backend.vercel.app').replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Disable TypeScript checking during build (already validated in CI)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance Optimizations
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Trailing slash policy: NO trailing slashes — single URL version only
  // This eliminates: /names/islamic/abdullah vs /names/islamic/abdullah/ duplication
  skipTrailingSlashRedirect: false,
  trailingSlash: false,

  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // REDIRECT CLEANUP: All redirects in one place — no chains, no loops
  // Rule: ONE URL → ONE redirect → final 200 page
  async redirects() {
    return [
      // Religion name normalization → lowercase canonical form
      // Prevents: /names/Islam/Abdullah vs /names/islamic/abdullah
      {
        source: '/names/islam/:path*',
        destination: '/names/islamic/:path*',
        permanent: true,
      },
      {
        source: '/names/muslim/:path*',
        destination: '/names/islamic/:path*',
        permanent: true,
      },
      {
        source: '/names/christianity/:path*',
        destination: '/names/christian/:path*',
        permanent: true,
      },
      {
        source: '/names/hinduism/:path*',
        destination: '/names/hindu/:path*',
        permanent: true,
      },
      // Old /baby-names/ paths → new /names/ structure
      {
        source: '/baby-names/:path*',
        destination: '/names/:path*',
        permanent: true,
      },
      {
        source: '/baby-names',
        destination: '/names',
        permanent: true,
      },
      // /name/ (singular) → /names/ (plural canonical)
      {
        source: '/name/:path*',
        destination: '/names/:path*',
        permanent: true,
      },
      // Legacy blog paths cleanup
      {
        source: '/article/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
    ];
  },

  // Headers for Performance & Edge Caching
  async headers() {
    return [
      // API routes - no cache + noindex
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // OG image generation - noindex, nofollow
      {
        source: '/api/og/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Main pages with comprehensive CSP
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.ahrefs.com https://pagead2.googlesyndication.com https://www.google-analytics.com https://www.googletagmanager.com https://*.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googletagmanager.com https://my.rtmark.net https://jhnwr.com https://pl29092372.effectivecpmnetwork.com https://effectivecpmnetwork.com https://protrafficinspector.com https://furiousexpansion.com https://*.adsterra.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: http:",
              "connect-src 'self' https://analytics.ahrefs.com https://name-meaning-site-backend.vercel.app https://*.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://ep1.adtrafficquality.google https://*.googletagmanager.com https://my.rtmark.net https://jhnwr.com https://pl29092372.effectivecpmnetwork.com https://effectivecpmnetwork.com https://protrafficinspector.com https://furiousexpansion.com https://*.adsterra.com data: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https://*.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://pl29092372.effectivecpmnetwork.com https://effectivecpmnetwork.com https://*.adsterra.com",
              "worker-src 'self' blob:",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "manifest-src 'self'",
              "media-src 'self' https: http:"
            ].join('; '),
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      // Next.js data
      {
        source: '/_next/data/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, stale-while-revalidate=2592000' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Static assets - long-term caching + noindex
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Rewrites for image fallbacks (keep minimal, no API exposure)
  async rewrites() {
    return [
      {
        source: '/images/articles/:path*',
        destination: '/logo.png',
      },
    ];
  },

  // Optimize package imports
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
      '@heroicons/react',
    ],
  },

  turbopack: {},
};

export default nextConfig;