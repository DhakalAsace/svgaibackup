'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export function AuthRedirectHandler() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a stored redirect path from OAuth flow
    const storedPath = localStorage.getItem('authRedirectPath');
    
    if (storedPath) {
      // Clear the stored path
      localStorage.removeItem('authRedirectPath');
      
      // Redirect to the stored path
      router.push(storedPath);
    }
  }, [router]);

  // Automatically sync subscription after successful Stripe checkout
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const success = url.searchParams.get('success');
    const sessionId = url.searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      // Prevent multiple sync attempts
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');

      const cleanUrl = `${url.pathname}${url.search}`;
      router.replace(cleanUrl);

      (async () => {
        try {
          const res = await fetch('/api/sync-subscription', {
            method: 'POST',
          });

          if (res.ok) {
            toast({
              title: 'Subscription activated!',
              description: 'Your new plan is now active. Enjoy your credits!',
            });
            // Reload to show updated credits/profile
            setTimeout(() => window.location.reload(), 1500);
          } else {
            const data = await res.json();
            toast({
              title: 'Sync failed',
              description: data.error || 'Could not sync your subscription',
              variant: 'destructive',
            });
          }
        } catch (err) {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred while activating your plan.',
            variant: 'destructive',
          });
        }
      })();
    }
  }, [router, toast]);

  return null;
}