"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, LogOut, Crown, Sparkles, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCredits } from "@/contexts/CreditContext";

export function UserMenu() {
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const { creditInfo, refreshCredits } = useCredits();
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [creditLimit, setCreditLimit] = useState(6);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const supabase = createClientComponentClient();

  // Create a callback to fetch subscription status
  const fetchSubscriptionStatus = useCallback(async () => {
      if (!user?.id) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, lifetime_credits_used, lifetime_credits_granted, monthly_credits_used, monthly_credits')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      if (profile) {
        console.log('Profile fetched:', profile);
        const isActive = profile.subscription_status === 'active';
        setIsSubscribed(isActive);
        setSubscriptionTier(isActive ? (profile.subscription_tier || 'starter') : null);
        
        // Set credits based on subscription status
        if (isActive) {
          setCreditsUsed(profile.monthly_credits_used || 0);
          setCreditLimit(profile.monthly_credits || 100);
        } else {
          setCreditsUsed(profile.lifetime_credits_used || 0);
          setCreditLimit(profile.lifetime_credits_granted || 6);
        }
      }
  }, [user?.id, supabase]);

  // Use credit context if available
  useEffect(() => {
    if (creditInfo) {
      setCreditsUsed(creditInfo.creditsUsed);
      setCreditLimit(creditInfo.creditLimit);
      setIsSubscribed(creditInfo.isSubscribed);
      setSubscriptionTier(creditInfo.isSubscribed ? (creditInfo.subscriptionTier || 'starter') : null);
    }
  }, [creditInfo]);

  // Fetch subscription status and set up real-time updates
  useEffect(() => {
    if (!user?.id) return;
    
    // Fetch immediately if no creditInfo
    if (!creditInfo) {
      fetchSubscriptionStatus();
    }
    
    // Also fetch after a short delay to handle any timing issues
    const timeoutId = setTimeout(() => {
      if (!creditInfo) {
        fetchSubscriptionStatus();
      }
    }, 500);
    
    // Set up real-time subscription for profile updates
    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          const newProfile = payload.new as any;
          if (newProfile) {
            const isActive = newProfile.subscription_status === 'active';
            setIsSubscribed(isActive);
            setSubscriptionTier(isActive ? (newProfile.subscription_tier || 'starter') : null);
            
            // Update credits based on subscription status
            if (isActive) {
              setCreditsUsed(newProfile.monthly_credits_used || 0);
              setCreditLimit(newProfile.monthly_credits || 100);
            } else {
              setCreditsUsed(newProfile.lifetime_credits_used || 0);
              setCreditLimit(newProfile.lifetime_credits_granted || 6);
            }
          }
        }
      )
      .subscribe();
      
    // Refresh data when menu opens (in case of stale data)
    const intervalId = setInterval(fetchSubscriptionStatus, 30000); // Refresh every 30 seconds
    
    return () => {
      channel.unsubscribe();
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [user?.id, fetchSubscriptionStatus, supabase, creditInfo]);
  
  // Force refresh when dropdown opens
  useEffect(() => {
    // Add a global event listener for dropdown open
    const handleFocus = () => {
      if (user?.id) {
        fetchSubscriptionStatus();
      }
    };
    
    // Listen for focus events on the dropdown trigger
    const trigger = document.querySelector('[aria-haspopup="menu"]');
    trigger?.addEventListener('click', handleFocus);
    
    return () => {
      trigger?.removeEventListener('click', handleFocus);
    };
  }, [user?.id, fetchSubscriptionStatus]);

  // Don't display anything if user is not logged in
  if (!session) {
    return null;
  }

  // Get user initials or a default fallback
  const getInitials = (email?: string | null) => {
    if (!email) return "??";
    return email[0]?.toUpperCase() || "U";
  };

  const userEmail = user?.email;
  const userInitials = getInitials(userEmail);

  // Handle sign out with redirect
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          onClick={() => refreshCredits()}
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">My Account</p>
              {subscriptionTier ? (
                <Badge variant="secondary" className="text-xs">
                  {subscriptionTier === 'pro' ? (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 mr-1" />
                      Starter
                    </>
                  )}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Free
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail || "No email provided"}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Credits used:</span>
                <span className="font-medium">{creditsUsed}/{creditLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-[#FF7043] h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((creditsUsed / creditLimit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        {!subscriptionTier && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/pricing')} className="text-[#FF7043]">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
