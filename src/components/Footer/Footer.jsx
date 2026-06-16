import Image from 'next/image';
import Link from 'next/link';
import { Globe, Link2, Share2, User } from 'lucide-react';

const footerLinks = {
  Names: [
    { label: 'All Names', href: '/names' },
    { label: 'Islamic Names', href: '/names/religion/islamic/1' },
    { label: 'Christian Names', href: '/names/religion/christian/1' },
    { label: 'Hindu Names', href: '/names/religion/hindu/1' },
    { label: 'Arabic Names', href: '/names/islamic/origin/arabic/1' },
    { label: 'Urdu Names', href: '/names/islamic/origin/urdu/1' },
    { label: 'Sanskrit Names', href: '/names/hindu/origin/sanskrit/1' }
  ],
  Tools: [
    { label: 'Name Search', href: '/search' },
    { label: 'Advanced Search', href: '/advanced-search' },
    { label: 'Name Meanings', href: '/name-meanings' },
    { label: 'Names by Meaning', href: '/names-by-meaning' },
    { label: 'Trending Names', href: '/trending-names' },
    { label: 'Unique Names', href: '/unique-names' },
    { label: 'Saved Names', href: '/my-names' }
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Expert Naming Guide', href: '/guides/expert-naming-guide' },
    { label: 'Popularity', href: '/popularity' },
    { label: 'Languages', href: '/languages' },
    { label: 'Popular by State', href: '/popular-by-state' }
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Sitemap', href: '/sitemap.xml' }
  ]
};

const socialLinks = [
  { label: 'Twitter', href: 'https://twitter.com/NameVerseOfficial', icon: Share2 },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Globe },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Link2 },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: User }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white">
                <Image src="/logo.png" alt="NameVerse logo" width={30} height={30} className="object-contain" />
              </div>
              <div>
                <div className="text-lg font-black tracking-tight text-slate-950">NameVerse</div>
                <div className="text-xs font-semibold text-slate-500">Meanings, origins & guides</div>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-600">
              NameVerse helps parents and researchers discover baby names with meanings, cultural origins, linguistic context and trusted naming guidance.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" aria-label={social.label}>
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-950">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-bold text-slate-950">Verified name research</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">Curated meanings, origins and cultural context for major naming traditions.</p>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-950">Fast discovery</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">Search, browse and compare names with clean, mobile-first navigation.</p>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-950">Parent-first guidance</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">Practical articles and tools designed for confident family decisions.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} NameVerse. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="font-semibold hover:text-blue-700">Privacy</Link>
            <Link href="/terms" className="font-semibold hover:text-blue-700">Terms</Link>
            <a href="/sitemap.xml" className="font-semibold hover:text-blue-700">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
