import Link from 'next/link';
import { Suspense } from 'react';
import { BookOpen, Search, Sparkles, Moon, ChevronRight, Star, Quote, Heart } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import AdBanner from '@/components/Ads/AdBanner';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Baby Name Meanings — Complete Guide | NameVerse'),
  description: validateMetaDescription(
    'Discover comprehensive guide to baby name meanings. Explore Islamic, Hindu, and Christian names with etymology, origin, and spiritual significance across 60,000+ verified names.'
  ),
  keywords: [
    'name meanings',
    'baby name meanings',
    'meaning of names',
    'name etymology',
    'what does my name mean',
    'name meaning search',
    'spiritual name meanings',
    'biblical name meanings',
    'quranic name meanings',
    'sanskrit name meanings'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Baby Name Meanings — Complete Guide | NameVerse'),
    description: validateMetaDescription(
      'Explore thousands of baby names with detailed meanings, origins, and spiritual significance. Find the perfect meaningful name from Islamic, Hindu, and Christian traditions.'
    ),
    url: `${getSiteUrl()}/name-meanings`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-name-meanings.png`,
        width: 1200,
        height: 630,
        alt: 'Baby Name Meanings Guide - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/name-meanings`,
    languages: { en: `${getSiteUrl()}/name-meanings`, 'x-default': `${getSiteUrl()}/name-meanings` }
  },
  robots: { index: true, follow: true }
};

