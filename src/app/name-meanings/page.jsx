import { redirect } from 'next/navigation';

export const revalidate = 2592000; // 30 days

export async function generateMetadata() {
  return {
    title: 'Name Meanings — Search by Meaning | NameVerse',
    description: 'Search 60,000+ baby names by meaning to find the perfect name with the right significance.',
  };
}

export default function NameMeaningsRedirect() {
  redirect('/names-by-meaning');
}