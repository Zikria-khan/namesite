import { Globe, Heart, Award, BookOpen, Languages, CheckCircle, Star, Sparkles } from 'lucide-react';
import SearchBar from './SearchSection';
import Link from 'next/link';

const HeroSection = () => {
  const categories = [
    {
      id: 'islamic',
      name: 'Islamic',
      icon: Globe,
      url: '/names/religion/islamic/1',
      count: '25,000+',
      description: 'Quranic and Arabic names for boys and girls.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700'
    },
    {
      id: 'hindu',
      name: 'Hindu',
      icon: Sparkles,
      url: '/names/religion/hindu/1',
      count: '20,000+',
      description: 'Sanskrit and Vedic names with trusted meanings.',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    },
    {
      id: 'christian',
      name: 'Christian',
      icon: Award,
      url: '/names/religion/christian/1',
      count: '15,000+',
      description: 'Biblical and modern Christian baby names.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    }
  ];

  const features = [
    { icon: Star, text: '5M+ parents trust NameVerse' },
    { icon: CheckCircle, text: 'Scholar-verified meanings' },
    { icon: Languages, text: '15+ languages supported' }
  ];

  return (
    <section className="relative w-full py-12 overflow-hidden" aria-label="NameVerse hero section">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-white font-semibold shadow-md">
            <Star className="w-4 h-4" />
            NameVerse — Baby names with trusted meanings
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            NameVerse – Find the perfect Islamic, Hindu, or Christian baby name in minutes.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
            NameVerse helps 5M+ parents search 65,000+ verified baby names with meanings, origins, and religious context. Fast results, accurate translations, and expert guidance for every family.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-gray-700">
                  <Icon className="w-4 h-4 text-teal-600" />
                  {feature.text}
                </div>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-visible border border-slate-200 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-10" />
              <div className="relative p-4 sm:p-6 bg-white">
                <SearchBar />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.url}
                  className={`group rounded-3xl border ${category.borderColor} ${category.bgColor} p-5 transition hover:-translate-y-1 hover:shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`rounded-2xl p-3 bg-gradient-to-br ${category.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${category.textColor}`}>{category.name} Names</p>
                      <p className="text-xs text-gray-500">{category.count}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
