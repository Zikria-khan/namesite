'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2, User, TrendingUp, X, Filter } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

// Debounce implementation
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const NAME_FILES = [
  { filename: 'islamic_names.json', religion: 'islamic' },
  { filename: 'hindu_names.json', religion: 'hindu' },
  { filename: 'christians_names.json', religion: 'christian' }
];

const POPULAR_SEARCHES = [
  'Muhammad', 'Aisha', 'Rayan', 'Zainab', 'Ayaan',
  'Liam', 'Noah', 'Emma', 'Olivia', 'Elijah',
  'Vihaan', 'Arjun', 'Ananya', 'Diya', 'Aryan'
];

export default function GlobalSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [allNames, setAllNames] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedReligion, setSelectedReligion] = useState('all');
  const debouncedSearchRef = useRef(null);

  // Load names from local JSON files
  const loadNamesData = useCallback(async () => {
    if (dataLoaded) return;

    try {
      setLoading(true);
      const allNamesData = [];

      await Promise.all(
        NAME_FILES.map(async ({ filename, religion }) => {
          try {
            const res = await fetch(`/${filename}`);
            if (!res.ok) return;
            const json = await res.json();
            if (!Array.isArray(json)) return;

            allNamesData.push(
              ...json.map((item) => {
                const name = typeof item === 'string' ? item : (item.name || '');
                return {
                  name,
                  religion,
                  slug: createSafeSlug(name),
                  meaning: item.meaning || item.short_meaning || '',
                  gender: item.gender || '',
                  origin: item.origin || ''
                };
              })
            );
          } catch (err) {
            console.error(`Error loading ${filename}:`, err);
          }
        })
      );

      // Remove duplicates
      const uniqueNames = Array.from(
        new Map(allNamesData.map((item) => [`${item.religion}:${item.slug}`, item])).values()
      );

      setAllNames(uniqueNames);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading names:', error);
    } finally {
      setLoading(false);
    }
  }, [dataLoaded]);

  // Debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce((searchQuery, religion) => {
      if (!searchQuery || searchQuery.length < 1) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setHasSearched(true);
      const lowerQuery = searchQuery.toLowerCase();

      let filtered = allNames.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );

      if (religion !== 'all') {
        filtered = filtered.filter((item) => item.religion === religion);
      }

      setResults(filtered.slice(0, 20));
    }, 300);
  }, [allNames]);

  const debouncedSearch = useCallback((searchQuery, religion) => {
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(searchQuery, religion);
    }
  }, []);

  // Load data on first focus or query
  useEffect(() => {
    if (!dataLoaded && (query || allNames.length === 0)) {
      loadNamesData();
    }
  }, [dataLoaded, loadNamesData, query, allNames.length]);

  // Search when query or religion changes
  useEffect(() => {
    if (dataLoaded && query) {
      debouncedSearch(query, selectedReligion);
      router.push(`/search?q=${encodeURIComponent(query)}&religion=${selectedReligion}`, { shallow: true });
    }
  }, [query, selectedReligion, debouncedSearch, router, dataLoaded]);

  // Initial search on mount
  useEffect(() => {
    if (initialQuery && dataLoaded) {
      debouncedSearch(initialQuery, selectedReligion);
    }
  }, [initialQuery, dataLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    if (!dataLoaded) {
      loadNamesData();
    }
  };

  const handlePopularSearch = (term) => {
    setQuery(term);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    router.push('/search');
  };

  const religionOptions = [
    { value: 'all', label: 'All Religions' },
    { value: 'islamic', label: 'Islamic Names' },
    { value: 'hindu', label: 'Hindu Names' },
    { value: 'christian', label: 'Christian Names' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Search className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
              NameVerse Search
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Instantly find baby names from Islamic, Hindu, and Christian traditions with meanings, origins, and 2026 trending data
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => !dataLoaded && loadNamesData()}
                placeholder="Search baby names, meanings, origins..."
                className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none shadow-md pr-24"
                aria-label="Search baby names"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>

          {/* Religion Filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {religionOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedReligion(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedReligion === value
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                <Filter size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        {!hasSearched && !query && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-orange-500" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Popular Baby Names</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearch(term)}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-700 hover:border-purple-300 hover:text-purple-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading baby names database...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div className="max-w-5xl mx-auto">
            {results.length > 0 ? (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-bold text-gray-900">{results.length}</span> results for{' '}
                    <span className="font-bold text-purple-600">&quot;{query}&quot;</span>
                  </p>
                </div>

                {/* Names Results Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((name) => (
                    <Link
                      key={`${name.religion}-${name.slug}`}
                      href={`/names/${name.religion}/${name.slug}`}
                      className="block p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{name.name}</h3>
                      {name.meaning && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{name.meaning}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700 capitalize">
                          {name.religion}
                        </span>
                        {name.gender && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 font-semibold text-green-700 capitalize">
                            {name.gender}
                          </span>
                        )}
                        {name.origin && (
                          <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 font-semibold text-purple-700">
                            {name.origin}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any names matching &quot;{query}&quot;. Try another search.
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
