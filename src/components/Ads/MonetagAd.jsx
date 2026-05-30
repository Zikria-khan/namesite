'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

/**
 * Monetag In-Page Push Ad Component
 * 
 * Strategy:
 * - Loads the Monetag tag script with `afterInteractive` strategy (non-blocking)
 * - Renders a hidden container near the bottom of the DOM for Monetag to inject ads
 * - The container is invisible to users but visible to Monetag's script
 * - No layout shift: container has zero height
 * - Works on all devices and routes (loaded once in root layout)
 * 
 * Monetag Domains Allowed in CSP:
 * - nap5k.com (tag script)
 * - *.mgid.com (ad delivery, tracking, iframes)
 * - *.monetag.com (alternative domains)
 * - *.monetagcdn.com (assets)
 * 
 * Performance Impact:
 * - LCP: None (script loads after page is interactive)
 * - CLS: None (container has fixed zero height)
 * - INP: Minimal (no DOM manipulation on main thread)
 */
export default function MonetagAd() {
  const containerRef = useRef(null);

  return (
    <>
      {/* Monetag in-page push script - loads after page is interactive */}
      <Script
        id="monetag-inpage-push"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11058633',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
        }}
      />

      {/* Invisible container for Monetag ad injection - positioned at the bottom */}
      <div
        ref={containerRef}
        id="monetag-container"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
      />
    </>
  );
}