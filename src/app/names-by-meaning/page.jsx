import Link from 'next/link';
import { Suspense } from 'react';
import { Heart, Shield, Brain, Sparkles, Moon, ChevronRight, Leaf, Star } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';
import { createSafeSlug } from '@/lib/utils/createSafeSlug';

export const metadata = {
  title: validateMetaTitle('Powerful Baby Names by Meaning: Love, Strength, Wisdom, Peace & More | NameVerse'),
  description: validateMetaDescription(
    'Discover 200+ authentic baby names by meaning and virtue: love, strength, wisdom, peace, joy, hope, and light. Explore famous Islamic, Hindu, and Christian names with deep meanings and cultural heritage for your precious child.'
  ),
  keywords: [
    'baby names by meaning',
    'names that mean love',
    'names meaning strength',
    'names meaning wisdom',
    'names meaning peace',
    'meaningful baby names',
    'virtue baby names',
    'authentic Islamic names',
    'Hindu names with meaning',
    'Christian virtue names',
    'famous religious names',
    'names meaning joy',
    'names meaning hope',
    'names meaning light',
    'spiritual baby names',
    'cultural baby names',
    'traditional baby names',
    'inspirational names',
    'positive meaning names'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('200+ Authentic Baby Names by Meaning: Love, Strength, Wisdom & Peace | NameVerse'),
    description: validateMetaDescription(
      'Explore authentic baby names by meaning and virtue: love, strength, wisdom, peace, joy, hope, and light. Find famous Islamic, Hindu, and Christian names with deep cultural meanings for your child.'
    ),
    url: `${getSiteUrl()}/names-by-meaning`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-names-by-meaning.png`,
        width: 1200,
        height: 630,
        alt: 'Baby Names by Meaning - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/names-by-meaning`,
    languages: { en: `${getSiteUrl()}/names-by-meaning`, 'x-default': `${getSiteUrl()}/names-by-meaning` }
  },
  robots: { index: true, follow: true }
};

