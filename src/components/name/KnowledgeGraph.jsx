 'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ENTITY_RELATIONSHIPS, ENTITY_TYPES } from '@/lib/seo/topical-authority-architecture';
import { Network, BookOpen, Globe, MapPin, Heart, Sparkles, Sun, Moon, Star, Flower2, Shield, Crown, Palette, Languages, History, Users } from 'lucide-react';

function getEntityIcon(type) {
  const icons = {
    [ENTITY_TYPES.RELIGION]: BookOpen,
    [ENTITY_TYPES.ORIGIN]: Globe,
    [ENTITY_TYPES.LANGUAGE]: Languages,
    [ENTITY_TYPES.COUNTRY]: MapPin,
    [ENTITY_TYPES.THEME]: Sparkles,
    [ENTITY_TYPES.MEANING]: Heart,
    [ENTITY_TYPES.LETTER]: 'A',
    [ENTITY_TYPES.GENDER]: Users,
    [ENTITY_TYPES.CULTURE]: Users,
    [ENTITY_TYPES.ERA]: History,
    [ENTITY_TYPES.PROFESSION]: Shield,
    [ENTITY_TYPES.PERSONALITY]: Heart,
    [ENTITY_TYPES.NUMEROLOGY]: Sparkles,
    [ENTITY_TYPES.ZODIAC]: Star,
    [ENTITY_TYPES.ELEMENT]: Sun,
    [ENTITY_TYPES.COLOR]: Palette,
    [ENTITY_TYPES.NATURE]: Sun,
    [ENTITY_TYPES.FLOWER]: Flower2,
    [ENTITY_TYPES.ANIMAL]: '🐾',
    [ENTITY_TYPES.VIRTUE]: Heart,
    [ENTITY_TYPES.ROYAL]: Crown,
    [ENTITY_TYPES.BIBLICAL]: BookOpen,
    [ENTITY_TYPES.QURANIC]: BookOpen,
    [ENTITY_TYPES.VEDIC]: BookOpen,
  };
  return icons[type] || Sparkles;
}

function getEntityColor(type) {
  const colors = {
    [ENTITY_TYPES.RELIGION]: 'bg-amber-100 text-amber-800 border-amber-200',
    [ENTITY_TYPES.ORIGIN]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ENTITY_TYPES.LANGUAGE]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [ENTITY_TYPES.COUNTRY]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [ENTITY_TYPES.THEME]: 'bg-purple-100 text-purple-800 border-purple-200',
    [ENTITY_TYPES.MEANING]: 'bg-rose-100 text-rose-800 border-rose-200',
    [ENTITY_TYPES.CULTURE]: 'bg-teal-100 text-teal-800 border-teal-200',
    [ENTITY_TYPES.ERA]: 'bg-orange-100 text-orange-800 border-orange-200',
    [ENTITY_TYPES.VIRTUE]: 'bg-pink-100 text-pink-800 border-pink-200',
    [ENTITY_TYPES.NATURE]: 'bg-green-100 text-green-800 border-green-200',
    [ENTITY_TYPES.FLOWER]: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    [ENTITY_TYPES.ANIMAL]: 'bg-lime-100 text-lime-800 border-lime-200',
    [ENTITY_TYPES.ROYAL]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [ENTITY_TYPES.BIBLICAL]: 'bg-sky-100 text-sky-800 border-sky-200',
    [ENTITY_TYPES.QURANIC]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [ENTITY_TYPES.VEDIC]: 'bg-orange-100 text-orange-800 border-orange-200',
    [ENTITY_TYPES.ELEMENT]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    [ENTITY_TYPES.COLOR]: 'bg-violet-100 text-violet-800 border-violet-200',
    [ENTITY_TYPES.PROFESSION]: 'bg-slate-100 text-slate-800 border-slate-200',
  };
  return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function getEntityTypeLabel(type) {
  const labels = {
    [ENTITY_TYPES.RELIGION]: 'Religion',
    [ENTITY_TYPES.ORIGIN]: 'Origin',
    [ENTITY_TYPES.LANGUAGE]: 'Language',
    [ENTITY_TYPES.COUNTRY]: 'Country',
    [ENTITY_TYPES.THEME]: 'Theme',
    [ENTITY_TYPES.MEANING]: 'Meaning',
    [ENTITY_TYPES.CULTURE]: 'Culture',
    [ENTITY_TYPES.ERA]: 'Era',
    [ENTITY_TYPES.VIRTUE]: 'Virtue',
    [ENTITY_TYPES.NATURE]: 'Nature',
    [ENTITY_TYPES.FLOWER]: 'Flower',
    [ENTITY_TYPES.ANIMAL]: 'Animal',
    [ENTITY_TYPES.ROYAL]: 'Royal',
    [ENTITY_TYPES.BIBLICAL]: 'Biblical',
    [ENTITY_TYPES.QURANIC]: 'Quranic',
    [ENTITY_TYPES.VEDIC]: 'Vedic',
    [ENTITY_TYPES.ELEMENT]: 'Element',
    [ENTITY_TYPES.COLOR]: 'Color',
    [ENTITY_TYPES.PROFESSION]: 'Profession',
    [ENTITY_TYPES.PERSONALITY]: 'Personality',
    [ENTITY_TYPES.NUMEROLOGY]: 'Numerology',
  };
  return labels[type] || 'Entity';
}