const meaningExamples = [
  {
    category: 'Names That Mean Love',
    icon: Heart,
    color: 'pink',
    names: [
      { name: 'Amina', meaning: 'Trustworthy, faithful', origin: 'Arabic', religion: 'islamic' },
      { name: 'Priya', meaning: 'Beloved, loved one', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Agape', meaning: 'Highest form of love', origin: 'Greek', religion: 'christian' },
      { name: 'Mila', meaning: 'Gracious, dear', origin: 'Slavic', religion: 'christian' }
    ]
  },
  {
    category: 'Names That Mean Strength',
    icon: Sparkles,
    color: 'indigo',
    names: [
      { name: 'Omar', meaning: 'Long-lived, prosperous', origin: 'Arabic', religion: 'islamic' },
      { name: 'Veer', meaning: 'Brave, hero', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Gabriel', meaning: 'God is my strength', origin: 'Hebrew', religion: 'christian' },
      { name: 'Valor', meaning: 'Courage, bravery', origin: 'Latin', religion: 'christian' }
    ]
  },
  {
    category: 'Names That Mean Wisdom',
    icon: Moon,
    color: 'purple',
    names: [
      { name: 'Hikmah', meaning: 'Wisdom, knowledge', origin: 'Arabic', religion: 'islamic' },
      { name: 'Vidya', meaning: 'Knowledge, wisdom', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Solomon', meaning: 'Peaceful, wise', origin: 'Hebrew', religion: 'christian' },
      { name: 'Sophia', meaning: 'Wisdom', origin: 'Greek', religion: 'christian' }
    ]
  },
  {
    category: 'Names That Mean Peace',
    icon: Star,
    color: 'blue',
    names: [
      { name: 'Salaam', meaning: 'Peace, safety', origin: 'Arabic', religion: 'islamic' },
      { name: 'Shanti', meaning: 'Peace, tranquility', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Solomon', meaning: 'Peaceful', origin: 'Hebrew', religion: 'christian' },
      { name: 'Frederick', meaning: 'Peaceful ruler', origin: 'German', religion: 'christian' }
    ]
  }
];

const religionMeanings = [
  {
    title: 'Islamic Names (Urdu/Arabic)',
    description: 'Islamic names are deeply rooted in the Quran and Hadith, carrying spiritual significance and blessings. Names often reflect the 99 names of Allah (Asmaul Husna) or positive attributes praised in Islam. Each name is carefully chosen to inspire goodness and righteousness in the child\'s character.',
    examples: [
      { name: 'Abdullah', meaning: 'Servant of Allah', significance: 'Highest spiritual status' },
      { name: 'Aisha', meaning: 'Living, prosperous', significance: 'Named after Prophet\'s wife' },
      { name: 'Yusuf', meaning: 'God will add', significance: 'Patience and perseverance' },
      { name: 'Maryam', meaning: 'Drop of the sea', significance: 'Purity and devotion' }
    ]
  },
  {
    title: 'Hindu Names (Sanskrit/Hindi)',
    description: 'Hindu names are derived from ancient Sanskrit texts, Vedic scriptures, and Hindu mythology. These names connect children to cosmic energies, deities, and philosophical concepts. Each name carries vibrational frequencies believed to influence the child\'s personality and life path according to Vedic astrology.',
    examples: [
      { name: 'Aarav', meaning: 'Peaceful, calm', significance: 'Vedic sound of tranquility' },
      { name: 'Diya', meaning: 'Lamp, light', significance: 'Divine illumination' },
      { name: 'Krishna', meaning: 'Dark, attractive', significance: 'Eighth avatar of Vishnu' },
      { name: 'Priya', meaning: 'Beloved', significance: 'Spiritual love and devotion' }
    ]
  },
  {
    title: 'Christian Names (Biblical/Greek/Latin)',
    description: 'Christian names draw from the Bible, honoring biblical figures, saints, and Christian virtues. These names connect children to salvation history and the communion of saints. Many names carry meanings related to faith, hope, love, and divine attributes revealed through scripture.',
    examples: [
      { name: 'Grace', meaning: 'God\'s unmerited favor', significance: 'Central Christian virtue' },
      { name: 'Elijah', meaning: 'My God is Yahweh', significance: 'Prophet of Israel' },
      { name: 'Faith', meaning: 'Trust and belief', significance: 'One of three theological virtues' },
      { name: 'Gabriel', meaning: 'God is my strength', significance: 'Archangel messenger' }
    ]
  }
];

export default async function NameMeaningsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-xl shadow-violet-500/20">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Baby Name Meanings — Complete Guide
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover comprehensive name meanings for 60,000+ Islamic, Hindu, and Christian names. 
                Explore etymology, origin, and spiritual significance to find the perfect meaningful name 
                that reflects your values and heritage.
              </p>
            </div>
          </div>
        </section>

        {/* How Name Meanings Work */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              How Name Meanings Work
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Etymology & Linguistics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Name meanings are derived from root languages—Arabic, Sanskrit, Hebrew, Greek, and Latin. 
                  Understanding the linguistic origins helps reveal the true essence and cultural context of each name.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Spiritual Significance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Across cultures, names carry spiritual weight. Islamic names reference Allah\'s attributes, 
                  Hindu names connect to cosmic energies, and Christian names honor biblical virtues and figures.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Moon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cultural Context</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names reflect cultural heritage and family traditions. The same name may have different meanings 
                  or pronunciations across cultures, making cultural context essential for accurate understanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meanings by Religion */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-violet-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Meanings by Religion
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {religionMeanings.map((religion, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{religion.title}</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed">{religion.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {religion.examples.map((example, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900">{example.name}</h4>
                            <p className="text-sm text-indigo-600 font-medium">{example.meaning}</p>
                            <p className="text-xs text-gray-500 mt-1">{example.significance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/names/religion/${index === 0 ? 'islamic' : index === 1 ? 'hindu' : 'christian'}/1`}
                      className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Explore more {index === 0 ? 'Islamic' : index === 1 ? 'Hindu' : 'Christian'} names
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Name Meanings by Category */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Popular Name Meanings by Category
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {meaningExamples.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {category.names.map((name, idx) => (
<Link
                         key={idx}
                         href={/names/religion/islamic/1}
                         className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {name.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{name.meaning}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/names/search"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Search Names by Meaning
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Choosing Meaningful Names Guide */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-50 to-indigo-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              How to Choose a Name with Meaning
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                  <Quote className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Reflect on Your Values</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Consider what qualities and virtues you hope your child will embody. Names meaning love, strength, 
                  wisdom, or peace can serve as daily inspiration throughout their life.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Honor Your Heritage</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Choose names that connect to your cultural or religious background. This creates a strong sense 
                  of identity and belonging for your child while honoring family traditions.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Moon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Consider the Sound & Flow</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A meaningful name should also sound beautiful with your surname. Say it aloud, consider 
                  pronunciation, and imagine how it will be written throughout your child\'s life.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Quick Tips for Finding Meaningful Names
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Start with virtues that matter most to you</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-violet-600 font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-600">Research cultural and religious significance</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-600">Check meanings in multiple languages</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-indigo-600 font-bold">4</span>
                  </div>
                  <p className="text-sm text-gray-600">Test the name with your surname</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdBanner />

        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Name Meaning FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Why are name meanings important?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Name meanings carry cultural, spiritual, and personal significance. They can reflect family values, 
                  religious beliefs, and aspirations for a child\'s character. Many parents choose names with positive 
                  meanings to inspire their children throughout life.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How accurate are name meanings on NameVerse?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our meanings are verified by cultural scholars and linguistic experts. We cross-reference multiple 
                  authoritative sources including religious texts, historical records, and etymological databases 
                  to ensure accuracy and cultural sensitivity.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can the same name have different meanings?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! Names often have different meanings across cultures and languages. For example, 
                  'Amina' means 'trustworthy' in Arabic but has different meanings in other cultures. 
                  We always specify the origin to provide accurate context.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do spiritual meanings influence naming?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  In many traditions, names are believed to influence character and destiny. Islamic names 
                  honor Allah\'s attributes, Hindu names align with cosmic energies, and Christian names 
                  reflect biblical virtues and divine connections.
                </p>
              </div>
            </div>

            {/* FAQ Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Why are name meanings important?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Name meanings carry cultural, spiritual, and personal significance. They reflect family values, religious beliefs, and aspirations for a child\'s character, inspiring them throughout life.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Can the same name have different meanings?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! Names often have different meanings across cultures and languages. For example, Amina means trustworthy in Arabic but has different meanings in other cultures.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How do spiritual meanings influence naming?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'In many traditions, names are believed to influence character and destiny. Islamic names honor Allah\'s attributes, Hindu names align with cosmic energies, and Christian names reflect biblical virtues.'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Find Names with Beautiful Meanings
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Explore our database of 60,000+ verified names with detailed meanings, origins, and cultural significance. 
              Find the perfect name that reflects your values and heritage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/name-meanings"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Name Meanings
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-bold text-lg hover:bg-indigo-400 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
              >
                Browse All Names
              </Link>
            </div>
          </div>
        </section>
      </SitePage>
    </Suspense>
  );
}
