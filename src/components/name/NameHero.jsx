import ShareButtons from './ShareButtons';
import { Volume2, Globe, Star, Hash, Calendar, BookOpen } from 'lucide-react';

function cleanText(text = '') {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function getReligionLabel(religion) {
  if (religion === 'islamic') return 'Islamic';
  if (religion === 'christian') return 'Christian';
  if (religion === 'hindu') return 'Hindu';
  return cleanText(religion);
}

function getGenderLabel(gender) {
  const value = cleanText(gender).toLowerCase();
  if (value.includes('male')) return 'Male';
  if (value.includes('female')) return 'Female';
  if (value.includes('unisex') || value.includes('neutral')) return 'Unisex';
  return cleanText(gender) || 'Unisex';
}

function getLanguages(data) {
  const languages = Array.isArray(data.language) ? data.language.map(cleanText).filter(Boolean) : [];
  const translationKeys = {
    in_arabic: 'Arabic',
    in_urdu: 'Urdu',
    in_hindi: 'Hindi',
    in_sanskrit: 'Sanskrit',
    in_english: 'English',
    in_hebrew: 'Hebrew',
    in_greek: 'Greek',
    in_latin: 'Latin',
    in_pashto: 'Pashto',
    in_tamil: 'Tamil',
    in_telugu: 'Telugu',
    in_marathi: 'Marathi',
    in_bengali: 'Bengali',
    in_punjabi: 'Punjabi',
    in_turkish: 'Turkish',
    in_persian: 'Persian',
    in_malay: 'Malay',
    in_indonesian: 'Indonesian',
    in_french: 'French',
    in_spanish: 'Spanish',
    in_german: 'German',
    in_italian: 'Italian',
    in_chinese: 'Chinese',
    in_japanese: 'Japanese',
    in_korean: 'Korean',
    in_russian: 'Russian',
  };

  Object.entries(translationKeys).forEach(([key, label]) => {
    if (data[key]?.name || data[key]?.meaning) languages.push(label);
  });

  return Array.from(new Set(languages));
}

const statItems = (data) => [
  (data.lucky_number || data.luckyNumber) && { label: 'Lucky Number', value: data.lucky_number || data.luckyNumber, icon: Hash },
  data.lucky_day && { label: 'Lucky Day', value: data.lucky_day, icon: Calendar },
  data.origin && { label: 'Origin', value: data.origin, icon: Globe },
  data.gender && { label: 'Gender', value: getGenderLabel(data.gender), icon: Star },
].filter(Boolean);

export default function NameHero({ data, pageUrl }) {
  const religion = cleanText(data.religion || 'islamic').toLowerCase();
  const religionDisplay = getReligionLabel(religion);
  const genderDisplay = getGenderLabel(data.gender);
  const subtitleMeaning = data.short_meaning || data.meaning || 'Meaningful cultural name';
  const pronunciation = data.pronunciation?.english || data.pronunciation?.ipa || '';
  const languages = getLanguages(data);
  const h1Label = [religionDisplay, genderDisplay, data.origin].filter(Boolean).join(' ');

  const infoItems = [
    { label: 'Name', value: data.name },
    { label: 'Meaning', value: subtitleMeaning },
    { label: 'Origin', value: data.origin },
    { label: 'Religion', value: religionDisplay },
    { label: 'Language', value: languages.length ? languages.join(', ') : 'Not listed' },
    { label: 'Gender', value: genderDisplay },
    { label: 'Pronunciation', value: pronunciation || 'Not listed' },
    { label: 'Lucky Number', value: data.lucky_number || data.luckyNumber || 'Not listed' },
  ].filter(item => cleanText(item.value));

  return (
    <section className="nv-card relative overflow-hidden p-6 sm:p-8" aria-label={`${data.name} name meaning, origin, pronunciation and lucky number`}>
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(14,165,164,0.20),transparent_42%),radial-gradient(circle_at_80%_30%,rgba(79,70,229,0.18),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.20),transparent_46%)]" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            <BookOpen className="h-4 w-4" /> NameVerse — Name Meaning & Origin Guides
          </div>
          <h1 className="nv-h1 mt-4">
            {data.name}
            {h1Label && (
              <span className="block text-base sm:text-lg font-normal text-slate-500 mt-1">
                {h1Label} name meaning
              </span>
            )}
          </h1>
          <p className="nv-lead mt-3 max-w-2xl">{subtitleMeaning}</p>
          {pronunciation && (
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
              <Volume2 className="h-4 w-4" />
              <span className="font-medium text-slate-700">Pronunciation: {pronunciation}</span>
            </p>
          )}
        </div>

        <div className="nv-card-solid w-full p-4 sm:p-5 lg:w-[360px] lg:sticky lg:top-24">
          <ShareButtons
            name={data.name}
            pageUrl={pageUrl}
            description={`${data.name} name meaning, ${data.origin || 'origin'}, pronunciation, lucky number and ${religionDisplay.toLowerCase()} context.`}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {infoItems.map((item) => (
          <div key={item.label} className="nv-card-solid p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
            <div className="mt-1 text-base font-semibold text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      {statItems(data).length > 0 ? (
        <div className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="relative mt-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">

          </div>
          <div className="flex-1 min-w-0">

          </div>
        </div>
      </div>
    </section>
  );
}
