import React from "react";
import { Sparkles, TrendingUp, BookOpen, Star, Globe } from "lucide-react";
import '../styles/animations-categories.css';

const QuickCategories = () => {
  const categories = [
    {
      title: "Islamic Names",
      href: "/names/religion/islamic/1",
      icon: <div className="text-4xl">🕌</div>,
      lucideIcon: <Star className="w-6 h-6" />,
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      bgGradient: "from-emerald-50 to-teal-50",
      borderGradient: "from-emerald-200 to-teal-200",
      hoverShadow: "shadow-emerald-200/50",
      description: "Beautiful Arabic & Islamic names",
      pattern: "🌙✨🕌⭐"
    },
    {
      title: "Hindu Names", 
      href: "/names/religion/hindu/1",
      icon: <div className="text-4xl">🕉️</div>,
      lucideIcon: <Globe className="w-6 h-6" />,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderGradient: "from-orange-200 to-amber-200",
      hoverShadow: "shadow-orange-200/50",
      description: "Sacred Hindu & Sanskrit names",
      pattern: "🪔🌺🕉️🙏"
    },
    {
      title: "Christian Names",
      href: "/names/religion/christian/1", 
      icon: <div className="text-4xl">✝️</div>,
      lucideIcon: <BookOpen className="w-6 h-6" />,
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bgGradient: "from-blue-50 to-indigo-50",
      borderGradient: "from-blue-200 to-indigo-200",
      hoverShadow: "shadow-blue-200/50",
      description: "Biblical & Christian names",
      pattern: "✝️🕊️⛪🌟"
    },
    {
      title: "Popular Names",
      href: "/names/popular",
      icon: <TrendingUp className="w-10 h-10 text-pink-600" />,
      lucideIcon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 to-rose-50", 
      borderGradient: "from-pink-200 to-rose-200",
      hoverShadow: "shadow-pink-200/50",
      description: "Trending names worldwide",
      pattern: "🔥❤️💖🌹"
    },
    {
      title: "Blog Articles",
      href: "/blog",
      icon: <BookOpen className="w-10 h-10 text-purple-600" />,
      lucideIcon: <Sparkles className="w-6 h-6" />,
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bgGradient: "from-purple-50 to-violet-50",
      borderGradient: "from-purple-200 to-violet-200", 
      hoverShadow: "shadow-purple-200/50",
      description: "Insights and guides",
      pattern: "📚✨📖🌟"
    }
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Quick Categories</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Jump straight to what you're looking for with our curated collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 max-w-7xl mx-auto animate-fadeInUp">
          {categories.map((category, index) => (
            <a 
              key={category.title}
              href={category.href}
              className="group relative block hover:y-[-8px] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
            >
              {/* Card Container */}
              <div className={`
                relative overflow-hidden rounded-3xl border-2 border-transparent
                bg-gradient-to-br ${category.bgGradient}
                hover:border-opacity-50 hover:${category.borderGradient}
                transition-all duration-300 ease-out
                hover:shadow-2xl hover:${category.hoverShadow}
                backdrop-blur-sm
              `}>
                {/* Animated Pattern Background */}
                <div className="absolute inset-0 opacity-5">
                  <div className="text-6xl flex flex-wrap gap-4 p-4 rotate-12 animate-spin-particles">
                    {category.pattern.split('').map((char, i) => (
                      <span key={i} className="animate-spin-slow">{char}</span>
                    ))}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${category.gradient} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300
                `} />

                {/* Content */}
                <div className="relative z-10 p-6 lg:p-8 text-center">
                  {/* Icon Container */}
                  <div className="relative mb-6 hover:scale-[1.1] hover:rotate-[5deg] transition-transform duration-300">
                    <div className={`
                      w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-2xl 
                      bg-gradient-to-br ${category.gradient}
                      flex items-center justify-center
                      shadow-lg group-hover:shadow-xl
                      transition-all duration-300
                      relative overflow-hidden
                    `}>
                      {/* Icon glow effect */}
                      <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Main icon */}
                      <div className="relative z-10 text-white">
                        {category.icon}
                      </div>

                      {/* Floating particles */}
                      <div className="absolute inset-0">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${20 + i * 25}%`,
                              top: `${15 + i * 20}%`
                            }}
                            className="animate-float"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-200">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm lg:text-base text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-200">
                    {category.description}
                  </p>

                  {/* Action indicator */}
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                    <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                      Explore
                    </span>
                    <div className="animate-spin-slow">
                      {category.lucideIcon}
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={`
                  absolute -inset-1 bg-gradient-to-r ${category.gradient} 
                  rounded-3xl opacity-0 group-hover:opacity-20 
                  transition-opacity duration-300 blur-xl -z-10
                `} />

                {/* External glow on hover */}
                <div className={`
                  absolute -inset-2 bg-gradient-to-r ${category.gradient} 
                  rounded-3xl opacity-0 blur-2xl -z-20
                `} 
                className="group-hover:opacity-15 transition-opacity duration-300"
                />
              </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 lg:mt-16 animate-fadeInUp">
          <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
            <span>Can't find what you're looking for?</span>
            <a 
              href="/search"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-2 underline-offset-2 hover:scale-[1.05] transition-transform duration-200"
            >
              Try advanced search
            </a>
            <span className="animate-spin-slow text-xl">🔍</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
