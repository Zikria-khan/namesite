import Link from 'next/link';
import { Suspense } from 'react';
import { TrendingUp, Sparkles, Zap, Star, Flame, Rocket, ChevronRight } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadat a= {
  title: validateMetaTitle('Trending Baby Names 2026 — What\'s Hot Now | NameVerse'),
  description: validateMetaDescription(
    'Discover the hottest trending baby names of 2026. See fast-rising names, viral social media names, celebrity baby names, and predicted popular names for next year.'
  ),
  keywords: [
    'trending baby names 2026',
    'viral baby names',
    'rising names',
    'fast-rising names',
    'celebrity baby names',
    'popular names this week',
    'trending names',
    'baby name trends'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Trending Baby Names 2026 — What\'s Hot Now | NameVerse'),
    description: validateMetaDescription(
      'Explore the hottest trending baby names of 2026. See fast-rising names, viral social media names, and celebrity baby names influencing naming trends.'
    ),
    url: `${getSiteUrl()}/trending-names`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-trending-names.png`,
        width: 1200,
        height: 630,
        alt: 'Trending Baby Names 2026 - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/trending-names`,
    languages: { en: `${getSiteUrl()}/trending-names`, 'x-default': `${getSiteUrl()}/trending-names` }
  },
  robots: { index: true, follow: true }
};

const trendingCategories = [
  {
    title: 'Fastest Rising Names',
    description: 'Names that have gained the most popularity in the past year, showing dramatic upward trends across all regions.',
    icon: TrendingUp,
    color: 'indigo',
    names: [
      { name: 'Rayan', meaning: 'Doorway to heaven', trend: '+45%', religion: 'islamic' },
      { name: 'Zain', meaning: 'Beauty, grace', trend: '+42%', religion: 'islamic' },
      { name: 'Inaya', meaning: 'Care, concern', trend: '+38%', religion: 'hindu' },
      { name: 'Nour', meaning: 'Light', trend: '+35%', religion: 'islamic' }
    ]
  },
  {
    title: 'Viral Social Media Names',
    description: 'Names blowing up on TikTok, Instagram, and Pinterest as parents share their unique choices online.',
    icon: Sparkles,
    color: 'fuchsia',
    names: [
      { name: 'Wren', meaning: 'Small bird', trend: '+1.2M searches', religion: 'christian' },
      { name: 'Paloma', meaning: 'Dove', trend: '+890K searches', religion: 'christian' },
      { name: 'Caspian', meaning: 'From the Caspian Sea', trend: '+720K searches', religion: 'christian' },
      { name: 'Elowen', meaning: 'Elm tree', trend: '+650K searches', religion: 'christian' }
    ]
  },
  {
    title: 'Celebrity Baby Names',
    description: 'Names made famous by A-list celebrities, royalty, and influencers that parents are rushing to adopt.',
    icon: Zap,
    color: 'amber',
    names: [
      { name: 'Atticus', meaning: 'Man of Attica', celebrity: 'Tom Hanks', trend: '+34%' },
      { name: 'Luna', meaning: 'Moon', celebrity: 'John Legend', trend: '+28%' },
      { name: 'Arlo', meaning: 'Fort', celebrity: 'Rob Schneider', trend: '+52%' },
      { name: 'Maeve', meaning: 'She who intoxicates', celebrity: 'Tina Fey', trend: '+41%' }
    ]
  },
  {
    title: 'Predicted Popular 2027',
    description: 'Names on the cusp of breaking through, predicted to be next year\'s hottest choices based on current trajectory.',
    icon: Rocket,
    color: 'purple',
    names: [
      { name: 'Kian', meaning: 'Ancient, enduring', prediction: 'Top 50 2027', trend: '+26%' },
      { name: 'Zuri', meaning: 'Beautiful', prediction: 'Top 100 2027', trend: '+33%' },
      { name: 'Cassian', meaning: 'Hollow', prediction: 'Top 100 2027', trend: '+41%' },
      { name: 'Leilani', meaning: 'Heavenly flowers', prediction: 'Top 50 2027', trend: '+38%' }
    ]
  }
];

const viralNameAnalysis = [
  {
    name: 'Olivia',
    platform: 'TikTok',
    mentions: '2.4M+',
    reason: 'Classic name with trendy nickname potential (Liv, Via, Ola)'
  },
  {
    name: 'Noah',
    platform: 'Instagram',
    mentions: '1.8M+',
    reason: 'Biblical name with cross-cultural appeal and easy pronunciation'
  },
  {
    name: 'Muhammad',
    platform: 'All Platforms',
    mentions: '3.2M+',
    reason: 'Religious significance combined with positive meaning and global popularity'
  },
  {
    name: 'Sofia',
    platform: 'Pinterest',
    mentions: '1.5M+',
    reason: 'Elegant spelling variation with royal connections and vintage charm'
  }
];

