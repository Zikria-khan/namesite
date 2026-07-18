import { redirect } from 'next/navigation';

// 30-day cache — single source of truth: src/lib/cache/cache-config.js DEFAULT_CACHE_TTL_SECONDS
export const revalidate = 2592000;

export async function generateMetadata() {
  return {
    title: 'Viral Baby Names - NameVerse',
    description: 'Discover baby names trending on social media platforms.',
  };
}

export default function ViralNames() {
  redirect('/trending-names');
}