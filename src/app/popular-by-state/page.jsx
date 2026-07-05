import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { MapPin, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Popular Baby Names by State — US Regional Trends | NameVerse'),
  description: validateMetaDescription(
    'Discover popular baby names by US state and region. See trending names across America with cultural breakdown and regional preferences.'
  ),
  alternates: { canonical: `${siteUrl}/popular-by-state` },
  openGraph: {
    title: validateMetaTitle('Popular Baby Names by State | NameVerse'),
    description: validateMetaDescription(
      'Explore baby naming trends across different US states and regions.'
    ),
    url: `${siteUrl}/popular-by-state`,
    type: 'website',
    siteName: 'NameVerse',
  },
};

const stateData = [
  { state: 'California', topName: 'Noah', category: 'Trendy/Unique' },
  { state: 'Texas', topName: 'Muhammad', category: 'Islamic Influence' },
  { state: 'New York', topName: 'Sophia', category: 'Classic/Elegant' },
  { state: 'Florida', topName: 'Liam', category: 'Modern Popular' },
  { state: 'Illinois', topName: 'Aarav', category: 'Hindu Influence' },
];

export default function PopularByStatePage() {
  return (
    <SitePage
      title="Popular Names by State"
      subtitle="Regional naming trends across America"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Popular by State' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700 mb-8">
        <p>
          Baby name popularity varies significantly across different regions and states in America. 
          Cultural diversity influences naming trends, with some areas favoring traditional Islamic names, 
          others preferring classic Christian names, and growing interest in Hindu names.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stateData.map((item, index) => (
          <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">{item.state}</h3>
            </div>
            <p className="text-slate-600">
              <strong>Top trending:</strong> {item.topName}
            </p>
            <p className="text-sm text-slate-500">
              {item.category}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/trending-names"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          See All Trending Names
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SitePage>
  );
}