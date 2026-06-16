import Link from 'next/link';
import { BookOpen, Clock, TrendingUp, Search, ArrowRight } from 'lucide-react';
import BlogCard, { SidebarPost } from './BlogCard';

const categories = [
  { label: 'Islamic Names', href: '/names/religion/islamic/1', description: 'Quranic, Arabic and Urdu name guidance.' },
  { label: 'Christian Names', href: '/names/religion/christian/1', description: 'Biblical, Hebrew, Greek and modern choices.' },
  { label: 'Hindu Names', href: '/names/religion/hindu/1', description: 'Sanskrit, Vedic and regional naming traditions.' },
  { label: 'Arabic Names', href: '/names/islamic/origin/arabic/1', description: 'Classical Arabic roots and meanings.' },
  { label: 'Urdu Names', href: '/names/islamic/origin/urdu/1', description: 'South Asian Muslim name meanings.' },
  { label: 'Baby Naming Guides', href: '/blog', description: 'Decision frameworks for modern parents.' }
];

export default function BlogSidebar({ posts = [] }) {
  const popularPosts = posts.slice(0, 5);
  const recentPosts = [...posts].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, 5);

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
          <Search className="h-4 w-4 text-blue-700" />
          Find a name
        </div>
        <p className="text-sm leading-relaxed text-slate-600">Use NameVerse search to validate spellings, meanings and cultural routes while reading.</p>
        <Link href="/search" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          Open search
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
          <TrendingUp className="h-4 w-4 text-blue-700" />
          Popular articles
        </div>
        <div className="space-y-3">
          {popularPosts.map((post) => (
            <SidebarPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
          <Clock className="h-4 w-4 text-blue-700" />
          Recent articles
        </div>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <SidebarPost key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-950">
          <BookOpen className="h-4 w-4 text-blue-700" />
          Categories
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="block rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              {category.label}
              <span className="mt-1 block text-xs font-medium text-slate-500">{category.description}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-blue-100 bg-blue-50 p-5">
        <h3 className="text-base font-bold text-slate-950">Editorial standard</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">Every guide is structured for quick scanning, verified name routes, clear metadata and parent-first decision support.</p>
      </div>
    </aside>
  );
}

export function BlogMiniCardStack({ posts = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {posts.slice(0, 3).map((post) => (
        <BlogCard key={post.id} post={post} variant="compact" />
      ))}
    </div>
  );
}
