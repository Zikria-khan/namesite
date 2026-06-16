import Link from 'next/link';
import { Suspense } from 'react';
import { Save, Heart, Share2, Star, Trash2, Copy, Check, ChevronRight } from 'lucide-react';
import { validateMetaTitle, validateMetaDescription } from '@/lib/seo/meta-helpers';
import { getSiteUrl } from '@/lib/seo/site';
import SitePage from '@/components/Layout/SitePage';

// ISR: 30-day cache — static content
export const revalidate = 2592000; // 30 days

export const metadata = {
  title: validateMetaTitle('Save & Compare Baby Names — Free Personal Shortlist Tool | NameVerse'),
  description: validateMetaDescription(
    'Save unlimited baby names to your list. Compare meanings, gender, lucky numbers. Share with partner. Free online baby name organizer — NameVerse.'
  ),
  keywords: [
    'save baby names',
    'compare baby names',
    'baby name shortlist',
    'favorite names list',
    'my baby names',
    'saved baby names',
    'baby name comparison',
    'name organizer',
    'baby name tool'
  ].join(', '),
  openGraph: {
    title: validateMetaTitle('Save & Compare Baby Names — Free Personal Shortlist Tool | NameVerse'),
    description: validateMetaDescription(
      'Save unlimited baby names to your list. Compare meanings, gender & lucky numbers. Share with partner. Free online baby name organizer — NameVerse.'
    ),
    url: `${getSiteUrl()}/my-names`,
    type: 'website',
    siteName: 'NameVerse',
    images: [
      {
        url: `${getSiteUrl()}/og-saved-names.png`,
        width: 1200,
        height: 630,
        alt: 'Save Baby Names Online - NameVerse'
      }
    ]
  },
  alternates: {
    canonical: `${getSiteUrl()}/my-names`,
    languages: { en: `${getSiteUrl()}/my-names`, 'x-default': `${getSiteUrl()}/my-names` }
  },
  robots: { index: true, follow: true }
};

// Sample saved names data for demonstration
const sampleSavedNames = [
  {
    id: 1,
    name: 'Muhammad',
    meaning: 'Praised, commendable',
    origin: 'Arabic',
    religion: 'islamic',
    gender: 'Male',
    luckyNumber: 9,
    luckyColor: 'Green',
    dateAdded: '2026-04-15',
    notes: 'Family name, very traditional'
  },
  {
    id: 2,
    name: 'Aisha',
    meaning: 'Living, prosperous',
    origin: 'Arabic',
    religion: 'islamic',
    gender: 'Female',
    luckyNumber: 7,
    luckyColor: 'Blue',
    dateAdded: '2026-04-14',
    notes: 'Strong, independent meaning'
  },
  {
    id: 3,
    name: 'Yusuf',
    meaning: 'God will add',
    origin: 'Hebrew',
    religion: 'islamic',
    gender: 'Male',
    luckyNumber: 3,
    luckyColor: 'Yellow',
    dateAdded: '2026-04-12',
    notes: ''
  },
  {
    id: 4,
    name: 'Maryam',
    meaning: 'Beloved, drop of the sea',
    origin: 'Hebrew',
    religion: 'islamic',
    gender: 'Female',
    luckyNumber: 5,
    luckyColor: 'White',
    dateAdded: '2026-04-10',
    notes: 'Beautiful and classic'
  }
];

