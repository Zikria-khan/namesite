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
      description: 'Arabic & Semitic Linguistic Roots',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'hindu',
      name: 'Hindu',
      icon: Sparkles,
      url: '/names/religion/hindu/1',
      count: '20,000+',
      description: 'Sanskrit & Dravidian Roots',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 'christian',
      name: 'Christian',
      icon: Award,
      url: '/names/religion/christian/1',
      count: '15,000+',
      description: 'Biblical Hebrew & Greek Roots',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  const features = [
    { icon: Star, text: 'Linguistic origin analysis' },
    { icon: ShieldCheck, text: 'Cultural semantic interpretation' },
    { icon: Languages, text: 'Islamic, Christian & Hindu traditions' }
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50" aria-label="NameVerse — Cultural Name Knowledge Base">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              <Star className="h-4 w-4 text-indigo-500" />
              NameVerse — Cultural Name Knowledge Base
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              NameVerse — Linguistic Origin Analysis & Cultural Name Research Across Civilizations.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              NameVerse is a Cultural Name Knowledge Base providing structured linguistic origin analysis, cultural semantic interpretation, and historical naming evolution research for personal names across Islamic, Christian, and Hindu traditions.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/40 transition hover:bg-indigo-700"
              >
                Search Cultural Names
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/names"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Browse All Research
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.text} className="rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-indigo-500" />
                      <span>{feature.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600">Quick research</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">Search names in seconds</h2>
              </div>
              <ShieldCheck className="h-6 w-6 text-indigo-500" />
            </div>

            <div className="mt-6">
              <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
                NameVerse instant search finds linguistic origin analysis data for Islamic, Christian, and Hindu personal names as you type. Select a cultural tradition to begin your research.
              </div>
              <div className="mt-4">
                <SearchBar />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={category.url}
                    className="group flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${category.gradient} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{category.count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;