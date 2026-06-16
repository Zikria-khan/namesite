import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User, Eye } from 'lucide-react';
import { BlogVisual, getInitials } from './BlogVisual';

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function hashString(value = '') {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getEstimatedViews(post) {
  const base = post.featured ? 18500 : 6200;
  const seed = hashString(`${post.id}-${post.title}`) % 9000;
  const recency = post.publishDate && post.publishDate.startsWith('2026') ? 3600 : 0;
  return base + seed + recency;
}

export function formatViews(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return String(value);
}

export default function BlogCard({ post, variant = 'default', className = '' }) {
  const views = formatViews(getEstimatedViews(post));

  if (variant === 'hero') {
    return (
      <Link href={`/blog/${post.id}`} className={`group block overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${className}`}>
        <BlogVisual title={post.title} category={post.category} />
        <div className="p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{post.category}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{views} views</span>
          </div>
          <h3 className="nv-display text-2xl font-semibold leading-tight text-slate-950 group-hover:text-blue-700">{post.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
          <div className="mt-5 flex items-center justify-between text-sm font-semibold text-blue-700">
            <span>Read guide</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.id}`} className={`group block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg ${className}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{post.category}</span>
          <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 transition group-hover:opacity-100" />
        </div>
        <h3 className="text-base font-bold leading-snug text-slate-950 group-hover:text-blue-700">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
          <span>{formatDate(post.publishDate)}</span>
        </div>
      </Link>
    );
  }

  return (
    <article className={`group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl ${className}`}>
      <BlogVisual title={post.title} category={post.category} />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{post.category}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{views} views</span>
        </div>
        <h3 className="nv-display text-xl font-semibold leading-tight text-slate-950 group-hover:text-blue-700 line-clamp-2">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
          <span className="inline-flex items-center gap-1 text-blue-700">
            Read
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function BlogFeedItem({ post }) {
  const views = formatViews(getEstimatedViews(post));

  return (
    <Link href={`/blog/${post.id}`} className="group grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl md:grid-cols-[220px_1fr] lg:p-5">
      <div className="overflow-hidden rounded-[1.5rem]">
        <BlogVisual title={post.title} category={post.category} compact />
      </div>
      <div className="flex flex-col justify-between gap-4">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{post.category}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(post.publishDate)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{views} views</span>
          </div>
          <h3 className="nv-display text-2xl font-semibold leading-tight text-slate-950 group-hover:text-blue-700 line-clamp-2">{post.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-600">By {post.author}</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition group-hover:bg-blue-700">
            Read article
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SidebarPost({ post }) {
  return (
    <Link href={`/blog/${post.id}`} className="group block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/40">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">{post.category}</span>
        <span className="text-xs font-semibold text-slate-500">{post.readTime}</span>
      </div>
      <h3 className="text-sm font-bold leading-snug text-slate-950 group-hover:text-blue-700 line-clamp-3">{post.title}</h3>
      <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{getInitials(post.title)}</span>
        <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}
