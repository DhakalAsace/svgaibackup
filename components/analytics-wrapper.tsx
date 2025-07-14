"use client";

import dynamic from 'next/dynamic';

// Dynamically import analytics components with lazy loading to reduce initial JS bundle
const SpeedInsights = dynamic(() => 
  import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights),
  { ssr: false, loading: () => null }
);

const Analytics = dynamic(() => 
  import('@vercel/analytics/react').then(mod => mod.Analytics),
  { ssr: false, loading: () => null }
);

export default function AnalyticsWrapper() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
