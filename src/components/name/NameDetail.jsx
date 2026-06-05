import NameHero from './NameHero';
import LinguisticOriginPanel from './Meaning';
import FAQ from './FAQ';
import RelatedNames from './RelatedNames';
import SitePage from '@/components/Layout/SitePage';
import BlogSection from '@/components/Blog/BlogSection';
import Link from 'next/link';
import { ArrowRight, Search, Grid3X3, BookOpen, Sparkles } from 'lucide-react';

export default function CulturalNameAnalysisCard({ data, faqData = [], pageUrl }) {
  const religion = (data.religion || 'islamic').toLowerCase();
  const religionLabel = religion.charAt(0).toUpperCase() + religion.slice(1);

  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Cultural Name Research', href: '/names' },
        { label: `${data.religion || 'Names'}`, href: `/names/${religion}` },
        { label: data.name },
      ]}
    >
      <div className="nv-stack">
        <NameHero data={data} pageUrl={pageUrl} />
        <div className="nv-stack">
          <LinguisticOriginPanel data={data} />
          <RelatedNames data={data} />

          {/* Cross-page internal links */}
          <section className="nv-card-solid">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Explore More {religionLabel} Names</h2>
                <p className="text-sm text-slate-500">Browse by category, letter, or origin.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href={`/names/${religion}/letter/A/1`}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
              >
                <Grid3X3 className="w-4 h-4" /> Browse by Letter
              </Link>
              <Link
                href={`/names/${religion}/categories/modern/1`}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
              >
                <Grid3X3 className="w-4 h-4" /> Browse by Category
              </Link>
              <Link
                href={`/names/${religion}/origin/arabic/1`}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
              >
                <Grid3X3 className="w-4 h-4" /> Browse by Origin
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
              >
                <Search className="w-4 h-4" /> Search All Names
              </Link>
            </div>
          </section>

          <FAQ faqData={faqData} name={data.name} />
        </div>
      </div>

      {/* Blog internal links */}
      <BlogSection religion={religion} title={`${religionLabel} Name Guides`} />
    </SitePage>
  );
}