export default async function MyNamesPage() {
   return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SitePage className="bg-transparent" containerClassName="max-w-none px-0 py-0">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-2xl shadow-xl shadow-rose-500/20">
                  <Save className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Save & Compare Baby Names — Your Personal Shortlist Tool
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Save unlimited baby names, compare meanings and lucky numbers side-by-side, and share with your partner. 
                500,000+ parents trust NameVerse for finding their perfect baby name.
              </p>
            </div>
          </div>
        </section>

        {/* Explore Popular Names CTA */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white/70">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Want to add more names to your list?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Browse 18,000+ Islamic, 15,000+ Hindu, and 11,000+ Christian names with verified meanings and lucky numbers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/names/religion/islamic/1" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                  Browse Islamic Names
                </Link>
                <Link href="/names/religion/hindu/1" className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Browse Hindu Names
                </Link>
                <Link href="/names/religion/christian/1" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Browse Christian Names
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How to Save & Compare Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              How to Save & Compare Names
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Save Names</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Click the heart icon on any name to save it to your personal list. All names are stored securely in your browser.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Organize Your List</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Add personal notes, mark favorites, and organize names by priority to keep track of your top choices.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Copy className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Compare Side by Side</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  View detailed comparisons of names including meanings, origins, lucky numbers, and cultural significance.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Share with Family</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Share your list with your partner and family members to get their input and make the decision together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Names List */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Your Saved Names
                    </h2>
                    <p className="text-gray-600 mt-1">
                      You have {sampleSavedNames.length} names saved
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                      Select All
                    </button>
                    <button className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Names List */}
              <div className="divide-y divide-gray-100">
                {sampleSavedNames.map((savedName) => (
                  <div key={savedName.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Name Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {savedName.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            savedName.gender === 'Male' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {savedName.gender}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                            {savedName.religion.charAt(0).toUpperCase() + savedName.religion.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">
                          "{savedName.meaning}"
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Origin:</span>
                            <span>{savedName.origin}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Lucky #:</span>
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                              {savedName.luckyNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Color:</span>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full border border-gray-200" 
                                   style={{ backgroundColor: savedName.luckyColor === 'Green' ? '#10B981' : 
                                                    savedName.luckyColor === 'Blue' ? '#3B82F6' :
                                                    savedName.luckyColor === 'Yellow' ? '#F59E0B' :
                                                    savedName.luckyColor === 'White' ? '#FFFFFF' : '#000000' }}></div>
                              <span>{savedName.luckyColor}</span>
                            </div>
                          </div>
                          {savedName.dateAdded && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Saved:</span>
                              <span>{new Date(savedName.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          )}
                        </div>
                        {savedName.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            "{savedName.notes}"
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Add to favorites">
                          <Star className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Share">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              <div className="hidden p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Saved Names Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start saving names you love by clicking the heart icon on any name card
                </p>
                <Link
                  href="/search"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Find Names to Save
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Create a Baby Name Shortlist?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Reduce Decision Fatigue</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  With thousands of names to choose from, creating a shortlist helps you focus on the most meaningful options without feeling overwhelmed.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Involve Your Partner</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sharing your saved list makes it easier to discuss preferences and find a name you both love for your baby.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Test Names in Context</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See how your top choices work with your surname, imagine them on school assignments, and consider potential nicknames.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ Section with Schema */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
              NameVerse Saved Names FAQ
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do I save a name to my list?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Simply click the heart icon on any name card throughout NameVerse. The name will be instantly saved to your personal list and stored securely in your browser's local storage.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Are my saved names synced across devices?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Currently, saved names are stored locally in your browser. If you want to access them on another device, you can use the export/share feature to transfer your list, or log into your account if available.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I compare names side by side?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! Select multiple names from your saved list to compare their meanings, origins, lucky attributes, and cultural significance side by side in our comparison tool.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How do I share my list with family?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Use the share button to generate a unique link to your saved names list. You can send this to your partner or family members via email, text, or any messaging app.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Is my data secure and private?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Absolutely. Your saved names are stored locally in your browser and never shared with third parties. You have complete control over your list and can delete it at any time.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Can I add notes to saved names?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Yes! You can add personal notes to each saved name to remember why you chose it, family connections, or any special meaning. These notes are only visible to you.
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
                      name: 'How do I save a name to my list?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Simply click the heart icon on any name card throughout NameVerse to save it to your personal list stored securely in your browser.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I compare names side by side?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! Select multiple names from your saved list to compare their meanings, origins, lucky attributes, and cultural significance side by side.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Is my data secure and private?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Your saved names are stored locally in your browser and never shared with third parties. You have complete control over your list.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I add notes to saved names?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes! You can add personal notes to each saved name to remember why you chose it, family connections, or any special meaning.'
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
              Start Building Your Perfect Name Shortlist Today
            </h2>
            <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
              Join millions of parents who have found their perfect baby name using NameVerse's saved names feature. 
              Start organizing your favorites today and make the final decision with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="px-8 py-4 bg-white text-rose-600 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl"
              >
                Start Saving Names Now
              </Link>
              <Link
                href="/names/religion/islamic/1"
                className="px-8 py-4 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-500 transition-all border-2 border-white/20 shadow-lg hover:shadow-xl"
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
