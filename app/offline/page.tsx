'use client';

import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4 py-8 max-w-md">
        <svg
          className="mx-auto h-24 w-24 text-muted-foreground mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          You're Offline
        </h1>
        
        <p className="text-muted-foreground mb-6">
          It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          
          <p className="text-sm text-muted-foreground">
            You can still access cached content and use some offline features.
          </p>
        </div>
      </div>
    </div>
  );
}