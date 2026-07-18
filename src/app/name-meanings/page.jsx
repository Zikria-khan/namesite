import { redirect } from 'next/navigation';

// 30-day cache — single source of truth: src/lib/cache/cache-config.js DEFAULT_CACHE_TTL_SECONDS
export const revalidate = 2592000;

export async function generateMetadata() {
  return {
    title: 'Name Meanings — Search by Meaning | NameVerse',
    description: 'Search 60,000+ baby names by meaning to find the perfect name with the right significance.',
  };
}

export default function NameMeaningsRedirect() {
  redirect('/names-by-meaning');
}