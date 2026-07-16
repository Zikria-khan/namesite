'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Globe,
  Heart,
  Languages,
  Library,
  Quote,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import HomePageSearch from '@/components/HomePage/HomePageSearch';
import createSafeSlug from '@/lib/utils/createSafeSlug';
import Reveal from '@/components/HomePage/Reveal';
import NameTicker from '@/components/HomePage/NameTicker';

const LatestArticles = dynamic(() => import('./LatestArticles'), {
  ssr: false,
  loading: () => (
    <div className="rounded-[2rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-8 text-center text-sm font-semibold text-[color:var(--nv-muted)]">
      Loading latest articles…
    </div>
  ),
});

const trustItems = [
  {
    icon: CheckCircle2,
    title: 'Verified meanings',
    text: 'Curated cultural and linguistic context for every featured name.',
  },
  {
    icon: Languages,
    title: 'Multi-tradition coverage',
    text: 'Islamic, Hindu, Christian, Arabic, Urdu, Persian, Sanskrit and global roots.',
  },
  {
    icon: Users,
    title: 'Parent-first UX',
    text: 'Fast search, shortlists, clear answers and mobile-friendly browsing.',
  },
];

const topicalHubs = [
  {
    label: 'Islamic Names',
    description: 'Quranic, Arabic, Urdu and Muslim name meanings.',
    href: '/names/religion/islamic/1',
    eyebrow: 'Religion',
  },
  {
    label: 'Hindu Names',
    description: 'Sanskrit, Vedic, regional and spiritual name roots.',
    href: '/names/religion/hindu/1',
    eyebrow: 'Religion',
  },
  {
    label: 'Christian Names',
    description: 'Biblical, Hebrew, Greek and modern Christian names.',
    href: '/names/religion/christian/1',
    eyebrow: 'Religion',
  },
  {
    label: 'Arabic Names',
    description: 'Classical Arabic roots with cultural pronunciation context.',
    href: '/names/islamic/origin/arabic/1',
    eyebrow: 'Origin',
  },
  {
    label: 'Urdu Names',
    description: 'South Asian Muslim names with poetic and devotional roots.',
    href: '/names/islamic/origin/urdu/1',
    eyebrow: 'Origin',
  },
  {
    label: 'Persian Names',
    description: 'Historic Persian names for boys and girls.',
    href: '/names/islamic/origin/persian/1',
    eyebrow: 'Origin',
  },
  {
    label: 'Sanskrit Names',
    description: 'Vedic, nature, deity and virtue-based Sanskrit names.',
    href: '/names/hindu/origin/sanskrit/1',
    eyebrow: 'Origin',
  },
  {
    label: 'Biblical Names',
    description: 'Old Testament, New Testament and saint-inspired names.',
    href: '/search?q=biblical%20names',
    eyebrow: 'Theme',
  },
];

const intentChips = [
  { label: 'Baby names with meanings', href: '/search?q=baby%20names%20with%20meanings' },
  { label: 'Unique baby names', href: '/unique-names' },
  { label: 'Trending baby names', href: '/trending-names' },
  { label: 'Popular names', href: '/popular-by-state' },
  { label: 'Boy names', href: '/search?q=boy%20names' },
  { label: 'Girl names', href: '/search?q=girl%20names' },
  { label: 'Names that mean light', href: '/search?q=light' },
  { label: 'Names that mean love', href: '/search?q=love' },
  { label: 'Names that mean strength', href: '/search?q=strength' },
];

const trendingNames = [
  { name: 'Muhammad', religion: 'islamic', origin: 'Arabic', badge: 'Islamic' },
  { name: 'Aisha', religion: 'islamic', origin: 'Arabic', badge: 'Islamic' },
  { name: 'Rayan', religion: 'islamic', origin: 'Arabic', badge: 'Islamic' },
  { name: 'Zainab', religion: 'islamic', origin: 'Arabic', badge: 'Islamic' },
  { name: 'Ayaan', religion: 'islamic', origin: 'Arabic', badge: 'Islamic' },
  { name: 'Noah', religion: 'christian', origin: 'Hebrew', badge: 'Christian' },
  { name: 'Olivia', religion: 'christian', origin: 'Latin', badge: 'Christian' },
  { name: 'Sophia', religion: 'christian', origin: 'Greek', badge: 'Christian' },
  { name: 'Aarav', religion: 'hindu', origin: 'Sanskrit', badge: 'Hindu' },
  { name: 'Diya', religion: 'hindu', origin: 'Sanskrit', badge: 'Hindu' },
  { name: 'Ananya', religion: 'hindu', origin: 'Sanskrit', badge: 'Hindu' },
  { name: 'Vihaan', religion: 'hindu', origin: 'Sanskrit', badge: 'Hindu' },
];

