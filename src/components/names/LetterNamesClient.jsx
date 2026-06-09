'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchNamesByLetter } from '@/lib/api/names';
import { Sparkles, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

const VALID_RELIGIONS = ['islamic', 'christian', 'hindu'];
const NAMES_PER_PAGE = 50;

function generateSlug(name) {
  if (!name || typeof name !== 'string') return '';
  return createSafeSlug(name);
}

export default function LetterNamesClient({ selectedReligion, letter, page }) {
  const router = useRouter();
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });

  useEffect(() => {
    const loadNames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchNamesByLetter(letter, {
          religion: selectedReligion,
          page,
          limit: NAMES_PER_PAGE,
          sort: 'asc',
        });

        if (response.success) {
          const filteredNames = (response.data || []).filter(
            (item) => item.name && typeof item.name === 'string'
          );
          setNames(filteredNames);
          setPagination(response.pagination || { totalPages: 1, totalCount: 0 });
        } else {
          setError('Failed to load names. Please try a different letter or refresh the page.');
        }
      } catch (err) {
        setError(
          err?.message && typeof err.message === 'string'
            ? err.message
            : 'Unable to load names at this time. Please check your connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadNames();
  }, [selectedReligion, letter, page]);

  const handleReligionChange = (newReligion) => {
    router.push(/names/religion/islamic/1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">Loading names...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Names</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const { totalPages = 1, totalCount = 0 } = pagination;
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const createUrl = (newPage) => /names/religion/islamic/1;
  const prevUrl = hasPrev ? createUrl(currentPage - 1) : null;
  const nextUrl = hasNext ? createUrl(currentPage + 1) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <section className="relative py-16 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>{totalCount} Names Found</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {selectedReligion.charAt(0).toUpperCase() + selectedReligion.slice(1)} Names Starting with "{letter}"
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            Page {currentPage} of {totalPages} • Discover beautiful names beginning with {letter}
          </p>
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Select Religion</label>
            <select
              value={selectedReligion}
              onChange={(e) => handleReligionChange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white"
            >
              {VALID_RELIGIONS.map((rel) => (
                <option key={rel} value={rel} className="text-gray-900">
                  {rel.charAt(0).toUpperCase() + rel.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <nav className="max-w-7xl mx-auto px-4 py-5" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/names/${selectedReligion}/letter/A/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">
              All Names
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link href={`/names/${selectedReligion}/letter/A/1`} className="text-emerald-600 hover:text-emerald-800 font-medium">
              {selectedReligion.charAt(0).toUpperCase() + selectedReligion.slice(1)}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">Letter {letter}</li>
          <li className="text-gray-400">/</li>
          <li className="text-emerald-700 font-semibold">Page {currentPage}</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map((l) => (
            <Link
              key={l}
              href={`/names/${selectedReligion}/letter/${l}/1`}
              className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                l === letter
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {names.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Names Found</h2>
            <p className="text-gray-600">No names starting with "{letter}" found. Try another letter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {names.map((nameItem, index) => {
                const itemKey = nameItem.slug || generateSlug(nameItem.name) || nameItem._id || index;

                return (
                  <Link
                    key={itemKey}
                    href={/names/religion/islamic/1}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:border-emerald-300 group hover:-translate-y-1 block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {nameItem.name || 'Unknown'}
                      </h3>
                      {nameItem.quranicReference && (
                        <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                          Quranic
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <FavoriteButton
                        nameData={{
                          name: nameItem.name,
                          slug: generateSlug(nameItem.name),
                          religion: selectedReligion,
                          meaning: nameItem.short_meaning || nameItem.meaning,
                          origin: nameItem.origin
                        }}
                        size="small"
                      />
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Moon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <p className="text-emerald-600 font-semibold text-lg mb-4">
                    "{nameItem.short_meaning || nameItem.meaning || 'No meaning available'}"
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Origin:</span>
                      <span>{
                        Array.isArray(nameItem.origin)
                          ? nameItem.origin.join(', ')
                          : nameItem.origin || 'Unknown'
                      }</span>
                    </div>
                    {nameItem.luckyNumber && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Lucky Number:</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full font-bold">
                          {nameItem.luckyNumber || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              {hasPrev && (
                <Link
                  href={prevUrl}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Link>
              )}

              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              {hasNext && (
                <Link
                  href={nextUrl}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
