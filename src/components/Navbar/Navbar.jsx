'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Sparkles, Heart, BookOpen, ChevronDown, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

/**
 * NameVerse Navbar Component
 * - Clean responsive design
 * - Smooth dropdowns
 * - Mobile-friendly menu
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const pathname = usePathname();

  // Handle mount state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileOpenSection(null);
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setActiveDropdown(null);
        setMobileOpenSection(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveDropdown(null);
        setMobileOpenSection(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const scrollPositionRef = useRef(0);
  const desktopNavRef = useRef(null);

  // Prevent body scroll when mobile menu is open, while preserving page position
  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY || window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!activeDropdown) return;
      if (!desktopNavRef.current) return;
      if (!desktopNavRef.current.contains(event.target)) setActiveDropdown(null);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [activeDropdown]);



  const categoryLinks = {
    name: 'Names',
    icon: Sparkles,
    subLinks: [
      { name: '👶 All Baby Names', href: '/names' },
      { name: '🕌 Islamic Boy Names', href: '/islamic/boy-names' },
      { name: '🕌 Islamic Girl Names', href: '/islamic/girl-names' },
      { name: '✝️ Christian Boy Names', href: '/christian/boy-names' },
      { name: '✝️ Christian Girl Names', href: '/christian/girl-names' },
      { name: '🔱 Hindu Boy Names', href: '/hindu/boy-names' },
      { name: '🔱 Hindu Girl Names', href: '/hindu/girl-names' },
      { name: '📝 Name Meanings', href: '/name-meanings' },
      { name: '🔤 Names by Letter', href: '/names/islamic/letter/A/1' },
      { name: '🌍 Names by Origin', href: '/names/islamic/origin/arabic/1' },
    ],
  };

  const resourceLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'Expert Guides', href: '/guides/expert-naming-guide' },
    { name: 'Saved Names', href: '/my-names' },
  ];

  const exploreLinks = [
    { name: '📈 Trending Names 2026', href: '/trending-names' },
    { name: '✨ Unique Names', href: '/unique-names' },
    { name: '⭐ Popular Names', href: '/popularity' },
    { name: '📖 Name Meanings', href: '/name-meanings' },
    { name: '🔍 Browse by Meaning', href: '/names-by-meaning' },
    { name: '🌍 Names by Language', href: '/languages' },
    { name: '🔤 Names by Letter A–Z', href: '/names/islamic/letter/A/1' },
    { name: '🔎 Advanced Search', href: '/advanced-search' },
    { name: '🔎 Search Names', href: '/search' },
  ];

  const directLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ];

  const normalizePath = (path) => {
    if (!path) return '/';
    const withoutQuery = path.split('?')[0];
    if (withoutQuery !== '/' && withoutQuery.endsWith('/')) return withoutQuery.slice(0, -1);
    return withoutQuery || '/';
  };

  const currentPath = normalizePath(pathname);
  const isActive = (href) => {
    const target = normalizePath(href);
    if (target === '/') return currentPath === '/';
    return currentPath === target || currentPath.startsWith(`${target}/`);
  };

  // Don't render until mounted
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-[100] bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 animate-pulse" />
                <div className="w-24 h-6 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-1' 
        : 'bg-white py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
              <Link href="/" title="Go to NameVerse home" aria-label="NameVerse Home" className="flex items-center gap-2 group logo4">
                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-all group-hover:scale-110 shadow-md logo4">
                  <Image
                    src="/logo.png"
                    alt="NameVerse Logo"
                    width={36}
                    height={36}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  NameVerse
                </span>
              </Link>
          </div>

          {/* Desktop Search removed */}

          {/* Desktop Navigation */}
          <div ref={desktopNavRef} className="hidden lg:flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'names' ? null : 'names')}
                className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition duration-200 ${
                  activeDropdown === 'names' || isActive('/names')
                    ? 'shadow-sm border-indigo-200 bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
                aria-expanded={activeDropdown === 'names'}
              >
                Names
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'names' ? 'rotate-180' : ''
                }`} />
              </button>

              {activeDropdown === 'names' && (
                <div className="absolute left-0 top-full mt-2 min-w-[260px] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="py-2">
                    {categoryLinks.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        className={`block px-5 py-3 transition-all duration-200 ${
                          isActive(subLink.href)
                            ? 'bg-indigo-50 text-indigo-800'
                            : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium">{subLink.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition duration-200 ${
                  activeDropdown === 'explore' || isActive('/trending-names') || isActive('/unique-names') || isActive('/popularity') || isActive('/languages') || isActive('/names-by-meaning') || isActive('/advanced-search') || isActive('/search') || isActive('/name-meanings')
                    ? 'shadow-sm border-purple-200 bg-purple-50 text-purple-700'
                    : 'text-slate-700 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                }`}
                aria-expanded={activeDropdown === 'explore'}
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'explore' ? 'rotate-180' : ''
                }`} />
              </button>

              {activeDropdown === 'explore' && (
                <div className="absolute left-0 top-full mt-2 min-w-[280px] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="py-2">
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`block px-5 py-3 transition-all duration-200 ${
                          isActive(link.href)
                            ? 'bg-purple-50 text-purple-800'
                            : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium">{link.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')}
                className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition duration-200 ${
                  activeDropdown === 'resources' || isActive('/blog') || isActive('/guides') || isActive('/my-names')
                    ? 'shadow-sm border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
                aria-expanded={activeDropdown === 'resources'}
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  activeDropdown === 'resources' ? 'rotate-180' : ''
                }`} />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute left-0 top-full mt-2 min-w-[240px] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="py-2">
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`block px-5 py-3 transition-all duration-200 ${
                          isActive(link.href)
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-medium">{link.name}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {directLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 ${
                    active
                      ? 'border-slate-200 bg-slate-100 text-slate-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/search"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 ${
                isActive('/search')
                  ? 'border-purple-200 bg-purple-50 text-purple-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700'
              }`}
              aria-label="Search NameVerse"
              title="Search names"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Search</span>
            </Link>
            <Link
              href="/my-names"
              className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 ${
                isActive('/my-names')
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              Saved
            </Link>
            <Link
              href="/names/religion/islamic/1"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]"
            >
              Explore Names
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-90 transition-all"
              aria-label="Search"
            >
              <Search size={22} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-90 transition-all"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[102] lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed inset-x-0 top-0 bottom-0 bg-white shadow-2xl z-[103] lg:hidden animate-in slide-in-from-top-2 duration-300 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
                  <Image src="/logo.png" alt="NameVerse logo" width={32} height={32} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">NameVerse</p>
                  <p className="text-xs text-gray-500">Names, meanings & guides</p>
                </div>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-2xl text-gray-600 hover:bg-gray-100 transition-all"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-4 py-4 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-gray-700">Quick Links</p>
                <p className="mt-1 text-xs text-gray-500">Tap a section to explore fast.</p>
              </div>

              <div className="rounded-3xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpenSection((current) => current === categoryLinks.name ? null : categoryLinks.name)}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left"
                  aria-expanded={mobileOpenSection === categoryLinks.name}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{categoryLinks.name}</p>
                      <p className="text-xs text-gray-500">Explore name categories</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileOpenSection === categoryLinks.name ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenSection === categoryLinks.name && (
                  <div className="space-y-1 border-t border-gray-100 bg-white px-4 pb-4">
                    {categoryLinks.subLinks.map((subLink) => (
                      <Link
                        key={subLink.name}
                        href={subLink.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileOpenSection(null);
                        }}
                        className="block rounded-2xl px-3 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Explore Section */}
              <div className="rounded-3xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpenSection((current) => current === 'explore' ? null : 'explore')}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left"
                  aria-expanded={mobileOpenSection === 'explore'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Explore</p>
                      <p className="text-xs text-gray-500">Trending, unique & popular</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileOpenSection === 'explore' ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenSection === 'explore' && (
                  <div className="space-y-1 border-t border-gray-100 bg-white px-4 pb-4">
                    {exploreLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileOpenSection(null);
                        }}
                        className="block rounded-2xl px-3 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources Section */}
              <div className="rounded-3xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpenSection((current) => current === 'resources' ? null : 'resources')}
                  className="w-full px-4 py-4 flex items-center justify-between gap-3 text-left"
                  aria-expanded={mobileOpenSection === 'resources'}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Resources</p>
                      <p className="text-xs text-gray-500">Blogs, guides & saved</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${mobileOpenSection === 'resources' ? 'rotate-180' : ''}`} />
                </button>

                {mobileOpenSection === 'resources' && (
                  <div className="space-y-1 border-t border-gray-100 bg-white px-4 pb-4">
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => {
                          setIsOpen(false);
                          setMobileOpenSection(null);
                        }}
                        className="block rounded-2xl px-3 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Links */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                {directLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-3xl px-4 py-4 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="grid gap-3 py-2">
                <Link
                  href="/names/religion/islamic/1"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-100"
                >
                  Browse All Names
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Read Guides
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
