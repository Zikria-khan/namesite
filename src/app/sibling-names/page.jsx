import Link from 'next/link';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Users, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Sibling Names — Perfect Pairs for Brothers & Sisters | NameVerse'),
  description: validateMetaDescription(
    'Find sibling name pairings that work together beautifully. Whether you need matching Islamic, Hindu, or Christian names, explore compatible combinations.'
  ),
  alternates: { canonical: `${siteUrl}/sibling-names` },
};

export default function SiblingNamesPage() {
  return (
    <SitePage
      title="Sibling Names"
      subtitle="Perfect pairs for brothers & sisters"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Sibling Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700 mb-8">
        <p>
          Finding names that work well together is an art. We've curated sibling combinations 
          that complement each other in sound, meaning, and style.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/islamic/boy-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Users className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="font-bold">Islamic Sibling Names</div>
          <div className="text-sm text-slate-500">Matching Arabic/Quranic pairs</div>
        </Link>
        <Link href="/christian/boy-names" className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md">
          <Users className="w-6 h-6 text-blue-600 mb-2" />
          <div className="font-bold">Christian Sibling Names</div>
          <div className="text-sm text-slate-500">Biblical name combinations</div>
        </Link>
      </div>
    </SitePage>
  );
}