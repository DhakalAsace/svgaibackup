"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2, Plus, Loader2, Check, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useCredits } from "@/contexts/CreditContext";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";

// Dynamically import heavy components
const Image = lazy(() => import("next/image"));

type SvgDesign = {
  id: string;
  title: string;
  description: string | null;
  svg_content: string;
  prompt: string | null;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  tags: string[] | null;
  user_id: string;
};

type DashboardProps = {
  initialSvgs: SvgDesign[];
  userId?: string; // Make userId optional
  userProfile?: {
    subscription_tier: string | null;
    subscription_status: string | null;
    lifetime_credits_granted?: number;
    lifetime_credits_used?: number;
    monthly_credits?: number;
    monthly_credits_used?: number;
    credits_reset_at?: string;
    subscription_interval?: string;
    stripe_customer_id?: string | null;
  };
};

// Number of SVGs to load initially and per page
const PAGE_SIZE = 6;

export default function Dashboard({ initialSvgs, userId, userProfile: initialUserProfile }: DashboardProps) {
  const [svgs, setSvgs] = useState<SvgDesign[]>(initialSvgs);
  const [displayedSvgs, setDisplayedSvgs] = useState<SvgDesign[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContents, setSvgContents] = useState<Record<string, string>>({});
  const [svgDataUrls, setSvgDataUrls] = useState<Record<string, string>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const router = useRouter();
  const { creditInfo, refreshCredits } = useCredits();

  // Create the client inside the component
  const supabase = createClientComponentClient<Database>();

  // Preload next page of SVGs
  useEffect(() => {
    const end = currentPage * PAGE_SIZE;
    const start = end - PAGE_SIZE;
    const pageSvgs = svgs.slice(start, end);
    setDisplayedSvgs(pageSvgs);
    
    // Prefetch next page SVGs
    const nextPageSvgs = svgs.slice(end, end + PAGE_SIZE);
    if (nextPageSvgs.length > 0) {
      // Prefetch SVG data for next page
      nextPageSvgs.forEach(svg => {
        // Use requestIdleCallback if available, otherwise setTimeout
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            fetchSvgContent(svg);
          });
        } else {
          setTimeout(() => fetchSvgContent(svg), 200);
        }
      });
    }
  }, [svgs, currentPage]);

  // Load more SVGs
  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Convert SVG content to data URL with optimization
  const svgToDataUrl = (svgContent: string): string => {
    try {
      // Skip if empty content
      if (!svgContent || svgContent.trim() === '') return '';
      
      // Optimize the SVG before converting (remove comments, unnecessary attributes)
      let cleanSvg = svgContent.trim()
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Consolidate whitespace
        .replace(/>\s+</g, '><'); // Remove whitespace between tags
        
      // Convert to base64 data URL
      const base64 = btoa(cleanSvg);
      return `data:image/svg+xml;base64,${base64}`;
    } catch (error) {
      console.error("Error converting SVG to data URL:", error);
      return "";
    }
  };

  // Function to fetch SVG content for a single design with performance optimizations
  const fetchSvgContent = async (svg: SvgDesign) => {
    if (svgDataUrls[svg.id]) return; // Already converted to data URL
    
    setLoadingStates(prev => ({
      ...prev,
      [svg.id]: true
    }));
    
    try {
      // Store original SVG content
      setSvgContents(prev => ({
        ...prev,
        [svg.id]: svg.svg_content
      }));
      
      // Use a web worker or defer to next frame for heavy operations
      const processInNextFrame = (callback: () => void) => {
        if (typeof window !== 'undefined') {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(callback);
          });
        } else {
          callback();
        }
      };
      
      processInNextFrame(() => {
        // Convert to data URL for efficient rendering
        const dataUrl = svgToDataUrl(svg.svg_content);
        setSvgDataUrls(prev => ({
          ...prev,
          [svg.id]: dataUrl
        }));
        
        // Update loading state
        setLoadingStates(prev => ({
          ...prev,
          [svg.id]: false
        }));
      });
    } catch (error) {
      console.error(`Error processing SVG for ${svg.id}:`, error);
      setLoadingStates(prev => ({
        ...prev,
        [svg.id]: false
      }));
    }
  };

  // Function to download SVG
  const downloadSvg = async (svg: SvgDesign) => {
    // If we've already fetched the SVG content
    if (svgContents[svg.id]) {
      const blob = new Blob([svgContents[svg.id]], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${svg.title.replace(/\s+/g, "-").toLowerCase()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    
    // If we haven't cached the SVG content yet
    try {
      // Direct use of svg_content since it contains the SVG markup
      const svgContent = svg.svg_content;
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${svg.title.replace(/\s+/g, "-").toLowerCase()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Store the content for future use
      setSvgContents(prev => ({
        ...prev,
        [svg.id]: svgContent
      }));
    } catch (error) {
      console.error("Error downloading SVG:", error);
      alert("Failed to download SVG");
    }
  };

  // Function to delete SVG
  const deleteSvg = async (id: string) => {
    try {
      // Get user confirmation using browser dialog
      if (!confirm("Are you sure you want to delete this SVG?")) return;
      
      // Show loading state
      setIsLoading(true);
      
      // Perform the deletion
      const { error } = await supabase
        .from("svg_designs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // Show brief success message
      toast({
        title: "SVG deleted successfully",
        variant: "default",
      });
      
      // Short delay before reload to let the toast appear
      setTimeout(() => {
        // Reload the page to show fresh data
        window.location.reload();
      }, 800);
      
    } catch (error) {
      console.error("Error deleting SVG:", error);
      
      toast({
        title: "Error deleting SVG",
        description: "Please try again.",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  };

  // Function to refresh designs (can be called after navigation back to dashboard)
  const refreshDesigns = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("svg_designs")
        .select()
        .eq("user_id", userId) 
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSvgs(data || []);
      
      // Prefetch SVG content for each design
      data?.forEach(svg => {
        fetchSvgContent(svg);
      });
    } catch (error) {
      console.error("Error fetching designs:", error);
    }
  };

  // Use effect to refetch designs if the session/user changes or when user navigates back to the page
  useEffect(() => {
    // Initialize loading states for all SVGs
    if (initialSvgs.length > 0) {
      const initialLoadingStates: Record<string, boolean> = {};
      initialSvgs.forEach(svg => {
        initialLoadingStates[svg.id] = true;
      });
      setLoadingStates(initialLoadingStates);
      
      // Immediately start fetching SVG content for all designs
      initialSvgs.forEach(svg => {
        fetchSvgContent(svg);
      });
    }
    
    // Initial fetch when component mounts
    refreshDesigns();

    // Set up listener for when user navigates back to the page
    const handleFocus = () => {
      refreshDesigns();
    };

    // Add event listener for when the window regains focus
    window.addEventListener('focus', handleFocus);

    // Clean up event listener
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [userId]);

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (!userId) return;

    // Function to fetch latest profile data
    const fetchLatestProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, lifetime_credits_granted, lifetime_credits_used, monthly_credits, monthly_credits_used, credits_reset_at, subscription_interval')
        .eq('id', userId)
        .single();
      
      if (profile) {
        setUserProfile(profile as typeof userProfile);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel(`profile-updates-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          // Update local state with new profile data
          if (payload.eventType === 'UPDATE' && payload.new) {
            setUserProfile(prev => ({
              ...prev!,
              ...payload.new
            }) as typeof userProfile);
          }
        }
      )
      .subscribe();

    // Also poll for updates every 30 seconds as a fallback
    const interval = setInterval(fetchLatestProfile, 30000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [userId, supabase]);

  // Use context creditInfo if available, otherwise fall back to local userProfile
  const contextCredits = creditInfo;
  const isSubscribed = contextCredits?.isSubscribed ?? userProfile?.subscription_status === 'active';
  
  // Handle case where profile might not have credit fields populated
  const displayCreditInfo = contextCredits ? {
    used: contextCredits.creditsUsed,
    limit: contextCredits.creditLimit,
    type: contextCredits.creditType,
    remaining: contextCredits.creditsRemaining
  } : {
    used: isSubscribed 
      ? (userProfile?.monthly_credits_used ?? 0)
      : (userProfile?.lifetime_credits_used ?? 0),
    limit: isSubscribed 
      ? (userProfile?.monthly_credits ?? 0) 
      : (userProfile?.lifetime_credits_granted ?? 6), // Default to 6 for free users
    type: isSubscribed ? 'monthly' : 'lifetime' as const,
    remaining: 0
  };
  
  // Calculate remaining if not from context
  if (!contextCredits) {
    displayCreditInfo.remaining = Math.max(0, displayCreditInfo.limit - displayCreditInfo.used);
  }
  
  // Check if credits need initialization
  const needsInitialization = !isSubscribed && 
    userProfile?.lifetime_credits_granted === undefined;

  // Determine user tier for curated content
  const getUserTier = () => {
    // Prefer context credit info if available
    if (contextCredits) {
      if (!contextCredits.isSubscribed) return 'free';
      return contextCredits.subscriptionTier === 'pro' ? 'pro' : 'starter';
    }
    // Fallback to userProfile data
    if (userProfile?.subscription_status === 'active') {
      return userProfile.subscription_tier === 'pro' ? 'pro' : 'starter';
    }
    return 'free';
  };

  const userTier = getUserTier();

  return (
    <div>
      {/* Credit Usage Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Credit Usage</CardTitle>
            {isSubscribed && <ManageSubscriptionButton />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Credits Used</span>
              <span className="font-medium">{displayCreditInfo.used}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Credits Available</span>
              <span className="font-medium">{displayCreditInfo.remaining}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] h-2 rounded-full transition-all"
                style={{ width: `${Math.min((displayCreditInfo.used / displayCreditInfo.limit) * 100, 100)}%` }}
              />
            </div>
            {needsInitialization && (
              <p className="text-sm text-blue-600 mt-2">
                Credits are being initialized. Please refresh the page in a moment.
              </p>
            )}
            {!needsInitialization && displayCreditInfo.type === 'lifetime' && displayCreditInfo.used >= displayCreditInfo.limit && (
              <p className="text-sm text-amber-600 mt-2">
                You've used all your free credits. Subscribe to get monthly credits!
              </p>
            )}
            {displayCreditInfo.type === 'monthly' && userProfile?.credits_reset_at && (
              <p className="text-xs text-gray-600 mt-2">
                Credits reset on {new Date(userProfile.credits_reset_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier-specific dashboard sections */}
      {userTier === 'free' && (
        <div className="mb-6 bg-gradient-to-r from-[#FF7043]/10 to-[#FFA726]/10 rounded-lg p-6 border border-[#FFE0B2]">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-[#FF7043]" />
                You're on the Free Plan
              </h3>
              <p className="text-sm text-gray-600 mb-3">Get more credits and extended features with a subscription.</p>
              <ul className="space-y-1 text-sm text-gray-700 mb-3">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  6 lifetime credits included
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  7-day design history
                </li>
                <li className="flex items-center opacity-60">
                  <Sparkles className="w-4 h-4 mr-2 text-[#FF7043]" />
                  Upgrade for 100-350 monthly credits
                </li>
                <li className="flex items-center opacity-60">
                  <Sparkles className="w-4 h-4 mr-2 text-[#FF7043]" />
                  Upgrade for 30-day history (Pro only)
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity inline-block text-center"
              >
                Upgrade Now
              </Link>
              <p className="text-xs text-gray-600 text-center">Starting at $12/mo</p>
            </div>
          </div>
        </div>
      )}

      {userTier === 'starter' && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-800">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                Starter Plan Active
              </h3>
              <p className="text-sm text-blue-700 mb-3">Perfect for individuals and small projects.</p>
              <ul className="space-y-1 text-sm text-blue-700 mb-3">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  100 credits per month
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  7-day design history
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  No watermarks
                </li>
                <li className="flex items-center opacity-60">
                  <Crown className="w-4 h-4 mr-2 text-[#FF7043]" />
                  Upgrade to Pro for 350 credits & 30-day history
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity inline-block text-center"
              >
                Upgrade to Pro
              </Link>
              <ManageSubscriptionButton />
            </div>
          </div>
        </div>
      )}

      {userTier === 'pro' && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-lg font-semibold mb-2 flex items-center text-purple-800">
                <Crown className="w-5 h-5 mr-2 text-purple-600" />
                Pro Plan Active
              </h3>
              <p className="text-sm text-purple-700 mb-3">You have access to all premium features!</p>
              <ul className="space-y-1 text-sm text-purple-700 mb-3">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  350 credits per month
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  30-day extended history
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  All premium styles & formats
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <ManageSubscriptionButton />
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>
            <strong>Note:</strong> Generated SVGs will be automatically deleted after{' '}
            {userTier === 'pro' ? '30 days' : '7 days'}. Please download any designs you wish to keep.
          </span>
        </p>
      </div>
      
      {svgs.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No SVGs yet</h3>
          <p className="text-muted-foreground mb-4">Create your first SVG design</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedSvgs.map((svg) => (
              <Card key={svg.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-base truncate">{svg.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="aspect-square bg-muted/20 rounded-md flex items-center justify-center overflow-hidden">
                    {loadingStates[svg.id] ? (
                      <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-xs">Loading SVG...</p>
                      </div>
                    ) : svgDataUrls[svg.id] ? (
                      <Suspense fallback={<div className="flex items-center justify-center w-full h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                        <div className="w-full h-full p-3 flex items-center justify-center">
                          <img 
                            src={svgDataUrls[svg.id]}
                            alt={svg.title}
                            className="max-w-full max-h-full object-contain"
                            loading="lazy"
                            decoding="async"
                            width={200}
                            height={200}
                          />
                        </div>
                      </Suspense>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-xs">Preparing your design...</p>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => fetchSvgContent(svg)}
                          className="mt-1"
                        >
                          Try again
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadSvg(svg)}
                      title="Download SVG"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteSvg(svg.id)}
                    disabled={isLoading}
                    title="Delete SVG"
                    className="h-8 w-8 p-0 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {svgs.length > displayedSvgs.length && (
            <div className="mt-6 text-center">
              <Button 
                onClick={loadMore} 
                variant="outline"
                disabled={isLoading}
                className="w-full max-w-xs mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : 'Load More SVGs'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
