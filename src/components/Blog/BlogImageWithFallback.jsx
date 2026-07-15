'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getSiteUrl } from '@/lib/seo/site';

export default function BlogImageWithFallback({ src, alt, className, fill, sizes, priority, containerClassName, imageStyle, children }) {
  const [error, setError] = useState(false);
  const fallbackSrc = `${getSiteUrl()}/opengraph-image`;

  if (error) {
    return (
      <div className={`relative bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-50 flex items-center justify-center ${containerClassName || ''}`}>
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">NV</span>
          </div>
          <p className="text-xs text-gray-500 font-medium truncate max-w-[200px] mx-auto">
            {alt || 'NameVerse Blog'}
          </p>
        </div>
        {children}
      </div>
    );
  }

  const imageSrc = src && src.startsWith('http') ? src : `${getSiteUrl()}${src || ''}`;

  return (
    <div className={`relative ${containerClassName || ''}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className={className}
        onError={() => setError(true)}
        style={imageStyle}
        priority={priority}
      />
      {children}
    </div>
  );
}