export default function KnowledgeGraph({ data, religion }) {
  // Derive entity connections from the name data
  const connectedEntities = useMemo(() => {
    const entities = [];
    const seen = new Set();

    // Religion entity
    if (religion) {
      const religionKey = religion === 'islamic' ? 'islam' : religion === 'christian' ? 'christianity' : religion === 'hindu' ? 'hinduism' : null;
      if (religionKey && ENTITY_RELATIONSHIPS[religionKey] && !seen.has(religionKey)) {
        seen.add(religionKey);
        entities.push({ key: religionKey, ...ENTITY_RELATIONSHIPS[religionKey] });
      }
    }

    // Origin entity
    if (data.origin) {
      const originKey = data.origin.toLowerCase().replace(/\s+/g, '-');
      if (ENTITY_RELATIONSHIPS[originKey] && !seen.has(originKey)) {
        seen.add(originKey);
        entities.push({ key: originKey, ...ENTITY_RELATIONSHIPS[originKey] });
      }
    }

    // Language entities
    const languageKeys = ['arabic', 'hebrew', 'sanskrit', 'greek', 'latin', 'persian', 'turkish', 'urdu', 'english'];
    languageKeys.forEach(key => {
      if (ENTITY_RELATIONSHIPS[key] && !seen.has(key)) {
        // Check if the name data has this language
        const langField = `in_${key}`;
        if (data[langField]?.name || data[langField]?.meaning) {
          seen.add(key);
          entities.push({ key, ...ENTITY_RELATIONSHIPS[key] });
        }
      }
    });

    // Meaning entities
    if (data.short_meaning || data.meaning) {
      const meaningText = (data.short_meaning || data.meaning || '').toLowerCase();
      const meaningKeys = ['strength', 'love', 'peace', 'wisdom', 'beauty', 'grace', 'gift', 'light', 'hope', 'faith', 'joy', 'power', 'king', 'queen', 'warrior', 'protector', 'blessing', 'star', 'moon', 'sun', 'river', 'mountain', 'garden', 'heaven', 'praiseworthy'];
      meaningKeys.forEach(key => {
        if (meaningText.includes(key) && ENTITY_RELATIONSHIPS[key] && !seen.has(key)) {
          seen.add(key);
          entities.push({ key, ...ENTITY_RELATIONSHIPS[key] });
        }
      });
    }

    // Country entities based on origin
    const countryMap = {
      'arabic': ['saudi-arabia', 'egypt', 'uae'],
      'persian': ['iran'],
      'turkish': ['turkey'],
      'urdu': ['pakistan'],
      'sanskrit': ['india'],
      'english': ['united-states', 'united-kingdom'],
    };
    if (data.origin) {
      const originLower = data.origin.toLowerCase();
      const countryKeys = countryMap[originLower] || [];
      countryKeys.forEach(key => {
        if (ENTITY_RELATIONSHIPS[key] && !seen.has(key)) {
          seen.add(key);
          entities.push({ key, ...ENTITY_RELATIONSHIPS[key] });
        }
      });
    }

    // Sacred text entities
    if (religion === 'islamic' && !seen.has('quran')) {
      seen.add('quran');
      entities.push({ key: 'quran', ...ENTITY_RELATIONSHIPS.quran });
    }
    if (religion === 'christian' && !seen.has('bible')) {
      seen.add('bible');
      entities.push({ key: 'bible', ...ENTITY_RELATIONSHIPS.bible });
    }
    if (religion === 'hindu' && !seen.has('veda')) {
      seen.add('veda');
      entities.push({ key: 'veda', ...ENTITY_RELATIONSHIPS.veda });
    }

    // Cultural entities
    const cultureKey = religion === 'islamic' ? 'islamic-culture' : religion === 'christian' ? 'christian-culture' : religion === 'hindu' ? 'hindu-culture' : null;
    if (cultureKey && ENTITY_RELATIONSHIPS[cultureKey] && !seen.has(cultureKey)) {
      seen.add(cultureKey);
      entities.push({ key: cultureKey, ...ENTITY_RELATIONSHIPS[cultureKey] });
    }

    return entities.slice(0, 12);
  }, [data, religion]);

  if (connectedEntities.length === 0) return null;

  return (
    <section className="nv-card-solid">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Network className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Knowledge Graph</h2>
          <p className="text-sm text-slate-500">Connected entities and semantic relationships</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {connectedEntities.map((entity) => {
          const colorClass = getEntityColor(entity.type);
          const typeLabel = getEntityTypeLabel(entity.type);
          const IconComponent = getEntityIcon(entity.type);

          const label = typeof entity.label === 'string' ? entity.label : String(entity.label || '');
          const description = typeof entity.description === 'string' ? entity.description : String(entity.description || '');
          const href = typeof entity.url === 'string' ? entity.url : '#';

          if (!label) return null;

          return (
            <Link
              key={entity.key}
              href={href}
              className={`rounded-xl border p-4 transition-all hover:shadow-md ${colorClass}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60">
                  {typeof IconComponent === 'function' ? (
                    <IconComponent className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{String(IconComponent || '')}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">
                      {typeLabel}
                    </span>
                  </div>
                  <span className="block text-sm font-semibold mt-0.5 truncate">
                    {label}
                  </span>
                  <span className="block text-xs mt-1 opacity-75 line-clamp-2">
                    {description}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <Link
          href="/names-by-meaning"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <Network className="h-4 w-4" />
          Explore the complete name knowledge graph
        </Link>
      </div>
    </section>
  );
}