import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Search, Filter, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Advanced Baby Name Search — Filter by Meaning, Origin & Religion | NameVerse'),
  description: validateMetaDescription(
    'Use advanced search filters to find the perfect baby name. Search by meaning, origin, religion, gender, and first letter across 60,000+ names.'
  ),
  alternates: { canonical: `${siteUrl}/advanced-search` },
  openGraph: {
    title: validateMetaTitle('Advanced Baby Name Search | NameVerse'),
    description: validateMetaDescription(
      'Filter 60,000+ baby names by meaning, origin, religion, gender, and more to find your perfect match.'
    ),
    url: `${siteUrl}/advanced-search`,
    type: 'website',
    siteName: 'NameVerse',
  },
};

export default function AdvancedSearchPage() {
  return (
    <SitePage
      title="Advanced Search"
      subtitle="Filter names by multiple criteria"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Advanced Search' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700">
        <p>
          Our advanced search tool lets you filter through 60,000+ baby names using multiple criteria:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Meaning:</strong> Search for names meaning love, strength, wisdom, peace, etc.</li>
          <li><strong>Origin:</strong> Filter by Arabic, Sanskrit, Hebrew, Greek, Persian, Turkish, or English</li>
          <li><strong>Religion:</strong> Islamic, Hindu, or Christian naming traditions</li>
          <li><strong>Gender:</strong> Boy names, girl names, or unisex options</li>
          <li><strong>First Letter:</strong> Browse names alphabetically</li>
        </ul>
        <p>
          Use the search bar below to begin filtering our comprehensive name database.
        </p>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <p className="text-center text-slate-600">
          Use the search bar in the header to access advanced filtering options.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mx-auto"
        >
          Start Searching
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SitePage>
  );
}