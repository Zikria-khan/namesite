'use client';

import { useState, useEffect, useCallback } from 'react';

const SIDEBAR_STORAGE_KEY = 'nameverse_sidebar_shown';

/**
 * SidebarSlideIn — Overlay sidebar that appears once per visit after 8s delay.
 *
 * - Uses sessionStorage to ensure it only shows once per browser session.
 * - Slides in from the right after 8 seconds of page load.
 * - Dismissible via close button or backdrop click.
 * - Contains ad placeholder content (can be replaced with AdBanner).
 */
export default function SidebarSlideIn() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(SIDEBAR_STORAGE_KEY, 'true');
    } catch {
      // sessionStorage unavailable — silently fail
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Check if sidebar was already shown this session
    try {
      const alreadyShown = sessionStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (alreadyShown === 'true') return;
    } catch {
      // sessionStorage unavailable — proceed anyway
    }

    // Show after 8 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted (SSR safety)
  if (!mounted) return null;

  return (
    <>
      {/* Backdrop overlay */}
      {visible && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={dismiss}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel — slides in from the right */}
      <div
        className={`
          fixed top-0 right-0 z-[110] h-full w-full max-w-sm
          bg-white dark:bg-gray-900 shadow-2xl
          transform transition-transform duration-400 ease-out
          ${visible ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Sidebar"
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar content */}
        <div className="flex flex-col h-full p-6 pt-16 overflow-y-auto">
          {/* Trending Names Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔥 Trending Names
            </h3>
            <ul className="space-y-3">
              {['Muhammad', 'Ayesha', 'Ali', 'Fatima', 'Omar', 'Zainab', 'Hassan', 'Khadeeja'].map(
                (name) => (
                  <li key={name}>
                    <a
                      href={`/names/islamic/${name.toLowerCase()}`}
                      onClick={dismiss}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm"
                    >
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                        {name[0]}
                      </span>
                      {name}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📚 Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Islamic Boy Names', href: '/islamic/boy-names' },
                { label: 'Islamic Girl Names', href: '/islamic/girl-names' },
                { label: 'Christian Boy Names', href: '/christian/boy-names' },
                { label: 'Christian Girl Names', href: '/christian/girl-names' },
                { label: 'Hindu Boy Names', href: '/hindu/boy-names' },
                { label: 'Hindu Girl Names', href: '/hindu/girl-names' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={dismiss}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ad Placeholder */}
          <div className="mt-auto">
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                — Sponsored —
              </p>
              <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                Ad Space
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}