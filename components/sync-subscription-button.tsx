'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export function SyncSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/sync-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Subscription synced!',
          description: `Your ${data.subscription.tier} subscription is now active with ${data.subscription.limit} generations per month.`,
        });
        
        // Reload the page to reflect changes
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast({
          title: 'Sync failed',
          description: data.error || 'Failed to sync subscription',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={loading}
      variant="outline"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Sync Stripe Subscription
    </Button>
  );
}