const faqs = [
  {
    question: 'How do I find the best baby name with meaning?',
    answer: 'Start by searching a name, meaning, origin, religion or theme. NameVerse connects each query to curated name lists, cultural context and related browsing paths so you can compare options quickly.',
  },
  {
    question: 'Which baby names are trending in 2026?',
    answer: 'Parents are searching for short, meaningful and globally pronounceable names. Popular homepage picks include Muhammad, Aisha, Rayan, Noah, Olivia, Aarav, Diya and Ananya, with more options in the trending names hub.',
  },
  {
    question: 'Can I search names by religion, origin or meaning?',
    answer: 'Yes. Browse Islamic, Hindu and Christian names by religion, then narrow by origins such as Arabic, Urdu, Persian, Sanskrit, Hebrew, Greek or Latin. You can also search meanings such as light, love, strength or peace.',
  },
  {
    question: 'Are NameVerse meanings verified?',
    answer: 'NameVerse prioritizes verified meanings and cultural context. Entries are reviewed for linguistic origin, common usage and faith-aware interpretation before being surfaced in search and curated lists.',
  },
  {
    question: 'Is NameVerse free to use?',
    answer: 'Yes. NameVerse search, name meanings, browsing pages, FAQs and name discovery tools are free for parents, families and researchers.',
  },
];

function SectionHeading({ id, eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
        <Sparkles className="h-3.5 w-3.5 text-[color:var(--nv-accent-2)]" />
        {eyebrow}
      </div>
      <h2 id={id} className="nv-display mt-5 text-3xl font-semibold leading-tight text-[color:var(--nv-ink)] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function TrustCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-5 backdrop-blur">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--nv-ink)] text-[color:var(--nv-canvas)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-bold text-[color:var(--nv-ink)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-muted)]">{text}</p>
    </div>
  );
}

function HubCard({ item }) {
  return (
    <Link
      href={item.href}
      className="group rounded-[2rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-[color:var(--nv-accent-2)]/40"
    >
      <div className="mb-6 flex items-center justify-between">
        <span className="rounded-full bg-[color:var(--nv-ink)]/8 px-3 py-1 text-xs font-bold text-[color:var(--nv-muted)]">
          {item.eyebrow}
        </span>
        <ArrowRight className="h-4 w-4 text-[color:var(--nv-muted)] opacity-0 transition group-hover:opacity-100" />
      </div>
      <h3 className="text-lg font-bold text-[color:var(--nv-ink)]">{item.label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-muted)]">{item.description}</p>
    </Link>
  );
}

function TrendingCard({ name }) {
  const slug = name.slug || createSafeSlug(name.name);
  const tradClass =
    name.religion === 'islamic'
      ? 'nv-trad-islamic'
      : name.religion === 'hindu'
      ? 'nv-trad-hindu'
      : 'nv-trad-christian';
  return (
    <Link
      href={`/names/${name.religion}/${slug}`}
      className={`group relative overflow-hidden rounded-[1.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-4 backdrop-blur transition hover:-translate-y-0.5 ${tradClass}`}
    >
      {/* per-tradition accent wash */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: 'var(--trad)' }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 transition group-hover:opacity-100"
        style={{ background: 'var(--trad-soft)' }}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--trad)' }}>
            {name.origin}
          </span>
          <h3 className="mt-2 text-xl font-bold text-[color:var(--nv-ink)]">{name.name}</h3>
        </div>
        <span className="rounded-full bg-[color:var(--nv-ink)]/8 px-3 py-1 text-xs font-bold text-[color:var(--nv-muted)]">
          {name.badge}
        </span>
      </div>
      <div className="relative mt-4 flex items-center gap-2 text-xs font-semibold text-[color:var(--nv-muted)]">
        <TrendingUp className="h-3.5 w-3.5" />
        View meaning and origin
      </div>
    </Link>
  );
}

