import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import { createSlug, isValidSlug } from '@/lib/seo/url-builder';

const normalizeLink = (name, religion) => {
  if (!name || typeof name !== 'string') return null;
  const cleaned = name.trim();
  if (cleaned.length < 2) return null;
  const segment = createSlug(cleaned);
  if (!segment || !isValidSlug(segment)) return null;
  if (/^\d+$/.test(segment)) return null;
  const rel = (religion || 'islamic').toLowerCase();
  return `/names/${rel}/${segment}`;
};

function cleanName(value) {
  if (!value) return '';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

export default function RelatedNames({ data }) {
  const religionKey = data.religion?.toLowerCase() || 'islamic';
  const similarNames = Array.isArray(data.similar_sounding_names) ? data.similar_sounding_names : [];
  const variations = Array.isArray(data.name_variations) ? data.name_variations : [];
  const relatedNames = Array.isArray(data.related_names) ? data.related_names : [];
  const hasSimilar = similarNames.length > 0;
  const hasVariations = variations.length > 0;
  const hasRelated = relatedNames.length > 0;

  if (!hasSimilar && !hasVariations && !hasRelated) {
    return null;
  }

  return (
    <section className="nv-card-solid" aria-labelledby="similar-names-heading">
      <div className="mb-5 flex items-center gap-3 text-slate-900">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <LinkIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 id="similar-names-heading" className="text-xl font-semibold">Similar Names</h2>
          <p className="text-sm text-slate-500">Explore names with the same sound, spelling, or origin.</p>
        </div>
      </div>

      <div className="space-y-5">
        {hasSimilar && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Similar sounding names</h3>
            <div className="flex flex-wrap gap-2">
              {similarNames.slice(0, 12).map((name) => {
                const link = normalizeLink(name, religionKey);
                // Only render link if slug is valid (prevents broken internal links)
                if (!link) return null;
                return (
                  <Link
                    key={name}
                    href={link}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {hasRelated && (
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Related names</h3>
            <div className="flex flex-wrap gap-2">
              {relatedNames.slice(0, 12).map((name) => {
                const link = normalizeLink(name, religionKey);
                if (!link) return null;
                return (
                  <Link
                    key={name}
                    href={link}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
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
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Spelling variations</h3>
            <div className="flex flex-wrap gap-2">
              {variations.slice(0, 12).map((value) => {
                const link = normalizeLink(cleanName(value), religionKey);
                if (!link) {
                  return <span key={value} className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">{cleanName(value)}</span>;
                }
                return (
                  <Link
                    key={value}
                    href={link}
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                  >
                    {cleanName(value)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}