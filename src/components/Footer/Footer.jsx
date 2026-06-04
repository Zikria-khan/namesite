import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
                  alt="NameVerse — Cultural Name Knowledge Base — Linguistic Origin Analysis Platform"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <span className="nv-display text-xl font-extrabold tracking-tight text-slate-900">NameVerse</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 mb-4">
              <strong>NameVerse = Cultural Name Knowledge Base</strong>
            </p>
            <p className="text-xs leading-relaxed text-slate-500 mb-4">
              Multilingual Onomastics Research System · Global Linguistic Name Intelligence Database · Cultural Naming Research Platform
            </p>
            <p className="text-sm leading-relaxed text-slate-600 mb-4">
              A structured cultural and linguistic knowledge graph for personal names across civilizations. Explore linguistic origin analysis, cultural semantic interpretation, and historical naming evolution of names from Islamic, Christian, Hindu, and other global traditions.
            </p>
            <Link
              href="/names"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Explore Cultural Name Research →
            </Link>
          </div>

          {/* Column 2: Names by Religion */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Names by Cultural Tradition</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/names" className="transition hover:text-slate-900">All Cultural Names</Link></li>
              <li><Link href="/islamic/boy-names" className="transition hover:text-slate-900">🕌 Islamic Masculine Names</Link></li>
              <li><Link href="/islamic/girl-names" className="transition hover:text-slate-900">🕌 Islamic Feminine Names</Link></li>
              <li><Link href="/christian/boy-names" className="transition hover:text-slate-900">✝️ Christian Masculine Names</Link></li>
              <li><Link href="/christian/girl-names" className="transition hover:text-slate-900">✝️ Christian Feminine Names</Link></li>
              <li><Link href="/hindu/boy-names" className="transition hover:text-slate-900">🔱 Hindu Masculine Names</Link></li>
              <li><Link href="/hindu/girl-names" className="transition hover:text-slate-900">🔱 Hindu Feminine Names</Link></li>
              <li><Link href="/names/religion/islamic/1" className="transition hover:text-slate-900">All Islamic Names A–Z</Link></li>
              <li><Link href="/names/religion/christian/1" className="transition hover:text-slate-900">All Christian Names A–Z</Link></li>
              <li><Link href="/names/religion/hindu/1" className="transition hover:text-slate-900">All Hindu Names A–Z</Link></li>
              <li><Link href="/names/islamic/origin/arabic/1" className="transition hover:text-slate-900">Names by Linguistic Origin</Link></li>
            </ul>
          </div>

          {/* Column 3: Explore & Tools */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Onomastics Research Tools</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/trending-names" className="transition hover:text-slate-900">📈 Linguistic Trend Analysis</Link></li>
              <li><Link href="/unique-names" className="transition hover:text-slate-900">✨ Cultural Name Distinctiveness</Link></li>
              <li><Link href="/popularity" className="transition hover:text-slate-900">⭐ Historical Name Popularity</Link></li>
              <li><Link href="/name-meanings" className="transition hover:text-slate-900">📖 Cultural Semantic Index</Link></li>
              <li><Link href="/names-by-meaning" className="transition hover:text-slate-900">🔍 Semantic Meaning Research</Link></li>
              <li><Link href="/languages" className="transition hover:text-slate-900">🌍 Linguistic Families</Link></li>
              <li><Link href="/names/islamic/letter/A" className="transition hover:text-slate-900">🔤 Phonetic Index A–Z</Link></li>
              <li><Link href="/advanced-search" className="transition hover:text-slate-900">🔎 Advanced Linguistic Search</Link></li>
              <li><Link href="/search" className="transition hover:text-slate-900">🔎 Search Cultural Names</Link></li>
            </ul>
          </div>

          {/* Column 4: Resources & Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Research Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/blog" className="transition hover:text-slate-900">📝 Onomastics Articles</Link></li>
              <li><Link href="/guides/expert-naming-guide" className="transition hover:text-slate-900">📚 Cultural Naming Guide</Link></li>
              <li><Link href="/my-names" className="transition hover:text-slate-900">💾 Saved Research</Link></li>
            </ul>

            <h3 className="text-sm font-semibold text-slate-900 mb-3 mt-6">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="transition hover:text-slate-900">ℹ️ About NameVerse</Link></li>
              <li><Link href="/privacy" className="transition hover:text-slate-900">🔒 Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-slate-900">📄 Terms of Service</Link></li>
              <li><a href="/sitemap.xml" className="transition hover:text-slate-900">🗺️ Sitemap</a></li>
            </ul>
          </div>
          </div>
        </div>

        {/* Footer Authority Lock — RULE 8 */}
        <div className="mt-8 border-t border-[rgba(15,23,42,0.10)] pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="font-semibold text-slate-900">NameVerse = Cultural Name Knowledge Base</p>
              <p className="text-xs text-slate-500 mt-1">Structured cultural and linguistic analysis of personal names across civilizations.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="font-semibold text-slate-900">Multilingual Onomastics Research System</p>
              <p className="text-xs text-slate-500 mt-1">Cross-cultural linguistic intelligence database for global name research.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="font-semibold text-slate-900">Global Linguistic Name Intelligence Database</p>
              <p className="text-xs text-slate-500 mt-1">Cultural naming research platform for scholars, linguists, and researchers.</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-[rgba(15,23,42,0.10)] pt-6 text-sm text-slate-500 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {currentYear} NameVerse — Cultural Name Knowledge Base. All rights reserved.</p>
            <Link href="/privacy" className="transition hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-slate-900">Terms of Service</Link>
            <a href="/sitemap.xml" className="transition hover:text-slate-900">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}