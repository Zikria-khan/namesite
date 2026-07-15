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
  // unoptimized: true is REQUIRED for Cloudflare Pages/Workers — the Next.js
  // image optimizer does not run in the Workers runtime. Images are served
  // as-is (remotePatterns below still gate allowed remote sources).
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nameverse.vercel.app',
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
  //
  // NOTE: Religion-path normalization (islam/muslim/christianity/hinduism →
  // canonical islamic/christian/hindu) lives in middleware.js, NOT here, to
  // avoid double-hop redirect chains. Do not re-add those four rules below.
  async redirects() {
    return [
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: https://quge5.com https://revolthem.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://adservice.google.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: https://quge5.com https://revolthem.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "connect-src 'self' https: data: blob: https://quge5.com https://revolthem.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https: data: https://quge5.com https://revolthem.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
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
      // Manifest.json - public, no auth required
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
      // Ad proxy route - allow all origins
      {
        source: '/dstar/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
      {
        source: '/dstar',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
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

  // IMPORTANT (Cloudflare / OpenNext):
  // We target @opennextjs/cloudflare, whose generated Worker implements
  // redirects()/rewrites()/headers() from next.config directly. Cloudflare
  // Pages _redirects/_headers files are NOT consulted for app routes under
  // OpenNext (the worker is a catch-all), so we deliberately keep these here
  // instead of moving them to _redirects/_headers as the next-on-pages flow
  // would require.

  // Optimize package imports
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
      '@heroicons/react',
    ],
  },

  // NOTE: Do NOT set output: 'export'. This project uses ISR + dynamic
  // routes; OpenNext supports hybrid static + dynamic without a full static
  // export. Leave `output` unset (defaults to undefined / server build).
};

export default nextConfig;