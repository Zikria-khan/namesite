'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NAME_FILES = [
  { filename: '/islamic_names.json', religion: 'islamic' },
  { filename: '/hindu_names.json', religion: 'hindu' },
  { filename: '/christians_names.json', religion: 'christian' },
];

import createSafeSlug from '@/lib/utils/createSafeSlug';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [names, setNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  const loadNames = useCallback(async () => {
    if (names.length > 0) return;
    setLoading(true);
    try {
      const allNames = [];
      await Promise.all(
        NAME_FILES.map(async ({ filename, religion }) => {
          const res = await fetch(filename);
          if (!res.ok) return;
          const json = await res.json();
          if (!Array.isArray(json)) return;
          json.forEach((n) => {
            const nameStr = typeof n === 'string' ? n : n.name || n.Name || '';
            if (nameStr) {
              allNames.push({
                name: nameStr,
                religion,
                slug: createSafeSlug(nameStr),
              });
            }
          });
        })
      );
      const unique = Array.from(
        new Map(allNames.map((item) => [`${item.religion}:${item.slug}`, item])).values()
      );
      setNames(unique);
    } catch (e) {
      console.error('Failed to load names:', e);
    } finally {
      setLoading(false);
    }
  }, [names]);

  useEffect(() => {
    if (query.length >= 2 && names.length > 0) {
      const lower = query.toLowerCase();
      const filtered = names
        .filter((n) => n.name.toLowerCase().includes(lower))
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, names]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const match = names.find((n) => n.name.toLowerCase() === trimmed.toLowerCase());
    if (match) {
      router.push(`/names/${match.religion}/${match.slug}`);
    } else {
      router.push(`/search/${encodeURIComponent(trimmed)}`);
    }
    setShowSuggestions(false);
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    router.push(`/names/${item.religion}/${item.slug}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search" aria-label="Name search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { loadNames(); if (suggestions.length > 0) setShowSuggestions(true); }}
          placeholder="Search personal names, linguistic origins, meanings..."
          className="w-full pl-9 pr-9 sm:pl-12 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200"
          aria-label="Search for personal names"
          aria-autocomplete="list"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-80 overflow-y-auto"
        >
          {suggestions.map((item, i) => (
            <button
              key={`${item.religion}-${item.slug}-${i}`}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {item.religion}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}