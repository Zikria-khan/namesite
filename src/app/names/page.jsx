import Link from 'next/link'
import FAQAccordion from '@/components/names/FAQAccordion'
import { getSiteUrl } from '@/lib/seo/site'
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers'


// 30-day cache — single source of truth: src/lib/cache/cache-config.js DEFAULT_CACHE_TTL_SECONDS
export const revalidate = 2592000;

const categories = [
  {
    title: "📖 Islamic Names — Arabic & Semitic Linguistic Analysis",
    desc: "Names of Arabic, Persian, and Urdu linguistic origin with etymological analysis, Quranic context, and cultural semantic interpretation across Islamic civilizations.",
    longDesc: "Explore 18,000+ personal names from Islamic linguistic tradition with scholarly verification of root etymology, phonetic structure, and cross-cultural usage patterns including names popular in 2026.",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/30",
    borderAccent: "border-emerald-200 dark:border-emerald-800",
    accentText: "text-emerald-700 dark:text-emerald-400",
    accentBg: "bg-emerald-600 hover:bg-emerald-700",
    accentLight: "bg-emerald-100",
    icon: "🕌",
    stats: "18,000+ names | 98% verified",
    links: [
      { label: "♂ Masculine Names", href: "/islamic/boy-names" },
      { label: "♀ Feminine Names", href: "/islamic/girl-names" },
      { label: "All Islamic Names →", href: "/names/religion/islamic/1", primary: true },
    ]
  },
  {
    title: "✝️ Christian Names — Hebrew, Aramaic & Greek Etymologies",
    desc: "Names of Biblical Hebrew, Aramaic, Greek, and Latin linguistic origin with etymological context from Old and New Testament sources and early Christian traditions.",
    longDesc: "Discover 11,000+ personal names from Christian linguistic tradition — including Biblical names, virtue names, and apostolic names — with root etymology and historical evolution analysis.",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderAccent: "border-blue-200 dark:border-blue-800",
    accentText: "text-blue-700 dark:text-blue-400",
    accentBg: "bg-blue-600 hover:bg-blue-700",
    accentLight: "bg-blue-100",
    icon: "⛪",
    stats: "11,000+ names | Biblical sources",
    links: [
      { label: "♂ Masculine Names", href: "/christian/boy-names" },
      { label: "♀ Feminine Names", href: "/christian/girl-names" },
      { label: "All Christian Names →", href: "/names/religion/christian/1", primary: true },
    ]
  },
  {
    title: "🕉️ Hindu Names — Sanskrit & Dravidian Linguistic Origins",
    desc: "Names of Sanskrit, Vedic, and Dravidian linguistic origin with etymological analysis, cultural context from Hindu traditions, and phonetic structure documentation.",
    longDesc: "Browse 15,000+ personal names from Hindu linguistic tradition — including Vedic names, deity-associated names, and nature-derived names — with root etymology and regional variations.",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderAccent: "border-orange-200 dark:border-orange-800",
    accentText: "text-orange-700 dark:text-orange-400",
    accentBg: "bg-orange-600 hover:bg-orange-700",
    accentLight: "bg-orange-100",
    icon: "🔱",
    stats: "15,000+ names | Vedic sources",
    links: [
      { label: "♂ Masculine Names", href: "/hindu/boy-names" },
      { label: "♀ Feminine Names", href: "/hindu/girl-names" },
      { label: "All Hindu Names →", href: "/names/religion/hindu/1", primary: true },
    ]
  },
]

