'use client';

import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Fixed Bottom Banner — Sticky ad bar at bottom of viewport
 * 
 * - Shows a 320x50 Monetag ad
 * - Sticky to bottom, appears after scrolling past first fold
 * - Dismissible with X button (stored in sessionStorage)
 * - Slides up animation on entry
 * - Does NOT overlap content (margin-bottom on body via layout)
 * - Refreshes on each new page navigation
 */
export default function FixedBottomBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef(null);
  const loaded = useRef(false);
  const mounted = useRef(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    mounted.current = true;

    // Check session storage
    const sd = sessionStorage.getItem('nv_bottom_ad_dismissed');
    if (sd === 'true') {
      setDismissed(true);
      return;
    }

    // Wait for idle callback or timeout (3s max)
    const idleCallback = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (!mounted.current) return;
          setVisible(true);
          loadedScript();
        }, { timeout: 3000 });
      } else {
        setTimeout(() => {
          if (!mounted.current) return;
          setVisible(true);
          loadedScript();
        }, 2000);
      }
    };

    // Start after first user interaction or timeout
    const startTimer = setTimeout(idleCallback, 2000);

    return () => {
      mounted.current = false;
      clearTimeout(startTimer);
    };
  }, []);

  const loadedScript = () => {
    if (loaded.current) return;
    loaded.current = true;

    const wrapper = document.createElement('div');
    wrapperRef.current = wrapper;
    wrapper.id = `monetag-bottom-ad`;
    wrapper.style.width = '320px';
    wrapper.style.overflow = 'hidden';

    const monetagScript = document.createElement('script');
    monetagScript.src = 'https://revolthem.com/f0e3fe0e0c4dc5a8ddc1d06d28e8997e/invoke.js';
    monetagScript.async = true;
    monetagScript.setAttribute('data-cfasync', 'false');

    monetagScript.onerror = () => {
      console.warn('Revolthem bottom ad script failed to load');
    };
    wrapper.appendChild(monetagScript);

    if (containerRef.current) {
      containerRef.current.appendChild(wrapper);
    }

    // Extra ad container
    const extraWrapper = document.createElement('div');
    extraWrapper.id = `extra-bottom-ad`;
    extraWrapper.style.width = '320px';
    extraWrapper.style.overflow = 'hidden';

    const extraScript = document.createElement('script');
    extraScript.async = true;
    extraScript.setAttribute('data-cfasync', 'false');
    extraScript.src = 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js';

    extraScript.onerror = () => {
      console.warn('Extra bottom ad script failed to load');
    };
    extraWrapper.appendChild(extraScript);

    const extraContainer = document.createElement('div');
    extraContainer.id = 'container-1606e7870f004d67136f85f2b1698cd3';
    extraWrapper.appendChild(extraContainer);

    if (containerRef.current) {
      containerRef.current.appendChild(extraWrapper);
    }
  };

  // ⚡ Impression: track when ad becomes visible to user
  useEffect(() => {
    if (!visible) return;
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Impression registered — ad is visible to user
          if (typeof window !== 'undefined' && 'dataLayer' in window) {
            try {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'ad_impression',
                adType: 'fixed_bottom_banner',
                adNetwork: 'revolthem',
                timestamp: Date.now()
              });
            } catch (e) {}
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    // Delay observer to let ad render
    const impressionTimer = setTimeout(() => {
      observer.observe(el);
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(impressionTimer);
    };
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem('nv_bottom_ad_dismissed', 'true');
    } catch (e) {
      // sessionStorage may be unavailable
    }
  };

  if (dismissed) return null;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-[9999]
        transition-all duration-500 ease-in-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
      role="complementary"
      aria-label="Sponsored content"
    >
      {/* Gradient top border */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
          {/* Left spacer for centering */}
          <div className="w-8 sm:w-10" />

          {/* Ad container */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 font-medium">
              — Sponsored —
            </span>
            <div
              ref={containerRef}
              className="flex items-center justify-center min-h-[50px] w-[320px] overflow-hidden rounded-lg bg-gray-50/60"
            />
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer z-10"
            aria-label="Close ad"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}