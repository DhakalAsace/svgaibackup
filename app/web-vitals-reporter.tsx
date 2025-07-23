'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const isGood = (value: number, thresholds: { good: number; needsImprovement: number }) => {
        if (value <= thresholds.good) return '✅';
        if (value <= thresholds.needsImprovement) return '⚠️';
        return '❌';
      };

      const thresholds = {
        LCP: { good: 2500, needsImprovement: 4000 },
        FID: { good: 100, needsImprovement: 300 },
        CLS: { good: 0.1, needsImprovement: 0.25 },
        FCP: { good: 1800, needsImprovement: 3000 },
        TTFB: { good: 800, needsImprovement: 1800 },
        INP: { good: 200, needsImprovement: 500 }
      };

      const threshold = thresholds[metric.name as keyof typeof thresholds];
      const status = threshold ? isGood(metric.value, threshold) : '';

      console.log(
        `%c${status} ${metric.name}: ${metric.value.toFixed(2)}${
          metric.name === 'CLS' ? '' : 'ms'
        }`,
        'font-weight: bold;'
      );

      // Detailed logging for debugging
      console.table({
        Metric: metric.name,
        Value: metric.value,
        Rating: metric.rating || 'N/A',
        ID: metric.id,
        Delta: metric.delta,
        NavigationType: metric.navigationType
      });
    }

    // Optional: Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics endpoint
      // sendToAnalytics(metric);
    }
  });

  return null;
}