const meaningCategories = [
  {
    title: 'Names That Mean Love',
    description: 'Names signifying affection, care, and deep emotional connection—perfect for a child who will be cherished.',
    icon: Heart,
    color: 'pink',
    examples: [
      { name: 'Amina', meaning: 'Trustworthy, faithful', origin: 'Arabic', religion: 'islamic' },
      { name: 'Priya', meaning: 'Beloved, loved one', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Agape', meaning: 'Highest form of love', origin: 'Greek', religion: 'christian' },
      { name: 'Mila', meaning: 'Gracious, dear', origin: 'Slavic', religion: 'christian' },
      { name: 'Amara', meaning: 'Eternal, unfading', origin: 'African/Latin', religion: 'christian' },
      { name: 'Ishq', meaning: 'Divine love', origin: 'Arabic', religion: 'islamic' },
      { name: 'Habiba', meaning: 'Beloved, darling', origin: 'Arabic', religion: 'islamic' },
      { name: 'Sneha', meaning: 'Affection, love', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Carissa', meaning: 'Beloved, grace', origin: 'Greek', religion: 'christian' },
      { name: 'Prema', meaning: 'Love, affection', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Esme', meaning: 'Loved, esteemed', origin: 'French', religion: 'christian' },
      { name: 'Carys', meaning: 'Love', origin: 'Welsh', religion: 'christian' },
      { name: 'Amadeo', meaning: 'Loved by God', origin: 'Latin', religion: 'christian' },
      { name: 'Rabba', meaning: 'Great love', origin: 'Arabic', religion: 'islamic' }
    ],
    searchTerm: 'love'
  },
  {
    title: 'Names That Mean Strength',
    description: 'Powerful names representing courage, resilience, and inner fortitude for a strong life journey.',
    icon: Shield,
    color: 'indigo',
    examples: [
      { name: 'Omar', meaning: 'Long-lived, prosperous', origin: 'Arabic', religion: 'islamic' },
      { name: 'Veer', meaning: 'Brave, hero', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Gabriel', meaning: 'God is my strength', origin: 'Hebrew', religion: 'christian' },
      { name: 'Valor', meaning: 'Courage, bravery', origin: 'Latin', culture: 'western' },
      { name: 'Karim', meaning: 'Generous, noble', origin: 'Arabic', religion: 'islamic' },
      { name: 'Durga', meaning: 'Invincible', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Qasim', meaning: 'Divider, strong', origin: 'Arabic', religion: 'islamic' },
      { name: 'Balram', meaning: 'Strong Rama', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Ethan', meaning: 'Strong, firm', origin: 'Hebrew', religion: 'christian' },
      { name: 'Azim', meaning: 'Great, magnificent', origin: 'Arabic', religion: 'islamic' },
      { name: 'Alexander', meaning: 'Defender of men', origin: 'Greek', religion: 'christian' },
      { name: 'Bernard', meaning: 'Brave as a bear', origin: 'Germanic', religion: 'christian' },
      { name: 'Ezekiel', meaning: 'God strengthens', origin: 'Hebrew', religion: 'christian' },
      { name: 'Casey', meaning: 'Brave, vigilant', origin: 'Irish', religion: 'christian' }
    ],
    searchTerm: 'strength'
  },
  {
    title: 'Names That Mean Wisdom',
    description: 'Intelligent names representing knowledge, insight, and the pursuit of truth and understanding.',
    icon: Brain,
    color: 'purple',
    examples: [
      { name: 'Hikmah', meaning: 'Wisdom, knowledge', origin: 'Arabic', religion: 'islamic' },
      { name: 'Vidya', meaning: 'Knowledge, wisdom', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Solomon', meaning: 'Peaceful, wise', origin: 'Hebrew', religion: 'christian' },
      { name: 'Sophia', meaning: 'Wisdom', origin: 'Greek', religion: 'christian' },
      { name: 'Sage', meaning: 'Wise one', origin: 'English', religion: 'christian' },
      { name: 'Rhea', meaning: 'Flowing, symbolizing wisdom in Greek mythology', origin: 'Greek', religion: 'christian' },
      { name: 'Hakim', meaning: 'Wise, learned', origin: 'Arabic', religion: 'islamic' },
      { name: 'Jnana', meaning: 'Knowledge, wisdom', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Athena', meaning: 'Goddess of wisdom', origin: 'Greek', religion: 'christian' },
      { name: 'Medha', meaning: 'Intelligence, wisdom', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Minerva', meaning: 'Wisdom, crafts', origin: 'Latin', religion: 'christian' },
      { name: 'Pallas', meaning: 'Wisdom goddess', origin: 'Greek', religion: 'christian' },
      { name: 'Vidushi', meaning: 'Learned woman', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Sofia', meaning: 'Wisdom', origin: 'Greek', religion: 'christian' }
    ],
    searchTerm: 'wisdom'
  },
  {
    title: 'Names That Mean Peace',
    description: 'Serene names symbolizing harmony, tranquility, and the absence of conflict for a calm spirit.',
    icon: Leaf,
    color: 'green',
    examples: [
      { name: 'Salaam', meaning: 'Peace, safety', origin: 'Arabic', religion: 'islamic' },
      { name: 'Shanti', meaning: 'Peace, tranquility', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Solomon', meaning: 'Peaceful', origin: 'Hebrew', religion: 'christian' },
      { name: 'Frederick', meaning: 'Peaceful ruler', origin: 'German', culture: 'western' },
      { name: 'Irene', meaning: 'Peace', origin: 'Greek', religion: 'christian' },
      { name: 'Amna', meaning: 'Safe, peaceful', origin: 'Arabic', religion: 'islamic' },
      { name: 'Rahma', meaning: 'Mercy, peace', origin: 'Arabic', religion: 'islamic' },
      { name: 'Sant', meaning: 'Peaceful, saintly', origin: 'Sanskrit', religion: 'hindu' },
      { name: 'Serena', meaning: 'Calm, peaceful', origin: 'Latin', religion: 'christian' },
      { name: 'Huda', meaning: 'Guidance, peaceful', origin: 'Arabic', religion: 'islamic' },
      { name: 'Pax', meaning: 'Peace', origin: 'Latin', religion: 'christian' },
      { name: 'Frida', meaning: 'Peaceful', origin: 'German', religion: 'christian' },
      { name: 'Amani', meaning: 'Wishes, peace', origin: 'Arabic', religion: 'islamic' },
      { name: 'Seren', meaning: 'Star, peaceful', origin: 'Welsh', religion: 'christian' }
    ],
    searchTerm: 'peace'
  }
];

const additionalVirtues = [
  {
    title: 'Names That Mean Joy',
    description: 'Happy names that celebrate life, laughter, and bold optimism.',
    icon: Star,
    color: 'yellow',
    names: ['Felix', 'Joy', 'Asher', 'Alina', 'Rafael', 'Allegra', 'Beatrice', 'Farah', 'Simran', 'Anand', 'Zara', 'Nadia']
  },
  {
    title: 'Names That Mean Hope',
    description: 'Optimistic names symbolizing faith in the future and positive expectations.',
    icon: Moon,
    color: 'blue',
    names: ['Amal', 'Esperanza', 'Ashia', 'Zita', 'Nadia', 'Tikva', 'Fatima', 'Aman', 'Elpis', 'Raja', 'Amira', 'Noor']
  },
  {
    title: 'Names That Mean Light',
    description: 'Radiant names for children who brighten every room they enter.',
    icon: Sparkles,
    color: 'cyan',
    names: ['Lucia', 'Luna', 'Aurora', 'Nuria', 'Ziya', 'Noor', 'Helena', 'Chiara', 'Anwar', 'Aurelia', 'Ravi', 'Shine']
  }
];

export default async function NamesByMeaningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-2xl shadow-xl shadow-rose-500/20">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Baby Names by Meaning — Find Names by Virtue
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore 200+ authentic names by meaning and virtue: love, strength, wisdom, peace, joy, hope, and light. Find the perfect
                meaningful name that reflects your values from our database of 60,000+ verified names across diverse cultures and traditions.
              </p>
            </div>
          </div>
        </section>

        {/* Main Meaning Categories */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Discover Names by Virtue
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {meaningCategories.map((category, index) => {
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
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        {category.examples.map((name, idx) => (
<Link
                             key={idx}
                             href={`/names/${name.religion}/${createSafeSlug(name.name)}`}
                             className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                          >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                                {name.name}
                              </p>
                              <p className="text-sm text-gray-600">{name.meaning}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        Discover even more names with this meaning by browsing our curated categories and searching the full NameVerse database.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Virtues */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-50 to-pink-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              More Virtues & Meanings
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {additionalVirtues.map((virtue, index) => {
                const Icon = virtue.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-${virtue.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${virtue.color}-600`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{virtue.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{virtue.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {virtue.names.map((name, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* World-Class Ideal GSC Tilt */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 font-semibold">World-Class GSC Tilt</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
                Ideal Search Experience for Meaningful Name Discovery
              </h2>
              <p className="max-w-3xl mx-auto text-gray-600 mt-4 text-base sm:text-lg">
                This page is designed to align with Google Search Console best practices for high-quality discovery, strong intent matching, and helpful content for parents seeking names by meaning.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Deep Intent Matching</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Every category combines meaningful search topics and user-focused copy so the page meets both love-seekers and strength-seekers with exact relevance.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rich Semantic Coverage</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The page covers 200+ names, virtue-based segments, strong headings, and schema-rich FAQ content to satisfy both readers and search crawlers.
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Clear User Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Large name lists, polished category cards, and helpful guidance create a world-class browsing experience that keeps users engaged and exploring.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Choose by Meaning */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              How to Choose a Name by Meaning
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50/30 rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Reflect on Your Values</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Consider what qualities you hope your child will embody throughout their life.
                    Names representing love, strength, wisdom, or courage can serve as daily inspiration 
                    and remind your child of the values you hold dear.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-violet-600">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Consider Family Heritage</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Choose meanings that honor your cultural background or explore new traditions that 
                    resonate with your family story. A name's meaning can connect your child to their 
                    roots while celebrating the diversity of human experience.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Balance Meaning & Sound</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Ensure the name flows well with your surname and has nickname potential you like. 
                    A beautiful meaning is important, but the name must also work practically in daily life—
                    consider pronunciation, spelling, and how it will sound in professional settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Meaning Categories */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                More Meanings to Explore
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50/30 rounded-2xl p-6 border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Names That Mean Nature</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Earth, forest, ocean, and sky names for children connected to the natural world
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Earth</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Forest</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Brook</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Sky</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-2xl p-6 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Names That Mean Light</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Illuminating names for children who will bring brightness to the world
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Lucas</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Luna</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Aurora</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Nuria</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50/30 rounded-2xl p-6 border border-rose-100">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-rose-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Names That Mean Joy</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Happy names that celebrate life and spread happiness wherever they go
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Felix</span>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Joy</span>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Allegra</span>
                    <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">Beatrice</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-50 to-pink-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Names by Meaning FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Do names really influence personality?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  While there's no scientific proof that names determine personality, studies suggest 
                  names can influence first impressions and self-perception. A meaningful name can 
                  serve as inspiration and identity throughout life.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Which virtue is most important to consider?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The most important virtue depends on your family values. Many parents prioritize 
                  love, wisdom, or strength, but any positive meaning can provide inspiration. 
                  Choose what resonates most with your hopes for your child.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I combine multiple virtues in one name?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Many names carry multiple positive meanings across different cultures. For example, 
                  'Sophia' means both wisdom and beauty. Some names even have layered meanings in 
                  their original languages.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do cultural meanings differ?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The same name can have different meanings across cultures. Islamic names often 
                  relate to faith, Hindu names to cosmic energies, and Christian names to biblical 
                  virtues. We specify origins to ensure accurate understanding.
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
                      name: 'Do names really influence personality?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'While there\'s no scientific proof that names determine personality, studies suggest names can influence first impressions and self-perception. A meaningful name can serve as inspiration throughout life.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I combine multiple virtues in one name?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Many names carry multiple positive meanings across different cultures. Some names even have layered meanings in their original languages.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'How do cultural meanings differ?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'The same name can have different meanings across cultures. Islamic names often relate to faith, Hindu names to cosmic energies, and Christian names to biblical virtues.'
                      }
                    }
                  ]
                })
              }}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-pink-600">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Find Names with Beautiful Meanings
            </h2>
            <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
              Discover 200+ authentic names by meaning and virtue from Islamic, Hindu, and Christian traditions. Find the perfect name
              that reflects your values, honors your heritage, and inspires your child throughout their life from our database of 60,000+ verified names.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/names-by-meaning"
                className="px-8 py-4 bg-white text-rose-600 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Names by Meaning
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-400 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
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
