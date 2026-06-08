'use client';

import { useEffect, useRef } from 'react';

/**
 * Ad Banner Component — Dual Ad Network Setup
 * 
 * Shows TWO ads side by side (responsive):
 * 1. Revolthem (existing)
 * 2. Google AdSense (added alongside)
 * 
 * Responsive: stacked on mobile, side-by-side on desktop
 * 
 * Priority loading: both ads fire immediately on mount (above the fold)
 */
export default function AdBanner({ className = '', priority = false }) {
  const revolthemRef = useRef(null);
  const adsenseRef = useRef(null);
  const revolthemLoaded = useRef(false);
  const adsenseLoaded = useRef(false);

  // Load Revolthem ad
  useEffect(() => {
    if (revolthemLoaded.current) return;
    if (!revolthemRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('type', 'text/javascript');

    script.onload = () => {
      revolthemLoaded.current = true;
    };

    script.onerror = () => {
      console.warn('Revolthem ad script failed to load');
    };

    revolthemRef.current.appendChild(script);
  }, []);

  // Load Google AdSense
  useEffect(() => {
    if (adsenseLoaded.current) return;
    if (!adsenseRef.current) return;

    // Load the AdSense script once globally
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const gScript = document.createElement('script');
      gScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1510675468129183';
      gScript.async = true;
      gScript.setAttribute('crossorigin', 'anonymous');
      document.head.appendChild(gScript);
    }

    // Push the ad unit
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push failed', e);
    }

    adsenseLoaded.current = true;
  }, []);

  return (
    <div
      role="complementary"
      aria-label="Sponsored content"
      className={`
        w-full
        mx-auto
        my-8 sm:my-10 md:my-12
        px-4 sm:px-6
        overflow-hidden
        select-none
        ${className}
      `}
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Decorative separator line above */}
        <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Sponsored label */}
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-300 font-medium">
            — Sponsored —
          </span>
        </div>

        {/* Two ads: stacked on mobile, side by side on lg+ */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* --- Ad 1: Revolthem --- */}
          <div className="flex-1 flex items-center justify-center w-full overflow-hidden rounded-xl bg-gray-50/40 border border-gray-100/50 min-h-[90px]">
            <div
              ref={revolthemRef}
              className="flex flex-col items-center justify-center w-full min-h-[80px] sm:min-h-[90px] overflow-hidden"
              style={{ maxWidth: '100%' }}
            />
          </div>

          {/* --- Ad 2: Google AdSense --- */}
          <div className="flex-1 flex items-center justify-center w-full overflow-hidden rounded-xl bg-gray-50/40 border border-gray-100/50 min-h-[90px]">
            <ins
              ref={adsenseRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '90px' }}
              data-ad-client="ca-pub-1510675468129183"
              data-ad-slot="6846580140"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}