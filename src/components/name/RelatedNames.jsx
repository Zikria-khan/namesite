import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

/**
 * Build a safe link for a similar/related name.
 * Only generates a link if the slug is valid and the name is
 * a real name (not garbage data like "marudeen.").
 */
const normalizeLink = (name, religion) => {
  if (!name || typeof name !== 'string') return null;
  const cleaned = name.trim();
  if (cleaned.length < 2) return null;
  const segment = createSafeSlug(cleaned);
  // Skip invalid slugs or single-char slugs
  if (!segment || segment.length < 2) return null;
  // Skip slugs that are obviously not real names (contain only common garbage patterns)
  if (/^\d+$/.test(segment)) return null;
  const rel = (religion || 'islamic').toLowerCase();
  return `/names/${rel}/${segment}`;
};

export default function RelatedNames({ data }) {
  const religionKey = data.religion?.toLowerCase() || 'islamic';
  const hasSimilar = data.similar_sounding_names?.length > 0;
  const hasVariations = data.name_variations?.length > 0 || data.related_names?.length > 0;

  if (!hasSimilar && !hasVariations) {
    return null;
  }

  return (
    <section className="nv-card-solid">
      <div className="mb-5 flex items-center gap-3 text-slate-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <LinkIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Similar & Related Names</h2>
          <p className="text-sm text-slate-500">Explore names with the same feel or origin.</p>
        </div>
      </div>

      <div className="space-y-5">
        {hasSimilar && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Similar sounding</h3>
            <div className="flex flex-wrap gap-2">
              {data.similar_sounding_names.slice(0, 10).map((name) => {
                const link = normalizeLink(name, religionKey);
                if (!link) return null;
                return (
                  <Link
                    key={name}
                    href={link}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hasVariations && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Variations & related names</h3>
            <div className="flex flex-wrap gap-2">
              {data.name_variations?.slice(0, 10).map((value) => (
                <span key={value} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
                  {value}
                </span>
              ))}
              {data.related_names?.slice(0, 10).map((value) => (
                <span key={value} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

