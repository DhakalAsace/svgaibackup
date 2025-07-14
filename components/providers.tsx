"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CreditProvider } from '@/contexts/CreditContext';
import { ThemeProvider } from './theme-provider';
import { Toaster } from './ui/sonner';
import { useEffect } from 'react';

// Hydration error debugging component
function HydrationDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Listen for hydration errors
      const originalError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('Hydration failed') || args[0]?.includes?.('hydration')) {
          console.group('🚨 HYDRATION ERROR DETECTED');
          console.error('Error details:', ...args);
          console.trace('Stack trace:');
          console.groupEnd();
        }
        originalError.apply(console, args);
      };

      // Clean up
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return null;
}

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <CreditProvider>
          <HydrationDebugger />
          {children}
          <Toaster />
        </CreditProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
