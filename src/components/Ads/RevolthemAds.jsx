'use client';

import { useEffect } from 'react';

export default function RevolthemAds() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Banner iframe
    if (!document.getElementById('revolthem-banner-script')) {
      const atOptions = {
        key: 'f0e3fe0e0c4dc5a8ddc1d06d28e8997e',
        format: 'iframe',
        height: 50,
        width: 320,
        params: {},
      };
      const atScript = document.createElement('script');
      atScript.id = 'revolthem-banner-script';
      atScript.type = 'text/javascript';
      atScript.async = true;
      atScript.setAttribute('data-cfasync', 'false');
      atScript.text = 'atOptions = ' + JSON.stringify(atOptions).replace(/"/g, "'") + ';';
      document.head.appendChild(atScript);

      const invoke = document.createElement('script');
      invoke.id = 'revolthem-banner-invoke';
      invoke.type = 'text/javascript';
      invoke.async = true;
      invoke.setAttribute('data-cfasync', 'false');
      invoke.src = 'https://revolthem.com/f0e3fe0e0c4dc5a8ddc1d06d28e8997e/invoke.js';
      document.head.appendChild(invoke);
    }

    // Social bar
    if (!document.getElementById('revolthem-social-bar')) {
      const script = document.createElement('script');
      script.id = 'revolthem-social-bar';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://revolthem.com/1b/54/37/1b543736c10a38ea4ca3f6f7bc8a7a9b.js';
      document.body.appendChild(script);
    }

    // Popunder
    if (!document.getElementById('revolthem-popunder')) {
      const script = document.createElement('script');
      script.id = 'revolthem-popunder';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://revolthem.com/15/fc/e7/15fce756a2be02e450ad8ee3543b0575.js';
      document.body.appendChild(script);
    }

    // Native banner — container inserted at the top of <body> so the ad renders near the top of the page
    if (!document.getElementById('revolthem-native-banner')) {
      const script = document.createElement('script');
      script.id = 'revolthem-native-banner';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js';
      document.head.appendChild(script);

      const container = document.createElement('div');
      container.id = 'container-1606e7870f004d67136f85f2b1698cd3';
      container.style.width = '100%';
      container.style.maxWidth = '100%';
      container.style.overflow = 'hidden';
      container.style.marginTop = '16px';
      container.style.marginBottom = '24px';
      // Insert as the first child of <body> so it appears at the top of the page
      if (document.body.firstChild) {
        document.body.insertBefore(container, document.body.firstChild);
      } else {
        document.body.appendChild(container);
      }
    }
  }, []);

  return null;
}
