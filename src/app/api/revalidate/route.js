import { NextResponse } from 'next/server';
import { purgeQueue, buildNamePageUrl } from '@/lib/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_WEBHOOK_SECRET;

function isAuthorized(request) {
  const secret = REVALIDATE_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get('x-revalidate-secret');
  if (!authHeader) return false;
  if (authHeader.length !== secret.length) return false;
  let result = 0;
  for (let i = 0; i < authHeader.length; i++) {
    result |= authHeader.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return result === 0;
}

async function revalidateTag(tag) {
  if (typeof globalThis !== 'undefined' && globalThis.__next_force_revalidate_tag) {
    try {
      await globalThis.__next_force_revalidate_tag(tag);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { religion, slug } = body || {};

    if (!religion || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing religion or slug' },
        { status: 400 }
      );
    }

    const tag = `name:${String(religion).toLowerCase()}:${String(slug).toLowerCase()}`;
    const tagRevalidated = await revalidateTag(tag);

    await purgeQueue.enqueue({
      type: 'slug',
      religion: String(religion).toLowerCase(),
      slug: String(slug).toLowerCase(),
      reason: 'manual_revalidate',
      id: `revalidate-${religion}-${slug}-${Date.now()}`,
    });
    await purgeQueue.flush();

    return NextResponse.json({
      revalidated: true,
      religion: String(religion).toLowerCase(),
      slug: String(slug).toLowerCase(),
      timestamp: Date.now(),
      tagRevalidated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
