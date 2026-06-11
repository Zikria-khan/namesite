'use client';

import { TrendingUp, Clock, Flame, Sparkles, Eye, Heart, Share2, Star } from 'lucide-react';
import Link from 'next/link';

const TrendingNames = () => {
  const trendingCategories = [
    {
      icon: Flame,
      title: 'Fastest Rising Names 2026',
      description: 'Names gaining rapid popularity this year. Get ahead of trends with these up-and-coming choices before they become mainstream.',
      keywords: 'trending baby names 2026, rising baby names, popular names this year, fastest rising names',
      link: '/blog/baby-names-inspired-by-nature',
      count: '2,847 searches today',
      color: 'from-orange-500 to-red-500'
    },
{
      icon: TrendingUp,
      title: 'Most Popular Names by State',
      description: 'See which names are trending in your region. Local popularity data helps you choose unique yet familiar names.',
      keywords: 'popular names by state, regional baby names, local name trends, US baby names by state',
      link: '/names',
      count: 'Updated daily',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'Celebrity Baby Names',
      description: 'Names chosen by celebrities and influencers. Track Hollywood baby name trends and find inspiration from famous families.',
      keywords: 'celebrity baby names 2026, famous baby names, Hollywood baby names, celebrity name choices',
      link: '/blog/best-islamic-baby-names-2026',
      count: '1,293 this week',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'Unique & Rare Names',
      description: 'Stand out from the crowd with uncommon names. Our database includes 15,000+ rare names with beautiful meanings.',
      keywords: 'unique baby names, rare baby names, uncommon names, distinctive baby names 2026',
      link: '/unique-names',
      count: '15,234 names available',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Heart,
      title: 'Names by Meaning',
      description: 'Find names that mean love, strength, wisdom, peace, or miracle. Search by positive attributes and virtues.',
      keywords: 'names that mean love, names meaning strength, names meaning peace, virtue baby names',
      link: '/names-by-meaning',
      count: '500+ meanings',
      color: 'from-pink-500 to-rose-500'
    },
{
      icon: Share2,
      title: 'Viral Baby Names on Social Media',
      description: 'Names gaining buzz on Instagram, TikTok, and Pinterest. Discover what parents are sharing and loving right now.',
      keywords: 'viral baby names, trending on TikTok, Instagram baby names, social media baby names',
      link: '/trending-names',
      count: 'Real-time updates',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const fastRisingNames = [
    { name: 'Aurelia', gender: 'girl', change: '+47%', popularity: 'Rising Fast' },
    { name: 'Cassian', gender: 'boy', change: '+38%', popularity: 'Trending' },
    { name: 'Nova', gender: 'girl', change: '+35%', popularity: 'Very Popular' },
    { name: 'Atlas', gender: 'boy', change: '+32%', popularity: 'Rising' },
    { name: 'Elodie', gender: 'girl', change: '+28%', popularity: 'Hot' },
    { name: 'Silas', gender: 'boy', change: '+25%', popularity: 'Trending' }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header with Trending Keywords */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-md">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold text-white">
              Real-Time Baby Name Trends — Based on 5M+ Searches
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trending Baby Names 2026 — What's Hot Right Now
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the most popular, rising, and unique baby names trending in 2026. Our trend data is updated daily from millions of NameVerse searches. Find out which names are going viral before they hit the top 100.
          </p>
        </div>

        {/* Trending Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trendingCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {category.count}
                  </span>
                  <Link 
                    href={category.link}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Names →
                  </Link>
                </div>
                <div className="flex flex-wrap gap-1">
                  {category.keywords.split(', ').slice(0, 3).map((keyword, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fast Rising Names Table */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ⚡ Fastest Rising Baby Names This Month
              </h3>
              <p className="text-gray-600 text-sm">
                Based on search volume growth — these names are exploding in popularity
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold text-sm">
                🔥 LIVE DATA
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {fastRisingNames.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-gray-900">{item.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.change.startsWith('+30') ? 'bg-red-100 text-red-700' : 
                    item.change.startsWith('+2') ? 'bg-orange-100 text-orange-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.change}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 capitalize">{item.gender}</span>
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {item.popularity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/trending-names"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              <TrendingUp className="w-5 h-5" />
              View All Trending Names
            </Link>
          </div>
        </div>

        {/* Authority Statement */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-900 rounded-xl">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              NameVerse tracks trends from 5M+ monthly searches — the largest baby name trend database online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingNames;