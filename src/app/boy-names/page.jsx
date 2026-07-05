import Link from 'next/link';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Baby, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Boy Names — 20,000+ Male Baby Names | NameVerse'),
  description: validateMetaDescription(
    'Explore 20,000+ boy names from Islamic, Hindu, and Christian traditions. Find meanings, origins, and the perfect name for your son.'
  ),
  alternates: { canonical: `${siteUrl}/boy-names` },
};

export default function BoyNamesPage() {
  return (
    <SitePage
      title="Boy Names"
      subtitle="Find the perfect name for your son"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Boy Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700 mb-8">
        <p>
          We've organized boy names by tradition. Choose from thousands of names with deep meanings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/islamic/boy-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="font-bold">Islamic Boy Names</div>
          <div className="text-sm text-slate-500">Quranic & Arabic names</div>
        </Link>
        <Link href="/hindu/boy-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-orange-600 mb-2" />
          <div className="font-bold">Hindu Boy Names</div>
          <div className="text-sm text-slate-500">Sanskrit & Vedic names</div>
        </Link>
        <Link href="/christian/boy-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-blue-600 mb-2" />
          <div className="font-bold">Christian Boy Names</div>
          <div className="text-sm text-slate-500">Biblical & saint names</div>
        </Link>
      </div>
    </SitePage>
  );
}