'use client';

import { useEffect, useRef } from 'react';

/**
 * Ad Banner Component — Revolthem Ad Network
 * 
 * In-content ad placement. Replaces old AdSense + old Revolthem combo.
 * Uses the new Revolthem atOptions + invoke.js system.
 * Responsive: adapts to container width.
 * 
 * The config script (1b543736c...) is loaded once globally per page.
 * The atOptions + invoke.js creates the specific ad unit.
 */
export default function AdBanner({ className = '', variant = 'inline' }) {
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (!containerRef.current) return;

    // 1. Load the universal config script (once per page)
    if (!document.querySelector('script[src*="1b543736c10a38ea4ca3f6f7bc8a7a9b"]')) {
      const configScript = document.createElement('script');
      configScript.src = 'https://revolthem.com/1b/54/37/1b543736c10a38ea4ca3f6f7bc8a7a9b.js';
      configScript.async = true;
      configScript.setAttribute('data-cfasync', 'false');
      document.head.appendChild(configScript);
    }

    // 2. Create a wrapper for the ad unit
    const wrapper = document.createElement('div');
    wrapper.id = `revolthem-ad-${Date.now()}`;
    wrapper.style.width = '100%';
    wrapper.style.overflow = 'hidden';

    // 3. Set atOptions for this specific ad unit
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.text = `
      atOptions = {
        'key' : 'f0e3fe0e0c4dc5a8ddc1d06d28e8997e',
        'format' : 'iframe',
        'height' : ${variant === 'banner' ? 90 : 50},
        'width' : ${variant === 'banner' ? 728 : 320},
        'params' : {}
      };
    `;

    // 4. Load the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.src = 'https://revolthem.com/f0e3fe0e0c4dc5a8ddc1d06d28e8997e/invoke.js';
    invokeScript.async = true;
    invokeScript.setAttribute('data-cfasync', 'false');
    invokeScript.setAttribute('type', 'text/javascript');

    wrapper.appendChild(atOptionsScript);
    wrapper.appendChild(invokeScript);
    containerRef.current.appendChild(wrapper);

    loaded.current = true;
  }, [variant]);

  return (
    <div
      role="complementary"
      aria-label="Sponsored content"
      className={`
        w-full mx-auto my-6 sm:my-8 md:my-10
        px-2 sm:px-4 overflow-hidden select-none
        ${className}
      `}
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Decorative separator */}
        <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Sponsored label */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-300 font-medium">
            — Sponsored —
          </span>
        </div>

        {/* Ad container */}
        <div className="flex justify-center items-center w-full overflow-hidden rounded-xl bg-gray-50/40 border border-gray-100/50 min-h-[60px]">
          <div
            ref={containerRef}
            className="flex flex-col items-center justify-center w-full min-h-[50px] overflow-hidden"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}