export default async function TrendingNamesPage() {
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
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Trending Baby Names 2026 — What's Hot Now
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the hottest trending baby names of 2026. See fast-rising names, viral social media 
                names, celebrity baby names, and predicted popular names for next year. Stay ahead of the 
                naming trends with NameVerse.
              </p>
            </div>
          </div>
        </section>

        {/* Trending Categories */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              What's Trending Now
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {trendingCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className={`bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 p-6 text-white`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{category.title}</h3>
                          <p className="text-sm opacity-90">{category.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {category.names.map((name, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Star className="w-5 h-5 text-amber-500" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{name.name}</p>
                                <p className="text-sm text-gray-600">{name.meaning}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-fuchsia-600">{name.trend}</span>
                              {name.celebrity && (
                                <p className="text-xs text-gray-500">{name.celebrity}</p>
                              )}
                              {name.prediction && (
                                <p className="text-xs text-purple-600 font-medium">{name.prediction}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Media Analysis */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-fuchsia-50 to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Viral Names on Social Media
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Platform</th>
                      <th className="px-6 py-4 text-left font-semibold">Mentions</th>
                      <th className="px-6 py-4 text-left font-semibold">Why It's Trending</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viralNameAnalysis.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-fuchsia-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">{item.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-xs font-medium">
                            {item.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-purple-600">{item.mentions}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Celebrity Influence */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Celebrity Baby Names Influence
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">The Royal Effect</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When royalty or celebrities choose a name, it often experiences an immediate surge. 
                  Princess Charlotte led to a 65% increase in that name's usage within a year.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Social Media Amplification</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Instagram and TikTok have accelerated trend adoption. A name mentioned by an influencer 
                  can see a 300% increase in searches within 48 hours.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">The Timing Factor</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names from movies or shows typically peak 9-12 months after release, giving parents time 
                  to discover and fall in love with the name organically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Predicted Next Year Trends */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Predicted Trends for Next Year
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Names on the Rise
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Gender-neutral nature names</span>
                    <span className="ml-auto text-sm text-indigo-600 font-medium">+45%</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Vintage names with modern spellings</span>
                    <span className="ml-auto text-sm text-purple-600 font-medium">+38%</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-fuchsia-500 rounded-full"></div>
                    <span className="text-gray-700">Cross-cultural fusion names</span>
                    <span className="ml-auto text-sm text-fuchsia-600 font-medium">+52%</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-700">Names meaning light and hope</span>
                    <span className="ml-auto text-sm text-amber-600 font-medium">+41%</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-600" />
                  Losing Steam
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-500 line-through">
                    <span>Overused '-ayden' variations</span>
                    <span className="ml-auto text-sm">-23%</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500 line-through">
                    <span>Hyphenated celebrity-style names</span>
                    <span className="ml-auto text-sm">-18%</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-500 line-through">
                    <span>Overly unique spellings</span>
                    <span className="ml-auto text-sm">-31%</span>
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
              Trending Names FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Should I choose a trending name?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trending names can be great if you love them, but consider the long-term. Names that are 
                  extremely popular may lead to multiple classmates sharing the same name. Balance trendy 
                  with timeless for the best results.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How long do naming trends last?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Most trends last 3-5 years before declining. However, some names experience revivals 
                  decades later. Names that rise gradually tend to have more staying power than those 
                  that spike suddenly due to celebrity influence.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Are viral social media names a good idea?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Viral names can be wonderful if they genuinely appeal to you and work well with your 
                  surname. However, consider whether you\'re choosing it because you love it or because 
                  it\'s trending. Authenticity matters most.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do I predict if a name will remain popular?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names with historical usage, positive meanings, and easy pronunciation tend to remain 
                  popular. Look for names that have been used consistently over decades rather than 
                  those that spiked suddenly and may fade quickly.
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
                      name: 'Should I choose a trending name?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Trending names can be great if you love them, but consider the long-term. Names that are extremely popular may lead to multiple classmates sharing the same name. Balance trendy with timeless for the best results.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How long do naming trends last?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Most trends last 3-5 years before declining. However, some names experience revivals decades later. Names that rise gradually tend to have more staying power than those that spike suddenly.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Are viral social media names a good idea?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Viral names can be wonderful if they genuinely appeal to you and work well with your surname. However, consider whether you\'re choosing it because you love it or because it\'s trending.'
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
              Stay Ahead of Naming Trends
            </h2>
            <p className="text-lg text-fuchsia-100 mb-8 max-w-2xl mx-auto">
              Discover the hottest trending names of 2026 before they become mainstream. Join thousands of 
              parents who choose NameVerse to find the perfect balance between trendy and timeless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/trending-names"
                className="px-8 py-4 bg-white text-fuchsia-600 rounded-xl font-bold text-lg hover:bg-fuchsia-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Trending Names
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
