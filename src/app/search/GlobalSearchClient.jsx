'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2, FileText, User, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { globalSearch, getPopularSearches } from '@/lib/api/search';
import toast from 'react-hot-toast';

// Native debounce implementation
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

export default function GlobalSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [results, setResults] = useState({ names: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedSearchRef = useRef(null);

  const popularSearches = getPopularSearches();

  // Debounced search function
  useEffect(() => {
    debouncedSearchRef.current = debounce(async (searchQuery, type) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults({ names: [], total: 0 });
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        const result = await globalSearch(searchQuery, {
          type,
          limit: 8,
        });

        if (result.success) {
          setResults(result);
        } else {
          toast.error('Search failed. Please try again.');
          setResults({ names: [], total: 0 });
        }
      } catch (error) {
        toast.error('Search failed. Please try again.');
        setResults({ names: [], total: 0 });
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const debouncedSearch = useCallback((searchQuery, type) => {
    if (debouncedSearchRef.current) {
      debouncedSearchRef.current(searchQuery, type);
    }
  }, []);

  // Search when query or type changes
  useEffect(() => {
    if (query) {
      debouncedSearch(query, searchType);
      // Update URL
      router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`, { shallow: true });
    }
  }, [query, searchType, debouncedSearch, router]);

  // Initial search on mount if query exists
  useEffect(() => {
    if (initialQuery) {
      debouncedSearch(initialQuery, initialType);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      debouncedSearch(query, searchType);
    }
  };

  const handlePopularSearch = (term) => {
    setQuery(term);
  };

  const clearSearch = () => {
    setQuery('');
    setResults({ names: [], total: 0 });
    setHasSearched(false);
    router.push('/search');
  };

  const typeOptions = [
    { value: 'all', label: 'All', icon: Search },
    { value: 'names', label: 'Names', icon: User },
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
              Search NameVerse
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search across names
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
                placeholder="Search for names..."
                className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none shadow-md pr-24"
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

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {typeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSearchType(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  searchType === value
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                <Icon size={16} />
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
              <h3 className="text-lg font-semibold text-gray-900">Popular Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
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
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && (
          <div className="max-w-5xl mx-auto">
            {results.total > 0 ? (
              <>
                {/* Results Summary */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-bold text-gray-900">{results.total}</span> results for{' '}
                    <span className="font-bold text-purple-600">&quot;{query}&quot;</span>
                  </p>
                </div>

                {/* Names Results */}
                {results.names && results.names.length > 0 && (searchType === 'all' || searchType === 'names') && (
                  <SearchSection
                    title="Names"
                    icon={User}
                    items={results.names}
                    renderItem={(name) => {
                      // API returns "Islam" but we need "islamic" for the URL
                      const religionMap = {
                        'islam': 'islamic',
                        'islamic': 'islamic',
                        'hindu': 'hindu',
                        'hinduism': 'hindu',
                        'christian': 'christian',
                        'christianity': 'christian',
                      };
                      const religion = religionMap[name.religion?.toLowerCase()] || 'islamic';
                      return (
                        <Link
                          key={name._id}
                          href={`/names/${religion}/${name.slug}`}
                          className="block p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transition-all"
                        >
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{name.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{name.short_meaning || name.long_meaning || name.meaning}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded capitalize">
                              {religion}
                            </span>
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                              {name.gender}
                            </span>
                            {name.origin && (
                              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                                {name.origin}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    }}
                  />
                )}

                

                
              </>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find anything for &quot;{query}&quot;
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

// Search Section Component
function SearchSection({ title, icon: Icon, items, renderItem }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map(renderItem)}
      </div>
    </div>
  );
}
