import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import fs from 'fs';
import path from 'path';

const RELIGION_MAP = {
  islamic: 'Islamic Names',
  christian: 'Christian Names',
  hindu: 'Hindu Names',
};

// Default blog posts (non-religion specific, good for any page)
const DEFAULT_CATEGORIES = [
  'Trends', 'Tips & Advice', 'Baby Naming Tips',
  'Unique Names', 'Meanings', 'Parenting', 'Baby Names'
];

export default function BlogSection({ religion, currentPostId, title }) {
  let allPosts = [];
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'blog-posts.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    allPosts = JSON.parse(raw);
  } catch {
    return null;
  }

  // Filter posts relevant to this religion
  const religionCategory = religion ? RELIGION_MAP[religion.toLowerCase()] : null;
  let relevantPosts = [];

  if (religionCategory) {
    // Get religion-specific posts first
    const religionPosts = allPosts.filter(
      p => p.category === religionCategory && p.id !== currentPostId
    );
    relevantPosts.push(...religionPosts);
  }

  // Fill remaining slots with general posts
  const remainingCount = 4 - relevantPosts.length;
  if (remainingCount > 0) {
    const usedIds = new Set(relevantPosts.map(p => p.id));
    const generalPosts = allPosts.filter(
      p => !usedIds.has(p.id) && p.id !== currentPostId &&
           DEFAULT_CATEGORIES.includes(p.category)
    );
    relevantPosts.push(...generalPosts.slice(0, remainingCount));
  }

  // Limit to 4 posts
  relevantPosts = relevantPosts.slice(0, 4);

  if (relevantPosts.length === 0) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nameverse.vercel.app';

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 mb-4 shadow-sm">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">
              {title || 'Related Guides & Articles'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Expert Name Guides
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Discover naming traditions, trends, and expert advice from our blog.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {relevantPosts.map((post) => {
            const imgSrc = post.featuredImage?.startsWith('http')
              ? post.featuredImage
              : `${siteUrl}${post.featuredImage || '/logo.png'}`;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{post.readTime || '5 min read'}</span>
                    <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            View All Guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}