import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import AdSenseUnit from '@/components/Ads/AdSenseUnit';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="nv-page border-t border-[rgba(15,23,42,0.10)]">
      <div className="nv-container nv-section">
        <div className="nv-card">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Logo + About */}
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="NameVerse logo - Islamic, Christian, and Hindu baby names with meanings and cultural origins"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <span className="nv-display text-xl font-extrabold tracking-tight text-slate-900">NameVerse</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 mb-4">
              Discover meaningful baby names across cultures, religions, and languages.
              Explore 60,000+ Islamic, Christian, and Hindu names with deep meanings, origins, and cultural significance.
            </p>
            <Link
              href="/names"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Browse All Names →
            </Link>
          </div>

          {/* Column 2: Names by Religion */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Names by Religion</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/names" className="transition hover:text-slate-900">👉 All Baby Names</Link></li>
              <li><Link href="/islamic/boy-names" className="transition hover:text-slate-900">🕌 Islamic Boy Names</Link></li>
              <li><Link href="/islamic/girl-names" className="transition hover:text-slate-900">🕌 Islamic Girl Names</Link></li>
              <li><Link href="/christian/boy-names" className="transition hover:text-slate-900">✝️ Christian Boy Names</Link></li>
              <li><Link href="/christian/girl-names" className="transition hover:text-slate-900">✝️ Christian Girl Names</Link></li>
              <li><Link href="/hindu/boy-names" className="transition hover:text-slate-900">🔱 Hindu Boy Names</Link></li>
              <li><Link href="/hindu/girl-names" className="transition hover:text-slate-900">🔱 Hindu Girl Names</Link></li>
              <li><Link href="/names/religion/islamic/1" className="transition hover:text-slate-900">All Islamic Names A–Z</Link></li>
              <li><Link href="/names/religion/christian/1" className="transition hover:text-slate-900">All Christian Names A–Z</Link></li>
              <li><Link href="/names/religion/hindu/1" className="transition hover:text-slate-900">All Hindu Names A–Z</Link></li>
              <li><Link href="/names/islamic/origin/arabic/1" className="transition hover:text-slate-900">Names by Origin</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore & Tools */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Explore Names</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/trending-names" className="transition hover:text-slate-900">📈 Trending Names 2026</Link></li>
              <li><Link href="/unique-names" className="transition hover:text-slate-900">✨ Unique Names</Link></li>
              <li><Link href="/popularity" className="transition hover:text-slate-900">⭐ Popular Names</Link></li>
              <li><Link href="/name-meanings" className="transition hover:text-slate-900">📖 Name Meanings</Link></li>
              <li><Link href="/names-by-meaning" className="transition hover:text-slate-900">🔍 Browse by Meaning</Link></li>
              <li><Link href="/languages" className="transition hover:text-slate-900">🌍 Names by Language</Link></li>
              <li><Link href="/names/islamic/letter/A" className="transition hover:text-slate-900">🔤 Names by Letter A–Z</Link></li>
              <li><Link href="/advanced-search" className="transition hover:text-slate-900">🔎 Advanced Search</Link></li>
              <li><Link href="/search" className="transition hover:text-slate-900">🔎 Search Names</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources & Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/blog" className="transition hover:text-slate-900">📝 Blog & Articles</Link></li>
              <li><Link href="/guides/expert-naming-guide" className="transition hover:text-slate-900">📚 Expert Naming Guide</Link></li>
              <li><Link href="/my-names" className="transition hover:text-slate-900">💾 Saved Names</Link></li>
            </ul>

            <h3 className="text-sm font-semibold text-slate-900 mb-3 mt-6">Info</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="transition hover:text-slate-900">ℹ️ About Us</Link></li>
              <li><Link href="/privacy" className="transition hover:text-slate-900">🔒 Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-slate-900">📄 Terms of Service</Link></li>
              <li><Link href="/sitemap.xml" className="transition hover:text-slate-900">🗺️ Sitemap</Link></li>
            </ul>
          </div>
          </div>

        {/* Divider */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[rgba(15,23,42,0.10)] pt-6 text-sm text-slate-500 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {currentYear} NameVerse. All rights reserved.</p>
            <Link href="/privacy" className="transition hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-slate-900">Terms of Service</Link>
            <Link href="/sitemap.xml" className="transition hover:text-slate-900">Sitemap</Link>
          </div>
          {/* Social links - Only show if you have actual social media accounts
          <div className="flex space-x-4">
            <Link href="https://facebook.com/nameverse" aria-label="Facebook" className="hover:text-indigo-700" target="_blank" rel="noopener">
              <Facebook size={18} />
            </Link>
            <Link href="https://twitter.com/nameverse" aria-label="Twitter" className="hover:text-indigo-700" target="_blank" rel="noopener">
              <Twitter size={18} />
            </Link>
            <Link href="https://instagram.com/nameverse" aria-label="Instagram" className="hover:text-indigo-700" target="_blank" rel="noopener">
              <Instagram size={18} />
            </Link>
          </div>
          */}
        </div>
      </div>

      {/* Bottom Ad Unit */}
      <AdSenseUnit slotId="9605048966" />
      </div>
    </footer>
  );
}
