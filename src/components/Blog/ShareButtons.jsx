'use client';

import { Copy, Globe, Link2, Mail, Share2 } from 'lucide-react';

export default function ShareButtons({ title, url }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const shareText = title;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      window.prompt('Copy this link', shareUrl);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share article">
      <button type="button" onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
        <Copy className="h-3.5 w-3.5" />
        Copy
      </button>
      <a
        href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        aria-label="Share by email"
      >
        <Mail className="h-3.5 w-3.5" />
        Email
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        aria-label="Share on Facebook"
      >
        <Globe className="h-3.5 w-3.5" />
        Share
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        aria-label="Share on X"
      >
        <Share2 className="h-3.5 w-3.5" />
        Post
      </a>
    </div>
  );
}
