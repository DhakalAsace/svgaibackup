declare module 'web-vitals' {
  export interface Metric {
    name: string;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
    navigationType: string;
  }

  export function onCLS(callback: (metric: Metric) => void): void;
  export function onINP(callback: (metric: Metric) => void): void;
  export function onLCP(callback: (metric: Metric) => void): void;
  export function onFCP(callback: (metric: Metric) => void): void;
  export function onTTFB(callback: (metric: Metric) => void): void;
}