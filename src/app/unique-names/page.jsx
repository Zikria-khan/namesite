import Link from 'next/link';
import { Suspense } from 'react';
import { Sparkles, Star, Moon, ChevronRight, Zap, Diamond, Gift, Globe } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Unique Baby Names — Rare & Uncommon Names | NameVerse'),
  description: validateMetaDescription(
    'Discover 15,000+ unique, rare, and uncommon baby names from around the world. Stand out with distinctive names that are memorable yet meaningful from NameVerse.'
  ),
  keywords: [
    'unique baby names',
    'rare baby names',
    'uncommon names',
    'distinctive names',
    'unusual baby names',
    'rare names',
    'unique name ideas',
    'uncommon baby names 2026',
    'rare gem names',
    'unique name search'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Unique Baby Names — Rare & Uncommon Names | NameVerse'),
    description: validateMetaDescription(
      'Find distinctive and rare baby names that stand out. Explore 15,000+ unique names from different cultures with meanings and origin details.'
    ),
    url: `${getSiteUrl()}/unique-names`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-unique-names.png`,
        width: 1200,
        height: 630,
        alt: 'Unique Baby Names - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/unique-names`,
    languages: { en: `${getSiteUrl()}/unique-names`, 'x-default': `${getSiteUrl()}/unique-names` }
  },
  robots: { index: true, follow: true }
};

const uniqueCategories = [
  {
    title: 'Rare Gem Names',
    description: 'Precious and semi-precious stone names that sparkle with uniqueness and elegance.',
    icon: Diamond,
    color: 'purple',
    names: [
      { name: 'Jade', meaning: 'Precious green stone', origin: 'Spanish', gender: 'unisex' },
      { name: 'Onyx', meaning: 'Black gemstone', origin: 'Greek', gender: 'male' },
      { name: 'Opal', meaning: 'Precious stone', origin: 'Sanskrit', gender: 'female' },
      { name: 'Topaz', meaning: 'Golden gem', origin: 'Greek', gender: 'unisex' }
    ],
    count: 1200
  },
  {
    title: 'Celestial Names',
    description: 'Names inspired by stars, planets, and cosmic phenomena for children destined to shine.',
    icon: Moon,
    color: 'indigo',
    names: [
      { name: 'Nova', meaning: 'New star', origin: 'Latin', gender: 'female' },
      { name: 'Orion', meaning: 'Hunter constellation', origin: 'Greek', gender: 'male' },
      { name: 'Lyra', meaning: 'Harp constellation', origin: 'Greek', gender: 'female' },
      { name: 'Cyrus', meaning: 'Sun', origin: 'Persian', gender: 'male' }
    ],
    count: 980
  },
  {
    title: 'Nature Mystique',
    description: 'Uncommon names drawn from the natural world with ethereal and mystical qualities.',
    icon: Sparkles,
    color: 'green',
    names: [
      { name: 'Sylvan', meaning: 'Of the forest', origin: 'Latin', gender: 'male' },
      { name: 'Elowen', meaning: 'Elm tree', origin: 'Cornish', gender: 'female' },
      { name: 'River', meaning: 'Flowing water', origin: 'English', gender: 'unisex' },
      { name: 'Zephyr', meaning: 'West wind', origin: 'Greek', gender: 'male' }
    ],
    count: 2500
  },
  {
    title: 'Mythological Treasures',
    description: 'Names from world mythology that carry ancient power and legendary significance.',
    icon: Gift,
    color: 'amber',
    names: [
      { name: 'Atlas', meaning: 'Bearer of the heavens', origin: 'Greek', gender: 'male' },
      { name: 'Calliope', meaning: 'Beautiful voice', origin: 'Greek', gender: 'female' },
      { name: 'Thalia', meaning: 'To blossom', origin: 'Greek', gender: 'female' },
      { name: 'Caspian', meaning: 'From the Caspian Sea', origin: 'Persian', gender: 'male' }
    ],
    count: 3200
  }
];

const rareNamesByOrigin = [
  {
    origin: 'Basque',
    names: ['Ander', 'Iker', 'Ane', 'Unai'],
    description: 'Ancient language of the Pyrenees region'
  },
  {
    origin: 'Welsh',
    names: ['Rhys', 'Saoirse', 'Eirlys', 'Taran'],
    description: 'Celtic names from Wales'
  },
  {
    origin: 'Icelandic',
    names: ['Bjorn', 'Sigrid', 'Leif', 'Astrid'],
    description: 'Nordic names from Iceland'
  },
  {
    origin: 'Maori',
    names: ['Aroha', 'Manaia', 'Tane', 'Whare'],
    description: 'Indigenous names from New Zealand'
  }
];