const faqs = [
  {
    q: "What is the linguistic origin of Islamic names?",
    a: "Islamic personal names primarily originate from Arabic and Semitic linguistic traditions, with significant influences from Persian, Turkish, and Urdu. Each name is verified against classical Arabic dictionaries, Quranic references, and historical usage patterns across Islamic civilizations."
  },
  {
    q: "What are the etymological roots of Christian personal names?",
    a: "Christian personal names derive from Biblical Hebrew, Aramaic, Greek, and Latin linguistic traditions. Sources include the Old Testament (Hebrew Bible), New Testament Greek texts, early Christian saints, and medieval European naming traditions."
  },
  {
    q: "What linguistic families do Hindu names come from?",
    a: "Hindu personal names primarily originate from Sanskrit (Indo-Aryan branch) and Dravidian language families. Many derive from Vedic literature, Puranic texts, and classical Sanskrit etymological roots with regional variations across the Indian subcontinent."
  },
  {
    q: "How are name meanings verified for accuracy?",
    a: "Each name undergoes scholarly verification: Islamic names against Quranic Arabic and classical dictionaries, Christian names against Biblical Hebrew/Greek concordances, and Hindu names against Sanskrit etymological references. Our verification rate exceeds 98% across all traditions."
  },
  {
    q: "Can I find gender-neutral names across different traditions?",
    a: "Yes — names like Noor (Arabic/Semitic), Arya (Sanskrit), and Eden (Hebrew) represent cross-cultural personal names found in multiple linguistic traditions. Our database cross-references names appearing in multiple cultural contexts."
  },
  {
    q: "What is the historical evolution of personal names across cultures?",
    a: "Personal names evolve through linguistic migration, cultural exchange, and historical events. For example, Arabic names spread through Islamic expansion into Persian, Turkish, Urdu, and Malay linguistic communities. Biblical names migrated from Hebrew to Greek to Latin to modern European languages."
  },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const religionLetters = [
  {
    religion: 'islamic',
    label: 'Islamic',
    emoji: '🕌',
    gradient: 'from-emerald-500 to-emerald-700',
    hoverBg: 'hover:bg-emerald-50',
    activeBg: 'bg-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  {
    religion: 'christian',
    label: 'Christian',
    emoji: '✝️',
    gradient: 'from-blue-500 to-blue-700',
    hoverBg: 'hover:bg-blue-50',
    activeBg: 'bg-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  {
    religion: 'hindu',
    label: 'Hindu',
    emoji: '🕉️',
    gradient: 'from-orange-500 to-orange-700',
    hoverBg: 'hover:bg-orange-50',
    activeBg: 'bg-orange-600',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
]

const popularStats = [
  { label: 'Islamic Onomastics', count: '18,000+', color: 'bg-emerald-500' },
  { label: 'Christian Onomastics', count: '11,000+', color: 'bg-blue-500' },
  { label: 'Hindu Onomastics', count: '15,000+', color: 'bg-orange-500' },
  { label: 'Cross-Cultural', count: '21,000+', color: 'bg-purple-500' },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => {
    const publishedDate = new Date().toISOString().split('T')[0];
    return {
      "@type": "Question",
      "name": f.q,
      "datePublished": publishedDate,
      "author": { "@type": "Organization", "name": "NameVerse" },
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
        "datePublished": publishedDate,
        "upvoteCount": 0,
        "author": { "@type": "Organization", "name": "NameVerse" }
      }
    };
  })
}

export const metadata = {
  title: validateMetaTitle("Cultural Name Knowledge Base — Linguistic Origin Analysis | NameVerse"),
  description: validateMetaDescription(
    "Explore 65,000+ personal names with linguistic origin analysis across Islamic, Christian, and Hindu traditions. Cross-cultural onomastics research with etymological roots, semantic meanings, and historical evolution data."
  ),
  keywords: ["cultural name knowledge base", "linguistic origin analysis", "Islamic onomastics", "Christian onomastics", "Hindu onomastics", "name etymology research", "cross-cultural name analysis", "onomastics database"],
  alternates: {
    canonical: `${getSiteUrl()}/names`,
  },
  openGraph: {
    title: validateMetaTitle("NameVerse — Linguistic Name Research Across Civilizations"),
    description: validateMetaDescription("65,000+ personal names with linguistic origin analysis and cultural semantic interpretation across Islamic, Christian, and Hindu traditions."),
    url: `${getSiteUrl()}/names`,
    type: "website",
    siteName: "NameVerse — Cultural Name Knowledge Base",
  },
}

