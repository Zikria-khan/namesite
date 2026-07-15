import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import blogPostsData from '@/../public/data/blog-posts.json' with { type: 'json' };
import BlogCard from './BlogCard';

const RELIGION_MAP = {
  islamic: 'Islamic Names',
  christian: 'Christian Names',
  hindu: 'Hindu Names',
};

const DEFAULT_CATEGORIES = [
  'Trends', 'Tips & Advice', 'Baby Naming Tips',
  'Unique Names', 'Meanings', 'Parenting', 'Baby Names'
];

export default function BlogSection({ religion, currentPostId, title }) {
  const allPosts = Array.isArray(blogPostsData) ? blogPostsData : [];
  if (!allPosts.length) return null;

  const religionCategory = religion ? RELIGION_MAP[religion.toLowerCase()] : null;
  let relevantPosts = [];

  if (religionCategory) {
    relevantPosts.push(...allPosts.filter((post) => post.category === religionCategory && post.id !== currentPostId));
  }

  const usedIds = new Set(relevantPosts.map((post) => post.id));
  const remainingCount = 4 - relevantPosts.length;
  if (remainingCount > 0) {
    relevantPosts.push(...allPosts.filter(
      (post) => !usedIds.has(post.id) && post.id !== currentPostId && DEFAULT_CATEGORIES.includes(post.category)
    ).slice(0, remainingCount));
  }

  relevantPosts = relevantPosts.slice(0, 4);
  if (!relevantPosts.length) return null;

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
              <BookOpen className="h-4 w-4 text-blue-700" />
              {title || 'Related Guides & Articles'}
            </div>
            <h2 className="nv-display mt-5 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              Continue your name research
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              More expert NameVerse guides to help you compare meanings, origins and naming decisions.
            </p>
          </div>
          <Link href="/blog" className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
            View all guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relevantPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
