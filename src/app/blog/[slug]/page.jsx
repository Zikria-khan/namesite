import { readFileSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  Lightbulb,
  ListChecks,
  Quote,
  Search,
  ShieldCheck,
  User,
  AlertTriangle,
} from 'lucide-react';
import { validateMetaDescription, validateMetaTitle } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';
import islamicNames from '../../../../public/islamic_names.json';
import hinduNames from '../../../../public/hindu_names.json';
import christianNames from '../../../../public/christians_names.json';
import BlogCard from '@/components/Blog/BlogCard';
import BlogSidebar from '@/components/Blog/BlogSidebar';
import BlogToc, { getArticleToc, slugifyHeading } from '@/components/Blog/BlogToc';
import { BlogVisual } from '@/components/Blog/BlogVisual';
import NewsletterSignup from '@/components/Blog/NewsletterSignup';
import ShareButtons from '@/components/Blog/ShareButtons';

export const revalidate = 7776000;

const blogPostsData = JSON.parse(readFileSync(join(process.cwd(), 'public', 'data', 'blog-posts.json'), 'utf8'));

const islamicNameSet = new Set(islamicNames.map((name) => String(name).toLowerCase()));
const hinduNameSet = new Set(hinduNames.map((name) => String(name).toLowerCase()));
const christianNameSet = new Set(christianNames.map((name) => String(name).toLowerCase()));