const uniquenessBenefits = [
  {
    title: 'Memorable Identity',
    description: 'Unique names help your child stand out and create a distinctive personal brand.',
    icon: Star
  },
  {
    title: 'Cultural Richness',
    description: 'Rare names often come from diverse cultures, broadening perspectives and celebrating heritage.',
    icon: Globe
  },
  {
    title: 'Personal Significance',
    description: 'Uncommon names allow for deeper meaning and connection to specific values or stories.',
    icon: Gift
  },
  {
    title: 'Creative Expression',
    description: 'Choosing unique names reflects creativity and openness to different traditions.',
    icon: Sparkles
  }
];

export default async function UniqueNamesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-fuchsia-600 to-purple-600 p-4 rounded-2xl shadow-xl shadow-fuchsia-500/20">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Unique Baby Names — Rare & Uncommon Names
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover 15,000+ unique, rare, and uncommon baby names from around the world. Stand out with 
                distinctive names that are memorable yet meaningful. Find the perfect uncommon name that reflects 
                your individuality and values.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Unique Names */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Choose a Unique Name
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {uniquenessBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Unique Name Categories */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-fuchsia-50 to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Unique Names by Category
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {uniqueCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className={`bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 p-6 text-white`}>
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          {category.count.toLocaleString()} names
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                      <p className="text-sm opacity-90">{category.description}</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {category.names.map((name, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                            <p className="font-bold text-gray-900">{name.name}</p>
                            <p className="text-sm text-gray-600">{name.meaning}</p>
                            <p className="text-xs text-gray-500">{name.origin}</p>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/names/religion/islamic/1"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        Explore more {category.title.toLowerCase()}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rare Names by Origin */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Rare Names from Around the World
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {rareNamesByOrigin.map((originData, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-fuchsia-600" />
                    <h3 className="text-lg font-bold text-gray-900">{originData.origin}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{originData.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {originData.names.map((name, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-fuchsia-50 text-fuchsia-700 rounded-full text-sm font-medium">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tips for Choosing Unique Names */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-fuchsia-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Tips for Choosing Unique Names
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-fuchsia-600" />
                    Balance Uniqueness with Accessibility
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The best unique names are distinctive but still easy to pronounce and spell. 
                    Avoid overly complicated spellings that might cause frustration. A name like 
                    'Elowen' is unique yet accessible, while something like 'Xzthqr' is unnecessarily difficult.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    Consider Cultural Sensitivity
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    When choosing names from other cultures, research their meaning and significance 
                    to ensure respectful usage. Some names have religious or ceremonial importance 
                    that should be honored appropriately.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Guidelines:</h3>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-600 font-bold">✓</span>
                    Test the name with your surname for flow and rhythm
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-600 font-bold">✓</span>
                    Consider potential nicknames and abbreviations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-600 font-bold">✓</span>
                    Check for unintended meanings in other languages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-600 font-bold">✓</span>
                    Ensure it won't cause constant misspellings or corrections
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Unique Names FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How unique is too unique for a baby name?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A name becomes 'too unique' when it's difficult to pronounce, spell, or might cause 
                  embarrassment. Aim for distinctive but accessible—names that are unusual yet still 
                  functional in daily life. The sweet spot is memorable without being confusing.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Should I worry about my child being the only one with their name?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Some children enjoy having a unique name and the individuality it brings. Others might 
                  prefer something more common. Consider your child's potential personality and how the 
                  name will be received in school and professional settings.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How can I test if a unique name works?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Say it aloud with your surname, imagine it on a resume or business card, and test it 
                  with friends and family. A good unique name should feel natural when spoken and 
                  written in all contexts.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  What about unique spellings of common names?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Creative spellings can backfire—your child may spend a lifetime correcting people. 
                  It's often better to choose a genuinely unique name than to alter a common one. 
                  Unique takes the heat off the spelling issue entirely.
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
                      name: 'How unique is too unique for a baby name?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'A name becomes \'too unique\' when it\'s difficult to pronounce, spell, or might cause embarrassment. Aim for distinctive but accessible—names that are unusual yet still functional in daily life.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How can I test if a unique name works?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Say it aloud with your surname, imagine it on a resume or business card, and test it with friends and family. A good unique name should feel natural when spoken and written in all contexts.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'What about unique spellings of common names?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Creative spellings can backfire—your child may spend a lifetime correcting people. It\'s often better to choose a genuinely unique name than to alter a common one.'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-fuchsia-600 to-purple-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Discover Your Perfect Unique Name
            </h2>
            <p className="text-lg text-fuchsia-100 mb-8 max-w-2xl mx-auto">
              Explore our curated collection of 15,000+ rare and distinctive names from around the world. 
              Find the uncommon name that perfectly captures your child's unique spirit and stands out 
              from the crowd while remaining meaningful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/unique-names"
                className="px-8 py-4 bg-white text-fuchsia-600 rounded-xl font-bold text-lg hover:bg-fuchsia-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Unique Names
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-fuchsia-500 text-white rounded-xl font-bold text-lg hover:bg-fuchsia-400 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
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
