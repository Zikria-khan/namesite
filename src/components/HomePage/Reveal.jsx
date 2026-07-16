'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveal — fades/slides children into view once when they enter the viewport.
 *
 * Pure IntersectionObserver + CSS (no dependencies). Respects
 * prefers-reduced-motion via the .nv-reveal rules in globals.css.
 *
 * @param {Object} props
 * @param {React.ElementType} [props.as] - wrapper element/tag (default 'div')
 * @param {number} [props.delay] - stagger delay in ms
 * @param {string} [props.className]
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is unavailable, show immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`nv-reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
