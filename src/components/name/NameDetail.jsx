import NameHero from './NameHero';
import LinguisticOriginPanel from './Meaning';
import FAQ from './FAQ';
import RelatedNames from './RelatedNames';
import KnowledgeGraph from './KnowledgeGraph';
import TopicClusterNav from './TopicClusterNav';
import SitePage from '@/components/Layout/SitePage';
import BlogSection from '@/components/Blog/BlogSection';
import Link from 'next/link';
import { ArrowRight, Search, Grid3X3, Sparkles, TrendingUp, Network, LayoutDashboard } from 'lucide-react';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

function cleanText(text = '') {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function getReligionLabel(religion) {
  if (religion === 'islamic') return 'Islamic';
  if (religion === 'christian') return 'Christian';
  if (religion === 'hindu') return 'Hindu';
  return cleanText(religion);
}

function getGenderLabel(gender) {
  const value = cleanText(gender).toLowerCase();
  if (value.includes('male')) return 'Boy';
  if (value.includes('female')) return 'Girl';
  if (value.includes('unisex') || value.includes('neutral')) return 'Unisex';
  return cleanText(gender) || 'Baby';
}

function getGenderPath(religion, gender) {
  const value = cleanText(gender).toLowerCase();
  if (value.includes('male')) return `/${religion}/boy-names`;
  if (value.includes('female')) return `/${religion}/girl-names`;
  return null;
}

function normalizeTrendingName(name, religion) {
  const label = cleanText(typeof name === 'object' ? name.name : name);
  if (!label) return null;
  const slug = cleanText(typeof name === 'object' ? name.slug : '') || createSafeSlug(label);
  if (!slug || slug.length < 2) return null;
  return { name: label, slug };
}

export default function CulturalNameAnalysisCard({ data, faqData = [], pageUrl, trendingNames = [], trendingNamesSource = 'suggested' }) {
  const safeFaqData = Array.isArray(faqData)
    ? faqData.filter((item) => item && typeof item === 'object' && item.q && item.a)
    : [];
  const religion = cleanText(data.religion || 'islamic').toLowerCase();
  const religionLabel = getReligionLabel(religion);
  const firstLetter = cleanText(data.name).charAt(0).toUpperCase();
  const originSlug = createSafeSlug(data.origin);
  const genderLabel = getGenderLabel(data.gender);
  const genderPath = getGenderPath(religion, data.gender);
  const originLabel = cleanText(data.origin) || 'Origin';
  const normalizedTrending = trendingNames
    .map(name => normalizeTrendingName(name, religion))
    .filter(Boolean)
    .slice(0, 8);

  const collectionLinks = [
    {
      label: `All ${religionLabel} names`,
      href: `/names/religion/${religion}/1`,
      description: `Browse ${religionLabel.toLowerCase()} baby names with meanings, origins and lucky numbers.`,
    },
    {
      label: `${originLabel} origin names`,
      href: originSlug ? `/names/${religion}/origin/${originSlug}/1` : null,
      description: `Explore more names from ${originLabel.toLowerCase()} origin.`,
    },
    {
      label: `${religionLabel} names starting with ${firstLetter}`,
      href: firstLetter ? `/names/${religion}/letter/${firstLetter}/1` : null,
      description: `Find ${religionLabel.toLowerCase()} names that begin with ${firstLetter}.`,
    },
    {
      label: `${religionLabel} ${genderLabel.toLowerCase()} names`,
      href: genderPath,
      description: `Browse ${religionLabel.toLowerCase()} ${genderLabel.toLowerCase()} names.`,
    },
  ].filter(link => link.href);

  const topicClusterId = `${religion}-names` || 'baby-names';

  return (
    <SitePage
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Names', href: '/names' },
        { label: `${religionLabel} Names`, href: `/names/religion/${religion}/1` },
        { label: data.name },
      ]}
    >
      {/* Topic Cluster Navigation */}
      <div className="nv-card-solid mb-6">
        <TopicClusterNav
          clusterId={topicClusterId}
          currentName={data.name}
          currentReligion={religion}
        />
      </div>

      <NameHero data={data} pageUrl={pageUrl} />
      <div className="nv-stack">
        <LinguisticOriginPanel data={data} />
        <RelatedNames data={data} />
      </div>

      {/* Knowledge Graph Section */}
      <div className="nv-stack">
        <KnowledgeGraph data={data} religion={religion} />
      </div>


      <div className="nv-stack">
        <section className="nv-card-solid">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Explore Related {religionLabel} Name Collections</h2>
              <p className="text-sm text-slate-500">Continue from this name to matching religion, origin, letter and gender pages.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {collectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 bg-indigo-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-100"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {link.label} <ArrowRight className="h-4 w-4" />
                </span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{link.description}</span>
              </Link>
            ))}
            {/* Additional topic explorer links */}
            <Link
              href={`/names/${religion}/categories/modern/1`}
              className="rounded-2xl border border-slate-200 bg-indigo-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                Browse by Category <ArrowRight className="h-4 w-4" />
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">Explore themed {religionLabel.toLowerCase()} name lists.</span>
            </Link>
            <Link
              href="/search"
              className="rounded-2xl border border-slate-200 bg-indigo-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-100"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                Search All Names <Search className="h-4 w-4" />
              </span>
              <span className="mt-2 block text-sm leading-6 text-slate-600">Search meanings, origins and lucky numbers.</span>
            </Link>
          </div>
        </section>

        {normalizedTrending.length > 0 && (
          <section className="nv-card-solid">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{trendingNamesSource === 'trending' ? `Trending ${religionLabel} Names` : `Suggested ${religionLabel} Names`}</h2>
                <p className="text-sm text-slate-500">Names to explore next on NameVerse.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {normalizedTrending.map((item) => (
                <Link
                  key={`${item.name}-${item.slug}`}
                  href={`/names/${religion}/${item.slug}`}
                  className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="nv-card-solid">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Grid3X3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Browse {religionLabel} Names</h2>
              <p className="text-sm text-slate-500">Use NameVerse collections to compare meanings, origins and lucky numbers.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href={`/names/${religion}/letter/a/1`}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
            >
              <Grid3X3 className="w-4 h-4" /> Browse by Letter
            </Link>
            <Link
              href={`/names/${religion}/categories/modern/1`}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
            >
              <Grid3X3 className="w-4 h-4" /> Browse by Category
            </Link>
            <Link
              href={originSlug ? `/names/${religion}/origin/${originSlug}/1` : `/names/${religion}/origin/arabic/1`}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
            >
              <Grid3X3 className="w-4 h-4" /> Browse by Origin
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-semibold text-slate-700 hover:text-indigo-700"
            >
              <Search className="w-4 h-4" /> Search All Names
            </Link>
          </div>
        </section>

        <FAQ faqData={safeFaqData} name={data.name} />
      </div>

      <BlogSection religion={religion} title={`${religionLabel} Name Guides`} />
    </SitePage>
  );
}
