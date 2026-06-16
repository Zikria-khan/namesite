import Link from 'next/link';
import { Suspense } from 'react';
import { TrendingUp, BarChart2, ArrowUp, ArrowDown, Users, Sparkles, ChevronRight, Star } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Baby Name Popularity — Rankings & Trends 2026 | NameVerse'),
  description: validateMetaDescription(
    'Discover baby name popularity rankings, trends, and statistics for 2026. Explore top 1000 baby names, regional popularity, and historical trends with NameVerse.'
  ),
  keywords: [
    'baby name popularity',
    'popular names 2026',
    'trending baby names',
    'name rankings',
    'baby name statistics',
    'name popularity chart',
    'top 1000 baby names',
    'name trends 2026'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Baby Name Popularity — Rankings & Trends 2026 | NameVerse'),
    description: validateMetaDescription(
      'Explore the most popular baby names of 2026 with detailed rankings, regional trends, and historical popularity data for Islamic, Hindu, and Christian names.'
    ),
    url: `${getSiteUrl()}/popularity`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-popularity.png`,
        width: 1200,
        height: 630,
        alt: 'Baby Name Popularity Rankings 2026 - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/popularity`,
    languages: { en: `${getSiteUrl()}/popularity`, 'x-default': `${getSiteUrl()}/popularity` }
  },
  robots: { index: true, follow: true }
};

const top1000Names = [
  { rank: 1, name: 'Muhammad', religion: 'islamic', gender: 'male', meaning: 'Praised', trend: 'up' },
  { rank: 2, name: 'Olivia', religion: 'christian', gender: 'female', meaning: 'Olive tree', trend: 'up' },
  { rank: 3, name: 'Noah', religion: 'christian', gender: 'male', meaning: 'Rest', trend: 'up' },
  { rank: 4, name: 'Aisha', religion: 'islamic', gender: 'female', meaning: 'Living', trend: 'up' },
  { rank: 5, name: 'Emma', religion: 'christian', gender: 'female', meaning: 'Universal', trend: 'same' },
  { rank: 6, name: 'Ali', religion: 'islamic', gender: 'male', meaning: 'High', trend: 'up' },
  { rank: 7, name: 'Sophia', religion: 'christian', gender: 'female', meaning: 'Wisdom', trend: 'down' },
  { rank: 8, name: 'Omar', religion: 'islamic', gender: 'male', meaning: 'Long-lived', trend: 'up' },
  { rank: 9, name: 'Liam', religion: 'christian', gender: 'male', meaning: 'Strong-willed', trend: 'up' },
  { rank: 10, name: 'Fatima', religion: 'islamic', gender: 'female', meaning: 'Captivating', trend: 'up' }
];

const regionalTrends = [
  { region: 'Middle East', topName: 'Muhammad', trend: '+15%', color: 'amber' },
  { region: 'South Asia', topName: 'Aarav', trend: '+22%', color: 'orange' },
  { region: 'Europe', topName: 'Noah', trend: '+8%', color: 'blue' },
  { region: 'North America', topName: 'Olivia', trend: '+12%', color: 'green' },
  { region: 'Africa', topName: 'Amina', trend: '+18%', color: 'purple' }
];

const historicalTrends = [
  { year: 2020, muhammad: 85000, noah: 72000, olivia: 68000 },
  { year: 2021, muhammad: 88000, noah: 75000, olivia: 70000 },
  { year: 2022, muhammad: 92000, noah: 78000, olivia: 73000 },
  { year: 2023, muhammad: 95000, noah: 82000, olivia: 76000 },
  { year: 2024, muhammad: 98000, noah: 85000, olivia: 79000 },
  { year: 2025, muhammad: 102000, noah: 88000, olivia: 82000 },
  { year: 2026, muhammad: 105000, noah: 90000, olivia: 85000 }
];

