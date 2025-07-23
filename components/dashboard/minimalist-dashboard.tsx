"use client";
import { useState, useEffect, useCallback } from "react";
import { createClientComponentClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useRouter } from "next/navigation";
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
      <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-50 p-8 flex items-center justify-center relative">
          <Film className="w-16 h-16 text-purple-500" />
          <Badge className="absolute top-2 right-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
            Video
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">
            {video.metadata.original_svg || 'AI Video'}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">
              {isExpired ? 'Expired' : `${daysRemaining} days left`}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {!isExpired && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onDownload(item)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:text-red-600"
                onClick={() => onDelete(video.id)}
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
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center relative">
        {svg.svg_content ? (
          <SafeSvgDisplay 
            svgContent={svg.svg_content}
            alt={svg.title}
            className="w-full h-full max-w-[180px] max-h-[180px] [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
          />
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        )}
        <Badge className={cn(
          "absolute top-2 right-2",
          item.type === 'icon' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
        )}>
          {item.type === 'icon' ? 'Icon' : 'SVG'}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{svg.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500">
            {isExpired ? 'Expired' : `${daysRemaining} days left`}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onDownload(item)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:text-red-600"
              onClick={() => onDelete(svg.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Empty State
const EmptyState = () => (
  <div className="text-center py-24">
    <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No creations yet</h3>
    <p className="text-gray-500 mb-6">Get started with AI generation</p>
    <Link href="/">
      <Button>
        <Sparkles className="w-4 h-4 mr-2" />
        Generate SVG
      </Button>
    </Link>
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
  const router = useRouter();
  const { creditInfo } = useCredits();
  const supabase = createClientComponentClient<Database>();
  const PAGE_SIZE = 12;
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
      {/* Mobile Header - Only shown on small screens */}
      <header className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 sm:px-6">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Minimalist Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {sidebarOpen && (
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
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
                <div className="mb-6 p-4 bg-gray-50 rounded-lg lg:hidden">
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
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Tools
                </h3>
                <div className="space-y-1">
                  <Link href="/ai-icon-generator" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
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
                  <Link href="/tools/svg-to-video" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Quick Actions */}
            <div className="mb-6">
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate New SVG
                </Button>
              </Link>
            </div>
            {/* Creations Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Your Creations</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {userTier === 'pro' ? '30-day' : '7-day'} retention
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 pr-4 w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="svg">SVG</SelectItem>
                            <SelectItem value="icon">Icons</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                          </SelectContent>
                        </Select>
                        {filterType !== 'all' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="relative">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recent">Recent</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                          </SelectContent>
                        </Select>
                        {sortBy !== 'recent' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex border border-gray-200 rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-r-none",
                            viewMode === 'grid' && "bg-gray-100"
                          )}
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "rounded-l-none",
                            viewMode === 'list' && "bg-gray-100"
                          )}
                          onClick={() => setViewMode('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {contentItems.length === 0 ? (
                  <EmptyState />
                ) : (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
                              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                            >
                              <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                                {isVideo ? (
                                  <Film className="w-6 h-6 text-purple-500" />
                                ) : (
                                  <FileIcon className="w-6 h-6 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{title}</h3>
                                <p className="text-sm text-gray-500">
                                  {isExpired ? 'Expired' : `${daysRemaining} days left`}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDownload(item)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:text-red-600"
                                  onClick={() => isVideo ? deleteVideo(item.id) : deleteSvg(item.id)}
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
                      <div className="mt-8 text-center">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={isLoading}
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