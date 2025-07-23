"use client";
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { createClientComponentClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useCredits } from "@/contexts/CreditContext";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
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
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Wand2,
  Code,
  FileDown,
  Zap,
  TrendingUp,
  ChevronDown,
  Eye,
  Edit2,
  Share2,
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
    subscription_interval?: string;
    stripe_customer_id?: string | null;
  };
};
// Metrics Card Component
const MetricCard = ({ label, value, change, trend, icon: Icon, color }: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: 'blue' | 'orange' | 'purple' | 'green';
}) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600'
  };
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };
  return (
    <Card className="group border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg transition-transform duration-200 group-hover:scale-110", colors[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {trend !== 'neutral' && (
            <span className={cn("text-sm font-medium", trendColors[trend])}>
              {change}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
};
// Quick Actions Component
const QuickActions = () => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create Something Amazing
          </h2>
          <p className="text-primary-100">
            Choose from AI generation or start with our tools
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg"
            className="bg-white text-primary-600 hover:bg-gray-50"
            onClick={() => router.push('/')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate SVG
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                More Options
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/ai-icon-generator')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Icon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/tools/svg-editor')}>
                <Code className="w-4 h-4 mr-2" />
                Open Editor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/gallery')}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Browse Gallery
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
// Enhanced Creation Card
const CreationCard = ({ item, onDownload, onDelete, userTier }: {
  item: ContentItem;
  onDownload: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  userTier: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  if (item.type === 'video') {
    const video = item.content as GeneratedVideo;
    const isExpired = new Date(video.expires_at) < new Date();
    return (
      <div
        className={cn(
          "group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer",
          isExpired && "opacity-60"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-square bg-gray-50 p-4 relative">
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <Film className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">{video.duration}s</p>
              <p className="text-xs text-gray-500">{video.resolution}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
              Video
            </Badge>
          </div>
          {!isExpired && (
            <div className={cn(
              "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(video.video_url, '_blank');
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item);
                }}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(video.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">
            {video.metadata.original_svg || 'AI Video'}
          </h3>
          <p className="text-sm text-gray-500 truncate mt-1">{video.prompt}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {isExpired ? 'Expired' : formatDistanceToNow(new Date(video.expires_at), { addSuffix: true })}
            </div>
            <span className="text-xs text-gray-400">
              {video.credits_used} credits
            </span>
          </div>
        </div>
      </div>
    );
  }
  const svg = item.content as SvgDesign;
  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-gray-50 p-4 relative">
        {svg.svg_content ? (
          <div className="w-full h-full flex items-center justify-center">
            <SafeSvgDisplay 
              svgContent={svg.svg_content}
              alt={svg.title}
              className="w-full h-full max-w-[200px] max-h-[200px] [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={cn(
            "hover:bg-current",
            item.type === 'icon' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
          )}>
            {item.type === 'icon' ? 'Icon' : 'SVG'}
          </Badge>
        </div>
        <div className={cn(
          "absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(item);
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open in editor
            }}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(svg.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{svg.title}</h3>
        {svg.description && (
          <p className="text-sm text-gray-500 truncate mt-1">{svg.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(svg.created_at), { addSuffix: true })}
          </div>
          {svg.tags && svg.tags.length > 0 && (
            <div className="flex gap-1">
              {svg.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// Empty State Component
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileIcon className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No creations yet</h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      Start creating amazing SVGs with our AI generator or upload your existing files.
    </p>
    <div className="flex justify-center gap-3">
      <Link href="/">
        <Button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </Link>
      <Link href="/tools">
        <Button variant="outline">
          Browse Tools
        </Button>
      </Link>
    </div>
  </div>
);
// Main Dashboard Component
export default function ProfessionalDashboard({ initialSvgs, userId, userProfile: initialUserProfile }: DashboardProps) {
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
  const { creditInfo, refreshCredits } = useCredits();
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
          return svg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 svg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 svg.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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
        title: "Item deleted successfully",
      });
      setSvgs(prev => prev.filter(svg => svg.id !== id));
    } catch (error) {
      toast({
        title: "Error deleting item",
        description: "Please try again.",
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
        title: "Video deleted successfully",
      });
      setVideos(prev => prev.filter(video => video.id !== id));
    } catch (error) {
      toast({
        title: "Error deleting video",
        description: "Please try again.",
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
  // Calculate metrics
  const totalCreations = contentItems.length;
  const totalSvgs = contentItems.filter(item => item.type !== 'video').length;
  const totalVideos = videos.length;
  const storageUsed = "2.4 GB"; // This would be calculated from actual data
  const hasMore = contentItems.length > displayedItems.length + (currentPage - 1) * PAGE_SIZE;
  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{displayCreditInfo.remaining}</span>
                <span className="text-sm text-gray-500">credits</span>
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/billing')}>
                    Billing & Plans
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
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
              {/* Quick Tools */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Tools
                </h3>
                <div className="space-y-1">
                  <Link href="/ai-icon-generator" className="dashboard-sidebar-link text-gray-700 hover:bg-gray-100 hover:text-primary-600">
                    <Wand2 className="w-4 h-4 mr-3 text-primary-500" />
                    AI Generator
                  </Link>
                  <Link href="/tools/svg-editor" className="dashboard-sidebar-link text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                    <Code className="w-4 h-4 mr-3 text-blue-500" />
                    SVG Editor
                  </Link>
                  <Link href="/tools/svg-optimizer" className="dashboard-sidebar-link text-gray-700 hover:bg-gray-100 hover:text-green-600">
                    <FileDown className="w-4 h-4 mr-3 text-green-500" />
                    Optimizer
                  </Link>
                  <Link href="/tools/svg-to-video" className="dashboard-sidebar-link text-gray-700 hover:bg-gray-100 hover:text-purple-600">
                    <Film className="w-4 h-4 mr-3 text-purple-500" />
                    SVG to Video
                    <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-100" variant="secondary">
                      PRO
                    </Badge>
                  </Link>
                  <Link href="/animate" className="dashboard-sidebar-link text-gray-700 hover:bg-gray-100 hover:text-pink-600">
                    <Zap className="w-4 h-4 mr-3 text-pink-500" />
                    Animator
                  </Link>
                </div>
              </div>
              {/* Popular Converters */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Popular Converters
                </h3>
                <div className="space-y-1">
                  <Link href="/convert/png-to-svg" className="dashboard-sidebar-link text-gray-600 hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    PNG to SVG
                    <span className="ml-auto text-xs text-gray-400">40.5k/mo</span>
                  </Link>
                  <Link href="/convert/svg-to-png" className="dashboard-sidebar-link text-gray-600 hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to PNG
                    <span className="ml-auto text-xs text-gray-400">22.2k/mo</span>
                  </Link>
                  <Link href="/convert/jpg-to-svg" className="dashboard-sidebar-link text-gray-600 hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    JPG to SVG
                    <span className="ml-auto text-xs text-gray-400">18.1k/mo</span>
                  </Link>
                  <Link href="/convert/svg-to-pdf" className="dashboard-sidebar-link text-gray-600 hover:bg-gray-100">
                    <ArrowRight className="w-4 h-4 mr-3 text-gray-400" />
                    SVG to PDF
                    <span className="ml-auto text-xs text-gray-400">9.9k/mo</span>
                  </Link>
                </div>
                <Link href="/convert" className="block mt-3 text-sm text-primary-600 hover:text-primary-700">
                  View all 40 converters →
                </Link>
              </div>
              {/* Storage Widget */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage</span>
                  <span className="text-sm text-gray-500">{storageUsed} / 8 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
                <MetricCard
                  label="Total Creations"
                  value={totalCreations.toString()}
                  change="+12%"
                  trend="up"
                  icon={FileIcon}
                  color="blue"
                />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '50ms' }}>
                <MetricCard
                  label="Credits Used"
                  value={`${displayCreditInfo.used}/${displayCreditInfo.limit}`}
                  change={`${Math.round((displayCreditInfo.used / displayCreditInfo.limit) * 100)}%`}
                  trend="neutral"
                  icon={CreditCard}
                  color="orange"
                />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                <MetricCard
                  label="Storage Used"
                  value={storageUsed}
                  change="5.2 GB free"
                  trend="neutral"
                  icon={FileDown}
                  color="purple"
                />
              </div>
              <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
                <MetricCard
                  label="Total Videos"
                  value={totalVideos.toString()}
                  change="+45%"
                  trend="up"
                  icon={Film}
                  color="green"
                />
              </div>
            </div>
            {/* Quick Actions */}
            <QuickActions />
            {/* Creations Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Your Creations</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {contentItems.length} items • {userTier === 'pro' ? '30-day' : '7-day'} retention
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="search"
                        placeholder="Search files..."
                        className="pl-9 pr-4 w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[120px]">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Files</SelectItem>
                          <SelectItem value="svg">SVG Files</SelectItem>
                          <SelectItem value="icon">Icons</SelectItem>
                          <SelectItem value="video">Videos</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex border rounded-md">
                        <Button
                          variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="rounded-r-none"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                          size="icon"
                          className="rounded-l-none"
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
                        {displayedItems.map((item, idx) => (
                          <div key={item.id} className="animate-scale-in" style={{ animationDelay: `${idx * 30}ms` }}>
                            <CreationCard
                              item={item}
                              onDownload={handleDownload}
                              onDelete={(id) => item.type === 'video' ? deleteVideo(id) : deleteSvg(id)}
                              userTier={userTier}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {displayedItems.map((item, idx) => (
                          <div 
                            key={item.id} 
                            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all animate-fade-up"
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                              {item.type === 'video' ? (
                                <Film className="w-8 h-8 text-purple-600" />
                              ) : (
                                <FileIcon className="w-8 h-8 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">
                                {item.type === 'video' ? 
                                  (item.content as GeneratedVideo).metadata.original_svg || 'AI Video' : 
                                  (item.content as SvgDesign).title}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {item.type === 'video' ? 
                                  (item.content as GeneratedVideo).prompt : 
                                  (item.content as SvgDesign).description || 'No description'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge className={cn(
                                "hover:bg-current text-xs",
                                item.type === 'video' ? "bg-purple-100 text-purple-700" :
                                item.type === 'icon' ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                              )}>
                                {item.type === 'video' ? 'Video' : item.type === 'icon' ? 'Icon' : 'SVG'}
                              </Badge>
                              <span className="text-sm text-gray-400">
                                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDownload(item)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  {item.type !== 'video' && (
                                    <>
                                      <DropdownMenuItem>
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => deleteSvg(item.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
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
                            <>
                              Load More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
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