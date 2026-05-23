'use client';

import { motion } from 'framer-motion';
import { Globe, Award, Languages, ShieldCheck, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import SearchBar from './SearchSection';
import Link from 'next/link';
import './styles/animations.css';

const HeroSection = () => {
  const categories = [
    {
      id: 'islamic',
      name: 'Islamic',
      icon: Globe,
      url: '/names/religion/islamic/1',
      count: '25,000+',
      description: 'Quranic & Arabic',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'hindu',
      name: 'Hindu',
      icon: Sparkles,
      url: '/names/religion/hindu/1',
      count: '20,000+',
      description: 'Sanskrit & Vedic',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'christian',
      name: 'Christian',
      icon: Award,
      url: '/names/religion/christian/1',
      count: '15,000+',
      description: 'Biblical & Modern',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const features = [
    { icon: Star, text: 'Trusted by 5M+ parents' },
    { icon: ShieldCheck, text: 'Verified meanings' },
    { icon: Languages, text: '15+ languages' }
  ];

  const constellation = [
    { letter: 'A', className: 'left-[6%] top-[14%] rotate-[-12deg]', delay: 0.1 },
    { letter: 'Z', className: 'left-[12%] top-[58%] rotate-[10deg]', delay: 0.35 },
    { letter: 'ن', className: 'left-[22%] top-[32%] rotate-[8deg]', delay: 0.2 },
    { letter: 'م', className: 'right-[18%] top-[18%] rotate-[-10deg]', delay: 0.25 },
    { letter: 'श', className: 'right-[9%] top-[44%] rotate-[11deg]', delay: 0.42 },
    { letter: 'E', className: 'right-[16%] top-[70%] rotate-[-6deg]', delay: 0.16 }
  ];

  return (
    <section className="relative w-full overflow-hidden" aria-label="NameVerse hero section">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: [
            'radial-gradient(900px circle at 15% 15%, rgba(79, 70, 229, 0.25), transparent 58%)',
            'radial-gradient(760px circle at 82% 18%, rgba(14, 165, 164, 0.28), transparent 60%)',
            'radial-gradient(740px circle at 70% 85%, rgba(245, 158, 11, 0.18), transparent 55%)',
            'linear-gradient(to bottom, rgba(247, 245, 240, 1), rgba(255, 255, 255, 1))'
          ].join(', ')
        }}
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(11,16,32,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(11,16,32,0.09) 1px, transparent 1px)',
            backgroundSize: '38px 38px'
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {constellation.map((item) => (
          <motion.div
            key={`${item.letter}-${item.delay}`}
            className={`absolute ${item.className} nv-float`}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: item.delay }}
            style={{ animationDelay: `${item.delay}s` }}
          >
            <div className="rounded-2xl border border-[color:var(--nv-border)] bg-white/70 px-4 py-3 shadow-[0_18px_50px_-35px_var(--nv-shadow)] backdrop-blur">
              <span className="nv-display text-xl font-semibold text-[color:var(--nv-ink)]">{item.letter}</span>
            </div>
          </motion.div>
        ))}
      </div>

       <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16">
         <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 items-start">
           <div className="text-left">
             <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-white/70 px-4 py-2 backdrop-blur animate-fadeInUp">
               <Star className="h-4 w-4 text-[color:var(--nv-accent-2)]" />
               <span className="text-sm font-semibold text-[color:var(--nv-ink)]">
                 65,000+ baby names with verified meanings
               </span>
             </div>

             <h1 className="nv-display mt-6 text-[2.15rem] leading-[1.04] text-[color:var(--nv-ink)] sm:text-[3rem] lg:text-[3.4rem] animate-fadeInUp">
               Find a name that sounds beautiful and carries meaning.
             </h1>

             <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--nv-muted)] sm:text-lg animate-fadeInUp">
               Search by religion, gender, letter, and meaning. Compare favorites, read cultural context, and pick with confidence.
             </p>

             <div className="mt-7 flex flex-wrap gap-2.5">
               {features.map((feature) => {
                 const Icon = feature.icon;
                 return (
                   <div
                     key={feature.text}
                     className="inline-flex items-center gap-2 rounded-full border border-[color:var(--nv-border)] bg-white/60 px-4 py-2 text-sm font-medium text-[color:var(--nv-ink)] backdrop-blur animate-fadeInUp"
                   >
                     <Icon className="h-4 w-4 text-[color:var(--nv-accent)]" />
                     {feature.text}
                   </div>
                 );
               })}
             </div>

             <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
               <Link
                 href="/names"
                 className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--nv-ink)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_-30px_var(--nv-shadow)] transition hover:translate-y-[-1px] hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[color:var(--nv-accent-2)] animate-fadeInUp"
               >
                 Browse all names
                 <ArrowUpRight className="h-4 w-4" />
               </Link>
               <Link
                 href="/advanced-search"
                 className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--nv-border)] bg-white/60 px-5 py-3 text-sm font-semibold text-[color:var(--nv-ink)] backdrop-blur transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[color:var(--nv-accent-2)] animate-fadeInUp"
               >
                 Advanced filters
                 <ArrowUpRight className="h-4 w-4" />
               </Link>
             </div>
           </div>

           <div className="relative animate-fadeInUp">
             <div className="nv-surface rounded-[28px] p-4 sm:p-6">
               <div className="flex items-center justify-between gap-3">
                 <div>
                   <p className="text-sm font-semibold text-[color:var(--nv-ink)]">Search instantly</p>
                   <p className="text-xs text-[color:var(--nv-muted)]">Meaning, origin, lucky number, pronunciation</p>
                 </div>
                 <div className="hidden sm:flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-[color:var(--nv-ink)]">
                   <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--nv-accent)]" />
                   Verified
                 </div>
               </div>

               <div className="mt-4">
                 <SearchBar />
               </div>

               <div className="mt-5 grid gap-3 sm:grid-cols-3">
                 {categories.map((category) => {
                   const Icon = category.icon;
                   return (
                     <Link
                       key={category.id}
                       href={category.url}
                       className="group rounded-2xl border border-[color:var(--nv-border)] bg-white/55 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/75 focus:outline-none focus:ring-2 focus:ring-[color:var(--nv-accent-2)]"
                     >
                       <div className="flex items-start justify-between gap-3">
                         <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-[0_18px_40px_-32px_var(--nv-shadow)]`}>
                           <Icon className="h-5 w-5" />
                         </div>
                         <span className="text-xs font-semibold text-[color:var(--nv-muted)]">{category.count}</span>
                       </div>
                       <div className="mt-3">
                         <p className="text-sm font-semibold text-[color:var(--nv-ink)]">
                           {category.name}
                         </p>
                         <p className="text-xs text-[color:var(--nv-muted)]">{category.description}</p>
                       </div>
                       <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--nv-ink)] opacity-80 group-hover:opacity-100">
                         Explore
                         <ArrowUpRight className="h-3.5 w-3.5" />
                       </div>
                     </Link>
                   );
                 })}
               </div>
             </div>
           </div>
         </div>
       </div>
    </section>
  );
};

export default HeroSection;
