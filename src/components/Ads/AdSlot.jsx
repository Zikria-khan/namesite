'use client';

import React, { useEffect } from 'react';

const AdSlot = ({ 
  slotId, 
  className = '', 
  minHeight = '90px', 
  ariaLabel = 'Advertisement' 
}) => {
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
  }, [slotId]); // Re-initialize when slotId changes

  return (
    <div 
      className={`w-full my-6 flex justify-center ${className}`} 
      aria-label={ariaLabel}
      role="region"
    >
      {/* Placeholder to prevent CLS */}
      <div 
        className="hidden sm:block"
        style={{ minHeight, width: '100%' }}
      ></div>
      
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

export default AdSlot;