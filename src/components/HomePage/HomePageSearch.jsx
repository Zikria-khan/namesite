'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Flame,
  Filter,
  Globe,
  Heart,
  History,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

const NAME_FILES = [
  { filename: 'islamic_names.json', religion: 'islamic' },
  { filename: 'hindu_names.json', religion: 'hindu' },
  { filename: 'christians_names.json', religion: 'christian' },
];

const POPULAR_NAMES = [
  { name: 'Muhammad', religion: 'Islamic', origin: 'Arabic', slug: 'muhammad' },
  { name: 'Aisha', religion: 'Islamic', origin: 'Arabic', slug: 'aisha' },
  { name: 'Rayan', religion: 'Islamic', origin: 'Arabic', slug: 'rayan' },
  { name: 'Noah', religion: 'Christian', origin: 'Hebrew', slug: 'noah' },
  { name: 'Olivia', religion: 'Christian', origin: 'Latin', slug: 'olivia' },
  { name: 'Aarav', religion: 'Hindu', origin: 'Sanskrit', slug: 'aarav' },
  { name: 'Diya', religion: 'Hindu', origin: 'Sanskrit', slug: 'diya' },
  { name: 'Sophia', religion: 'Christian', origin: 'Greek', slug: 'sophia' },
];

const STATIC_SUGGESTIONS = [
  {
    kind: 'meaning',
    label: 'Names that mean light',
    query: 'light',
    href: '/search?q=light',
    badge: 'Meaning',
    detail: 'Noor, Lucia, Diya, Ziya',
  },
  {
    kind: 'meaning',
    label: 'Names that mean gift of God',
    query: 'gift of God',
    href: '/search?q=gift%20of%20God',
    badge: 'Meaning',
    detail: 'Theodore, Dorothea, Prisha',
  },
  {
    kind: 'meaning',
    label: 'Names that mean strength',
    query: 'strength',
    href: '/search?q=strength',
    badge: 'Meaning',
    detail: 'Ethan, Gabriel, Veer',
  },
  {
    kind: 'meaning',
    label: 'Names that mean love',
    query: 'love',
    href: '/search?q=love',
    badge: 'Meaning',
    detail: 'Priya, David, Esme',
  },
  {
    kind: 'origin',
    label: 'Arabic names',
    query: 'Arabic names',
    href: '/names/islamic/origin/arabic/1',
    badge: 'Origin',
    detail: 'Quranic, Semitic and Urdu usage',
  },
  {
    kind: 'origin',
    label: 'Urdu names',
    query: 'Urdu names',
    href: '/names/islamic/origin/urdu/1',
    badge: 'Origin',
    detail: 'South Asian Muslim name meanings',
  },
  {
    kind: 'origin',
    label: 'Persian names',
    query: 'Persian names',
    href: '/names/islamic/origin/persian/1',
    badge: 'Origin',
    detail: 'Poetic and historic roots',
  },
  {
    kind: 'origin',
    label: 'Sanskrit names',
    query: 'Sanskrit names',
    href: '/names/hindu/origin/sanskrit/1',
    badge: 'Origin',
    detail: 'Vedic, spiritual and nature roots',
  },
  {
    kind: 'religion',
    label: 'Islamic names',
    query: 'Islamic names',
    href: '/names/religion/islamic/1',
    badge: 'Religion',
    detail: 'Arabic, Urdu and Muslim names',
  },
  {
    kind: 'religion',
    label: 'Muslim names',
    query: 'Muslim names',
    href: '/names/religion/islamic/1',
    badge: 'Religion',
    detail: 'Quranic and positive-meaning names',
  },
  {
    kind: 'religion',
    label: 'Hindu names',
    query: 'Hindu names',
    href: '/names/religion/hindu/1',
    badge: 'Religion',
    detail: 'Sanskrit and regional traditions',
  },
  {
    kind: 'religion',
    label: 'Christian names',
    query: 'Christian names',
    href: '/names/religion/christian/1',
    badge: 'Religion',
    detail: 'Biblical and modern choices',
  },
  {
    kind: 'gender',
    label: 'Boy names',
    query: 'boy names',
    href: '/search?q=boy%20names',
    badge: 'Gender',
    detail: 'Popular and unique boys names',
  },
  {
    kind: 'gender',
    label: 'Girl names',
    query: 'girl names',
    href: '/search?q=girl%20names',
    badge: 'Gender',
    detail: 'Modern, classic and meaningful girls names',
  },
  {
    kind: 'gender',
    label: 'Unisex names',
    query: 'unisex names',
    href: '/search?q=unisex%20names',
    badge: 'Gender',
    detail: 'Gender-neutral baby names',
  },
];

const SEARCH_MODES = [
  { id: 'names', label: 'Name', icon: Search },
  { id: 'meanings', label: 'Meaning', icon: Heart },
  { id: 'origins', label: 'Origin', icon: Globe },
  { id: 'religions', label: 'Religion', icon: BookOpen },
  { id: 'gender', label: 'Gender', icon: Filter },
];

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function normalizeRouteReligion(religion = 'islamic') {
  const normalized = normalize(religion);
  return ['islamic', 'hindu', 'christian'].includes(normalized) ? normalized : 'islamic';
}

