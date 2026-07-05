import Link from 'next/link';
import { Suspense } from 'react';
import { Globe, Sparkles, BookOpen, Heart, ChevronRight, Moon, Sun } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Baby Names by Origin — Cultural & Linguistic Heritage | NameVerse'),
  description: validateMetaDescription(
    'Explore baby names by origin: Arabic, Urdu, Sanskrit, Hebrew, Greek, Persian, Turkish, and English. Discover 60,000+ names with their linguistic and cultural heritage.'
  ),
  keywords: [
    'baby names by origin',
    'Arabic baby names',
    'Sanskrit names',
    'Hebrew baby names',
    'Greek baby names',
    'Persian baby names',
    'Turkish baby names',
    'Urdu baby names',
    'cultural names',
    'linguistic origin names'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Baby Names by Origin — Cultural & Linguistic Heritage | NameVerse'),
    description: validateMetaDescription(
      'Discover beautiful baby names from their original languages: Arabic, Sanskrit, Hebrew, Greek, Persian, and more.'
    ),
    url: `${getSiteUrl()}/names-by-origin`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-names-by-origin.png`,
        width: 1200,
        height: 630,
        alt: 'Baby Names by Origin - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/names-by-origin`,
    languages: { en: `${getSiteUrl()}/names-by-origin`, 'x-default': `${getSiteUrl()}/names-by-origin` }
  },
  robots: { index: true, follow: true }
};

const originCategories = [
  {
    title: 'Arabic Names',
    description: 'Classic names from the Arabic language, deeply rooted in Islamic tradition and Quranic heritage. These names carry meanings of faith, virtue, and divine qualities.',
    names: ['Muhammad', 'Fatima', 'Omar', 'Zainab', 'Yusuf', 'Aisha', 'Ali', 'Khadija'],
    count: 25000,
    color: 'emerald',
    icon: Sun
  },
  {
    title: 'Sanskrit Names',
    description: 'Ancient Vedic names from Sanskrit, embodying spiritual wisdom and cosmic energies. Popular in Hindu traditions for their profound meanings.',
    names: ['Aarav', 'Saanvi', 'Arjun', 'Diya', 'Vihaan', 'Ananya', 'Krish', 'Isha'],
    count: 20000,
    color: 'orange',
    icon: Sparkles
  },
  {
    title: 'Hebrew Names',
    description: 'Biblical names from Hebrew, forming the foundation of Christian and Jewish naming traditions. These names connect to Old Testament figures.',
    names: ['Sarah', 'David', 'Moses', 'Rachel', 'Elijah', 'Isaac', 'Rebecca', 'Michael'],
    count: 8000,
    color: 'blue',
    icon: BookOpen
  },
  {
    title: 'Greek Names',
    description: 'Classical names from ancient Greece, many adopted into Christian saints and early church traditions. Known for their elegant sounds.',
    names: ['Sophia', 'Alexander', 'Theodore', 'Chloe', 'Lucas', 'Maria', 'Andrew', 'Helena'],
    count: 5000,
    color: 'purple',
    icon: Globe
  },
  {
    title: 'Persian Names',
    description: 'Names from Persian and Farsi linguistic traditions, popular in Islamic cultures. These names blend Arabic and Iranian influences.',
    names: ['Kian', 'Roxana', 'Darius', 'Soraya', 'Kamran', 'Laleh', 'Arash', 'Tara'],
    count: 3000,
    color: 'indigo',
    icon: Moon
  },
  {
    title: 'Turkish Names',
    description: 'Traditional Turkic names adopted into Islamic culture, with Ottoman and Central Asian influences.',
    names: ['Deniz', 'Berk', 'Elif', 'Can', 'Asli', 'Yusuf', 'Zeynep', 'Ahmet'],
    count: 2500,
    color: 'teal',
    icon: Heart
  }
];

export default async function NamesByOriginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-4 rounded-2xl shadow-xl shadow-emerald-500/20">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Baby Names by Origin — Cultural & Linguistic Heritage
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore 60,000+ baby names organized by their linguistic and cultural origins. 
                Discover names from Arabic, Sanskrit, Hebrew, Greek, Persian, and Turkish traditions.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Categories */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Explore Names by Origin
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {originCategories.map((origin, index) => {
                const Icon = origin.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className={`bg-gradient-to-r from-${origin.color}-500 to-${origin.color}-600 p-6 text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          {origin.count.toLocaleString()}+ names
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{origin.title}</h3>
                      <p className="text-sm opacity-90 leading-relaxed">{origin.description}</p>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {origin.names.map((name, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            {name}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/names/islamic/origin/${origin.title.toLowerCase().split(' ')[0]}/1`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Explore {origin.title} names
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-slate-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Names by Origin FAQ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Why does origin matter in baby naming?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A name's origin provides cultural and linguistic context. Understanding where a name comes from 
                  helps you appreciate its full meaning and significance, ensuring respectful usage.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I choose a name outside my culture?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes, many families choose names from different cultures. The key is understanding the meaning, 
                  pronunciation, and cultural significance to honor the name's heritage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Discover Names from Around the World
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              Explore 60,000+ verified baby names from Arabic, Sanskrit, Hebrew, Greek, Persian, and 
              Turkish origins. Find the perfect name that connects to cultural heritage.
            </p>
            <Link
              href="/names/religion/islamic/1"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Browse All Names
            </Link>
          </div>
        </section>
      </SitePage>
    </Suspense>
  );
}