export default function Page() {
  return (
    <div className="w-full">

      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-6 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.3)_1px,transparent_0)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4">

          {/* ── Breadcrumb ── */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
              <li>
                <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-700 font-semibold" aria-current="page">Cultural Name Knowledge Base</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
            Cultural Name Knowledge Base —{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
              Linguistic Origin Analysis Across Civilizations
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8 leading-relaxed">
            65,000+ personal names with linguistic origin analysis across Islamic (Arabic/Semitic), Christian (Hebrew/Aramaic/Greek), and Hindu (Sanskrit/Dravidian) traditions — plus 21,000+ cross-cultural names. Each entry includes root etymology, phonetic structure, and cultural semantic interpretation.
          </p>

          {/* ── Quick Stats ── */}
          <div className="flex flex-wrap gap-4 mb-2">
            {popularStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className={`w-2.5 h-2.5 rounded-full ${stat.color}`}></div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.count}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${cat.bgClass} border border-gray-100 dark:border-gray-800 hover:scale-[1.02] group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <div className={`w-full h-full rounded-full ${cat.accentBg} blur-3xl`}></div>
              </div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-xs font-mono bg-white/50 dark:bg-gray-800/50 px-2.5 py-1 rounded-full text-gray-600 dark:text-gray-400 font-semibold">
                  {cat.stats}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {cat.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {cat.desc}
              </p>

              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-5 border-l-2 border-purple-300 pl-3 italic">
                {cat.longDesc}
              </p>

              <div className="flex gap-2 mb-3">
                {cat.links.filter(l => !l.primary).map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex-1 text-center text-xs font-semibold py-2.5 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 hover:text-purple-700 dark:hover:text-purple-400 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {cat.links.filter(l => l.primary).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block w-full text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 transition-all group-hover:shadow-md text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* REVENUE BANNERS — center of names directory content */}


      {/* ── SEO Content Section ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Cross-Cultural Onomastics Research — 65,000+ Personal Names
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            <p>
              NameVerse is a Cultural Name Knowledge Base providing linguistic origin analysis for personal names across civilizations. Whether researching <Link href="/islamic/boy-names" className="text-emerald-600 hover:underline font-medium">Islamic masculine names</Link> with Arabic/Semitic roots, <Link href="/christian/girl-names" className="text-blue-600 hover:underline font-medium">Christian feminine names</Link> of Biblical Hebrew origin, or <Link href="/hindu/boy-names" className="text-orange-600 hover:underline font-medium">Hindu masculine names</Link> with Sanskrit etymology — our database of 65,000+ entries covers every major linguistic tradition.
            </p>
            <p>
              Each entry includes linguistic origin, root etymology, cultural semantic interpretation, gender classification, phonetic structure, and cross-cultural usage data. Our scholarly verification process references: Quranic Arabic and classical dictionaries for Islamic names, Biblical Hebrew/Greek concordances for Christian names, and Sanskrit etymological references for Hindu names.
            </p>
            <p>
              Start your research by exploring <Link href="/names/religion/islamic/1" className="text-emerald-600 hover:underline font-medium">Islamic onomastics</Link>,{' '}
              <Link href="/names/religion/christian/1" className="text-blue-600 hover:underline font-medium">Christian onomastics</Link>, or{' '}
              <Link href="/names/religion/hindu/1" className="text-orange-600 hover:underline font-medium">Hindu onomastics</Link>.{' '}
              Browse by phonetic index (A–Z) for each linguistic tradition below.
            </p>
          </div>
        </div>
      </section>

      {/* ── Gender Quick Links ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Browse by Cultural Tradition & Gender</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "🕌 Islamic Masculine", href: "/islamic/boy-names", color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40" },
            { label: "🕌 Islamic Feminine", href: "/islamic/girl-names", color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40" },
            { label: "✝️ Christian Masculine", href: "/christian/boy-names", color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40" },
            { label: "✝️ Christian Feminine", href: "/christian/girl-names", color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40" },
            { label: "🔱 Hindu Masculine", href: "/hindu/boy-names", color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40" },
            { label: "🔱 Hindu Feminine", href: "/hindu/girl-names", color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.color} border rounded-xl p-3.5 text-center text-sm font-semibold text-gray-800 dark:text-gray-200 transition-all hover:shadow-md hover:scale-[1.03]`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Alphabet Navigation ── */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Phonetic Index — Browse Names by Letter A to Z
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Navigate the phonetic index for Islamic, Christian, or Hindu name collections. Click any letter to access names with that initial phoneme — complete with etymological analysis and cultural context.
          </p>
          {religionLetters.map((rl) => (
            <div key={rl.religion} className={`mb-6 last:mb-0 ${rl.bgLight} dark:bg-gray-700/30 rounded-2xl p-4 md:p-5`}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r ${rl.gradient} text-white text-sm font-bold shadow-sm`}>
                  {rl.emoji}
                </span>
                <h3 className={`text-base font-bold ${rl.textColor}`}>
                  {rl.label} Names by Letter
                </h3>
                <Link
                  href={`/names/religion/${rl.religion}/1`}
                  className={`ml-auto text-xs font-semibold ${rl.textColor} hover:underline`}
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALPHABET.map((letter) => (
                  <Link
                    key={letter}
                    href={`/names/${rl.religion}/letter/${letter}/1`}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 bg-white border ${rl.borderColor} ${rl.textColor} ${rl.hoverBg} hover:shadow-sm hover:scale-110 dark:bg-gray-800 dark:border-gray-600`}
                    aria-label={`${rl.label} names starting with ${letter}`}
                    title={`Browse ${rl.label} personal names beginning with ${letter}`}
                  >
                    {letter}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Each letter page shows up to 50 names with etymological analysis, origins, gender classification, and cultural context.
            </p>
          </div>
        </div>
      </section>


      {/* ── FAQ Section ── */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Onomastics FAQ: Linguistic Analysis of Personal Names
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Scholarly answers to common questions about cultural name research and linguistic origin analysis
          </p>

          <FAQAccordion faqs={faqs} />

          {/* FAQ Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        </div>
      </section>

    </div>
  )
}