'use client';

import { useEffect, useRef } from 'react';

/**
 * Ad Banner Component — CLS-Safe, Responsive, Horizontal
 * 
 * Placement rules:
 * - Always after main content, never before H1 or critical above-fold content
 * - Max height: 90-120px to prevent layout shift
 * - Full-width with proper spacing
 * - Horizontal on desktop, responsive on mobile
 */
export default function AdBanner({ className = '' }) {
  const containerRef = useRef(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    script.onload = () => {
      scriptLoaded.current = true;
    };

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full my-4 ${className}`}
      role="complementary"
      aria-label="Sponsored content"
      style={{
        minHeight: '90px',
        maxHeight: '120px',
      }}
    >
      <div
        id="container-1606e7870f004d67136f85f2b1698cd3"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '90px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}