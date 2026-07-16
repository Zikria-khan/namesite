'use client';

import { useEffect, useState } from 'react';

/**
 * NameTicker — cycles through a small set of names + meanings for a lively
 * hero. Pure React + CSS, no dependencies, no API calls. Pauses under
 * prefers-reduced-motion (shows the first item statically).
 */
const DEFAULT_ITEMS = [
  { name: 'Aisha', meaning: 'living, prosperous' },
  { name: 'Noah', meaning: 'rest, comfort' },
  { name: 'Aarav', meaning: 'peaceful, wise' },
  { name: 'Zainab', meaning: 'fragrant flower' },
  { name: 'Olivia', meaning: 'olive tree, peace' },
  { name: 'Vihaan', meaning: 'dawn, new beginning' },
];

export default function NameTicker({ items = DEFAULT_ITEMS, interval = 2200 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || items.length <= 1) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, interval]);

  const current = items[index] || items[0];

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2" aria-live="polite">
      <span
        key={current.name}
        className="nv-ticker-word nv-display text-2xl font-semibold sm:text-3xl"
      >
        {current.name}
      </span>
      <span className="text-sm font-semibold text-[color:var(--nv-muted)]">
        — {current.meaning}
      </span>
    </span>
  );
}