function scoreName(item, query) {
  const q = normalize(query);
  const name = normalize(item.name);
  if (!q || !name) return 0;

  let score = 0;
  if (name === q) score += 100;
  if (name.startsWith(q)) score += 60;
  if (name.includes(q)) score += 35;
  if (normalize(item.origin).includes(q)) score += 18;
  if (normalize(item.religion).includes(q)) score += 18;
  if (normalize(item.meaning).includes(q)) score += 18;
  score -= Math.max(0, name.length - q.length) * 0.15;
  return score;
}

function scoreStatic(item, query) {
  const q = normalize(query);
  if (!q) return 10;
  const haystack = normalize(`${item.label} ${item.query} ${item.detail} ${item.badge}`);
  if (haystack === q) return 100;
  if (haystack.startsWith(q)) return 70;
  if (haystack.includes(q)) return 45;
  return 0;
}

function getStoredRecentSearches() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('nameverse_recent_searches');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveStoredRecentSearches(items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('nameverse_recent_searches', JSON.stringify(items.slice(0, 6)));
  } catch {
    // Ignore storage failures.
  }
}

export default function HomePageSearch() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeMode, setActiveMode] = useState('names');

  useEffect(() => {
    setRecentSearches(getStoredRecentSearches());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  const loadNames = async () => {
    if (hasLoaded) return;

    setLoading(true);

    try {
      const allNames = [];

      await Promise.all(
        NAME_FILES.map(async ({ filename, religion }) => {
          try {
            const response = await fetch(`/${filename}`);
            if (!response.ok) return;
            const json = await response.json();
            if (!Array.isArray(json)) return;

            allNames.push(
              ...json.map((item) => {
                const name = typeof item === 'string' ? item : String(item.name || item || '');
                return {
                  name,
                  religion,
                  slug: createSafeSlug(name),
                  meaning: typeof item === 'string' ? '' : String(item.short_meaning || item.meaning || ''),
                  origin: typeof item === 'string' ? '' : String(item.origin || ''),
                };
              })
            );
          } catch {
            return null;
          }
        })
      );

      const uniqueNames = Array.from(
        new Map(allNames.map((item) => [`${item.religion}:${item.slug}`, item])).values()
      );

      setNames(uniqueNames);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const staticSuggestions = useMemo(() => {
    const mode = activeMode === 'all' ? STATIC_SUGGESTIONS : STATIC_SUGGESTIONS.filter((item) => item.kind === activeMode);
    const q = normalize(query);

    if (!q) return mode.slice(0, 8);

    return mode
      .map((item) => ({ item, score: scoreStatic(item, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ item }) => item);
  }, [activeMode, query]);

  const nameSuggestions = useMemo(() => {
    const q = normalize(query);
    if (!q || names.length === 0) return [];

    return names
      .map((item) => ({ item, score: scoreName(item, q) }))
      .filter(({ score }) => score > 8)
      .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
      .slice(0, 8)
      .map(({ item }) => item);
  }, [names, query]);

  const suggestions = useMemo(() => {
    if (!query.trim()) {
      return [
        ...POPULAR_NAMES.slice(0, 5).map((item) => ({ ...item, kind: 'name' })),
        ...staticSuggestions.slice(0, 5),
      ];
    }

    return [...nameSuggestions.slice(0, 6), ...staticSuggestions.slice(0, 4)];
  }, [nameSuggestions, query, staticSuggestions]);

  const exactName = useMemo(() => {
    const q = normalize(query);
    if (!q) return null;
    return names.find((item) => normalize(item.name) === q);
  }, [names, query]);

  const addRecentSearch = (value) => {
    const next = [value, ...recentSearches.filter((item) => item !== value)].slice(0, 6);
    setRecentSearches(next);
    saveStoredRecentSearches(next);
  };

  const navigateToSuggestion = (item) => {
    if (item.kind === 'name') {
      const route = item.href || `/names/${normalizeRouteReligion(item.religion)}/${item.slug || createSafeSlug(item.name)}`;
      router.push(route);
      addRecentSearch(item.name);
      return;
    }

    router.push(item.href || `/search?q=${encodeURIComponent(item.query || item.label)}`);
    addRecentSearch(item.label);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    addRecentSearch(trimmed);

    if (exactName) {
      router.push(`/names/${normalizeRouteReligion(exactName.religion)}/${exactName.slug || createSafeSlug(exactName.name)}`);
      return;
    }

    if (/^names (that )?mean|^baby names (that )?mean/i.test(trimmed)) {
      const meaning = trimmed.replace(/^names (that )?mean|^baby names (that )?mean/i, '').trim();
      router.push(`/search?q=${encodeURIComponent(meaning || 'meaning')}`);
      return;
    }

    router.push(`/search/${createSafeSlug(trimmed) || 'search'}`);
  };

  const clearRecentSearch = (value) => {
    const next = recentSearches.filter((item) => item !== value);
    setRecentSearches(next);
    saveStoredRecentSearches(next);
  };

  return (
    <section aria-label="NameVerse baby name search" className="relative">
      <div className="mx-auto max-w-5xl">
        <form onSubmit={handleSearch} role="search" className="relative">
          <div className="group nv-surface rounded-[2rem] p-2 sm:p-3">
            <div className="flex flex-col gap-2 rounded-[1.5rem] border border-[rgba(15,23,42,0.08)] bg-white/82 px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 shrink-0 text-[color:var(--nv-accent-2)]" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={loadNames}
                  placeholder="Search baby names, meanings, origins, religions or gender"
                  className="min-h-12 flex-1 bg-transparent text-base font-semibold text-[color:var(--nv-ink)] placeholder:text-slate-400 focus:outline-none sm:text-lg"
                  aria-label="Search baby names and meanings"
                  aria-controls="nameverse-home-search-suggestions"
                  aria-expanded={suggestions.length > 0}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--nv-ink)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[color:var(--nv-accent-2)]"
                >
                  {loading ? 'Loading' : 'Search'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
                <button
                  type="button"
                  onClick={() => setActiveMode(activeMode === 'names' ? 'all' : 'names')}
                  className="rounded-full border border-[color:var(--nv-border)] bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  All
                </button>
                {SEARCH_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const active = activeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setActiveMode(mode.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? 'border-[color:var(--nv-accent-2)] bg-[color:var(--nv-accent-2)]/10 text-[color:var(--nv-accent-2)]'
                          : 'border-[color:var(--nv-border)] bg-white/70 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>

        {suggestions.length > 0 && (
          <div
            id="nameverse-home-search-suggestions"
            role="listbox"
            aria-label="Search suggestions"
            className="nv-surface mt-3 max-h-[min(70vh,560px)] overflow-y-auto rounded-[1.75rem] p-2"
          >
            {debouncedQuery && query !== debouncedQuery && (
              <div className="px-4 py-3 text-xs font-semibold text-slate-500">Refining NameVerse suggestions…</div>
            )}

            {recentSearches.length > 0 && !query && (
              <div className="px-2 pb-2 pt-1">
                <div className="mb-2 flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <History className="h-3.5 w-3.5" />
                    Recent searches
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([]);
                      saveStoredRecentSearches([]);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <div key={item} className="group flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(item);
                          inputRef.current?.focus();
                        }}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {item}
                      </button>
                      <button
                        type="button"
                        onClick={() => clearRecentSearch(item)}
                        className="rounded-full p-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-white hover:text-slate-900"
                        aria-label={`Remove ${item} from recent searches`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {suggestions.map((item, index) => {
                if (item.kind === 'name') {
                  return (
                    <button
                      key={`${item.kind}-${item.religion}-${item.slug}-${index}`}
                      type="button"
                      role="option"
                      onClick={() => navigateToSuggestion(item)}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white/72 p-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)]/40 hover:bg-white"
                    >
                      <span className="text-base font-bold text-[color:var(--nv-ink)]">{item.name}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {item.religion}
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={`${item.kind}-${item.label}-${index}`}
                    type="button"
                    role="option"
                    onClick={() => navigateToSuggestion(item)}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white/72 p-4 text-left transition hover:-translate-y-0.5 hover:border-[color:var(--nv-accent-2)]/40 hover:bg-white"
                  >
                    <span>
                      <span className="mb-1 block text-sm font-bold text-[color:var(--nv-ink)]">{item.label}</span>
                      <span className="block text-xs leading-relaxed text-slate-500">{item.detail}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[color:var(--nv-border)] bg-white/65 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Flame className="h-4 w-4 text-[color:var(--nv-accent-3)]" />
              Trending names
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_NAMES.slice(0, 4).map((item) => (
                <Link
                  key={item.slug}
                  href={`/names/${item.religion.toLowerCase()}/${item.slug}`}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-[color:var(--nv-accent-2)] hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--nv-border)] bg-white/65 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Heart className="h-4 w-4 text-rose-500" />
              By meaning
            </div>
            <div className="flex flex-wrap gap-2">
              {STATIC_SUGGESTIONS.filter((item) => item.kind === 'meaning').slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-rose-500 hover:text-white"
                >
                  {item.query}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--nv-border)] bg-white/65 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Globe className="h-4 w-4 text-emerald-600" />
              By origin
            </div>
            <div className="flex flex-wrap gap-2">
              {STATIC_SUGGESTIONS.filter((item) => item.kind === 'origin').slice(0, 4).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  {item.query.split(' ')[0]}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--nv-border)] bg-white/65 p-4 backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Popular categories
            </div>
            <div className="flex flex-wrap gap-2">
              {['Islamic', 'Muslim', 'Arabic', 'Urdu', 'Hindu', 'Christian', 'Boy', 'Girl'].map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item.toLowerCase())}`}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-indigo-600 hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
