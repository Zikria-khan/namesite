import SitePage from '@/components/Layout/SitePage';
import AdvancedSearchClient from './AdvancedSearchClient';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Advanced Baby Name Search — 18+ Filters | NameVerse'),
  description: validateMetaDescription(
    'Use NameVerse advanced search to filter baby names by gender, religion, origin, meaning keywords, numerology, popularity, and more.'
  ),
  alternates: {
    canonical: `${getSiteUrl()}/advanced-search`,
  },
};

export default function AdvancedSearchPage() {
  return (
    <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
      <AdvancedSearchClient />
    </SitePage>
  );
}

