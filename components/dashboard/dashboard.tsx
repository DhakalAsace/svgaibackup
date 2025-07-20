"use client";

import { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Trash2, Plus, Loader2, Check, Crown, Sparkles, Edit, Settings, Video, Zap, Clock, BarChart, BarChart3, Code, FileDown, Film, FileIcon, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useCredits } from "@/contexts/CreditContext";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { SafeSvgDisplay } from "@/components/safe-svg-display";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

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

type GeneratedVideo = {
  id: string;
  prompt: string;
  video_url: string;
  duration: number;
  resolution: string;
  credits_used: number;
  expires_at: string;
  created_at: string;
  metadata: {
    fps?: number;
    seed?: string;
    original_svg?: string;
  };
};

type ContentItem = {
  id: string;
  type: 'svg' | 'icon' | 'video';
  content: SvgDesign | GeneratedVideo;
  created_at: string;
};

type ToolUsageStats = {
  toolName: string;
  count: number;
  lastUsed?: Date;
};

type RecentToolActivity = {
  toolName: string;
  timestamp: Date;
  toolPath: string;
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
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<ContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [svgContents, setSvgContents] = useState<Record<string, string>>({});
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const router = useRouter();
  const { creditInfo, refreshCredits } = useCredits();

  // Create the client inside the component
  const supabase = createClientComponentClient<Database>();

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      // Type assertion needed as generated_videos is not in the types yet
      const { data, error } = await (supabase as any)
        .from('generated_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }, [supabase]);

  // Fetch videos on mount and poll
  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000);
    return () => clearInterval(interval);
  }, [fetchVideos]);

  // Combine SVGs and videos into content items
  useEffect(() => {
    const svgItems: ContentItem[] = svgs.map(svg => ({
      id: svg.id,
      type: svg.prompt?.toLowerCase().includes('icon') ? 'icon' : 'svg',
      content: svg,
      created_at: svg.created_at
    }));

    const videoItems: ContentItem[] = videos.map(video => ({
      id: video.id,
      type: 'video',
      content: video,
      created_at: video.created_at
    }));

    // Combine and sort by creation date
    const allItems = [...svgItems, ...videoItems].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setContentItems(allItems);
  }, [svgs, videos]);

  // Paginate content items
  useEffect(() => {
    const end = currentPage * PAGE_SIZE;
    const start = end - PAGE_SIZE;
    const pageItems = contentItems.slice(start, end);
    setDisplayedItems(pageItems);
  }, [contentItems, currentPage]);

  // Load more SVGs
  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
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

  // Function to download video
  const downloadVideo = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        title: "Download failed",
        description: "Failed to download video",
        variant: "destructive"
      });
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
  const refreshDesigns = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("svg_designs")
        .select()
        .eq("user_id", userId) 
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSvgs(data || []);
    } catch (error) {
      console.error("Error fetching designs:", error);
    }
  }, [userId, supabase]);

  // Use effect to refetch designs if the session/user changes or when user navigates back to the page
  useEffect(() => {
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
  }, [userId, refreshDesigns]);

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
    <div className="max-w-7xl mx-auto">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content - 3 columns */}
        <div className="lg:col-span-3">
          {/* Main Content Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Creations</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {contentItems.length} items • {userTier === 'pro' ? '30-day' : '7-day'} retention
              </p>
            </div>
          </div>
          {contentItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start creating</h3>
                <p className="text-sm text-gray-500 mb-6">Generate professional icons and SVGs with AI</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create SVG
                    </Button>
                  </Link>
                  <Link href="/ai-icon-generator">
                    <Button variant="outline">
                      Create Icon
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedItems.map((item) => {
              if (item.type === 'video') {
                const video = item.content as GeneratedVideo;
                const isExpired = new Date(video.expires_at) < new Date();
                
                return (
                  <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${isExpired ? 'opacity-60' : ''}`}>
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative group">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center">
                            <Film className="w-7 h-7 text-purple-600" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-medium text-gray-700">{video.duration}s • {video.resolution}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="info" className="text-xs">Video</Badge>
                        </div>
                        {!isExpired && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadVideo(video.video_url, `ai-video-${video.id}.mp4`)}
                            className="absolute bottom-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="p-3 border-t">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">
                          {video.metadata.original_svg || 'AI Video'}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{video.prompt}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                          <Clock className="w-3 h-3" />
                          {isExpired ? 'Expired' : formatDistanceToNow(new Date(video.expires_at), { addSuffix: true })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              } else {
                const svg = item.content as SvgDesign;
                return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center relative group">
                        {svg.svg_content ? (
                          <Suspense fallback={<div className="flex items-center justify-center w-full h-full"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>}>
                            <div className="w-full h-full p-6 flex items-center justify-center">
                              <SafeSvgDisplay 
                                svgContent={svg.svg_content}
                                alt={svg.title}
                                className="w-full h-full max-w-[180px] max-h-[180px] [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                              />
                            </div>
                          </Suspense>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            <p className="text-xs text-gray-500">Loading...</p>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant="info" className="text-xs">
                            {item.type === 'icon' ? 'Icon' : 'SVG'}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadSvg(svg)}
                            title="Download SVG"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSvg(svg.id)}
                            disabled={isLoading}
                            title="Delete SVG"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 border-t">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">{svg.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {(() => {
                            const createdDate = new Date(svg.created_at);
                            const retentionDays = userProfile?.subscription_tier === 'pro' ? 30 : 7;
                            const expiryDate = new Date(createdDate.getTime() + retentionDays * 24 * 60 * 60 * 1000);
                            const isExpired = expiryDate < new Date();
                            
                            return isExpired ? 'Expired' : formatDistanceToNow(expiryDate, { addSuffix: true });
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
          {contentItems.length > displayedItems.length && (
            <div className="mt-6 text-center">
              <Button 
                onClick={loadMore} 
                variant="outline"
                disabled={isLoading}
                className="mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
              </>
          )}
        </div>

        {/* Right Sidebar - 1 column */}
        <div className="lg:col-span-1">
          {/* Credit Balance Card */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Credit Balance</CardTitle>
                {userTier === 'free' && (
                  <Badge variant="secondary" className="text-xs">Free Plan</Badge>
                )}
                {userTier === 'starter' && (
                  <Badge variant="info" className="text-xs">Starter</Badge>
                )}
                {userTier === 'pro' && (
                  <Badge variant="warning" className="text-xs">Pro</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900">{displayCreditInfo.remaining}</span>
                    <span className="text-sm text-gray-500">/ {displayCreditInfo.limit}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((displayCreditInfo.used / displayCreditInfo.limit) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {displayCreditInfo.type === 'monthly' ? 'Monthly credits' : 'Free lifetime credits'}
                  </p>
                  {displayCreditInfo.type === 'monthly' && userProfile?.credits_reset_at && (
                    <p className="text-xs text-gray-400">
                      Resets {new Date(userProfile.credits_reset_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                
                {userTier === 'free' && (
                  <div className="pt-2">
                    <Link href="/pricing" className="block">
                      <Button size="sm" className="w-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white hover:opacity-90">
                        Get More Credits
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center mt-1.5">Monthly plans available</p>
                  </div>
                )}
                
                {userTier === 'starter' && (
                  <div className="pt-2 space-y-2">
                    <ManageSubscriptionButton />
                    <Link href="/pricing" className="block">
                      <Button size="sm" variant="outline" className="w-full">Upgrade to Pro</Button>
                    </Link>
                  </div>
                )}
                
                {userTier === 'pro' && (
                  <div className="pt-2">
                    <ManageSubscriptionButton />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Quick Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href="/ai-icon-generator" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <Sparkles className="w-3.5 h-3.5 mr-2 text-[#FF7043]" />
                  <span className="text-sm">AI Icon Generator</span>
                </Button>
              </Link>
              <Link href="/tools/svg-editor" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <Code className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  <span className="text-sm">SVG Editor</span>
                </Button>
              </Link>
              <Link href="/tools/svg-optimizer" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <FileDown className="w-3.5 h-3.5 mr-2 text-green-600" />
                  <span className="text-sm">SVG Optimizer</span>
                </Button>
              </Link>
              <Link href="/tools/svg-to-video" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <Film className="w-3.5 h-3.5 mr-2 text-purple-600" />
                  <span className="text-sm">SVG to Video</span>
                </Button>
              </Link>
              <Link href="/animate" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <Zap className="w-3.5 h-3.5 mr-2 text-pink-600" />
                  <span className="text-sm">SVG Animator</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Popular Converters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Popular Converters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <Link href="/convert/png-to-svg" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-700">PNG to SVG</span>
                </Button>
              </Link>
              <Link href="/convert/svg-to-png" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-700">SVG to PNG</span>
                </Button>
              </Link>
              <Link href="/convert/jpg-to-svg" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-700">JPG to SVG</span>
                </Button>
              </Link>
              <Link href="/convert/svg-to-pdf" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-700">SVG to PDF</span>
                </Button>
              </Link>
              <Link href="/convert/svg-to-mp4" className="block">
                <Button variant="ghost" className="w-full justify-start h-8 px-2" size="sm">
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-700">SVG to MP4</span>
                </Button>
              </Link>
              <div className="mt-2 pt-2 border-t">
                <Link href="/convert" className="text-xs text-[#FF7043] hover:underline">View all converters →</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}