import { NextResponse } from 'next/server';

/**
 * Middleware — completely stripped to eliminate all Vercel Functions CPU overhead.
 * Math/string manipulation, RegExp matching, and URL construction removed entirely.
 * Returns immediately without touching the incoming request.
 */
export function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
