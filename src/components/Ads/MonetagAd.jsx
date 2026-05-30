'use client';

import Script from 'next/script';

export default function MonetagAd() {
  return (
    <>
      <Script
        id="monetag-inpage-push"
        src="https://nap5k.com/tag.min.js"
        data-zone="11058633"
        strategy="lazyOnload"
      />
      <div
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