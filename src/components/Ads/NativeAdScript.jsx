'use client';

import { useEffect } from 'react';

/**
 * NativeAdScript — Loads all global Revolthem monetization scripts once.
 *
 * Each script is loaded a single time (guarded by a unique id) and mounted in
 * <head>. Because this component is rendered at the root layout level, the
 * scripts run site-wide (every page).
 *
 * Scripts:
 *   - Native ads invoke.js (renders inside any container-* divs)
 *   - Social bar
 *
 * NOTE: The popunder script was intentionally removed. Popunder ads open
 * unwanted pop-up windows on user interaction and were causing a poor UX.
 */
const REVOLTHEM_SCRIPTS = [
  {
    id: 'revolthem-native-invoke',
    src: 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js',
  },
  {
    id: 'revolthem-social-bar',
    src: 'https://revolthem.com/1b/54/37/1b543736c10a38ea4ca3f6f7bc8a7a9b.js',
  },
];

export default function NativeAdScript() {
  useEffect(function () {
    if (typeof window === 'undefined') return;

    REVOLTHEM_SCRIPTS.forEach(function (scriptConfig) {
      // Only load once
      if (document.getElementById(scriptConfig.id)) return;

      var script = document.createElement('script');
      script.id = scriptConfig.id;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = scriptConfig.src;
      document.head.appendChild(script);
    });
  }, []);

  return null;
}
