"use client";
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useCredits } from "@/contexts/CreditContext";
import { SafeSvgDisplay } from "@/components/safe-svg-display";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { 
  Plus, 
  Download, 
  Trash2, 
  Loader2, 
  Sparkles, 
  Film, 
  Clock, 
  FileIcon, 
  ArrowRight,
  Search,
  Grid3X3,
  List,
  Code,
  FileDown,
  Zap,
  ChevronDown,
  Bell,
  Menu,
  X,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { WelcomeModal } from "./welcome-modal";
import { WelcomeToast } from "./welcome-toast";
import { CreditsScarcityModal } from "./credits-scarcity-modal";
// Type definitions
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
type DashboardProps = {
  initialSvgs: SvgDesign[];
  userId?: string;
  userProfile?: {
    subscription_tier: string | null;
    subscription_status: string | null;
    lifetime_credits_granted?: number;
    lifetime_credits_used?: number;
    monthly_credits?: number;
    monthly_credits_used?: number;
    credits_reset_at?: string;
    stripe_customer_id?: string | null;
  };
};
// Minimalist Creation Card
const CreationCard = ({ item, onDownload, onDelete, userTier }: {
  item: ContentItem;
  onDownload: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  userTier: string;
}) => {
  if (item.type === 'video') {
    const video = item.content as GeneratedVideo;
    const isExpired = new Date(video.expires_at) < new Date();
    const daysRemaining = Math.ceil((new Date(video.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return (
      <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
        <div className="aspect-square bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 md:p-5 flex items-center justify-center relative flex-shrink-0">
          <Film className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-purple-600 drop-shadow-sm" />
          <Badge className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-purple-500 text-white text-xs sm:text-sm font-medium px-2 py-1">
            Video
          </Badge>
        </div>
        <div className="p-4 sm:p-5 flex-grow flex flex-col">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate mb-2">
            {video.metadata.original_svg || 'AI Video'}
          </h3>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className={cn(
                "text-xs sm:text-sm font-medium",
                isExpired ? "text-red-600" : daysRemaining <= 3 ? "text-amber-600" : "text-gray-600"
              )}>
                {isExpired ? 'Expired' : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`}
              </span>
            </div>
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-1">
              {!isExpired && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-gray-100"
                  onClick={() => onDownload(item)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                onClick={() => onDelete(video.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const svg = item.content as SvgDesign;
  const createdDate = new Date(svg.created_at);
  const retentionDays = userTier === 'pro' ? 30 : 7;
  const expiryDate = new Date(createdDate.getTime() + retentionDays * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysRemaining <= 0;
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 h-full flex flex-col">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center relative flex-shrink-0">
        {svg.svg_content ? (
          <SafeSvgDisplay 
            svgContent={svg.svg_content}
            alt={svg.title}
            className="w-full h-full max-w-[160px] max-h-[160px] sm:max-w-[180px] sm:max-h-[180px] md:max-w-[200px] md:max-h-[200px] [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain drop-shadow-sm"
          />
        ) : (
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-gray-400" />
        )}
        <Badge className={cn(
          "absolute top-3 right-3 text-xs font-medium px-2 py-1",
          item.type === 'icon' ? "bg-blue-500 text-white" : "bg-emerald-500 text-white"
        )}>
          {item.type === 'icon' ? 'Icon' : 'SVG'}
        </Badge>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-base text-gray-900 truncate mb-3">{svg.title}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={cn(
              "text-sm font-medium",
              isExpired ? "text-red-600" : daysRemaining <= 3 ? "text-amber-600" : "text-gray-600"
            )}>
              {isExpired ? 'Expired' : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
              onClick={() => onDownload(item)}
              title="Download"
            >
              <Download className="h-4 w-4" style={{ stroke: 'currentColor' }} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 bg-white hover:bg-red-50 hover:text-red-600 border-gray-200 text-gray-700"
              onClick={() => onDelete(svg.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" style={{ stroke: 'currentColor' }} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Empty State
const EmptyState = () => (
  <div className="text-center py-16 sm:py-24">
    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
      <FileIcon className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">No creations yet</h3>
    <p className="text-gray-600 mb-8 max-w-md mx-auto">
      Start creating beautiful SVGs and icons with our AI-powered tools
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link href="/">
        <Button size="lg" className="w-full sm:w-auto">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate SVG
        </Button>
      </Link>
      <Link href="/ai-icon-generator">
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Icon
        </Button>
      </Link>
    </div>
  </div>
);
// Main Dashboard Component
export default function MinimalistDashboard({ initialSvgs, userId, userProfile: initialUserProfile }: DashboardProps) {
  const [svgs, setSvgs] = useState<SvgDesign[]>(initialSvgs);
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [displayedItems, setDisplayedItems] = useState<ContentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncCompleted, setSyncCompleted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { creditInfo, refreshCredits } = useCredits();
  const supabase = createClientComponentClient<Database>();
  const PAGE_SIZE = 12;

  // Handle successful subscription
  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    
    if (success === 'true' && sessionId && !syncInProgress && !syncCompleted) {
      // Show immediate success message
      toast({
        title: "🎉 Payment successful!",
        description: "Syncing your subscription... This may take a few moments.",
      });
      
      // Check if already subscribed before syncing
      const checkAndSync = async () => {
        // First check if already subscribed
        if (creditInfo?.isSubscribed) {
          // Already synced, just show success and clean URL
          toast({
            title: "✨ Welcome to your subscription!",
            description: "Your account is ready to use.",
          });
          // Clean up URL without reload
          window.history.replaceState({}, '', '/dashboard');
          setSyncCompleted(true);
          return;
        }
        
        // Prevent multiple sync attempts
        if (syncInProgress) return;
        setSyncInProgress(true);
        
        // Not subscribed yet, try to sync
        try {
          const response = await fetch('/api/sync-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            // Refresh credits immediately
            await refreshCredits();
            
            // Check if subscription is now active after a short delay
            setTimeout(async () => {
              await refreshCredits();
              // Clean up URL without reload
              window.history.replaceState({}, '', '/dashboard');
              setSyncCompleted(true);
              setSyncInProgress(false);
              
              // Show success message once credits are refreshed
              toast({
                title: "✨ Subscription activated!",
                description: "Your account has been upgraded successfully.",
              });
            }, 1500);
          } else {
            setSyncInProgress(false);
          }
        } catch (error) {
          console.error('Sync error:', error);
          setSyncInProgress(false);
        }
      };
      
      // Try to sync immediately
      checkAndSync();
      
      // Also try again after 3 seconds if not completed
      const retryTimeout = setTimeout(() => {
        if (!syncCompleted && !creditInfo?.isSubscribed) {
          checkAndSync();
        }
      }, 3000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [searchParams, creditInfo?.isSubscribed, refreshCredits, syncInProgress, syncCompleted]);

  // Ensure client-side rendering for components with dynamic IDs
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('generated_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
    }
  }, [supabase]);
  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000);
    return () => clearInterval(interval);
  }, [fetchVideos]);
  // Combine and filter content
  useEffect(() => {
    const svgItems: ContentItem[] = svgs.map(svg => ({
      id: svg.id,
      type: svg.tags?.includes('icon') ? 'icon' : 'svg',
      content: svg,
      created_at: svg.created_at
    }));
    const videoItems: ContentItem[] = videos.map(video => ({
      id: video.id,
      type: 'video',
      content: video,
      created_at: video.created_at
    }));
    let allItems = [...svgItems, ...videoItems];
    // Apply filters
    if (filterType !== 'all') {
      allItems = allItems.filter(item => item.type === filterType);
    }
    if (searchQuery) {
      allItems = allItems.filter(item => {
        if (item.type === 'video') {
          const video = item.content as GeneratedVideo;
          return video.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 video.metadata.original_svg?.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          const svg = item.content as SvgDesign;
          return svg.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }
    // Sort items
    allItems.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          const aTitle = a.type === 'video' ? 
            (a.content as GeneratedVideo).metadata.original_svg || 'Video' : 
            (a.content as SvgDesign).title;
          const bTitle = b.type === 'video' ? 
            (b.content as GeneratedVideo).metadata.original_svg || 'Video' : 
            (b.content as SvgDesign).title;
          return aTitle.localeCompare(bTitle);
        default:
          return 0;
      }
    });
    setContentItems(allItems);
    setCurrentPage(1);
  }, [svgs, videos, filterType, searchQuery, sortBy]);
  // Paginate content
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setDisplayedItems(contentItems.slice(start, end));
  }, [contentItems, currentPage]);
  // Download handlers
  const downloadSvg = async (svg: SvgDesign) => {
    const blob = new Blob([svg.svg_content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${svg.title.replace(/\s+/g, "-").toLowerCase()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const downloadVideo = async (video: GeneratedVideo) => {
    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-video-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download video",
        variant: "destructive"
      });
    }
  };
  const handleDownload = (item: ContentItem) => {
    if (item.type === 'video') {
      downloadVideo(item.content as GeneratedVideo);
    } else {
      downloadSvg(item.content as SvgDesign);
    }
  };
  // Delete handler
  const deleteSvg = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("svg_designs")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({
        title: "Item deleted",
      });
      setSvgs(prev => prev.filter(svg => svg.id !== id));
    } catch (error) {
      toast({
        title: "Error deleting item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete video handler
  const deleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("generated_videos")
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({
        title: "Video deleted",
      });
      setVideos(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      toast({
        title: "Error deleting video",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Get user tier and credit info
  const contextCredits = creditInfo;
  const isSubscribed = contextCredits?.isSubscribed ?? userProfile?.subscription_status === 'active';
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
      : (userProfile?.lifetime_credits_granted ?? 6),
    type: isSubscribed ? 'monthly' : 'lifetime' as const,
    remaining: 0
  };
  if (!contextCredits) {
    displayCreditInfo.remaining = Math.max(0, displayCreditInfo.limit - displayCreditInfo.used);
  }
  const userTier = contextCredits?.isSubscribed ? 
    (contextCredits.subscriptionTier === 'pro' ? 'pro' : 'starter') : 
    (userProfile?.subscription_status === 'active' ? 
      (userProfile.subscription_tier === 'pro' ? 'pro' : 'starter') : 
      'free');
  const hasMore = contentItems.length > displayedItems.length + (currentPage - 1) * PAGE_SIZE;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Components for New Users */}
      <WelcomeToast />
      {/* <WelcomeModal /> */}
      
      {/* Credit-based Modals - Disabled */}
      {/* {creditInfo && (
        <CreditsScarcityModal 
          creditsRemaining={creditInfo.creditsRemaining} 
        />
      )} */}
      {/* Mobile Header - Only shown on small screens */}
      <header className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center">
              <span className="text-lg font-semibold">SVGAI</span>
            </Link>
            {creditInfo && (
              <div className="flex items-center text-sm">
                <Sparkles className="w-4 h-4 mr-1 text-[#FF7043]" />
                <span className="font-medium">{creditInfo.creditsRemaining}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Minimalist Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="relative h-full overflow-y-auto bg-white">
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden absolute right-2 top-2"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              {/* Credit Display - Show for all users on mobile */}
              {creditInfo && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg lg:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Credits</span>
                    <span className="text-sm text-gray-900">{creditInfo.creditsRemaining} left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] h-2 rounded-full transition-all" 
                         style={{ width: `${(creditInfo.creditsRemaining / creditInfo.creditLimit) * 100}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {creditInfo.isSubscribed ? 'Resets monthly' : 'One-time credits'}
                  </p>
                  {!creditInfo.isSubscribed && creditInfo.creditsRemaining < 10 && (
                    <Link href="/pricing" className="block">
                      <Button size="sm" className="w-full">
                        Get More Credits
                      </Button>
                    </Link>
                  )}
                </div>
              )}
              {/* Quick Tools */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Tools
                </h3>
                <div className="space-y-1">
                  <Link 
                    href={creditInfo && creditInfo.creditsRemaining === 0 ? "/pricing" : "/ai-icon-generator"} 
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-3 text-gray-400" />
                    AI Icon Generator
                    <span className="ml-auto text-xs text-gray-500">1 credit</span>
                  </Link>
                  <Link href="/tools/svg-editor" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Code className="w-4 h-4 mr-3 text-gray-400" />
                    SVG Editor
                  </Link>
                  <Link href="/tools/svg-optimizer" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <FileDown className="w-4 h-4 mr-3 text-gray-400" />
                    Optimizer
                  </Link>
                  <Link href="/convert/svg-to-png" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to PNG
                  </Link>
                  <Link href="/convert/png-to-svg" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    PNG to SVG
                  </Link>
                  <Link 
                    href={creditInfo && creditInfo.creditsRemaining < 6 ? "/pricing" : "/tools/svg-to-video"} 
                    className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <Film className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to Video
                    <span className="ml-auto text-xs text-gray-500">6 credits</span>
                  </Link>
                  <Link href="/animate" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <Zap className="w-4 h-4 mr-3 text-gray-400" />
                    Animator
                  </Link>
                </div>
              </div>
              {/* Popular Converters */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Popular Converters
                </h3>
                <div className="space-y-1">
                  <Link href="/convert/jpg-to-svg" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    JPG to SVG
                  </Link>
                  <Link href="/convert/svg-to-pdf" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to PDF
                  </Link>
                  <Link href="/convert/webp-to-svg" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    WebP to SVG
                  </Link>
                  <Link href="/convert/svg-to-jpg" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to JPG
                  </Link>
                </div>
                <Link href="/convert" className="block mt-3 text-sm text-primary-600 hover:text-primary-700">
                  View all 40 converters →
                </Link>
              </div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 sm:p-8 lg:p-10 max-w-[1600px] mx-auto">
            {/* Quick Actions */}
            <div className="mb-4">
              {creditInfo && creditInfo.creditsRemaining === 0 ? (
                <Link href="/pricing" className="block sm:inline-block">
                  <Button className="w-full sm:w-auto">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get More Credits
                  </Button>
                </Link>
              ) : (
                <Link href="/" className="block sm:inline-block">
                  <Button className="w-full sm:w-auto">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate New SVG
                  </Button>
                </Link>
              )}
            </div>
            {/* Creations Section */}
            <Card className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-4 pt-5 px-6 sm:px-8">
                <div className="flex flex-col space-y-3">
                  {/* Title and retention info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Your Creations
                      </h2>
                      <Badge variant="secondary" className="text-xs font-normal px-2.5 py-0.5">
                        {contentItems.length}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {userTier === 'pro' ? (
                        <span className="font-medium text-purple-600">30-day retention</span>
                      ) : userTier === 'starter' ? (
                        <span className="text-gray-600">7-day retention</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">7-day retention</span>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <Link href="/pricing" className="text-[#FF7043] hover:underline font-medium inline-flex items-center gap-1">
                            <span className="hidden sm:inline">Upgrade for</span>
                            <span className="sm:hidden">→</span>
                            <span>30 days</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Search and filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search bar */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="Search creations..."
                        className="pl-9 pr-4 w-full h-9 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {/* Filters and view toggle */}
                    <div className="flex items-center gap-2">
                      {isClient ? (
                        <>
                          {/* Filter dropdown */}
                          <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[90px] h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="svg">SVG</SelectItem>
                              <SelectItem value="icon">Icons</SelectItem>
                              <SelectItem value="video">Videos</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {/* Sort dropdown */}
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[100px] h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="recent">Recent</SelectItem>
                              <SelectItem value="oldest">Oldest</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <>
                          <div className="w-[90px] h-9 bg-gray-200 animate-pulse rounded-md"></div>
                          <div className="w-[100px] h-9 bg-gray-200 animate-pulse rounded-md"></div>
                        </>
                      )}
                      
                      {/* View mode toggle */}
                      <div className="flex border border-gray-200 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-r-none h-9 w-9",
                            viewMode === 'grid' && "bg-gray-100"
                          )}
                          onClick={() => setViewMode('grid')}
                          aria-label="Grid view"
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-l-none h-9 w-9",
                            viewMode === 'list' && "bg-gray-100"
                          )}
                          onClick={() => setViewMode('list')}
                          aria-label="List view"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 py-5">
                {contentItems.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid gap-4 sm:gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {displayedItems.map((item) => (
                          <CreationCard
                            key={item.id}
                            item={item}
                            onDownload={handleDownload}
                            onDelete={(id) => item.type === 'video' ? deleteVideo(id) : deleteSvg(id)}
                            userTier={userTier}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displayedItems.map((item) => {
                          const isVideo = item.type === 'video';
                          const title = isVideo ? 
                            (item.content as GeneratedVideo).metadata.original_svg || 'AI Video' : 
                            (item.content as SvgDesign).title;
                          let daysRemaining = 0;
                          if (isVideo) {
                            const video = item.content as GeneratedVideo;
                            daysRemaining = Math.ceil((new Date(video.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          } else {
                            const svg = item.content as SvgDesign;
                            const createdDate = new Date(svg.created_at);
                            const retentionDays = userTier === 'pro' ? 30 : 7;
                            const expiryDate = new Date(createdDate.getTime() + retentionDays * 24 * 60 * 60 * 1000);
                            daysRemaining = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          }
                          const isExpired = daysRemaining <= 0;
                          return (
                            <div 
                              key={item.id} 
                              className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all"
                            >
                              <div className={cn(
                                "w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg flex items-center justify-center mr-4",
                                isVideo ? "bg-gradient-to-br from-purple-50 to-purple-100" : 
                                item.type === 'icon' ? "bg-gradient-to-br from-blue-50 to-blue-100" : 
                                "bg-gradient-to-br from-emerald-50 to-emerald-100"
                              )}>
                                {isVideo ? (
                                  <Film className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                                ) : item.type === 'icon' ? (
                                  <FileIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                                ) : (
                                  <FileIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{title}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <p className={cn(
                                    "text-sm font-medium",
                                    isExpired ? "text-red-600" : daysRemaining <= 3 ? "text-amber-600" : "text-gray-600"
                                  )}>
                                    {isExpired ? 'Expired' : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-gray-100"
                                  onClick={() => handleDownload(item)}
                                  title="Download"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => isVideo ? deleteVideo(item.id) : deleteSvg(item.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {hasMore && (
                      <div className="mt-6 sm:mt-8 text-center">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={isLoading}
                          className="text-sm"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            'Load More'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}