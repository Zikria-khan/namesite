import { redirect } from 'next/navigation';

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: 'Popular Names by State - NameVerse',
    description: 'Discover regional baby name trends across the United States.',
  };
}

export default function PopularByState() {
  redirect('/names');
}