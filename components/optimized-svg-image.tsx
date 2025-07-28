'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedSVGImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  width?: number;
  height?: number;
}

export function OptimizedSVGImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E",
  width = 400,
  height = 400
}: OptimizedSVGImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (loading === 'eager' || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { rootMargin: '50px' }
    );

    const element = document.querySelector(`[data-src="${src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [src, loading, priority]);

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div data-src={src} className={`relative ${className}`} style={{ width, height }}>
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain"
          onError={() => setHasError(true)}
          loading={loading}
          priority={priority}
        />
      ) : (
        <Image
          src={placeholder}
          alt=""
          width={width}
          height={height}
          className="object-contain"
          unoptimized
        />
      )}
    </div>
  );
}