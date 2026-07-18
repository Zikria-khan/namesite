import Link from 'next/link';
import { getSiteUrl } from '@/lib/seo/site';
import { BookOpen, Heart, Star, ArrowRight, Sparkles, Award, CheckCircle, Users, Globe } from 'lucide-react';
import NativeBanner from '@/components/Ads/NativeBanner';

// 30-day cache — single source of truth: src/lib/cache/cache-config.js DEFAULT_CACHE_TTL_SECONDS
export const revalidate = 2592000;

export const metadata = {
  title: 'Expert Baby Naming Guide | How to Choose the Perfect Name | NameVerse',
  description: 'Complete expert guide to choosing the perfect baby name. Learn naming traditions across Islamic, Christian, and Hindu cultures with tips from naming specialists.',
  keywords: 'baby naming guide, how to choose baby name, expert naming tips, Islamic naming traditions, Christian naming traditions, Hindu naming traditions, baby name selection',
  alternates: {
    canonical: `${getSiteUrl()}/guides/expert-naming-guide`,
  },
  openGraph: {
    title: 'Expert Baby Naming Guide | NameVerse',
    description: 'Complete expert guide to choosing the perfect baby name across all religions and cultures.',
    type: 'article',
    url: `${getSiteUrl()}/guides/expert-naming-guide`,
  },
  robots: { index: true, follow: true },
};

export default function ExpertNamingGuidePage() {
  return (
    <main className="nv-page min-h-screen">
      <section className="nv-container nv-section">
        <div className="nv-card relative overflow-hidden p-6 text-center sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_10%_20%,rgba(79,70,229,0.16),transparent_44%),radial-gradient(circle_at_90%_10%,rgba(14,165,164,0.14),transparent_44%),radial-gradient(circle_at_30%_90%,rgba(245,158,11,0.16),transparent_46%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <Award className="h-4 w-4" />
              <span>Expert Guide</span>
            </div>
            <h1 className="nv-display mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              The Ultimate Guide to Choosing a Baby Name
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg">
              Everything you need to know about selecting a meaningful name for your baby.
            </p>
          </div>
        </div>
      </section>

      <nav className="nv-container -mt-2 pb-2" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li><Link href="/" className="font-medium text-slate-600 transition hover:text-slate-900">Home</Link></li>
          <li className="text-slate-300">/</li>
          <li><Link href="/blog" className="font-medium text-slate-600 transition hover:text-slate-900">Blog</Link></li>
          <li className="text-slate-300">/</li>
          <li className="font-medium text-slate-900">Expert Naming Guide</li>
        </ol>
      </nav>

      <article className="nv-container nv-section pt-2">
        <div className="nv-card-solid p-6 sm:p-10">
          
          {/* Native Banner 1 — After page title/intro */}
          <NativeBanner className="my-6" minHeight="90px" instanceId="expert-guide-1" />

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Your Baby's Name Matters</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Choosing a name for your baby is one of the most significant decisions you'll make as a parent. 
              A name is more than just a label—it carries meaning, cultural heritage, and spiritual significance 
              that will accompany your child throughout their life.
            </p>
            <p className="text-gray-600 leading-relaxed">
              In this comprehensive guide, we'll explore naming traditions across different religions and cultures, 
              provide expert tips for selecting the perfect name, and help you avoid common pitfalls.
            </p>
          </section>

          {/* Tips Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 10 Tips for Choosing a Baby Name</h2>
            <div className="space-y-4">
              {[
                { tip: 'Consider the meaning carefully', desc: 'A name with a positive meaning can inspire your child throughout their life.' },
                { tip: 'Think about pronunciation', desc: 'Choose a name that is easy to pronounce in your community.' },
                { tip: 'Check the initials', desc: 'Make sure the initials don\'t spell anything undesirable.' },
                { tip: 'Consider family traditions', desc: 'Honor family heritage while choosing a name that feels modern.' },
                { tip: 'Say it out loud', desc: 'Test how the name sounds with your surname.' },
                { tip: 'Research cultural significance', desc: 'Understand the cultural and religious context of the name.' },
                { tip: 'Think about nicknames', desc: 'Consider potential nicknames and whether you like them.' },
                { tip: 'Check popularity trends', desc: 'Decide if you want a unique name or a popular one.' },
                { tip: 'Get feedback from family', desc: 'Share your choices with trusted family members.' },
                { tip: 'Trust your instincts', desc: 'Ultimately, choose a name that feels right to you.' },
              ].map((item, index) => (
                <div key={index} className="flex gap-4 rounded-3xl border border-[rgba(15,23,42,0.10)] bg-white/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.tip}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Native Banner 2 — Mid-content */}
          <NativeBanner className="my-6" minHeight="90px" instanceId="expert-guide-2" />

          {/* Religion Sections */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Naming Traditions by Religion</h2>
            
            {/* Islamic */}
            <div className="mb-4 rounded-3xl border border-[rgba(15,23,42,0.10)] bg-white/60 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Star className="h-5 w-5 text-slate-700" /> Islamic Naming Traditions
              </h3>
              <p className="mb-3 text-sm leading-6 text-slate-600">
                In Islam, names carry deep spiritual significance. Parents often choose names with positive meanings 
                that reflect Islamic values and connect children to their faith heritage.
              </p>
              <Link href="/islamic/boy-names" className="inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-[color:var(--nv-accent-2)]">
                Browse Islamic Names <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Christian */}
            <div className="mb-4 rounded-3xl border border-[rgba(15,23,42,0.10)] bg-white/60 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Star className="h-5 w-5 text-slate-700" /> Christian Naming Traditions
              </h3>
              <p className="mb-3 text-sm leading-6 text-slate-600">
                Christian names often draw from Biblical sources, honoring prophets, saints, and virtuous qualities. 
                These names connect children to their spiritual heritage and faith community.
              </p>
              <Link href="/christian/boy-names" className="inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-[color:var(--nv-accent-2)]">
                Browse Christian Names <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Hindu */}
            <div className="mb-4 rounded-3xl border border-[rgba(15,23,42,0.10)] bg-white/60 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold text-slate-900">
                <Star className="h-5 w-5 text-slate-700" /> Hindu Naming Traditions
              </h3>
              <p className="mb-3 text-sm leading-6 text-slate-600">
                Hindu names are often derived from Sanskrit and connected to deities, virtues, and natural elements. 
                The Namakaran ceremony is a sacred ritual for naming a child.
              </p>
              <Link href="/hindu/boy-names" className="inline-flex items-center gap-1 font-semibold text-slate-900 transition hover:text-[color:var(--nv-accent-2)]">
                Browse Hindu Names <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Native Banner 3 — Before CTA/footer */}
          <NativeBanner className="my-6" minHeight="90px" instanceId="expert-guide-3" />

          {/* CTA */}
          <section className="nv-card text-center">
            <h2 className="nv-display text-2xl font-semibold text-slate-900">Ready to Find the Perfect Name?</h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Explore our database of 60,000+ baby names with meanings, origins, and numerology.
            </p>
            <Link
              href="/names/religion/islamic/1"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Heart className="w-5 h-5" />
              Browse All Names
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
