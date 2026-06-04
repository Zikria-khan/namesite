'use client';

import React, { useRef, useState, useEffect } from 'react';
import useAdSenseSlot from './useAdSenseSlot';

const BottomAd = ({
  slotId,
  minHeight = '90px',
  ariaLabel = 'Advertisement',
  adFormat = 'autorelaxed',
}) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  useAdSenseSlot(slotId, adRef);

  useEffect(() => {
    const checkAdStatus = () => {
      const ins = adRef.current?.querySelector('ins.adsbygoogle');
      if (!ins) return false;

      const iframe = ins.querySelector('iframe');
      if (iframe && iframe.offsetHeight > 0) {
        setAdLoaded(true);
        return true;
      }
      return false;
    };

    const interval = setInterval(checkAdStatus, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
      try {
        window.adsbygoogle.push({});
      } catch (e) {
        console.warn('adsbygoogle push failed:', e);
      }
    }
  }, []);

  if (!adLoaded) {
    return null;
  }

  return (
    <div
      ref={adRef}
      className="w-full flex justify-center my-6"
      aria-label={ariaLabel}
      role="region"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight }}
        data-ad-client="ca-pub-1510675468129183"
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default BottomAd;