const externalReferences = {
  islamic: [
    { title: 'Quranic Arabic Corpus', href: 'https://corpus.quran.com/' },
    { title: 'Arabic Lexicon', href: 'https://www.arabiclexicon.org/' }
  ],
  christian: [
    { title: 'Blue Letter Bible Lexicon', href: 'https://www.blueletterbible.org/lexicon/' },
    { title: 'Bible Gateway', href: 'https://www.biblegateway.com/' }
  ],
  hindu: [
    { title: 'Cologne Digital Sanskrit Dictionaries', href: 'https://www.sanskrit-lexicon.uni-koeln.de/' },
    { title: 'Wisdom Library', href: 'https://www.wisdomlib.org/' }
  ]
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getOgImage(post) {
  return post.featuredImage
    ? post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `${getSiteUrl()}${post.featuredImage}`
    : `${getSiteUrl()}/api/og?title=${encodeURIComponent(post.title)}`;
}

function getReligionFromCategory(category) {
  const categoryLower = String(category || '').toLowerCase();
  if (categoryLower.includes('islamic') || categoryLower.includes('muslim')) return 'islamic';
  if (categoryLower.includes('christian') || categoryLower.includes('biblical')) return 'christian';
  if (categoryLower.includes('hindu') || categoryLower.includes('vedic') || categoryLower.includes('sanskrit')) return 'hindu';
  return 'islamic';
}

function getCategoryHref(category) {
  const religion = getReligionFromCategory(category);
  if (religion === 'hindu') return '/names/religion/hindu/1';
  if (religion === 'christian') return '/names/religion/christian/1';
  return '/names/religion/islamic/1';
}

function detectNameReligion(name) {
  const normalized = String(typeof name === 'string' ? name : name.name || name).toLowerCase().trim();
  if (islamicNameSet.has(normalized)) return 'islamic';
  if (hinduNameSet.has(normalized)) return 'hindu';
  if (christianNameSet.has(normalized)) return 'christian';
  return 'islamic';
}

function countWords(post) {
  const parts = [
    post.excerpt,
    post.content?.introduction,
    ...(post.content?.sections || []).flatMap((section) => [
      section.title,
      section.content,
      ...(section.subsections || []).flatMap((subsection) => [subsection.title, subsection.content])
    ]),
    ...(post.content?.faqs || []).flatMap((faq) => [faq.question, faq.answer])
  ];
  return parts.filter(Boolean).join(' ').trim().split(/\s+/).length;
}

function FeaturedNameLink({ name, religion }) {
  const displayName = typeof name === 'string' ? name : name.name;
  const detectedReligion = detectNameReligion(name);
  const finalReligion = religion !== 'islamic' ? religion : detectedReligion;
  const slug = createSafeSlug(displayName);

  return (
    <Link
      href={`/names/${finalReligion}/${slug}`}
      className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-white"
    >
      {displayName}
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  );
}

function Callout({ type = 'tip', title, children }) {
  const config = {
    tip: { icon: Lightbulb, className: 'border-blue-100 bg-blue-50 text-blue-950' },
    warning: { icon: AlertTriangle, className: 'border-amber-100 bg-amber-50 text-amber-950' },
    fact: { icon: ShieldCheck, className: 'border-emerald-100 bg-emerald-50 text-emerald-950' }
  }[type] || { icon: Lightbulb, className: 'border-blue-100 bg-blue-50 text-blue-950' };
  const Icon = config.icon;

  return (
    <div className={`my-8 rounded-[1.5rem] border p-5 ${config.className}`}>
      <div className="mb-3 flex items-center gap-2 font-bold">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ArticleSection({ section, religion, index }) {
  const id = slugifyHeading(section.title);

  return (
    <section id={id} className="scroll-mt-28 border-t border-slate-200 py-10 first:border-t-0 first:pt-0">
      <h2 className="mb-4 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">{section.title}</h2>
      {section.content && <p className="text-base leading-8 text-slate-700">{section.content}</p>}
      {section.points && (
        <ul className="my-6 space-y-3">
          {section.points.map((point, pointIndex) => (
            <li key={pointIndex} className="flex gap-3 text-base leading-8 text-slate-700">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-700" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
      {section.steps && (
        <ol className="my-6 space-y-4">
          {section.steps.map((step, stepIndex) => (
            <li key={stepIndex} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 flex items-center gap-3 text-sm font-bold text-blue-700">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50">{stepIndex + 1}</span>
                {step.title || `Step ${stepIndex + 1}`}
              </div>
              <p className="text-sm leading-7 text-slate-700">{step.content || step}</p>
            </li>
          ))}
        </ol>
      )}
      {section.table && (
        <div className="my-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                {section.table.headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {section.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.callout && <Callout type={section.callout.type || 'tip'} title={section.callout.title || 'Editor note'}>{section.callout.content}</Callout>}
      {section.warning && <Callout type="warning" title="Important note">{section.warning}</Callout>}
      {section.tip && <Callout type="tip" title="Practical tip">{section.tip}</Callout>}
      {section.fact && <Callout type="fact" title="Verified context">{section.fact}</Callout>}
      {section.featuredNames && section.featuredNames.length > 0 && (
        <div className="my-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Featured names</h3>
          <div className="flex flex-wrap gap-2">
            {section.featuredNames.map((name, nameIndex) => (
              <FeaturedNameLink key={`${createSafeSlug(typeof name === 'string' ? name : name.name)}-${nameIndex}`} name={name} religion={religion} />
            ))}
          </div>
        </div>
      )}
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-8 space-y-8">
          {section.subsections.map((subsection, subIndex) => {
            const subId = `${id}-${slugifyHeading(subsection.title)}`;
            return (
              <section id={subId} key={subId} className="scroll-mt-28 rounded-[1.5rem] border border-slate-100 bg-white p-5 sm:p-6">
                <h3 className="mb-3 text-xl font-bold text-slate-950">{subsection.title}</h3>
                {subsection.content && <p className="text-base leading-8 text-slate-700">{subsection.content}</p>}
                {subsection.points && (
                  <ul className="mt-4 space-y-2">
                    {subsection.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex gap-2 text-sm leading-7 text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ArticleSources({ religion, post }) {
  const references = externalReferences[religion] || [];
  const internalSources = [
    { title: 'NameVerse name database', href: '/names' },
    { title: `${post.category} collection`, href: getCategoryHref(post.category) },
    { title: 'Name search', href: '/search' }
  ];

  return (
    <section className="my-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-950">
        <BookOpen className="h-4 w-4 text-blue-700" />
        Sources used
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Internal references</h3>
          <ul className="space-y-2">
            {internalSources.map((source) => (
              <li key={source.href}>
                <Link href={source.href} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                  {source.title}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">External references</h3>
          <ul className="space-y-2">
            {references.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                  {source.title}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FAQSchema({ faqs }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPostsData.find((item) => item.id === slug);

  if (!post) return { title: 'Post Not Found | NameVerse' };

  const canonical = `${getSiteUrl()}/blog/${post.id}`;
  const ogImage = getOgImage(post);
  const seoDescription = validateMetaDescription(post.metaDescription || `${post.excerpt} Read this expert guide for modern parents choosing meaningful baby names.`);
  const seoTitle = validateMetaTitle(`${post.title} | NameVerse Blog`);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.seoKeywords || [...(post.tags || []), `${post.category} baby names`, 'baby name trends', 'baby naming guide'].join(', '),
    alternates: { canonical, languages: { en: canonical, 'x-default': canonical } },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: canonical,
      images: [{ url: ogImage, alt: `${post.title} | NameVerse`, width: 1200, height: 630 }],
      publishedTime: post.publishDate,
      modifiedTime: post.lastUpdated,
      authors: [post.author],
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImage]
    },
    robots: { index: true, follow: true }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPostsData.find((item) => item.id === slug);

  if (!post) notFound();

  const religion = getReligionFromCategory(post.category);
  const relatedPosts = blogPostsData
    .filter((item) => item.category === post.category && item.id !== post.id)
    .slice(0, 3);
  const fallbackRelated = blogPostsData
    .filter((item) => item.id !== post.id)
    .slice(0, 3);
  const finalRelated = relatedPosts.length ? relatedPosts : fallbackRelated;
  const headings = getArticleToc(post);
  const wordCount = countWords(post);
  const canonical = `${getSiteUrl()}/blog/${post.id}`;
  const ogImage = getOgImage(post);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonical}#article`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonical
    },
    'headline': post.title,
    'alternativeHeadline': post.subtitle || post.title,
    'description': post.metaDescription || post.excerpt,
    'image': ogImage,
    'author': {
      '@type': 'Person',
      'name': post.author,
      'jobTitle': post.authorCredentials || 'Baby Name Expert',
      'url': `${getSiteUrl()}/about`
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'NameVerse',
      'url': getSiteUrl(),
      'logo': {
        '@type': 'ImageObject',
        'url': `${getSiteUrl()}/logo.png`,
        'width': 512,
        'height': 512
      }
    },
    'datePublished': post.publishDate,
    'dateModified': post.lastUpdated || post.publishDate,
    'articleSection': post.category,
    'keywords': post.seoKeywords || (post.tags || []).join(', '),
    'wordCount': wordCount,
    'inLanguage': 'en-US'
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': getSiteUrl() },
      { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${getSiteUrl()}/blog` },
      { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': canonical }
    ]
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [articleSchema, breadcrumbSchema] }) }} />
      {post.content.faqs && post.content.faqs.length > 0 && <FAQSchema faqs={post.content.faqs} />}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_minmax(0,800px)_340px] lg:px-8 lg:py-10">
          <BlogToc headings={headings} />

          <article className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm">
              <ol className="flex flex-wrap items-center gap-2 text-slate-500">
                <li><Link href="/" className="font-semibold text-slate-600 hover:text-blue-700">Home</Link></li>
                <li className="text-slate-300">/</li>
                <li><Link href="/blog" className="font-semibold text-slate-600 hover:text-blue-700">Blog</Link></li>
                <li className="text-slate-300">/</li>
                <li className="font-semibold text-slate-950">{post.category}</li>
              </ol>
            </nav>

            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{post.category}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Fact checked
              </span>
              {post.featured && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">Editor's pick</span>}
            </div>

            <h1 className="nv-display text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {post.subtitle && <p className="mt-5 text-lg leading-8 text-blue-700 font-semibold">{post.subtitle}</p>}
            <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>

            <div className="mt-7 flex flex-col gap-4 border-y border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><User className="h-4 w-4 text-blue-700" />{post.author}</span>
                <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-700" />Published {formatDate(post.publishDate)}</span>
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-blue-700" />Updated {formatDate(post.lastUpdated || post.publishDate)}</span>
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-blue-700" />{post.readTime}</span>
                <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4 text-blue-700" />{wordCount.toLocaleString()} words</span>
              </div>
              <ShareButtons title={post.title} url={canonical} />
            </div>

            <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
              <BlogVisual title={post.title} category={post.category} />
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Author expertise</div>
                  <h2 className="mt-1 text-lg font-bold text-slate-950">{post.author}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{post.authorCredentials || 'NameVerse Editorial Team'} — curated for parents who need clear, trustworthy naming guidance.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-8 rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                  <ListChecks className="h-4 w-4" />
                  Introduction
                </div>
                <p className="text-base leading-8 text-slate-100">{post.content.introduction}</p>
              </div>

              {post.content.sections && post.content.sections.map((section, index) => (
                <ArticleSection key={`${section.title}-${index}`} section={section} religion={religion} index={index} />
              ))}

              <section className="scroll-mt-28 border-t border-slate-200 py-10">
                <h2 className="mb-4 text-2xl font-bold text-slate-950 sm:text-3xl">Summary</h2>
                <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-5 text-sm leading-8 text-blue-950">
                  <strong className="block text-base">Key takeaway:</strong>
                  Choose names with positive meaning, clear pronunciation, cultural fit and long-term flexibility. Use NameVerse to compare name meanings, origins and related traditions before making a final decision.
                </div>
              </section>

              <ArticleSources religion={religion} post={post} />

              <section className="scroll-mt-28 border-t border-slate-200 py-10">
                <h2 className="mb-4 text-2xl font-bold text-slate-950 sm:text-3xl">People also ask</h2>
                <div className="space-y-3">
                  {post.content.faqs && post.content.faqs.map((faq, index) => (
                    <details key={index} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-bold text-slate-950">
                        {faq.question}
                        <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="px-5 pb-5 text-sm leading-8 text-slate-600">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="scroll-mt-28 border-t border-slate-200 py-10">
                <h2 className="mb-4 text-2xl font-bold text-slate-950 sm:text-3xl">Conclusion</h2>
                <p className="text-base leading-8 text-slate-700">
                  A strong baby name combines meaning, cultural context, pronunciation and family values. NameVerse helps parents move from inspiration to confidence with structured name research, related name links and expert editorial guidance.
                </p>
              </section>

              <section className="scroll-mt-28 border-t border-slate-200 py-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Related articles</p>
                    <h2 className="nv-display mt-2 text-3xl font-semibold text-slate-950">Continue reading</h2>
                  </div>
                  <Link href="/blog" className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 sm:inline-flex">
                    All articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {finalRelated.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} variant="compact" />
                  ))}
                </div>
              </section>

              <section className="scroll-mt-28 border-t border-slate-200 py-10">
                <div className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                    <Quote className="h-6 w-6 text-blue-300" />
                  </div>
                  <h2 className="nv-display text-3xl font-semibold leading-tight">Need a name that fits your family values?</h2>
                  <p className="mt-4 text-sm leading-8 text-slate-300">Search the NameVerse database for meanings, origins, religion, gender and trending name inspiration.</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50">
                      Search names
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href={getCategoryHref(post.category)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                      Browse {post.category}
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </article>

          <BlogSidebar posts={blogPostsData} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="nv-display text-3xl font-semibold text-slate-950 sm:text-5xl">Get the NameVerse naming brief.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">Practical naming frameworks, trend summaries and cultural origin notes delivered without clutter.</p>
          <NewsletterSignup />
        </div>
      </section>
    </main>
  );
}
