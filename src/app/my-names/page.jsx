import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Heart, Save, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('My Saved Names — Your Personal Baby Name Collection | NameVerse'),
  description: validateMetaDescription(
    'View and manage your saved baby names collection. Keep track of names you love from Islamic, Hindu, and Christian traditions.'
  ),
  alternates: { canonical: `${siteUrl}/my-names` },
  openGraph: {
    title: validateMetaTitle('My Saved Names — Personal Collection'),
    description: validateMetaDescription(
      'Your personal collection of saved baby names from NameVerse.'
    ),
    url: `${siteUrl}/my-names`,
    type: 'website',
    siteName: 'NameVerse',
  },
};

export default function MyNamesPage() {
  return (
    <SitePage
      title="My Saved Names"
      subtitle="Your personal baby name collection"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'My Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">No saved names yet</h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          Save names you love by clicking the heart icon on any name page. Your saved names 
          are stored locally and available whenever you visit.
        </p>
        <Link
          href="/names/religion/islamic/1"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Browse Baby Names
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SitePage>
  );
}