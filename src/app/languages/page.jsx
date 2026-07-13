import Link from 'next/link';
import { Suspense } from 'react';
import { Globe, Sparkles, Star, BookOpen, ChevronRight, Moon, Quote } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 31536000; // 365 days

export const metadata = {
  title: validateMetaTitle('Baby Names by Language — Multilingual Name Guide | NameVerse'),
  description: validateMetaDescription(
    'Explore baby names by language: Urdu, Arabic, Hindi, Sanskrit, Hebrew, and Greek. Discover 60,000+ multilingual names with meanings and cultural context from NameVerse.'
  ),
  keywords: [
    'Urdu baby names',
    'Arabic name meanings',
    'Hindi baby names',
    'multilingual names',
    'language-specific names',
    'Sanskrit names',
    'Hebrew names',
    'Greek names',
    'baby names by language',
    'Urdu names meaning'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Baby Names by Language — Multilingual Name Guide | NameVerse'),
    description: validateMetaDescription(
      'Discover beautiful baby names from different languages including Urdu, Arabic, Hindi, Sanskrit, Hebrew, and Greek with detailed meanings and cultural significance.'
    ),
    url: `${getSiteUrl()}/languages`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-languages.png`,
        width: 1200,
        height: 630,
        alt: 'Baby Names by Language - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/languages`,
    languages: { en: `${getSiteUrl()}/languages`, 'x-default': `${getSiteUrl()}/languages` }
  },
  robots: { index: true, follow: true }
};

const languageCategories = [
  {
    title: 'Urdu Baby Names',
    description: 'Beautiful Urdu names with deep meanings and poetic elegance. Urdu names combine Persian, Arabic, and Turkic influences, creating names that flow melodically and carry profound significance.',
    names: [
      { name: 'Zainab', meaning: 'Fragrant flower', gender: 'female' },
      { name: 'Ayaan', meaning: 'Gift of God', gender: 'male' },
      { name: 'Iman', meaning: 'Faith, belief', gender: 'unisex' },
      { name: 'Zara', meaning: 'Princess, flower', gender: 'female' }
    ],
    totalNames: 15000,
    color: 'purple',
    icon: Globe
  },
  {
    title: 'Arabic Baby Names',
    description: 'Classic Arabic names rooted in the Quran and Islamic tradition. These names honor the 99 names of Allah and reflect virtues like mercy, wisdom, and strength that are central to Islamic values.',
    names: [
      { name: 'Muhammad', meaning: 'Praised, commendable', gender: 'male' },
      { name: 'Fatima', meaning: 'Captivating, one who abstains', gender: 'female' },
      { name: 'Omar', meaning: 'Long-lived, prosperous', gender: 'male' },
      { name: 'Layla', meaning: 'Night, dark beauty', gender: 'female' }
    ],
    totalNames: 25000,
    color: 'indigo',
    icon: BookOpen
  },
  {
    title: 'Hindi & Sanskrit Names',
    description: 'Ancient Sanskrit names connecting children to Vedic wisdom and Hindu mythology. These names draw from sacred texts and cosmic energies, each carrying vibrational frequencies believed to influence destiny.',
    names: [
      { name: 'Aarav', meaning: 'Peaceful, calm', gender: 'male' },
      { name: 'Diya', meaning: 'Light, lamp', gender: 'female' },
      { name: 'Karan', meaning: 'Intelligent, clever', gender: 'male' },
      { name: 'Saanvi', meaning: 'Goddess Lakshmi', gender: 'female' }
    ],
    totalNames: 20000,
    color: 'orange',
    icon: Sparkles
  },
  {
    title: 'Hebrew Names',
    description: 'Timeless Hebrew names from the Old Testament and Jewish tradition. These names connect to biblical stories of faith, hope, and divine purpose, carrying meanings that have inspired generations.',
    names: [
      { name: 'Elijah', meaning: 'My God is Yahweh', gender: 'male' },
      { name: 'Sarah', meaning: 'Princess, noblewoman', gender: 'female' },
      { name: 'Noah', meaning: 'Rest, comfort', gender: 'male' },
      { name: 'Rachel', meaning: 'Ewe, gentle one', gender: 'female' }
    ],
    totalNames: 8000,
    color: 'green',
    icon: Moon
  },
  {
    title: 'Greek Names',
    description: 'Elegant Greek names from classical antiquity and early Christian tradition. These names embody philosophy, mythology, and the rich cultural heritage of ancient Greece and the Byzantine Empire.',
    names: [
      { name: 'Sophia', meaning: 'Wisdom', gender: 'female' },
      { name: 'Alexander', meaning: 'Defender of mankind', gender: 'male' },
      { name: 'Theodore', meaning: 'Gift of God', gender: 'male' },
      { name: 'Chloe', meaning: 'Blooming, green shoot', gender: 'female' }
    ],
    totalNames: 5000,
    color: 'blue',
    icon: Star
  },
  {
    title: 'Other Languages',
    description: 'Names from diverse cultures including Persian, Turkish, Celtic, Norse, and Native American traditions. Explore unique names that celebrate global diversity and multicultural heritage.',
    names: [
      { name: 'Aiden', meaning: 'Little fire', gender: 'male', origin: 'Irish' },
      { name: 'Luna', meaning: 'Moon', gender: 'female', origin: 'Latin' },
      { name: 'Kai', meaning: 'Sea', gender: 'unisex', origin: 'Hawaiian' },
      { name: 'Zuri', meaning: 'Beautiful', gender: 'female', origin: 'Swahili' }
    ],
    totalNames: 12000,
    color: 'pink',
    icon: Globe
  }
];

