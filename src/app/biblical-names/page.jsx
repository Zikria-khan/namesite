import Link from 'next/link';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { Book, ArrowRight } from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata = {
  title: validateMetaTitle('Biblical Names — Christian & Hebrew Baby Names | NameVerse'),
  description: validateMetaDescription(
    'Explore biblical baby names with meanings. Names from the Old and New Testaments with Christian and Hebrew origins.'
  ),
  alternates: { canonical: `${siteUrl}/biblical-names` },
};

export default function BiblicalNamesPage() {
  return (
    <SitePage
      title="Biblical Names"
      subtitle="Christian & Hebrew names from Scripture"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Biblical Names' },
      ]}
      containerClassName="max-w-4xl"
    >
      <div className="prose prose-lg max-w-none text-slate-700 mb-8">
        <p>
          Biblical names have been given for millennia. They carry deep spiritual significance 
          and timeless meaning across Christian and Jewish traditions.
        </p>
        <p>
          Our Christian names collection includes many biblical names — from Abraham to Zion, 
          each with documented scriptural or historical significance.
        </p>
      </div>

      <Link href="/christian/boy-names" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
        Browse All Christian Names
        <ArrowRight className="w-4 h-4" />
      </Link>
    </SitePage>
  );
}