export default function HomePageClient({ latestArticles = [] }) {
  return (
    <main role="main" className="min-h-screen flex flex-col bg-[color:var(--nv-canvas)] nv-body">
      <section
        aria-labelledby="homepage-title"
        className="relative overflow-hidden border-b border-[color:var(--nv-border)]"
      >
        <div className="nv-hero-mesh" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.96fr_1.04fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--nv-muted)] backdrop-blur">
                <BookOpen className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
                Cultural name knowledge base
              </div>

              <h1 id="homepage-title" className="nv-display mt-6 text-4xl font-semibold leading-[0.98] tracking-tight text-[color:var(--nv-ink)] sm:text-5xl md:text-6xl lg:text-7xl">
                Baby names with meanings, origins and cultural roots.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg">
                Search 65,000+ Islamic, Hindu, Christian and global names with fast suggestions, verified meaning pages, curated origin hubs and parent-friendly research tools.
              </p>

              {/* Live rotating name ticker */}
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] px-4 py-3 backdrop-blur">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">Now trending</span>
                <NameTicker />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/search" className="nv-btn nv-btn-primary">
                  Explore all names
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#topical-hubs" className="nv-btn nv-btn-secondary">
                  Browse by tradition
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustItems.map((item) => (
                  <TrustCard key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-[color:var(--nv-accent-2)]/10 blur-2xl" aria-hidden="true" />
              <HomePageSearch />
            </div>
          </div>

          {/* Stats strip (single connected strip, not 3 identical boxes) */}
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] backdrop-blur">
            <div className="grid divide-y divide-[color:var(--nv-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="flex items-center gap-3 p-5">
                <div className="text-3xl font-bold text-[color:var(--nv-ink)]">65K+</div>
                <div className="text-sm font-semibold text-[color:var(--nv-muted)]">Names across major traditions</div>
              </div>
              <div className="flex items-center gap-3 p-5">
                <div className="text-3xl font-bold text-[color:var(--nv-ink)]">3</div>
                <div className="text-sm font-semibold text-[color:var(--nv-muted)]">Curated religion hubs</div>
              </div>
              <div className="flex items-center gap-3 p-5">
                <div className="text-3xl font-bold text-[color:var(--nv-ink)]">2026</div>
                <div className="text-sm font-semibold text-[color:var(--nv-muted)]">Trending naming insights</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* REVENUE BANNER — center of homepage content */}


      <section aria-label="Popular search intents" className="nv-section">
        <div className="nv-container">
          <Reveal className="rounded-[2rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-4 backdrop-blur sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
              <Search className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
              Popular searches
            </div>
            <div className="flex flex-wrap gap-2">
              {intentChips.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] px-4 py-2 text-sm font-bold text-[color:var(--nv-ink)] transition hover:border-[color:var(--nv-accent-2)] hover:bg-[color:var(--nv-accent-2)] hover:text-[color:var(--nv-canvas)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="topical-hubs" aria-labelledby="topical-hubs-title" className="nv-section nv-tone-tint">
        <div className="nv-container">
          <Reveal className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="topical-hubs-title"
              eyebrow="Topical authority hubs"
              title="Browse names by tradition, origin and intent."
              description="NameVerse organizes the homepage around the search journeys parents use most: religion, origin, gender, meaning and trending lists."
            />
            <Link href="/names" className="nv-btn nv-btn-secondary w-fit">
              View full directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topicalHubs.map((item, i) => (
              <Reveal key={item.href} delay={i * 60}>
                <HubCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="trending-title" className="nv-section">
        <div className="nv-container">
          <Reveal className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="trending-title"
              eyebrow="Trending names"
              title="Popular names parents are searching now."
              description="A compact mix of Islamic, Hindu and Christian names selected for search demand, cultural relevance and meaning-led discovery."
            />
            <Link href="/trending-names" className="nv-btn nv-btn-primary w-fit">
              Explore trends
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trendingNames.map((item, i) => (
              <Reveal key={`${item.religion}-${item.name}`} delay={(i % 4) * 60}>
                <TrendingCard name={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="authority-title" className="nv-section nv-tone-tint">
        <div className="nv-container">
          <Reveal className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-muted)]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--nv-accent)]" />
                E-E-A-T for names
              </div>
              <h2 id="authority-title" className="nv-display mt-5 text-3xl font-semibold leading-tight text-[color:var(--nv-ink)] sm:text-4xl md:text-5xl">
                Built for trustworthy name research.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg">
                NameVerse combines searchable name data with clear cultural context, origin labels, meaning summaries and internal pathways to deeper research pages.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-4">
                  <div className="text-2xl font-bold text-[color:var(--nv-ink)]">65K+</div>
                  <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Name records</div>
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-4">
                  <div className="text-2xl font-bold text-[color:var(--nv-ink)]">15+</div>
                  <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Language roots</div>
                </div>
                <div className="rounded-[1.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-4">
                  <div className="text-2xl font-bold text-[color:var(--nv-ink)]">Free</div>
                  <div className="text-xs font-semibold text-[color:var(--nv-muted)]">Search tools</div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-6 backdrop-blur">
              <Quote className="h-8 w-8 text-[color:var(--nv-accent-2)]" />
              <p className="mt-5 text-xl font-semibold leading-relaxed text-[color:var(--nv-ink)]">
                A great name should be easy to search, simple to understand and rich enough to connect a child to family, faith and culture.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--nv-muted)]">
                NameVerse homepage sections are designed to answer common parent questions before they leave the page: what names mean, where they come from, which are popular, and how to choose with confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="meaning-title" className="nv-section">
        <div className="nv-container">
          <Reveal className="rounded-[2.5rem] p-6 sm:p-8 lg:p-10 nv-tone-ink">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--nv-canvas)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--nv-canvas)]/80">
                  <Heart className="h-3.5 w-3.5" />
                  Meaning-led discovery
                </div>
                <h2 id="meaning-title" className="nv-display mt-5 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  Baby names with meanings that feel personal.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--nv-canvas)]/75 sm:text-base">
                  Parents rarely search only for a spelling. They search for values: light, strength, love, peace, blessing, wisdom and courage. NameVerse connects those intent-rich queries to curated search results and origin hubs.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['light', 'love', 'strength', 'peace', 'blessing', 'wisdom', 'courage', 'grace'].map((meaning) => (
                    <Link
                      key={meaning}
                      href={`/search?q=${encodeURIComponent(`names that mean ${meaning}`)}`}
                      className="rounded-full bg-[color:var(--nv-canvas)] px-4 py-2 text-sm font-bold text-[color:var(--nv-ink)] transition hover:opacity-85"
                    >
                      Names that mean {meaning}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link href="/names-by-meaning" className="rounded-[1.75rem] bg-[color:var(--nv-canvas)]/10 p-5 transition hover:bg-[color:var(--nv-canvas)]/20">
                  <Library className="h-6 w-6 text-[color:var(--nv-canvas)]/90" />
                  <h3 className="mt-4 text-base font-bold">Meaning index</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-canvas)]/70">Find names by semantic theme and cultural interpretation.</p>
                </Link>
                <Link href="/name-meanings" className="rounded-[1.75rem] bg-[color:var(--nv-canvas)]/10 p-5 transition hover:bg-[color:var(--nv-canvas)]/20">
                  <Globe className="h-6 w-6 text-[color:var(--nv-canvas)]/90" />
                  <h3 className="mt-4 text-base font-bold">Origin explorer</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-canvas)]/70">Browse Arabic, Urdu, Persian, Sanskrit, Hebrew and Greek roots.</p>
                </Link>
                <Link href="/trending-names" className="rounded-[1.75rem] bg-[color:var(--nv-canvas)]/10 p-5 transition hover:bg-[color:var(--nv-canvas)]/20">
                  <Flame className="h-6 w-6 text-[color:var(--nv-canvas)]/90" />
                  <h3 className="mt-4 text-base font-bold">Trending names</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-canvas)]/70">Discover names gaining search interest across traditions.</p>
                </Link>
                <Link href="/search" className="rounded-[1.75rem] bg-[color:var(--nv-canvas)]/10 p-5 transition hover:bg-[color:var(--nv-canvas)]/20">
                  <Search className="h-6 w-6 text-[color:var(--nv-canvas)]/90" />
                  <h3 className="mt-4 text-base font-bold">Advanced search</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--nv-canvas)]/70">Search names, meanings, origins, religions and gender.</p>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="homepage-faq" aria-labelledby="faq-title" className="nv-section nv-tone-tint">
        <div className="nv-container">
          <Reveal className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="faq-title"
              eyebrow="FAQ"
              title="Answers parents ask before choosing a name."
              description="Homepage FAQ content is written for real search intent and marked up as FAQPage schema."
            />
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-2">
            {faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={(i % 2) * 60}>
                <details className="nv-surface rounded-[2rem] p-5">
                  <summary className="cursor-pointer list-none text-sm font-bold text-[color:var(--nv-ink)]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--nv-muted)]">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="articles-title" className="nv-section">
        <div className="nv-container">
          <Reveal className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="articles-title"
              eyebrow="Expert guidance"
              title="Latest NameVerse articles."
              description="Editorial content supports topical authority, long-tail discovery and parent confidence."
            />
            <Link href="/blog" className="nv-btn nv-btn-secondary w-fit">
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <LatestArticles articles={latestArticles} />
        </div>
      </section>

      <section aria-label="Homepage final CTA" className="nv-section pb-10">
        <div className="nv-container">
          <Reveal className="rounded-[2.5rem] border border-[color:var(--nv-border)] bg-[color:var(--nv-card)] p-6 text-center backdrop-blur sm:p-10">
            <h2 className="nv-display text-3xl font-semibold text-[color:var(--nv-ink)] sm:text-4xl">
              Find a name with meaning, origin and confidence.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--nv-muted)] sm:text-base">
              Start with a name, explore by meaning, or browse a cultural tradition. NameVerse is built to make name research fast, clear and trustworthy.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/search" className="nv-btn nv-btn-primary">
                Search names
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/names/religion/islamic/1" className="nv-btn nv-btn-secondary">
                Browse Islamic names
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
