'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdRefreshHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Trigger ad refresh on route change
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
      // Note: Monetag refresh would require their specific API
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return null;
}