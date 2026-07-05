import Link from 'next/link';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { TrendingUp, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Popular Baby Names — Trending & Timeless Favorites | NameVerse'),
  description: validateMetaDescription(
    'Discover the most popular baby names across cultures and time. From classic favorites to trending newcomers, find names that stand the test of time.'
  ),
  alternates: { canonical: `${siteUrl}/popularity` },
};

export default function PopularityPage() {
  return (
    <SitePage
      title="Popular Baby Names"
      subtitle="Trending & timeless favorites"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Popular Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700">
        <p>
          Popular names reflect cultural values, trends, and enduring appeal. Our database tracks 
          naming trends across Islamic, Hindu, and Christian traditions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link href="/trending-names" className="block p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition">
          <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-2">Trending Now</h3>
          <p className="text-sm text-slate-600">Names with rising search interest</p>
        </Link>
        <Link href="/top-baby-names-usa" className="block p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition">
          <TrendingUp className="w-8 h-8 text-emerald-600 mb-3" />
          <h3 className="font-bold text-slate-900 mb-2">Top US Names</h3>
          <p className="text-sm text-slate-600">Official SSA rankings</p>
        </Link>
      </div>
    </SitePage>
  );
}