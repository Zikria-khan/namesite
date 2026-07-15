import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { BookOpen, Globe, Sparkles, Library, Search } from 'lucide-react';
import SitePage from '@/components/Layout/SitePage';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { loadAllNames, loadBlogPosts, loadDetailedNames, loadMeaningContent } from '@/lib/seo/name-data.mjs';

const RELIGIONS = ['islamic', 'christian', 'hindu'];
const RELIGION_LABELS = { islamic: 'Islamic', christian: 'Christian', hindu: 'Hindu' };
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STATIC_CATEGORIES = ['modern', 'traditional', 'nature', 'religious', 'classical', 'unique'];
const STATIC_ORIGINS = ['arabic', 'persian', 'turkish', 'indian', 'english', 'other'];

function readMeaningContent() {
  return loadMeaningContent();
}

function normalizeReligion(value) {
  const r = String(value || '').toLowerCase();
  return RELIGIONS.includes(r) ? r : null;
}

function findReligion(religion) {
  if (!RELIGIONS.includes(religion)) return null;
  const allNames = loadAllNames().filter((name) => name.religion === religion);
  const detailedNames = loadDetailedNames().filter((name) => name.religion === religion);
  const posts = loadBlogPosts();
  return { religion, label: RELIGION_LABELS[religion], allNames, detailedNames, posts };
}

export function generateStaticParams() {
  return RELIGIONS.map((religion) => ({ religion }));
}

export async function generateMetadata({ params }) {
  const { religion } = await params;
  const data = findReligion(normalizeReligion(religion));
  if (!data) return { title: 'Religion Not Found | NameVerse', robots: { index: false, follow: false } };
  const canonical = `${getSiteUrl()}/religions/${data.religion}`;
  return {
    title: validateMetaTitle(`${data.label} Names — Meanings, Origins & Culture | NameVerse`),
    description: validateMetaDescription(`Explore ${data.allNames.length} ${data.label.toLowerCase()} names with meanings, origins, letter indexes, categories, stories, and naming guidance on NameVerse.`),
    keywords: [`${data.religion} names`, `${data.religion} baby names`, `${data.religion} names with meaning`, 'names by religion', 'NameVerse'],
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: { title: `${data.label} Names — NameVerse`, description: `Explore ${data.label} names with meanings, origins, and cultural context.`, url: canonical, type: 'website', siteName: 'NameVerse' },
    robots: { index: true, follow: true },
  };
}

function Schema({ data }) {
  const canonical = `${getSiteUrl()}/religions/${data.religion}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${data.label} Names`,
        description: `${data.label} name hub with meanings, origins, letter indexes, categories, stories, and guides.`,
        url: canonical,
        numberOfItems: data.allNames.length,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: data.allNames.length,
          itemListElement: data.allNames.slice(0, 20).map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: name.name,
            url: `${getSiteUrl()}/names/${data.religion}/${name.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
          { '@type': 'ListItem', position: 2, name: 'Religions', item: `${getSiteUrl()}/names` },
          { '@type': 'ListItem', position: 3, name: data.label, item: canonical },
        ],
      },
    ],
  };
  return <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function ReligionHubPage({ params }) {
  const { religion } = await params;
  const data = findReligion(normalizeReligion(religion));
  if (!data) notFound();

  return (
    <SitePage breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Names', href: '/names' }, { label: data.label }]}>
      <Schema data={data} />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg">
              <Globe className="h-8 w-8" />
            </div>
            <h1 className="nv-display text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">{data.label} Names</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">Explore {data.allNames.length.toLocaleString()} {data.label.toLowerCase()} names with meanings, origins, letter indexes, categories, stories, and naming guidance.</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-4">
          <Link href={`/names/religion/${data.religion}/1`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"><BookOpen className="mb-4 h-8 w-8 text-emerald-600" /><h2 className="text-xl font-bold">All {data.label} Names</h2><p className="mt-2 text-sm text-slate-500">{data.allNames.length.toLocaleString()} names across paginated collections.</p></Link>
          <Link href={`/${data.religion}/boy-names`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"><Sparkles className="mb-4 h-8 w-8 text-blue-600" /><h2 className="text-xl font-bold">Boy Names</h2><p className="mt-2 text-sm text-slate-500">Masculine {data.label.toLowerCase()} names with meanings.</p></Link>
          <Link href={`/${data.religion}/girl-names`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"><Sparkles className="mb-4 h-8 w-8 text-pink-600" /><h2 className="text-xl font-bold">Girl Names</h2><p className="mt-2 text-sm text-slate-500">Feminine {data.label.toLowerCase()} names with meanings.</p></Link>
          <Link href="/search" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"><Search className="mb-4 h-8 w-8 text-indigo-600" /><h2 className="text-xl font-bold">Search</h2><p className="mt-2 text-sm text-slate-500">Search meanings, origins, and names.</p></Link>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="nv-display text-3xl font-bold text-slate-950">Letters</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-8 lg:grid-cols-13">
            {LETTERS.map((letter) => <Link key={letter} href={`/names/${data.religion}/letter/${letter}/1`} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700">{letter}</Link>)}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="nv-display text-2xl font-bold text-slate-950">Origins</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {STATIC_ORIGINS.map((origin) => <Link key={origin} href={`/names/${data.religion}/origin/${origin}/1`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-emerald-100">{origin}</Link>)}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="nv-display text-2xl font-bold text-slate-950">Categories</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {STATIC_CATEGORIES.map((category) => <Link key={category} href={`/names/${data.religion}/categories/${category}/1`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-100">{category}</Link>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="nv-display text-3xl font-bold text-slate-950">Meanings</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {readMeaningContent().filter((item) => item.names?.some((name) => name.religion === data.religion)).slice(0, 12).map((item) => <Link key={item.slug} href={`/meaning/${item.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"><span className="font-bold text-slate-900">Names That Mean {item.title}</span><span className="mt-2 block text-sm text-slate-500">{item.schema?.nameCount || 0} names</span></Link>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="nv-display text-3xl font-bold text-slate-950">Stories</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.posts.slice(0, 6).map((post) => <Link key={post.id} href={`/stories/${post.id}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:border-blue-300"><span className="text-xs font-bold text-blue-700">{post.category}</span><h3 className="mt-2 text-xl font-bold text-slate-950">{post.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p></Link>)}
          </div>
        </section>
      </main>
    </SitePage>
  );
}
