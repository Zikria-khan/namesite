'use client';

import React, { useRef } from 'react';
import useAdSenseSlot from './useAdSenseSlot';

const AdSenseUnit = ({ slotId = '9605048966', className = '', minHeight = '90px', ariaLabel }) => {
  const adRef = useRef(null);
  useAdSenseSlot(slotId, adRef);

  return (
    <div ref={adRef} className={`w-full my-8 flex justify-center ${className}`} aria-label={ariaLabel}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight }}
        data-ad-client="ca-pub-1510675468129183"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;