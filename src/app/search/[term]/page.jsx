import { serverSearchNames } from '@/lib/api/server-fetch';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import ClientComponent from './ClientComponent';

export async function generateMetadata({ params }) {
  const { term } = await params;
  const searchResults = await serverSearchNames(term, { limit: 20 });

  const title = validateMetaTitle(`${term} - Names | NameVerse`);
  const description = validateMetaDescription(`Discover ${searchResults.count} name results for ${term}. Expert meanings, origins, and inspiration for your search.`);
  const canonical = `${getSiteUrl()}/search/${encodeURIComponent(term)}`;

  let meta = [];
  if (searchResults.count === 0) {
    meta = [
      { name: 'robots', content: 'noindex, follow' }
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