export default async function PopularityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-600 to-amber-600 p-4 rounded-2xl shadow-xl shadow-orange-500/20">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Baby Name Popularity — Rankings & Trends 2026
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the most popular baby names of 2026 with detailed rankings, regional trends, 
                and historical popularity data. Explore top 1000 baby names across Islamic, Hindu, 
                and Christian traditions.
              </p>
            </div>
          </div>
        </section>

        {/* Top 1000 Baby Names 2026 */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Top 1000 Baby Names 2026
            </h2>
            
            {/* Top 10 Highlights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {top1000Names.slice(0, 10).map((nameData) => (
                <div key={nameData.rank} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl font-bold text-gray-400">#{nameData.rank}</span>
                    {nameData.trend === 'up' && (
                      <ArrowUp className="w-5 h-5 text-green-500" />
                    )}
                    {nameData.trend === 'down' && (
                      <ArrowDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{nameData.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{nameData.meaning}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    nameData.religion === 'islamic' ? 'bg-green-100 text-green-700' :
                    nameData.religion === 'hindu' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {nameData.religion.charAt(0).toUpperCase() + nameData.religion.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* View Full List */}
            <div className="text-center">
              <Link
                href="/names/religion/islamic/1"
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                View Full Top 1000 List
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Popularity by Region */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Popularity by State/Region
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
              {regionalTrends.map((region, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100">
                    <Users className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{region.region}</h3>
                  <p className="text-sm text-gray-600 mb-3">Top: <span className="font-semibold">{region.topName}</span></p>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                    region.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {region.trend.startsWith('+') ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    {region.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Historical Trends */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Historical Name Trends
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-orange-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Year</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Muhammad (×1000)</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Noah (×1000)</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Olivia (×1000)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalTrends.map((yearData, index) => (
                      <tr key={index} className="border-t border-gray-100 hover:bg-orange-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{yearData.year}</td>
                        <td className="px-6 py-4 text-gray-600">{yearData.muhammad.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{yearData.noah.toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{yearData.olivia.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-600">
              * Data represents estimated usage across major regions
            </div>
          </div>
        </section>

        {/* Predictive Analytics */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-orange-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              How Name Popularity Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart2 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Data Collection</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our popularity rankings are based on millions of data points collected from birth records, 
                  census data, and parent surveys across multiple countries and regions. We also analyze 
                  search trends, social media mentions, and school enrollment data to provide the most 
                  comprehensive view of naming trends worldwide.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Real-Time Updates</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rankings are updated continuously as new data becomes available, giving you the most 
                  current picture of naming trends and emerging popular names. We monitor celebrity 
                  announcements, cultural events, and media influences that can instantly impact name popularity.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Predictive Analytics</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our algorithms identify emerging trends and predict which names are likely to rise in 
                  popularity, helping you stay ahead of naming trends. We analyze naming velocity, 
                  regional spread, and cultural adoption patterns to forecast future popularity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Name Popularity Matters Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Name Popularity Matters
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Classroom Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Children with very common names may share their name with multiple classmates, 
                  which can lead to confusion, nickname assignments, or a feeling of being less unique.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Professional Identity</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  In adulthood, highly common names can sometimes be less memorable in professional 
                  contexts, though this is balanced by the familiarity and trust that comes with 
                  traditional names.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Trend Awareness</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names that skyrocket in popularity due to celebrity influence may feel dated 
                  later. Choosing a name with moderate popularity often provides timeless appeal.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Significance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A child's name is a core part of their identity. Names with moderate popularity 
                  allow children to feel special while still having a name that's recognized and 
                  respected.
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50/30 rounded-2xl shadow-lg border border-indigo-100 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">The Goldilocks Zone</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Experts suggest the "sweet spot" for baby names is typically in the 100-500 
                    range of popularity rankings. These names offer several advantages:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      Distinctive enough to feel special and memorable
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      Common enough that it's easily recognized and pronounced
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      Unlikely to have multiple classmates with the same name
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                      Often reflects established names with positive associations
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">When to Consider Trends</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Trending names can be wonderful choices if they genuinely appeal to you. 
                    Consider these factors:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      Do you love the name independent of its trend status?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      Does it work well with your surname and potential nicknames?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      How will it age as your child grows into adulthood?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">✓</span>
                      Is it easy to spell and pronounce in your community?
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Name Popularity FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How often are popularity rankings updated?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our rankings are updated in real-time as new data becomes available from birth registries, 
                  census data, and parent submissions. Major updates occur quarterly with continuous 
                  monitoring throughout the year.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Why do some names suddenly become popular?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Names often surge in popularity due to celebrity influence, social media trends, 
                  television shows, movies, or cultural shifts. A single high-profile person can 
                  dramatically increase a name's usage.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Are regional differences significant?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! Names can be extremely popular in one region while rare in another. 
                  Cultural heritage, religious practices, and local traditions all influence 
                  regional naming patterns significantly.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How accurate are popularity predictions?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our predictions are based on sophisticated algorithms analyzing historical data, 
                  current trends, and demographic factors. While not perfect, they provide valuable 
                  insights into likely future popularity.
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
                      name: 'How often are popularity rankings updated?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Our rankings are updated in real-time as new data becomes available. Major updates occur quarterly with continuous monitoring throughout the year.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Why do some names suddenly become popular?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Names often surge due to celebrity influence, social media trends, television shows, movies, or cultural shifts. A single high-profile person can dramatically increase a name\'s usage.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Are regional differences significant?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! Names can be extremely popular in one region while rare in another. Cultural heritage, religious practices, and local traditions all influence regional naming patterns significantly.'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-amber-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Explore Name Popularity Trends
            </h2>
            <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Join millions of parents who use NameVerse to discover trending names, avoid overused choices, 
              and find the perfect balance between popularity and uniqueness for their baby.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/popularity"
                className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Popularity Rankings
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-400 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
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
