'use client';

import React, { useEffect } from 'react';

const AdSenseUnit = ({ slotId = '9605048966', className = '' }) => {
  useEffect(() => {
    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('AdSense push failed:', error);
      }
    };

    const raf = requestAnimationFrame(pushAd);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`w-full my-8 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-1510675468129183"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;