'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Share2, Heart, Star, X } from 'lucide-react';

/**
 * Social Action Bar — Floating social message on the right side
 *
 * - Shows a friendly message to visitors
 * - Social share buttons (WhatsApp, Twitter, Facebook via share API)
 * - Slides in from the right after 5 seconds
 * - Dismissible per session
 * - Graceful fallback for non-sharing browsers
 */
export default function SocialActionBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const sd = sessionStorage.getItem('nv_social_bar_dismissed');
    if (sd === 'true') {
      setDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem('nv_social_bar_dismissed', 'true');
    } catch (e) {}
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = document.title || 'NameVerse — Cultural Name Knowledge Base';
    const text = `Explore the meaning and origin of names at NameVerse! ${url}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          '_blank',
          'noopener'
        );
        break;
      default:
        // Native share API
        if (navigator.share) {
          try {
            navigator.share({ title, text, url });
          } catch (e) {
            // User cancelled
          }
        }
    }
  };

  if (dismissed) return null;

  return (
    <div
      className={`
        fixed right-0 top-1/3 z-[9998]
        transition-all duration-500 ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="relative flex flex-col items-end">
        {/* Main card */}
        <div className="relative bg-white/95 backdrop-blur-md rounded-l-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-200/50 border-r-0 overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>

          <div className="px-3.5 py-4 pt-6 flex flex-col items-center gap-2.5">
            {/* Message */}
            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-[11px] font-medium text-gray-600 leading-tight max-w-[90px]">
                Love NameVerse?
              </p>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight max-w-[90px]">
                Share with friends!
              </p>
            </div>

            {/* Divider */}
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Social share buttons */}
            <div className="flex flex-col items-center gap-1.5">
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-green-50 hover:bg-green-100 active:bg-green-200 transition-colors cursor-pointer group"
                aria-label="Share on WhatsApp"
                title="WhatsApp"
              >
                <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>

              {/* Twitter / X */}
              <button
                onClick={() => handleShare('twitter')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-sky-50 hover:bg-sky-100 active:bg-sky-200 transition-colors cursor-pointer group"
                aria-label="Share on X (Twitter)"
                title="X (Twitter)"
              >
                <svg className="w-4 h-4 text-sky-600 group-hover:text-sky-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors cursor-pointer group"
                aria-label="Share on Facebook"
                title="Facebook"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* Native share (fallback) */}
              <button
                onClick={() => handleShare('native')}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 transition-colors cursor-pointer group"
                aria-label="Share"
                title="Share"
              >
                <Share2 className="w-4 h-4 text-indigo-500 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}