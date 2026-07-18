import { serverSearchNames } from '@/lib/api/server-fetch';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { NOINDEX_ROBOTS } from '@/lib/seo/topical-authority-architecture';
import ClientComponent from './ClientComponent';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

// 30-day cache for search results — single source of truth: src/lib/cache/cache-config.js SEARCH_TTL_SECONDS = 2592000
export const revalidate = 2592000;

export async function generateMetadata({ params }) {
  const { term } = await params;
  const searchResults = await serverSearchNames(term, { limit: 20 });

  const safeTerm = createSafeSlug(term) || 'search';
  const title = validateMetaTitle(`${term} - Names | NameVerse`);
  const description = validateMetaDescription(`Discover ${searchResults.count} name results for ${term}. Expert meanings, origins, and inspiration for your search.`);
  const canonical = `${getSiteUrl()}/search/${safeTerm}`;

  let meta = [];
  if (searchResults.count === 0) {
    meta = [
      { name: 'robots', content: NOINDEX_ROBOTS }
    ];
  }

  return {
    title,
    description,
    alternates: { canonical },
    ...(meta.length > 0 && { meta })
  };
}

export default async function SearchPage({ params }) {
  const { term } = await params;
  const searchResults = await serverSearchNames(term, { limit: 20 });

  return (
    <ClientComponent
      initialNames={searchResults.data}
      searchTerm={term}
      totalNames={searchResults.count}
    />
  );
}
