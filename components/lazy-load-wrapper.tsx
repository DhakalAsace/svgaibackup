'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function LazyLoadWrapper({ children, fallback = null, delay = 0 }: LazyLoadWrapperProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => {
        setShouldRender(true);
      }, { timeout: delay || 2000 });
      
      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(id);
        }
      };
    } else {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Dynamic imports for heavy components
export const DynamicGenerationUpsell = dynamic(
  () => import('@/components/generation-upsells').then(mod => mod.GenerationUpsell),
  { 
    loading: () => <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicPricingSection = dynamic(
  () => import('@/components/pricing-section'),
  { 
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicFAQ = dynamic(
  () => import('@/components/faq'),
  { 
    loading: () => <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />,
    ssr: false 
  }
);

export const DynamicFeatures = dynamic(
  () => import('@/components/features'),
  { 
    loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />,
    ssr: false 
  }
);