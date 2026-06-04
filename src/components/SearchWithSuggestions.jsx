'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NAME_FILES = [
  { filename: 'islamic_names.json', religion: 'islamic' },
  { filename: 'hindu_names.json', religion: 'hindu' },
  { filename: 'christians_names.json', religion: 'christian' }
];

import createSafeSlug from '../lib/utils/createSafeSlug';


const SearchWithSuggestions = () => {
  const [query, setQuery] = useState('');
  const [names, setNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const router = useRouter();

  const loadNames = async () => {
    if (hasLoaded) return;

    setLoading(true);

    try {
      const allNames = [];
      await Promise.all(
        NAME_FILES.map(async ({ filename, religion }) => {
          const res = await fetch(`/${filename}`);
          if (!res.ok) return;
          const json = await res.json();
          if (!Array.isArray(json)) return;

          allNames.push(
            ...json.map((name) => {
              const normalized = typeof name === 'string' ? name : String(name || '');
              return {
                name: normalized,
                religion,
                slug: createSafeSlug(normalized)
              };
            })
          );
        })
      );

      const uniqueNames = Array.from(
        new Map(allNames.map((item) => [`${item.religion}:${item.slug}`, item])).values()
      );

      setNames(uniqueNames);
    } catch (error) {
      console.error('Error loading name data:', error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  // Handle input focus - load name data on first focus
  const handleFocus = () => {
    if (!hasLoaded) {
      loadNames();
    }
  };

  // Update suggestions based on query
  useEffect(() => {
    if (query.length > 0 && names.length > 0) {
      const lowerQuery = query.toLowerCase();
      const filtered = names
        .filter((item) => item.name.toLowerCase().includes(lowerQuery))
        .slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, names]);

  // Handle form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const exactMatch = names.find(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exactMatch) {
      router.push(`/names/${exactMatch.religion}/${exactMatch.slug}`);
      return;
    }

    router.push(`/search/${createSafeSlug(trimmed)}`);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setSuggestions([]);
    router.push(`/names/${item.religion}/${item.slug}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="relative" role="search" aria-label="Site search">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder="Search personal names..."
            className="w-full pl-12 pr-12 py-4 text-base font-medium text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Search for baby names"
            name="search"
            id="universal-search-input"
            autoComplete="off"
          />

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={clearSearch}
                type="button"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50 overflow-hidden">
          {suggestions.map((item, index) => (
            <button
              key={`${item.religion}-${item.slug}-${index}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {item.religion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;