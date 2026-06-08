import ShareButtons from './ShareButtons';
import AdBanner from '@/components/Ads/AdBanner';
import { Crown, Volume2, Globe, Star, Hash, Calendar, BookOpen, Languages } from 'lucide-react';

const statItems = (data) => [
  data.lucky_number && { label: 'Numerological Association', value: data.lucky_number, icon: Hash },
  data.lucky_day && { label: 'Cultural Day Association', value: data.lucky_day, icon: Calendar },
  data.origin && { label: 'Linguistic Origin', value: data.origin, icon: Globe },
  data.gender && { label: 'Gender Classification', value: data.gender, icon: Star },
].filter(Boolean);

export default function NameHero({ data, pageUrl }) {
  const subtitle = data.short_meaning || data.meaning || 'Meaningful cultural context';
  const genderDisplay = data.gender === 'male' ? 'Masculine' : data.gender === 'female' ? 'Feminine' : '';
  const religionDisplay = data.religion === 'islamic' ? 'Islamic' :
                          data.religion === 'christian' ? 'Christian' :
                          data.religion === 'hindu' ? 'Hindu' :
                          (data.religion || '');
  const h1Label = [religionDisplay, genderDisplay].filter(Boolean).join(' ');
  const luckyNote = data.lucky_number ? ` · Numerological #${data.lucky_number}` : '';

  return (
    <section className="nv-card relative overflow-hidden p-6 sm:p-8" aria-label={`${data.name} — Linguistic Origin Analysis & Cultural Context`}>
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(14,165,164,0.20),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(79,70,229,0.18),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.20),transparent_46%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            <BookOpen className="h-4 w-4" /> NameVerse — Cultural Name Knowledge Base
          </div>
          <h1 className="nv-h1 mt-4">
            {data.name}
            {h1Label && (
              <span className="block text-base sm:text-lg font-normal text-slate-500 mt-1">
                {h1Label} — Linguistic Origin Analysis & Cultural Context{luckyNote}
              </span>
            )}
          </h1>
          <p className="nv-lead mt-3 max-w-2xl">{subtitle}</p>
          {data.pronunciation?.english && (
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium text-slate-700">Phonetic: {data.pronunciation.english}</span>
              {data.pronunciation?.ipa ? <span className="text-slate-500">IPA: {data.pronunciation.ipa}</span> : null}
            </p>
          )}
        </div>

        <div className="nv-card-solid w-full p-4 sm:p-5 lg:w-[360px] lg:sticky lg:top-24">
          <ShareButtons
            name={data.name}
            pageUrl={pageUrl}
            description={`Linguistic origin analysis and cultural semantic interpretation of ${data.name}.`}
          />
        </div>
      </div>

      {statItems(data).length > 0 ? (
        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statItems(data).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="nv-card-solid p-4 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-base font-semibold text-slate-900">{item.value}</div>
                <div className="mt-1 text-sm text-slate-500">{item.label}</div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ⚡ Fast-load ads in hero section — 2 banners side by side (above the fold) */}
      <div className="relative mt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <AdBanner variant="inline" />
          </div>
          <div className="flex-1 min-w-0">
            <AdBanner variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
}