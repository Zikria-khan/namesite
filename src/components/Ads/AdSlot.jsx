'use client';

import React, { useRef, useState, useEffect } from 'react';
import useAdSenseSlot from './useAdSenseSlot';

const AdSlot = ({
  slotId,
  className = '',
  minHeight = '90px',
  ariaLabel = 'Advertisement',
  adFormat = 'auto',
  eager = false,
  responsive = true,
  collapseOnEmpty = true,
}) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  useAdSenseSlot(slotId, adRef);

  useEffect(() => {
    if (!collapseOnEmpty || !adRef.current) return;

    const checkAdStatus = () => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) return false;
      
      // Check if ad has loaded content (iframe or innerHTML)
      const iframe = ins.querySelector('iframe');
      const hasContent = !!(iframe && iframe.offsetHeight > 0);
      const hasAdFilled = ins.children.length > 0;
      
      if (hasContent || hasAdFilled) {
        setAdLoaded(true);
        return true;
      }
      return false;
    };

    // Initial check + polling
    checkAdStatus();
    const interval = setInterval(checkAdStatus, 300);

    return () => clearInterval(interval);
  }, [collapseOnEmpty]);

  useEffect(() => {
    if (!eager) return;
    if (typeof window === 'undefined' || !adRef.current) return;
    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.warn('adsbygoogle push failed (eager):', e);
      }
    }
  }, [eager, slotId]);

  const containerClasses = `${className} ad-container`.trim();

  // When not loaded and collapse enabled, minimize space
  if (collapseOnEmpty && !adLoaded) {
    return (
      <div
        ref={adRef}
        className={`${containerClasses} invisible h-0 min-h-0 py-0`}
        aria-label={ariaLabel}
        role="region"
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-1510675468129183"
          data-ad-slot={slotId}
          data-ad-format={adFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={`w-full flex justify-center ${containerClasses}`}
      aria-label={ariaLabel}
      role="region"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight }}
        data-ad-client="ca-pub-1510675468129183"
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSlot;