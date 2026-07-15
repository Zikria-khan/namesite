import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Globe, Sparkles, Library } from 'lucide-react';
import SitePage from '@/components/Layout/SitePage';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { loadBlogPosts, loadMeaningContent } from '@/lib/seo/name-data.mjs';

function readMeaningContent() {
  return loadMeaningContent();
}

function findMeaning(slug) {
  return readMeaningContent().find((item) => item.slug === slug);
}

export function generateStaticParams() {
  return readMeaningContent().map((item) => ({ slug: item.slug }));
}

function religionLabel(religion) {
  return religion.charAt(0).toUpperCase() + religion.slice(1);
}

function generateParagraphs(meaning) {
  const title = meaning.title.toLowerCase();
  const names = meaning.names || [];
  const firstNames = names.slice(0, 8).map((name) => name.name).join(', ');
  const religionText = (meaning.schema?.religions || [])
    .map((item) => `${item.religion} (${item.count})`)
    .join(', ');
  return [
    `Names that mean ${title} help parents connect a child's identity with a clear emotional, spiritual, or cultural value. On NameVerse, this meaning page is built only from names already present in the database, so every linked name has an existing profile, religion, origin, and meaning field. The collection currently includes ${names.length} database entries, beginning with names such as ${firstNames || 'examples from the NameVerse database'}.`,
    `The ${title} theme appears across multiple naming traditions. ${religionText || 'Islamic, Christian, and Hindu traditions'} each express this value through different linguistic roots, historical usage, and family expectations. A name from this meaning group may be chosen because the sound fits the family, the origin matches cultural heritage, or the meaning reflects a hope parents want to carry forward.`,
    `When browsing names that mean ${title}, compare the short meaning with the full origin context. Two names can share the same core meaning while feeling very different in pronunciation, gender association, religious usage, and cultural history. NameVerse keeps the name pages connected so you can move from this meaning hub to individual name meanings without losing context.`,
    `The most useful way to choose from this collection is to start with the meaning, then narrow by religion, origin, gender, and first letter. Parents often want a name that is meaningful but also easy to pronounce, spell, and use across school, work, and family settings. Each linked name page provides deeper details such as lucky number, origin, pronunciation, and related collections.`,
    `This meaning page also supports internal discovery. Related meaning pages help you explore adjacent values, while religion pages show the broader naming tradition. Story pages and blog guides add editorial context for parents who want to understand naming customs, trends, and cultural background before choosing a final shortlist.`,
    `NameVerse treats meaning pages as collection hubs rather than thin keyword pages. The page lists real names, explains how the meaning is used across traditions, connects to related meanings, and points to deeper guides. That structure helps search engines understand the page topic while giving users a practical path from inspiration to detailed research.`,
    `If you are building a shortlist, save names that share the ${title} meaning but vary in origin and sound. For example, one option may be short and modern, while another may be traditional and heritage-focused. Comparing several options from the same meaning group makes it easier to find a name that feels personal without sacrificing cultural accuracy.`,
    `The ${title} collection will grow as new verified names are added to the database. Because the page is generated from existing name records, it does not invent meanings or create pages for values that are not already represented. This keeps the meaning architecture scalable for tens of thousands of names while preserving trust and consistency.`,
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meaning = findMeaning(slug);
  if (!meaning) return { title: 'Meaning Not Found | NameVerse', robots: { index: false, follow: false } };
  const canonical = `${getSiteUrl()}/meaning/${meaning.slug}`;
  return {
    title: validateMetaTitle(meaning.seo?.title || `Names That Mean ${meaning.title} | NameVerse`),
    description: validateMetaDescription(meaning.seo?.description || `Explore names that mean ${meaning.title.toLowerCase()} across Islamic, Christian, and Hindu traditions.`),
    keywords: [`names that mean ${meaning.title.toLowerCase()}`, `${meaning.title.toLowerCase()} baby names`, `names meaning ${meaning.title.toLowerCase()}`, 'baby names by meaning', 'NameVerse'],
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: { title: meaning.seo?.title, description: meaning.seo?.description, url: canonical, type: 'website', siteName: 'NameVerse' },
    robots: { index: true, follow: true },
  };
}

function Schema({ meaning }) {
  const canonical = `${getSiteUrl()}/meaning/${meaning.slug}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        name: `Names That Mean ${meaning.title}`,
        description: meaning.description,
        url: canonical,
        numberOfItems: meaning.schema?.nameCount || (meaning.names || []).length,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: meaning.schema?.nameCount || (meaning.names || []).length,
          itemListElement: (meaning.names || []).slice(0, 20).map((name, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: name.name,
            url: `${getSiteUrl()}/names/${name.religion}/${name.slug}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: getSiteUrl() },
          { '@type': 'ListItem', position: 2, name: 'Names by Meaning', item: `${getSiteUrl()}/names-by-meaning` },
          { '@type': 'ListItem', position: 3, name: meaning.title, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: (meaning.faq || []).map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
  return <Script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function MeaningPage({ params }) {
  const { slug } = await params;
  const meaning = findMeaning(slug);
  if (!meaning) notFound();
  const posts = loadBlogPosts().slice(0, 4);
  const relatedMeanings = (meaning.relatedMeanings || []).slice(0, 12);
  const paragraphs = generateParagraphs(meaning);

  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Names', href: '/names' },
        { label: 'Names by Meaning', href: '/names-by-meaning' },
        { label: meaning.title },
      ]}
    >
      <Schema meaning={meaning} />
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-16">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="nv-display text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">Names That Mean {meaning.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">{meaning.description}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_340px]">
          <article className="prose prose-lg max-w-none">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base leading-8 text-slate-700">{paragraph}</p>
            ))}
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500"><BookOpen className="h-4 w-4" /> Names in this meaning</div>
              <div className="space-y-3">
                {(meaning.names || []).slice(0, 12).map((name) => (
                  <Link key={name.slug} href={`/names/${name.religion}/${name.slug}`} className="block rounded-2xl bg-slate-50 p-3 transition hover:bg-emerald-50">
                    <span className="font-bold text-slate-900">{name.name}</span>
                    <span className="mt-1 block text-xs text-slate-500">{religionLabel(name.religion)} · {name.origin || 'Origin not listed'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500"><Globe className="h-4 w-4" /> Religion breakdown</div>
              <div className="space-y-3">
                {(meaning.schema?.religions || []).map((item) => (
                  <Link key={item.religion} href={`/religions/${item.religion}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <span className="font-semibold text-slate-800">{religionLabel(item.religion)}</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{item.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Related meaning pages</p>
              <h2 className="nv-display text-3xl font-bold text-slate-950">Explore adjacent meanings</h2>
            </div>
            <Link href="/names-by-meaning" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">All meanings</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMeanings.map((relatedSlug) => {
              const related = readMeaningContent().find((item) => item.slug === relatedSlug);
              if (!related) return null;
              return <Link key={relatedSlug} href={`/meaning/${relatedSlug}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300"><span className="font-bold text-slate-900">Names That Mean {related.title}</span><span className="mt-2 block text-sm text-slate-500">{related.schema?.nameCount || 0} names</span></Link>;
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500"><Library className="h-4 w-4" /> Stories and guides</div>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/stories/${post.id}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300">
                <span className="text-xs font-bold text-blue-700">{post.category}</span>
                <h3 className="mt-2 text-xl font-bold text-slate-950">{post.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Read story <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-3xl bg-slate-950 p-8 text-white">
            <h2 className="nv-display text-3xl font-bold">Find more names that mean {meaning.title.toLowerCase()}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/names-by-meaning" className="rounded-2xl bg-white/10 p-4 font-semibold">Names by Meaning</Link>
              <Link href="/names-by-origin" className="rounded-2xl bg-white/10 p-4 font-semibold">Names by Origin</Link>
              <Link href="/names-by-letter" className="rounded-2xl bg-white/10 p-4 font-semibold">Names by Letter</Link>
              <Link href="/search" className="rounded-2xl bg-white/10 p-4 font-semibold">Search Names</Link>
            </div>
          </div>
        </section>
      </main>
    </SitePage>
  );
}
