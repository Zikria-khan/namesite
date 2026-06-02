"use client";

import { useEffect, useRef } from 'react';

export default function StickyBottomAd() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize AdSense slot when component mounts
    if (typeof window !== 'undefined' && window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        // ignore initialization errors
        // eslint-disable-next-line no-console
        console.warn('adsbygoogle push failed', e);
      }
    }
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '728px', height: '59px' }}
        data-ad-client="ca-pub-1510675468129183"
        data-ad-slot="9605048966"
      />
    </div>
  );
}
