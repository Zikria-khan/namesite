import Link from 'next/link';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Baby, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Girl Names — 20,000+ Female Baby Names | NameVerse'),
  description: validateMetaDescription(
    'Explore 20,000+ girl names from Islamic, Hindu, and Christian traditions. Find meanings, origins, and the perfect name for your daughter.'
  ),
  alternates: { canonical: `${siteUrl}/girl-names` },
};

export default function GirlNamesPage() {
  return (
    <SitePage
      title="Girl Names"
      subtitle="Find the perfect name for your daughter"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Girl Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700 mb-8">
        <p>
          We've organized girl names by tradition. Choose from thousands of beautiful names with meaning.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/islamic/girl-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="font-bold">Islamic Girl Names</div>
          <div className="text-sm text-slate-500">Quranic & Arabic names</div>
        </Link>
        <Link href="/hindu/girl-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-orange-600 mb-2" />
          <div className="font-bold">Hindu Girl Names</div>
          <div className="text-sm text-slate-500">Sanskrit & Vedic names</div>
        </Link>
        <Link href="/christian/girl-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Baby className="w-6 h-6 text-blue-600 mb-2" />
          <div className="font-bold">Christian Girl Names</div>
          <div className="text-sm text-slate-500">Biblical & saint names</div>
        </Link>
      </div>
    </SitePage>
  );
}