import Link from 'next/link';
import Script from 'next/script';
import { Calendar, Clock, ChevronRight, BookOpen } from 'lucide-react';
import SitePage from '@/components/Layout/SitePage';
import { validateMetaDescription, validateMetaTitle } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { loadBlogPosts } from '@/lib/seo/name-data.mjs';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export const metadata = {
  title: validateMetaTitle('Name Stories — Cultural Naming Journeys | NameVerse'),
  description: validateMetaDescription('Read name stories, naming traditions, cultural origin guides, and meaningful baby name journeys from the NameVerse editorial library.'),
  alternates: { canonical: `${getSiteUrl()}/stories`, languages: { en: `${getSiteUrl()}/stories`, 'x-default': `${getSiteUrl()}/stories` } },
  robots: { index: true, follow: true },
};

export default async function StoriesPage() {
  const posts = loadBlogPosts().sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Name Stories',
    description: 'Name stories and cultural naming journeys from NameVerse.',
    url: `${getSiteUrl()}/stories`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.slice(0, 20).map((post, index) => ({ '@type': 'ListItem', position: index + 1, name: post.title, url: `${getSiteUrl()}/stories/${post.id}` })),
    },
  };

  return (
    <SitePage breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Stories' }]}>
      <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <BookOpen className="mx-auto mb-6 h-14 w-14 text-blue-700" />
            <h1 className="nv-display text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">Name Stories</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">Explore cultural naming journeys, origin stories, and editorial guides that connect baby names with meaning, tradition, and family identity.</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/stories/${post.id}`} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{post.category}</span>
              <h2 className="nv-display mt-3 text-2xl font-bold text-slate-950 group-hover:text-blue-700">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(post.publishDate)}</span>
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{post.readTime}</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Read story <ChevronRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </section>
      </main>
    </SitePage>
  );
}
