import { NextResponse } from 'next/server';

/**
 * SEO FIREWALL MIDDLEWARE — Vercel Edge
 * 
 * Allow ALL valid routes to pass through normally.
 * Next.js routing handles 404/notFound.
 */

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const path = pathname.toLowerCase();

  // ✅ ALLOW: root, static files, assets immediately — no checks
  if (
    path === '/' ||
    path.startsWith('/_next/') ||
    path.startsWith('/api/') ||
    path.startsWith('/feed.xml') ||
    path.startsWith('/sitemap.xml') ||
    path.startsWith('/robots.txt') ||
    path.startsWith('/manifest.json') ||
    path.startsWith('/ads.txt') ||
    path.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|json|xml|txt)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ ALLOW: everything else — let Next.js routing handle 404/notFound
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};