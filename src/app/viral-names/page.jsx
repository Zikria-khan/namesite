import { redirect } from 'next/navigation';

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: 'Viral Baby Names - NameVerse',
    description: 'Discover baby names trending on social media platforms.',
  };
}

export default function ViralNames() {
  redirect('/trending-names');
}