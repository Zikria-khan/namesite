import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, Heart, Clock, ArrowLeft, Share2, Calendar, User, Tag, CheckCircle, Star, Sparkles, ArrowRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo/site';
import blogPostsData from '../../../../public/data/blog-posts.json';
import NativeBanner from '@/components/Ads/NativeBanner';

// ISR: 30-day cache — static blog content
export const revalidate = 31536000; // 365 days

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = blogPostsData.find(p => p.id === resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Guide Not Found | NameVerse',
    };
  }

  return {
    title: `${post.title} | NameVerse Expert Guide`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    alternates: {
      canonical: `${getSiteUrl()}/guides/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${getSiteUrl()}/guides/${post.id}`,
      publishedTime: post.publishDate,
      authors: [post.author],
      tags: post.tags,
    },
    robots: { index: true, follow: true },
  };
}

// Generate static params for all guides
export default async function GuidePage({ params }) {
  const resolvedParams = await params;
  const post = blogPostsData.find(p => p.id === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Get related guides (same category, excluding current)
  const relatedGuides = blogPostsData
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorCredentials
    },
    "publisher": {
      "@type": "Organization",
      "name": "NameVerse",
      "url": getSiteUrl()
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${getSiteUrl()}/guides/${post.id}`
    },
    "keywords": post.tags.join(', '),
    "articleSection": post.category
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.featured && (
                <span className="bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-purple-100 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <nav className="max-w-4xl mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-purple-600 hover:text-purple-800">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/blog" className="text-purple-600 hover:text-purple-800">Blog</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-purple-700 font-semibold">{post.title}</li>
          </ol>
        </nav>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-purple-100">
            
            {/* Author Box */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{post.author}</div>
                <div className="text-sm text-gray-500">{post.authorCredentials}</div>
              </div>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-gray-700 leading-relaxed text-lg">
                {post.content.introduction}
              </p>
            </div>

            {/* Native Banner 1 — After introduction */}
            <NativeBanner className="my-6" minHeight="90px" instanceId="guide-post-1" />

            {/* REVENUE BANNERS — center of guide content */}


            {/* Main Content Sections */}
            {post.content.sections && post.content.sections.map((section, index) => (
              <section key={index} className="mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
                
                {/* Section Tips */}
                {section.tips && (
                  <div className="mt-6 bg-purple-50 rounded-xl p-5 border border-purple-100">
                    <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Expert Tips
                    </h3>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-2 text-purple-700 text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}

            {/* Native Banner 2 — Mid-content */}
            <NativeBanner className="my-6" minHeight="90px" instanceId="guide-post-2" />

            {/* Expert Tips */}
            {post.content.expertTips && (
              <section className="mb-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Expert Tips
                </h2>
                <ul className="space-y-3">
                  {post.content.expertTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-purple-700">
                      <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Tags */}
            <div className="mb-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Native Banner 3 — Before related content */}
            <NativeBanner className="my-6" minHeight="90px" instanceId="guide-post-3" />

            {/* Share */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Share this guide:</span>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <Link 
                  key={relatedGuide.id}
                  href={`/guides/${relatedGuide.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {relatedGuide.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {relatedGuide.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedGuide.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-medium">
                      Read guide <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Find the Perfect Name?</h2>
            <p className="text-purple-100 mb-6">
              Explore our database of 60,000+ baby names with meanings, origins, and numerology.
            </p>
            <Link
              href="/names/religion/islamic/1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Browse All Names
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}