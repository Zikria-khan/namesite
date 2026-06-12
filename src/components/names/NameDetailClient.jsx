"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles, Book, Heart, Brain, Gem, Calendar, Hash,
  Languages, Volume2, Users, Link2, Share2, Bookmark, TrendingUp,
  Globe, ChevronDown, ChevronUp, Home, AlignLeft, History, Star,
  MessageCircle, Copy, Check, ExternalLink, Palette
} from 'lucide-react'
import FavoriteButton from '@/components/FavoriteButton'
import { createSafeSlug } from '@/lib/utils/createSafeSlug'

// Religion-based theme configuration
const religionThemes = {
  islamic: {
    primary: "#059669",
    secondary: "#047857",
    accent: "#D97706",
    gradient: "from-emerald-600 to-teal-600",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    bgSoft: "bg-emerald-50/50"
  },
  christian: {
    primary: "#2563eb",
    secondary: "#1d4ed8",
    accent: "#dc2626",
    gradient: "from-blue-600 to-indigo-600",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    bgSoft: "bg-blue-50/50"
  },
  hindu: {
    primary: "#ea580c",
    secondary: "#c2410c",
    accent: "#fbbf24",
    gradient: "from-orange-600 to-amber-600",
    light: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    bgSoft: "bg-orange-50/50"
  }
}

// Translation tabs configuration (tabs ONLY for translations)
const translationTabs = [
  { id: 'english', label: 'English', flag: '🇺🇸' },
  { id: 'urdu', label: 'Urdu', flag: '🇵🇰' },
  { id: 'arabic', label: 'Arabic', flag: '🇸🇦' },
  { id: 'hindi', label: 'Hindi', flag: '🇮🇳' },
]

// Mobile navigation sections
const mobileNavSections = [
  { id: 'hero', label: 'Name', icon: Star },
  { id: 'meaning', label: 'Meaning', icon: AlignLeft },
  { id: 'translations', label: 'Languages', icon: Languages },
  { id: 'personality', label: 'Personality', icon: Brain },
  { id: 'lucky', label: 'Lucky', icon: Star },
  { id: 'faq', label: 'FAQ', icon: MessageCircle },
  { id: 'related', label: 'Similar', icon: Link2 },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
]

// Get color hex for lucky colors
const getColorHex = (colorName) => {
  const colors = {
    red: '#EF4444', blue: '#3B82F6', green: '#10B981', yellow: '#F59E0B',
    purple: '#A855F7', pink: '#EC4899', orange: '#F97316', teal: '#14B8A6',
    indigo: '#6366F1', emerald: '#10B981', rose: '#F43F5E', amber: '#F59E0B'
  }
  return colors[colorName?.toLowerCase()] || '#6B7280'
}

// Accessible Badge Component
const Badge = ({ children, variant = 'default', className = '', icon: Icon, ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    outline: 'bg-transparent border-2 border-gray-200 text-gray-700',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  )
}

// Card Component with consistent styling
const Card = ({ children, className = '', hover = true, ...props }) => (
  <div
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-300' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
)

// Section Title Component
const SectionTitle = ({ icon: Icon, title, subtitle, theme, id }) => (
  <div className="mb-6" id={id}>
    <div className="flex items-center gap-3 mb-2">
      {Icon && (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    {subtitle && <p className="text-gray-600 ml-13">{subtitle}</p>}
  </div>
)

// Translation Card Component
const TranslationCard = ({ language, nativeName, meaning, longMeaning, flag }) => {
  const [expanded, setExpanded] = useState(false)
  const isRTL = ['Arabic', 'Urdu', 'Pashto', 'Hebrew'].includes(language)

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl" role="img" aria-label={`${language} flag`}>{flag}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{language}</h4>
          </div>
        </div>
      </div>

      <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Name</span>
          <p className={`text-xl font-bold text-gray-900 ${isRTL ? 'font-arabic' : ''}`}>{nativeName}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Meaning</span>
          <p className="text-sm text-gray-700 leading-relaxed">{meaning}</p>
        </div>

        {longMeaning && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Show Less' : 'More Details'}
          </button>
        )}
        {expanded && longMeaning && (
          <p className="text-sm text-gray-600 leading-relaxed mt-2 pt-2 border-t border-gray-100">
            {longMeaning}
          </p>
        )}
      </div>
    </Card>
  )
}

