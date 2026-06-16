import { readFileSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Hash,
  Library,
  Search,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import StructuredData from '@/components/SEO/StructuredData';
import NewsletterSignup from '@/components/Blog/NewsletterSignup';
import BlogCard, { BlogFeedItem, formatViews, getEstimatedViews } from '@/components/Blog/BlogCard';
import BlogSidebar, { BlogMiniCardStack } from '@/components/Blog/BlogSidebar';
import { BlogVisual } from '@/components/Blog/BlogVisual';
import { getSiteUrl } from '@/lib/seo/site';

export const revalidate = 7776000;

const blogPostsData = JSON.parse(readFileSync(join(process.cwd(), 'public', 'data', 'blog-posts.json'), 'utf8'));
const sortedPosts = [...blogPostsData].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
const featuredPosts = blogPostsData.filter((post) => post.featured);
const latestPosts = sortedPosts.slice(0, 6);
const trendingPosts = sortedPosts.slice(0, 6);
const popularGuides = blogPostsData.filter((post) => post.category.includes('Guides') || post.tags?.some((tag) => tag.toLowerCase().includes('guide'))).slice(0, 4);
const editorsPicks = [...featuredPosts, ...sortedPosts.filter((post) => !post.featured)].slice(0, 4);

const blogFaq = [
  { question: 'How do I choose the perfect baby name?', answer: 'Choose a baby name by balancing meaning, cultural relevance, pronunciation, family tradition and long-term fit. NameVerse guides help you compare Islamic, Christian, Hindu and global name choices with trusted origin notes.' },
  { question: 'What are the most popular Islamic baby names?', answer: 'Popular Islamic baby names include Muhammad, Ali, Yusuf, Aisha, Fatima, Zainab and Maryam — names with Quranic meaning, strong heritage and modern appeal.' },
  { question: 'What baby names are trending in 2026?', answer: 'Trending baby names for 2026 include names with spiritual meaning, short modern forms and cross-cultural appeal such as Rayan, Noor, Elias, Leila, Vihaan and Zara.' },
  { question: 'How important is name meaning?', answer: 'Name meaning is important for cultural identity and long-term satisfaction. Choose a name with a positive meaning that reflects your family values, heritage and pronunciation needs.' }
];

const categoryCards = [
  { label: 'Islamic Names', href: '/names/religion/islamic/1', description: 'Quranic, Arabic and Urdu name meanings.', meta: '25K+ names', icon: BookOpen },
  { label: 'Christian Names', href: '/names/religion/christian/1', description: 'Biblical, Hebrew, Greek and modern names.', meta: '15K+ names', icon: Library },
  { label: 'Hindu Names', href: '/names/religion/hindu/1', description: 'Sanskrit, Vedic and regional traditions.', meta: '20K+ names', icon: Sparkles },
  { label: 'Arabic Names', href: '/names/islamic/origin/arabic/1', description: 'Classical roots, pronunciation and heritage.', meta: 'Origin hub', icon: Globe },
  { label: 'Urdu Names', href: '/names/islamic/origin/urdu/1', description: 'South Asian Muslim names with poetic roots.', meta: 'Origin hub', icon: Hash },
  { label: 'Baby Names', href: '/search?q=baby%20names', description: 'Modern, classic, unique and trending choices.', meta: 'Search hub', icon: Search },
  { label: 'Unique Names', href: '/unique-names', description: 'Distinctive names with meaning and context.', meta: 'Discovery', icon: Sparkles },
  { label: 'Surname Guides', href: '/blog', description: 'Naming frameworks and editorial guidance.', meta: 'Guides', icon: BookOpen }
];

const blogCollection = {
  name: 'NameVerse Blog: Expert Baby Names & Naming Guides',
  description: 'Expert guides, naming traditions, baby name trends, cultural origins and decision frameworks for modern parents.',
  url: `${getSiteUrl()}/blog`,
  items: categoryCards.slice(0, 6).map((item) => ({ name: item.label, path: item.href.replace(/^\//, '') }))
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-blue-700" />
          {eyebrow}
        </div>
        <h2 className="nv-display mt-5 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function HeroArticleCard({ post, tone = 'featured' }) {
  const views = formatViews(getEstimatedViews(post));
  const isFeatured = tone === 'featured';

  return (
    <Link href={`/blog/${post.id}`} className={`group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${isFeatured ? 'border-blue-100 lg:col-span-2' : 'border-slate-200'}`}>
      <BlogVisual title={post.title} category={post.category} compact={!isFeatured} />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{post.category}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(post.publishDate)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{views} views</span>
        </div>
        <h3 className={`font-bold leading-tight text-slate-950 group-hover:text-blue-700 ${isFeatured ? 'nv-display text-3xl sm:text-4xl' : 'text-xl'}`}>
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3 text-sm font-bold text-blue-700">
          <span>Read guide</span>
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export const metadata = {
  title: 'Expert Name Meanings, Origins & Naming Guides | NameVerse Blog',
  description: 'Read expert baby naming guides, name meanings, cultural origins, 2026 trends and decision frameworks for Islamic, Christian, Hindu and global names.',
  keywords: 'baby names blog, naming guides, baby name trends 2026, Islamic naming guide, Christian naming guide, Hindu naming guide, how to choose baby name, baby naming tips',
  alternates: { canonical: `${getSiteUrl()}/blog` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Expert Name Meanings, Origins & Naming Guides | NameVerse Blog',
    description: 'Read expert baby naming guides, name meanings, cultural origins, 2026 trends and decision frameworks for Islamic, Christian, Hindu and global names.',
    type: 'website',
    url: `${getSiteUrl()}/blog`,
    images: [{ url: `${getSiteUrl()}/api/og?section=blog&page=1`, width: 1200, height: 630, alt: 'NameVerse Blog' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert Name Meanings, Origins & Naming Guides | NameVerse Blog',
    description: 'Read expert baby naming guides, name meanings, cultural origins, 2026 trends and decision frameworks for Islamic, Christian, Hindu and global names.',
    images: [`${getSiteUrl()}/api/og?section=blog&page=1`]
  }
};

export default function BlogPage() {
  const featuredPost = featuredPosts[0] || sortedPosts[0];
  const trendingPost = sortedPosts[1] || featuredPost;
  const latestPost = sortedPosts[0] || featuredPost;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-950">
      <StructuredData
        organization
        website
        breadcrumbs={[
          { name: 'Home', url: getSiteUrl() },
          { name: 'Blog', url: `${getSiteUrl()}/blog` }
        ]}
        collectionPage={blogCollection}
        faq={blogFaq}
      />

      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              Expert-reviewed naming guidance
            </div>
            <h1 className="nv-display mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
              Expert Name Meanings, Origins & Naming Guides
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Professional guides for parents who want names with meaning, cultural context, strong pronunciation and long-term confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Search names
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#latest-articles" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
                Browse latest guides
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-slate-950">{blogPostsData.length}+</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Expert guides</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-slate-950">8</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Core categories</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-slate-950">2026</div>
                <div className="mt-1 text-xs font-semibold text-slate-500">Trend coverage</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {featuredPost && <HeroArticleCard post={featuredPost} tone="featured" />}
            {trendingPost && <HeroArticleCard post={trendingPost} tone="trending" />}
            {latestPost && <HeroArticleCard post={latestPost} tone="latest" />}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Featured categories</p>
              <h2 className="nv-display mt-2 text-3xl font-semibold text-slate-950">Browse by naming intent</h2>
            </div>
            <Link href="/names" className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:inline-flex">
              Full directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.href} href={category.href} className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg">
                  <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-700">{category.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{category.description}</p>
                  <div className="mt-4 text-xs font-bold text-blue-700">{category.meta}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Editor's Picks"
            title="Guides selected for deeper research."
            description="High-signal articles for parents comparing faith traditions, origins, trends and naming frameworks."
            action={
              <Link href="/blog" className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50">
                View all picks
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {editorsPicks.slice(0, 4).map((post) => (
              <BlogCard key={post.id} post={post} variant="hero" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trending Articles"
            title="What parents are reading now."
            description="Trending articles include read time, views, published date and category metadata for fast scanning."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trendingPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section id="latest-articles" className="bg-slate-50 py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Latest Articles"
              title="Fresh naming research and editorial guidance."
              description="A professional article feed designed for fast scanning, strong internal links and long-form reading."
            />
            <div className="space-y-5">
              {latestPosts.map((post) => (
                <BlogFeedItem key={post.id} post={post} />
              ))}
            </div>
          </div>
          <BlogSidebar posts={sortedPosts} />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Popular Guides"
            title="Evergreen resources for confident decisions."
            description="Core guides that support parent research, internal linking and long-tail SEO discovery."
          />
          <BlogMiniCardStack posts={popularGuides.length ? popularGuides : sortedPosts} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
            <Sparkles className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="nv-display text-3xl font-semibold leading-tight sm:text-5xl">Get the NameVerse naming brief.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Receive practical naming frameworks, trend summaries and cultural origin notes without visual clutter or hype.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}