const languageInsights = [
  {
    title: 'The Power of Original Language',
    content: 'Names carry their deepest meaning in their original language. For example, the Arabic name "Yusuf" carries nuances of patience and divine blessing that transcend simple translation. Understanding the original pronunciation and cultural context enriches the name\'s significance.'
  },
  {
    title: 'Cross-Cultural Adaptations',
    content: 'Many names travel across cultures, adapting to new languages while retaining core meanings. "Maryam" becomes "Mary" in English and "Maria" in Spanish, yet all honor the same biblical figure. These variations reflect the beautiful interconnectedness of human cultures.'
  },
  {
    title: 'Pronunciation Matters',
    content: 'Correct pronunciation honors the name\'s cultural origin and preserves its intended sound and rhythm. Language-specific names often have unique phonetic qualities that contribute to their meaning. For example, Sanskrit names use specific tongue positions believed to create positive vibrations.'
  }
];

export default async function LanguagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-cyan-600 to-teal-600 p-4 rounded-2xl shadow-xl shadow-cyan-500/20">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Baby Names by Language — Multilingual Name Guide
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore beautiful baby names from different languages including Urdu, Arabic, Hindi, Sanskrit, 
                Hebrew, and Greek. Discover 60,000+ multilingual names with detailed meanings and rich cultural 
                significance from around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Language Categories */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Explore Names by Language
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {languageCategories.map((lang, index) => {
                const Icon = lang.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`bg-gradient-to-r from-${lang.color}-500 to-${lang.color}-600 p-6 text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          {lang.totalNames.toLocaleString()} names
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{lang.title}</h3>
                      <p className="text-sm opacity-90 leading-relaxed">{lang.description}</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {lang.names.map((name, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                            <p className="font-bold text-gray-900">{name.name}</p>
                            <p className="text-sm text-gray-600">{name.meaning}</p>
                            {name.gender && (
                              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                                name.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                                name.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {name.gender}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <Link
                        href={`/names/religion/${index === 0 ? 'islamic' : index === 1 ? 'islamic' : index === 2 ? 'hindu' : 'christian'}/1`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Explore all {lang.title.split(' ')[0]} names
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Language Insights */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50 to-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Understanding Multilingual Names
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {languageInsights.map((insight, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Quote className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{insight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Popular Names by Language */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Most Popular Names by Language
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="pb-4 font-semibold text-gray-900">Language</th>
                    <th className="pb-4 font-semibold text-gray-900">Top Boy Names</th>
                    <th className="pb-4 font-semibold text-gray-900">Top Girl Names</th>
                    <th className="pb-4 font-semibold text-gray-900">Total Names</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">
                      <span className="font-medium">Arabic/Urdu</span>
                    </td>
                    <td className="py-4 text-gray-600">Muhammad, Ali, Omar, Yusuf</td>
                    <td className="py-4 text-gray-600">Fatima, Aisha, Maryam, Khadija</td>
                    <td className="py-4 font-semibold">40,000+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">
                      <span className="font-medium">Sanskrit/Hindi</span>
                    </td>
                    <td className="py-4 text-gray-600">Aarav, Vihaan, Arjun, Krish</td>
                    <td className="py-4 text-gray-600">Ananya, Priya, Diya, Saanvi</td>
                    <td className="py-4 font-semibold">20,000+</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4">
                      <span className="font-medium">Hebrew/Greek</span>
                    </td>
                    <td className="py-4 text-gray-600">Noah, Elijah, David, Jacob</td>
                    <td className="py-4 text-gray-600">Sophia, Emma, Olivia, Sarah</td>
                    <td className="py-4 font-semibold">13,000+</td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <span className="font-medium">Multicultural</span>
                    </td>
                    <td className="py-4 text-gray-600">James, Alexander, Michael, Ethan</td>
                    <td className="py-4 text-gray-600">Chloe, Luna, Aurora, Maya</td>
                    <td className="py-4 font-semibold">12,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Language Insights */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50 to-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Understanding Multilingual Names
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {languageInsights.map((insight, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                    <Quote className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{insight.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pronunciation Guide */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Pronunciation Guide for Multilingual Names
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Why Pronunciation Matters
                </h3>
                <p className="text-indigo-800 text-sm leading-relaxed mb-4">
                  Correct pronunciation honors the name's cultural origin and preserves its intended sound and rhythm. 
                  Language-specific names often have unique phonetic qualities that contribute to their meaning. 
                  For example, Sanskrit names use specific tongue positions believed to create positive vibrations.
                </p>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-indigo-700 text-sm font-medium">Tip: When in doubt, ask native speakers or use online pronunciation guides to ensure you honor the name's cultural heritage.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100">
                <h3 className="text-lg font-bold text-cyan-900 mb-4 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-cyan-600" />
                  Original vs. Localized Pronunciation
                </h3>
                <p className="text-cyan-800 text-sm leading-relaxed mb-4">
                  Many families choose to honor the original pronunciation as a way to preserve cultural heritage. 
                  However, localized pronunciations are also common and acceptable. The key is finding a balance 
                  that feels right for your family and community while respecting the name's roots.
                </p>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-cyan-700 text-sm font-medium">Example: "Maryam" (Arabic) can be pronounced as Mary-ahm, Muh-ry-am, or Mar-yam depending on cultural context.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-purple-50 to-fuchsia-50/30 rounded-2xl shadow-lg border border-purple-100 p-8">
              <h3 className="text-xl font-bold text-purple-900 mb-6 text-center">Common Pronunciation Challenges</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold text-lg">A</span>
                  </div>
                  <p className="text-purple-800 text-sm font-medium">Arabic Names</p>
                  <p className="text-purple-600 text-xs mt-1">Emphasis on throat sounds and vowel length</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-fuchsia-600 font-bold text-lg">S</span>
                  </div>
                  <p className="text-fuchsia-800 text-sm font-medium">Sanskrit Names</p>
                  <p className="text-fuchsia-600 text-xs mt-1">Retroflex consonants and specific tongue positions</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-cyan-600 font-bold text-lg">H</span>
                  </div>
                  <p className="text-cyan-800 text-sm font-medium">Hebrew Names</p>
                  <p className="text-cyan-600 text-xs mt-1">Guttural sounds like 'ch' (ח) and 'kh' (כ)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-50 to-teal-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Language-Specific Names FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Are language-specific names harder to pronounce?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  It depends on the language and your community. Arabic and Sanskrit names may require practice, 
                  but many parents find that people quickly learn to pronounce their child\'s name correctly. 
                  Consider providing a phonetic spelling when introducing the name.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Should I use the original language pronunciation?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Many families choose to honor the original pronunciation as a way to preserve cultural heritage. 
                  However, localized pronunciations are also common and acceptable. Consider what feels right 
                  for your family and community.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can non-native speakers use these names?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Absolutely! Many parents choose names from languages other than their own. The key is to 
                  understand and respect the name\'s meaning and cultural significance, and to learn proper 
                  pronunciation to honor its origin.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Which language has the most baby names?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Arabic/Urdu has the largest collection with over 40,000 names, followed by Sanskrit/Hindi 
                  with 20,000+ names. This reflects the rich naming traditions and linguistic diversity of 
                  these cultures.
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
                      name: 'Are language-specific names harder to pronounce?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'It depends on the language and your community. Arabic and Sanskrit names may require practice, but many parents find that people quickly learn to pronounce their child\'s name correctly.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Can non-native speakers use these names?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Absolutely! Many parents choose names from languages other than their own. The key is to understand and respect the name\'s meaning and cultural significance.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Which language has the most baby names?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Arabic/Urdu has the largest collection with over 40,000 names, followed by Sanskrit/Hindi with 20,000+ names.'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-teal-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Discover Names from Around the World
            </h2>
            <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">
              Explore 60,000+ verified baby names from Urdu, Arabic, Hindi, Sanskrit, Hebrew, Greek, and 
              many more languages. Find the perfect multicultural name that honors your heritage or embraces 
              global diversity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/languages"
                className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore by Language
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-cyan-500 text-white rounded-xl font-bold text-lg hover:bg-cyan-400 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
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