// FAQ Item Component with accordion for mobile
const FAQItem = ({ question, answer, isOpen, onToggle, isMobile }) => {
  if (isMobile) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200">
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center transition-colors"
          aria-expanded={isOpen}
        >
          <span className="pr-8">{question}</span>
          <ChevronDown
            size={20}
            className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div className="px-6 pb-4 text-gray-700 leading-relaxed border-t border-gray-200 animate-in slide-in-from-top-2">
            {answer}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="font-semibold text-gray-900">{question}</div>
      <div className="text-gray-700 leading-relaxed">{answer}</div>
    </div>
  )
}

// Main Component
export default function NameDetailClient({ data, initialLanguage }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTranslationTab, setActiveTranslationTab] = useState('english')
  const [openFAQ, setOpenFAQ] = useState(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeMobileSection, setActiveMobileSection] = useState('hero')

  const religion = data.religion?.toLowerCase() || 'islamic'
  const theme = religionThemes[religion] || religionThemes.islamic

  // Detect mobile
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  }, [])

  // Track scroll position and active section
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const scrollY = window.scrollY

      // Update active mobile section based on scroll position
      const sections = mobileNavSections.map(section => {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          return { id: section.id, top: rect.top + scrollY }
        }
        return null
      }).filter(Boolean)

      const currentSection = sections.reduce((closest, section) => {
        return Math.abs(section.top - scrollY) < Math.abs(closest.top - scrollY) ? section : closest
      }, sections[0])

      if (currentSection) {
        setActiveMobileSection(currentSection.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get native script name
  const nativeScriptName = data.in_arabic?.name || data.in_hebrew?.name || data.in_sanskrit?.name || data.name

  // Available translations
  const availableTranslations = useMemo(() => {
    const translations = []
    if (data.in_arabic) translations.push({ key: 'in_arabic', language: 'Arabic', flag: '🇸🇦', ...data.in_arabic })
    if (data.in_urdu) translations.push({ key: 'in_urdu', language: 'Urdu', flag: '🇵🇰', ...data.in_urdu })
    if (data.in_hindi) translations.push({ key: 'in_hindi', language: 'Hindi', flag: '🇮🇳', ...data.in_hindi })
    if (data.in_pashto) translations.push({ key: 'in_pashto', language: 'Pashto', flag: '🇦🇫', ...data.in_pashto })
    if (data.in_hebrew) translations.push({ key: 'in_hebrew', language: 'Hebrew', flag: '🇮🇱', ...data.in_hebrew })
    if (data.in_greek) translations.push({ key: 'in_greek', language: 'Greek', flag: '🇬🇷', ...data.in_greek })
    if (data.in_latin) translations.push({ key: 'in_latin', language: 'Latin', flag: '🏛️', ...data.in_latin })
    if (data.in_sanskrit) translations.push({ key: 'in_sanskrit', language: 'Sanskrit', flag: '🕉️', ...data.in_sanskrit })
    if (data.in_tamil) translations.push({ key: 'in_tamil', language: 'Tamil', flag: '🇮🇳', ...data.in_tamil })
    if (data.in_telugu) translations.push({ key: 'in_telugu', language: 'Telugu', flag: '🇮🇳', ...data.in_telugu })
    return translations
  }, [data])

  // Current translation data
  const currentTranslation = useMemo(() => {
    const tabMap = {
      english: data.in_english || { name: data.name, meaning: data.short_meaning || data.long_meaning },
      urdu: data.in_urdu,
      arabic: data.in_arabic,
      hindi: data.in_hindi
    }
    return tabMap[activeTranslationTab] || tabMap.english
  }, [data, activeTranslationTab])

  // Load favorites
  useEffect(() => {
    if (!mounted) return
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteNames') || '[]')
      setIsFavorite(favorites.includes(data.slug || createSafeSlug(data.name)))
    } catch (localErr) {
      // Corrupted localStorage — silently reset favorites list
      localStorage.removeItem('favoriteNames');
      setIsFavorite(false);
    }
  }, [data, mounted])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // Handle FAQ toggle
  const handleFAQToggle = useCallback((index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }, [openFAQ])

  // Generate FAQ data (coerce all scalar values to strings to avoid "object as child" errors)
  const faqData = useMemo(() => data.seo?.faq || [
    {
      q: `What does the name ${data.name} mean?`,
      a: String(data.long_meaning || data.short_meaning || data.meaning || `${data.name} is a beautiful ${religion} name.`),
    },
    {
      q: `What is the origin of ${data.name}?`,
      a: `${data.name} originates from ${data.origin || 'ancient traditions'} and is commonly used in ${religion} cultures.`,
    },
    {
      q: `Is ${data.name} a ${data.gender} name?`,
      a: `Yes, ${data.name} is traditionally used as a ${data.gender} name in ${religion} families.`,
    },
    {
      q: `How do you pronounce ${data.name}?`,
      a: data.pronunciation?.english
        ? `${data.name} is pronounced as "${data.pronunciation.english}" in English.`
        : `${data.name} has a unique pronunciation that varies by culture and region.`,
    }
  ], [data, religion])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around py-2 px-2">
            {mobileNavSections.map((section) => {
              const Icon = section.icon
              const isActive = activeMobileSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  aria-label={`Go to ${section.label} section`}
                >
                  <Icon size={18} />
                  <span className="text-xs mt-1">{section.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header id="hero" className={`bg-gradient-to-br ${theme.gradient} pt-24 pb-16 px-4 relative`}>
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-white/80 flex-wrap" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={14} />
              <span>Home</span>
            </a>
            <span className="text-white/60">/</span>
            <a href={`/names/religion/${religion}/1`} className="hover:text-white transition-colors">Names</a>
            <span className="text-white/60">/</span>
            <a href={`/names/religion/${religion}/1`} className="hover:text-white transition-colors capitalize">{religion}</a>
            <span className="text-white/60">/</span>
            <span className="text-white font-semibold">{data.name}</span>
          </nav>

          {/* Main Content */}
          <div className="text-center">
            {/* Name */}
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                {data.name}
              </h1>
              <div className="flex items-center gap-2">
                <FavoriteButton
                  nameData={{
                    name: data.name,
                    slug: data.slug || createSafeSlug(data.name),
                    religion: data.religion?.toLowerCase() === 'islam' ? 'islamic' : data.religion?.toLowerCase(),
                    meaning: data.short_meaning || data.long_meaning || data.meaning,
                    origin: data.origin
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(data.name)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                  aria-label="Copy name to clipboard"
                  title="Copy name"
                >
                  {copied ? <Check size={24} /> : <Copy size={24} />}
                </button>
              </div>
            </div>

            {/* Native Script */}
            {nativeScriptName !== data.name && (
              <p className="text-2xl sm:text-3xl text-white/90 mb-6 font-arabic">
                {nativeScriptName}
              </p>
            )}

            {/* Quick Info Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-white/90 text-sm mb-1">Religion</div>
                  <div className="text-white font-semibold capitalize">{religion}</div>
                </div>
                <div>
                  <div className="text-white/90 text-sm mb-1">Origin</div>
                  <div className="text-white font-semibold">{data.origin || 'Ancient'}</div>
                </div>
                <div>
                  <div className="text-white/90 text-sm mb-1">Gender</div>
                  <div className="text-white font-semibold capitalize">{data.gender || 'Unisex'}</div>
                </div>
                <div>
                  <div className="text-white/90 text-sm mb-1">Lucky Number</div>
                  <div className="text-white font-semibold">{data.lucky_number || '?'}</div>
                </div>
              </div>
            </div>

            {/* Meaning */}
            <p className="text-xl sm:text-2xl text-white/95 mb-8 max-w-2xl mx-auto font-medium">
              &ldquo;{data.short_meaning || data.meaning}&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${data.name} - Baby Name Meaning`,
                      text: `${data.name}: ${data.short_meaning}`,
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={() => {
                  try {
                    const favorites = JSON.parse(localStorage.getItem('favoriteNames') || '[]')
                    const nameId = data.slug || createSafeSlug(data.name)

                    if (favorites.includes(nameId)) {
                      const updated = favorites.filter(id => id !== nameId)
                      localStorage.setItem('favoriteNames', JSON.stringify(updated))
                      setIsFavorite(false)
                    } else {
                      favorites.push(nameId)
                      localStorage.setItem('favoriteNames', JSON.stringify(favorites))
                      setIsFavorite(true)
                    }
                  } catch (error) {
                  }
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl ${
                  isFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Bookmark size={18} className={isFavorite ? 'fill-white' : ''} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable Layout */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-20 md:pb-8">

        {/* Meaning Section */}
        <section className="mb-12">
          <SectionTitle
            icon={AlignLeft}
            title="Name Meaning"
            subtitle="Complete meaning and significance"
            theme={theme}
            id="meaning"
          />
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">What Does {data.name} Mean?</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {data.long_meaning || data.short_meaning}
            </p>
            {data.spiritual_meaning && (
              <div className="bg-blue-50 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">Spiritual Significance</h4>
                <p className="text-blue-800">{data.spiritual_meaning}</p>
              </div>
            )}
          </Card>
        </section>

        {/* Translation Tabs Section */}
        <section className="mb-12">
          <SectionTitle
            icon={Languages}
            title="Translations & Languages"
            subtitle="How the name is written and understood across cultures"
            theme={theme}
            id="translations"
          />
          <Card>
            {/* Translation Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {translationTabs.map((tab) => {
                const hasData = tab.id === 'english' || data[`in_${tab.id}`]
                if (!hasData) return null
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTranslationTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeTranslationTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{tab.flag}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Current Translation Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Name</h4>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  {currentTranslation?.name || data.name}
                </p>
                {currentTranslation?.pronunciation && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Pronunciation:</span> {currentTranslation.pronunciation}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Meaning</h4>
                <p className="text-gray-700 leading-relaxed">
                  {currentTranslation?.meaning || currentTranslation?.long_meaning || data.short_meaning}
                </p>
                {currentTranslation?.long_meaning && currentTranslation.long_meaning !== currentTranslation.meaning && (
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                    {currentTranslation.long_meaning}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Personality Traits Section */}
        <section className="mb-12">
          <SectionTitle
            icon={Brain}
            title="Personality Traits"
            subtitle="Characteristics associated with the name"
            theme={theme}
            id="personality"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {data.emotional_traits && data.emotional_traits.length > 0 && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="text-rose-500" size={24} />
                  <h3 className="font-bold text-gray-900 text-lg">Emotional Traits</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.emotional_traits.map((trait) => (
                    <Badge key={trait} className="bg-rose-50 text-rose-700">{trait}</Badge>
                  ))}
                </div>
              </Card>
            )}
            {data.hidden_personality_traits && data.hidden_personality_traits.length > 0 && (
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-amber-500" size={24} />
                  <h3 className="font-bold text-gray-900 text-lg">Hidden Traits</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.hidden_personality_traits.map((trait) => (
                    <Badge key={trait} className="bg-amber-50 text-amber-700">{trait}</Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Lucky Traits Section */}
        <section className="mb-12">
          <SectionTitle
            icon={Star}
            title="Lucky Attributes"
            subtitle="Numerology and lucky elements"
            theme={theme}
            id="lucky"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {data.lucky_number && (
              <Card className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                  {data.lucky_number}
                </div>
                <div className="text-sm text-gray-600">Lucky Number</div>
              </Card>
            )}
            {data.lucky_day && (
              <Card className="text-center">
                <Calendar className={`mx-auto mb-3 ${theme.text}`} size={32} />
                <div className="text-xl font-bold text-gray-900 mb-1">{data.lucky_day}</div>
                <div className="text-sm text-gray-600">Lucky Day</div>
              </Card>
            )}
            {data.lucky_stone && (
              <Card className="text-center">
                <Gem className="text-purple-500 mx-auto mb-3" size={32} />
                <div className="text-xl font-bold text-gray-900 mb-1">{data.lucky_stone}</div>
                <div className="text-sm text-gray-600">Lucky Stone</div>
              </Card>
            )}
          </div>
          {data.lucky_colors && data.lucky_colors.length > 0 && (
            <Card className="mt-6">
              <SectionTitle icon={Palette} title="Lucky Colors" theme={theme} />
              <div className="flex flex-wrap gap-4">
                {data.lucky_colors.map((color) => (
                  <div key={color.toLowerCase()} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full shadow-md mb-2 border-2 border-white"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                    <span className="text-xs text-gray-600 capitalize">{color}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* FAQs Section */}
        <section className="mb-12">
          <SectionTitle
            icon={MessageCircle}
            title="Frequently Asked Questions"
            subtitle="Common questions about the name"
            theme={theme}
            id="faq"
          />
          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <FAQItem
                key={faq.q || idx}
                question={faq.q}
                answer={faq.a}
                isOpen={openFAQ === idx}
                onToggle={() => handleFAQToggle(idx)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </section>

        {/* Related Names Section */}
        <section className="mb-12">
          <SectionTitle
            icon={Link2}
            title="Similar Names"
            subtitle="Names with similar meanings or sounds"
            theme={theme}
            id="related"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.similar_sounding_names?.filter((n) => {
              // Validate: must be a real name string, not garbage data
              if (!n || typeof n !== 'string') return false;
              const slug = createSafeSlug(n.trim());
              return slug && slug.length >= 2;
            }).slice(0, 8).map((similarName) => (
              <Link
                key={similarName}
                href={`/names/${religion}/${createSafeSlug(similarName.trim())}`}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
              >
                <div className="font-semibold text-blue-600">{similarName}</div>
                <div className="text-xs text-gray-500 mt-1">Similar Sound</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Names Section */}
        <section className="mb-12">
          <SectionTitle
            icon={TrendingUp}
            title="Trending Names"
            subtitle="Popular names in this category"
            theme={theme}
            id="trending"
          />
          <Card>
            <p className="text-gray-600 text-center py-8">
              Trending names feature coming soon. Check back for popular {religion} names!
            </p>
          </Card>
        </section>

        {/* Internal Linking Section */}
        <section className="mb-12">
          <SectionTitle
            icon={ExternalLink}
            title="Explore More"
            subtitle="Related categories and collections"
            theme={theme}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href={`/names/${religion}`}
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center hover:shadow-md transition-all"
            >
              <div className="font-semibold text-blue-700">All {religion.charAt(0).toUpperCase() + religion.slice(1)} Names</div>
              <div className="text-xs text-blue-600 mt-1">Browse Complete List</div>
            </Link>
            <Link
              href={`/names/${religion}/letter/${data.name.charAt(0).toUpperCase()}/1`}
              className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center hover:shadow-md transition-all"
            >
              <div className="font-semibold text-green-700">Names Starting with {data.name.charAt(0).toUpperCase()}</div>
              <div className="text-xs text-green-600 mt-1">Letter {data.name.charAt(0).toUpperCase()}</div>
            </Link>
            {data.gender && (
              <Link
                href={`/${religion}/${data.gender}-names`}
                className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center hover:shadow-md transition-all"
              >
                <div className="font-semibold text-purple-700">{data.gender.charAt(0).toUpperCase() + data.gender.slice(1)} Names</div>
                <div className="text-xs text-purple-600 mt-1">{religion.charAt(0).toUpperCase() + religion.slice(1)} {data.gender}s</div>
              </Link>
            )}
            <Link
              href={`/search`}
              className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 text-center hover:shadow-md transition-all"
            >
              <div className="font-semibold text-orange-700">Search Names</div>
              <div className="text-xs text-orange-600 mt-1">Find Your Perfect Name</div>
            </Link>
          </div>
        </section>

      </main>

      {/* Footer CTA */}
      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Found the Perfect Name?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Share {data.name} with your loved ones or save it to your favorites for later.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${data.name} - Baby Name Meaning`,
                    text: `${data.name}: ${data.short_meaning}`,
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }
              }}
              className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2`}
            >
              <Share2 size={18} />
              Share Name
            </button>
            <button
              onClick={() => {
                try {
                  const favorites = JSON.parse(localStorage.getItem('favoriteNames') || '[]')
                  const nameId = data.slug || createSafeSlug(data.name)

                  if (favorites.includes(nameId)) {
                    const updated = favorites.filter(id => id !== nameId)
                    localStorage.setItem('favoriteNames', JSON.stringify(updated))
                    setIsFavorite(false)
                  } else {
                    favorites.push(nameId)
                    localStorage.setItem('favoriteNames', JSON.stringify(favorites))
                    setIsFavorite(true)
                  }
                } catch (error) {
                }
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 border-2 ${
                isFavorite
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Bookmark size={18} className={isFavorite ? 'fill-white' : ''} />
              {isFavorite ? 'Saved' : 'Save Name'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
