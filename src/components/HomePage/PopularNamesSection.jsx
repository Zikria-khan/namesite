import Link from 'next/link';
import { Heart, Sparkles, Users, Crown, Flame, TrendingUp, Eye, Share2 } from 'lucide-react';

const PopularNamesSection = () => {
  const popularBoyNames = [
    { name: 'Muhammad', meaning: 'Praised one, praiseworthy', religion: 'Islamic', origin: 'Arabic', slug: 'muhammad', color: 'emerald' },
    { name: 'Arjun', meaning: 'Bright, shining, white', religion: 'Hindu', origin: 'Sanskrit', slug: 'arjun', color: 'orange' },
    { name: 'Noah', meaning: 'Rest, comfort, peace', religion: 'Christian', origin: 'Hebrew', slug: 'noah', color: 'blue' },
    { name: 'Ali', meaning: 'Exalted, noble, sublime', religion: 'Islamic', origin: 'Arabic', slug: 'ali', color: 'emerald' },
    { name: 'Aiden', meaning: 'Little fire, fiery one', religion: 'Christian', origin: 'Irish', slug: 'aiden', color: 'blue' },
    { name: 'Aarav', meaning: 'Peaceful, wisdom, melody', religion: 'Hindu', origin: 'Sanskrit', slug: 'aarav', color: 'orange' },
    { name: 'Omar', meaning: 'Long-lived, flourishing', religion: 'Islamic', origin: 'Arabic', slug: 'omar', color: 'emerald' },
    { name: 'Liam', meaning: 'Strong-willed warrior', religion: 'Christian', origin: 'Irish', slug: 'liam', color: 'blue' },
    { name: 'Advait', meaning: 'Unique, unparalleled', religion: 'Hindu', origin: 'Sanskrit', slug: 'advait', color: 'orange' },
    { name: 'Zain', meaning: 'Beauty, grace, excellence', religion: 'Islamic', origin: 'Arabic', slug: 'zain', color: 'emerald' },
  ];

  const popularGirlNames = [
    { name: 'Aisha', meaning: 'Living, prosperous, alive', religion: 'Islamic', origin: 'Arabic', slug: 'aisha', color: 'emerald' },
    { name: 'Priya', meaning: 'Beloved, dear one', religion: 'Hindu', origin: 'Sanskrit', slug: 'priya', color: 'orange' },
    { name: 'Sophia', meaning: 'Wisdom, knowledge', religion: 'Christian', origin: 'Greek', slug: 'sophia', color: 'blue' },
    { name: 'Fatima', meaning: 'Captivating, abstinent', religion: 'Islamic', origin: 'Arabic', slug: 'fatima', color: 'emerald' },
    { name: 'Olivia', meaning: 'Olive tree, peace', religion: 'Christian', origin: 'Latin', slug: 'olivia', color: 'blue' },
    { name: 'Ananya', meaning: 'Unique, matchless, peerless', religion: 'Hindu', origin: 'Sanskrit', slug: 'ananya', color: 'orange' },
    { name: 'Zara', meaning: 'Princess, flower, radiance', religion: 'Islamic', origin: 'Arabic', slug: 'zara', color: 'emerald' },
    { name: 'Ava', meaning: 'Life, bird, voice', religion: 'Christian', origin: 'Latin', slug: 'ava', color: 'blue' },
    { name: 'Maya', meaning: 'Illusion, magic, mother', religion: 'Hindu', origin: 'Sanskrit', slug: 'maya', color: 'orange' },
    { name: 'Layla', meaning: 'Night, dark beauty', religion: 'Islamic', origin: 'Arabic', slug: 'layla', color: 'emerald' },
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4 shadow-md">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Popular names, trending themes, and top baby name searches</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Popular Baby Names 2026 — Trending Names with Meanings
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto mb-4">
            Discover top baby name lists for Islamic, Hindu, and Christian families. Explore the names parents search most often, with trusted meanings, origins, and popularity insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Popular Boy Names</h3>
                  <p className="text-sm text-white/80">Top trending names for baby boys</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {popularBoyNames.map((name) => {
                const colors = colorMap[name.color];
                return (
                  <Link
                    key={name.slug}
                    href={`/names/${name.religion.toLowerCase()}/${name.slug}`}
                    className="block p-3 rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{name.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{name.religion}</span>
                        </div>
                        <p className="text-sm text-gray-600">{name.meaning} • {name.origin}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-blue-600">View details</div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-2 border-pink-200 rounded-xl overflow-hidden bg-white shadow-lg">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Popular Girl Names</h3>
                  <p className="text-sm text-white/80">Top trending names for baby girls</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {popularGirlNames.map((name) => {
                const colors = colorMap[name.color];
                return (
                  <Link
                    key={name.slug}
                    href={`/names/${name.religion.toLowerCase()}/${name.slug}`}
                    className="block p-3 rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{name.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>{name.religion}</span>
                        </div>
                        <p className="text-sm text-gray-600">{name.meaning} • {name.origin}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-blue-600">View details</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Trending Name Themes</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Trending Names & Popular Naming Themes</h3>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto mt-3">
              Keep up with the latest baby name interest: rising searches, celebrity favorites, regional trends, and unique name ideas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Flame,
                title: 'Fastest Rising Names',
                description: 'Names gaining rapid popularity this year with the strongest search growth.',
                link: '/blog/baby-names-inspired-by-nature',
                count: '2,847 searches today',
                color: 'from-orange-500 to-red-500'
              },
{
                icon: TrendingUp,
                title: 'Popular Names by State',
                description: 'Regional name trends that show which names are rising in your area.',
                link: '/names',
                count: 'Updated daily',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Sparkles,
                title: 'Celebrity Baby Names',
                description: 'Viral names chosen by celebrities that are now trending with parents.',
                link: '/blog/best-islamic-baby-names-2026',
                count: '1,293 this week',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Eye,
                title: 'Unique & Rare Names',
                description: 'Stand out from the crowd with uncommon names that still sound beautiful and meaningful.',
                link: '/unique-names',
                count: '15,234 names available',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: Heart,
                title: 'Names by Meaning',
                description: 'Search baby names by virtues like love, strength, wisdom, peace, and miracle.',
                link: '/names-by-meaning',
                count: '500+ meanings',
                color: 'from-pink-500 to-rose-500'
              },
{
                icon: Share2,
                title: 'Viral Social Names',
                description: 'Names trending on Instagram, TikTok, and Pinterest that parents are sharing now.',
                link: '/trending-names',
                count: 'Real-time updates',
                color: 'from-violet-500 to-purple-500'
              }
            ].map((item) => (
              <div key={item.title} className="group rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className={`w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-semibold text-green-700">{item.count}</span>
                  <Link href={item.link} className="text-blue-600 font-semibold hover:text-blue-700">
                    View Names →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-blue-50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fastest Rising Baby Names This Month</h3>
              <p className="text-sm text-gray-600 max-w-2xl">
                Based on search volume growth and trending name interest, these names are gaining momentum across NameVerse.
              </p>
            </div>
<Link
              href="/names"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Explore All Popular Names
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Aurelia', gender: 'girl', change: '+47%', popularity: 'Rising Fast' },
              { name: 'Cassian', gender: 'boy', change: '+38%', popularity: 'Trending' },
              { name: 'Nova', gender: 'girl', change: '+35%', popularity: 'Very Popular' },
              { name: 'Atlas', gender: 'boy', change: '+32%', popularity: 'Rising' },
              { name: 'Elodie', gender: 'girl', change: '+28%', popularity: 'Hot' },
              { name: 'Silas', gender: 'boy', change: '+25%', popularity: 'Trending' }
            ].map((item, index) => (
              <div key={index} className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm transition hover:shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{item.gender}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{item.popularity}</span>
                </div>
                <p className="text-sm text-gray-600">Search growth: <span className="font-semibold text-gray-900">{item.change}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularNamesSection;

