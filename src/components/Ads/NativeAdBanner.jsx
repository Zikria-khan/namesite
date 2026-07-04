'use client';

import { useEffect, useRef, useState } from 'react';

const ADSTERRA_NATIVE_ID = '1606e7870f004d67136f85f2b1698cd3';
const ADSTERRA_NATIVE_SCRIPT = 'https://revolthem.com/1606e7870f004d67136f85f2b1698cd3/invoke.js';
const ADSTERRA_SCRIPT_ID = 'adsterra-native-script';

const isAdPage = (pathname = '/') => {
  const lower = pathname.toLowerCase();
  if (lower.startsWith('/privacy')) return true;
  if (lower.startsWith('/terms')) return true;
  if (lower.startsWith('/login')) return true;
  if (lower.startsWith('/signup')) return true;
  if (lower.startsWith('/dashboard')) return true;
  if (lower.startsWith('/admin')) return true;
  return false;
};

function loadNativeScript() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ADSTERRA_SCRIPT_ID)) return;
  if (document.querySelector(`script[src="${ADSTERRA_NATIVE_SCRIPT}"]`)) return;

  const script = document.createElement('script');
  script.id = ADSTERRA_SCRIPT_ID;
  script.async = true;
  script.setAttribute('data-cfasync', 'false');
  script.src = ADSTERRA_NATIVE_SCRIPT;
  document.head.appendChild(script);
}

function ensureContainer(container) {
  if (!container) return;
  const existing = container.querySelector(`#container-${ADSTERRA_NATIVE_ID}`);
  if (existing) return existing;

  const wrapper = document.createElement('div');
  wrapper.id = `container-${ADSTERRA_NATIVE_ID}`;
  wrapper.style.width = '100%';
  wrapper.style.maxWidth = '100%';
  wrapper.style.overflow = 'hidden';
  wrapper.style.marginTop = '16px';
  wrapper.style.marginBottom = '24px';
  container.appendChild(wrapper);
  return wrapper;
}

export default function NativeAdBanner({ className = '', pathname, minHeight = '90px' }) {
  const containerRef = useRef(null);
  const loaded = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (isAdPage(pathname)) return;
  }, [pathname]);

  useEffect(() => {
    if (isAdPage(pathname)) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (isAdPage(pathname)) return;
    if (!inView || loaded.current || !containerRef.current) return;
    loaded.current = true;

    loadNativeScript();
    ensureContainer(containerRef.current);
  }, [inView, pathname]);

  if (isAdPage(pathname)) return null;

  return (
    <div
      ref={containerRef}
      role="complementary"
      aria-label="Sponsored content"
      className={`
        w-full mx-auto
        px-2 sm:px-4 overflow-hidden select-none
        ${className}
      `}
      style={{ minHeight }}
    />
  );
}