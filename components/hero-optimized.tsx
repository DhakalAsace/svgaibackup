"use client"
import { useState, useEffect, useRef, useMemo, useCallback, memo, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader, Settings, ArrowRight, ChevronDown, ChevronUp, Sparkles, Download, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { useSVGExamples } from "./svg-examples"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { usePromptRestoration } from '@/hooks/use-prompt-restoration'
import { useCredits } from '@/contexts/CreditContext'
import { getSvgStyleOptions, getStyleTooltip } from "@/lib/style-mappings"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatErrorMessage } from '@/lib/client-error-handler'
// Dynamically import modals to reduce initial bundle size
const GenerationSignupModal = dynamic(
  () => import('@/components/auth/generation-signup-modal').then(mod => ({ default: mod.GenerationSignupModal })),
  { 
    ssr: false,
    loading: () => null // No loading indicator to prevent layout shift
  }
)
const UpgradeModal = dynamic(
  () => import('@/components/generation-upsells').then(mod => ({ default: mod.UpgradeModal })),
  { 
    ssr: false,
    loading: () => null // No loading indicator to prevent layout shift
  }
)

// Lazy load advanced options to reduce initial bundle
// Commented out - using local definition for now
// const AdvancedOptions = dynamic(
//   () => import('./hero-advanced-options').then(mod => ({ default: mod.AdvancedOptions })),
//   { 
//     ssr: false,
//     loading: () => null
//   }
// )
// Memoized sample prompts component
const SamplePrompts = memo(({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) => {
  const samplePrompts = [
    {
      label: "Cute Red Panda",
      prompt: "Adorable red panda sitting on bamboo branch, fluffy tail, warm orange and brown colors, kawaii style illustration."
    },
    {
      label: "Eco Brand Logo",
      prompt: "Minimal eco logo 'TerraBloom' with sprouting seedling icon, fresh green and charcoal text, clean lines."
    },
    {
      label: "Coffee Cup Line Art",
      prompt: "Single-line art of steaming coffee cup with swirling beans, monochrome dark brown."
    },
    {
      label: "Space Rocket",
      prompt: "Cartoon rocket soaring past planets and stars, flat style, blue space, red rocket, orange flames."
    },
    {
      label: "Kawaii Sticker Set",
      prompt: "3 kawaii stickers: smiling cat with heart, cheerful corgi, happy cloud raining hearts, pastel colors."
    }
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {samplePrompts.map((samplePrompt, idx) => (
        <button 
          key={idx}
          onClick={() => onSelectPrompt(samplePrompt.prompt)}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
        >
          {samplePrompt.label}
        </button>
      ))}
    </div>
  );
});
SamplePrompts.displayName = 'SamplePrompts';
// Memoized advanced options component
const AdvancedOptions = memo(({ 
  style, 
  size, 
  aspectRatio,
  onStyleChange,
  onSizeChange,
  onAspectRatioChange 
}: {
  style: string;
  size: string;
  aspectRatio: string;
  onStyleChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onAspectRatioChange: (value: string) => void;
}) => {
  const styleOptions = getSvgStyleOptions();
  const sortedSizeOptions = useMemo(() => {
    const sizeOptions = ["1024x1024", "1365x1024", "1024x1365", "1536x1024", "1024x1536", "1820x1024", "1024x1820", "1024x2048", "2048x1024", "1434x1024", "1024x1434", "1024x1280", "1280x1024", "1024x1707", "1707x1024"];
    return [...sizeOptions].sort((a, b) => {
      const [widthA, heightA] = a.split('x').map(Number);
      const [widthB, heightB] = b.split('x').map(Number);
      return (widthA * heightA) - (widthB * heightB);
    });
  }, []);
  const sortedAspectRatioOptions = useMemo(() => {
    const aspectRatioOptions = ["Not set", "1:1", "4:3", "3:4", "3:2", "2:3", "16:9", "9:16", "1:2", "2:1", "7:5", "5:7", "4:5", "5:4", "3:5", "5:3"];
    return [...aspectRatioOptions].sort((a, b) => {
      if (a === "Not set") return -1;
      if (b === "Not set") return 1;
      return a.localeCompare(b);
    });
  }, []);
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
      <div>
        <div className="flex items-center gap-1 mb-1">
          <label htmlFor="style-select" className="text-sm font-medium text-gray-700">Style</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{getStyleTooltip(style, false)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <select
          id="style-select"
          className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
          value={style}
          onChange={e => onStyleChange(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">Size</label>
        <select
          id="size-select"
          className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
          value={size}
          onChange={e => onSizeChange(e.target.value)}
        >
          {sortedSizeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-gray-700 mb-1">Ratio</label>
        <select
          id="aspect-ratio-select"
          className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
          value={aspectRatio}
          onChange={e => onAspectRatioChange(e.target.value)}
        >
          {sortedAspectRatioOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
});
AdvancedOptions.displayName = 'AdvancedOptions';
export default function HeroOptimized() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [limitReachedError, setLimitReachedError] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isSoftPrompt, setIsSoftPrompt] = useState(false)
  const [dailyGenerations, setDailyGenerations] = useState(0)
  const [showCustomize, setShowCustomize] = useState(false)
  const [size, setSize] = useState("1024x1024")
  const [style, setStyle] = useState("any")
  const [aspectRatio, setAspectRatio] = useState("Not set")
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [activeSlide, setActiveSlide] = useState(0)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [userGenerations, setUserGenerations] = useState<{used: number, limit: number} | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const isInitialLoad = useRef(true);
  // Use the preloaded SVG examples instead of hardcoding them
  const examplesData = useSVGExamples();
  const featuredExamples = useMemo(() => 
    examplesData.length > 0 ? examplesData : [
      {
        src: "/svg-examples/minimalist-geometric-fox-head-logo-clean-lines-sin.svg",
        alt: "Minimalist geometric fox head SVG logo generated by AI",
        type: "Brand Logo",
        description: "Clean, modern fox logo created with AI. Perfect for businesses looking for a distinctive mark."
      },
      {
        src: "/svg-examples/dog.svg",
        alt: "Adorable illustrated dog character with expressive eyes and playful stance SVG generated by AI",
        type: "Character Illustration",
        description: "Charming dog illustration perfect for pet brands, children's content, or friendly mascots. AI creates personality-filled characters."
      }
    ], [examplesData]);
  // Use credit context
  const { creditInfo, refreshCredits } = useCredits()
  // Check for logged in user and their generation status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      setUserId(user?.id || null)
      if (user?.id && !authError && creditInfo) {
        setUserGenerations({
          used: creditInfo.creditsUsed,
          limit: creditInfo.creditLimit
        })
        setIsSubscribed(creditInfo.isSubscribed)
      }
    }
    checkUser()
  }, [creditInfo, supabase.auth])
  // Use prompt restoration hook
  usePromptRestoration(setPrompt, setStyle, setSize, setAspectRatio);
  // Memoized callbacks to prevent re-renders
  const handleStyleChange = useCallback((value: string) => setStyle(value), []);
  const handleSizeChange = useCallback((value: string) => setSize(value), []);
  const handleAspectRatioChange = useCallback((value: string) => setAspectRatio(value), []);
  const handlePromptSelect = useCallback((prompt: string) => setPrompt(prompt), []);
  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return
    // Persist prompt and settings so they can be restored later
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pendingPrompt', prompt);
      sessionStorage.setItem('pendingStyle', style);
      sessionStorage.setItem('pendingSize', size);
      sessionStorage.setItem('pendingAspectRatio', aspectRatio);
    }
    // For authenticated users, check credit balance on frontend
    if (userId && userGenerations) {
      const requiredCredits = 2;
      const remainingCredits = userGenerations.limit - userGenerations.used;
      const hasEnoughCredits = remainingCredits >= requiredCredits;
      if (!hasEnoughCredits) {
        if (!isSubscribed) {
          setShowUpgradeModal(true);
        } else {
          setError("You've used all your monthly credits. They'll refresh at the start of your next billing period.");
        }
        return;
      }
    }
    setIsGenerating(true)
    setError("")
    setLimitReachedError("")
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout
      
      const response = await fetch("/api/generate-svg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          prompt,
          style,
          size,
          aspect_ratio: aspectRatio
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId);
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        try {
          const textResponse = await response.text();
          throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
        } catch (textError) {
          throw new Error(`Failed to parse server response (Status: ${response.status})`);
        }
      }
      if (response.status === 429) {
        const errorMessage = responseData.error || "";
        if (errorMessage.includes("Sign up to continue") || 
            errorMessage.includes("sign up for a free account") ||
            errorMessage.includes("Sign up for a free account")) {
          setIsSoftPrompt(false);
          setShowSignupModal(true);
        } else if (errorMessage.includes("no credits remaining") || errorMessage.includes("lifetime credits")) {
          setShowUpgradeModal(true);
        } else if (errorMessage.includes("monthly credits")) {
          setError("You've used all your monthly credits. They'll refresh at the start of your next billing period.");
        } else {
          // Handle any other 429 errors (like API limits)
          const formattedError = formatErrorMessage(errorMessage);
          setError(formattedError);
        }
        setIsGenerating(false)
        return
      }
      if (!response.ok) {
        const errorMessage = typeof responseData.error === 'string' 
          ? responseData.error 
          : (responseData.error?.message || `Failed to generate SVG (Status: ${response.status})`);
        
        // Check for signup prompts (including device verification errors)
        if (errorMessage.includes("Unable to verify your device") || 
            errorMessage.includes("sign up for a free account") ||
            errorMessage.includes("Sign up for a free account")) {
          setShowSignupModal(true);
          setIsGenerating(false);
          return;
        }
        
        throw new Error(errorMessage);
      }
      if (responseData.success) {
        const data = responseData.data || {};
        if (data.svgUrl) {
          const { svgUrl, remainingGenerations } = data;
          sessionStorage.setItem('resultSvgUrl', svgUrl);
          const queryParams = new URLSearchParams();
          const remainingStr = remainingGenerations?.toString() ?? '';
          if (remainingStr) {
            queryParams.set('remaining', remainingStr);
          }
          queryParams.set('prompt', prompt);
          if (!userId) {
            const totalGenerations = parseInt(localStorage.getItem('totalGenerations') || '0');
            localStorage.setItem('totalGenerations', (totalGenerations + 1).toString());
          } else if (userGenerations) {
            setUserGenerations(prev => prev ? {...prev, used: prev.used + 2} : null)
            window.dispatchEvent(new Event('creditUsed'))
            refreshCredits()
          }
          const pushPath = `/results?${queryParams.toString()}`;
          router.push(pushPath);
        } else {
          setError("The SVG was generated but the URL was not returned correctly. Please try again.");
          setIsGenerating(false);
        }
      } else {
        const errorMsg = typeof responseData.error === 'string' 
          ? responseData.error 
          : (responseData.error?.message || "Failed to generate SVG");
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      if (!limitReachedError) {
        let formattedError;
        if (err.name === 'AbortError') {
          formattedError = "The request took too long and timed out. Your credits may have been used - please check your dashboard. If your SVG was generated, it will appear in your dashboard.";
        } else {
          formattedError = formatErrorMessage(err);
          // Check for signup prompts (including device verification errors)
          if (formattedError.includes("Unable to verify your device") || 
              formattedError.includes("sign up for a free account") ||
              formattedError.includes("Sign up for a free account")) {
            setShowSignupModal(true);
            setIsGenerating(false);
            return;
          }
        }
        setError(formattedError);
        setIsGenerating(false)
      }
    } finally {
      if (!limitReachedError) {
        setIsGenerating(false)
      }
    }
  }, [prompt, style, size, aspectRatio, userId, userGenerations, isSubscribed, router, refreshCredits, limitReachedError]);
  // Auto-advance the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredExamples.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredExamples.length]);
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);
  const handleNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % featuredExamples.length);
  }, [featuredExamples.length]);
  const handlePrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + featuredExamples.length) % featuredExamples.length);
  }, [featuredExamples.length]);
  return (
    <section className="bg-gradient-to-b from-[#f8f9fa] to-white py-6 md:py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top badge - minimal and subtle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-[156px] h-[80px] mb-3 flex items-center justify-center">
            <Image 
              src="/laurel.svg" 
              alt="Award laurel - #1 Rated SVG AI Tool" 
              width={156} 
              height={80}
              priority={true}
              className="object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none" 
            />
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              <span className="text-center font-bold text-black text-base leading-none">#1</span>
              <span className="text-center font-bold text-black text-[15px] leading-none">SVG AI Tool</span>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Image 
                    key={i}
                    src="/star.svg" 
                    alt="5-star rating for SVG AI" 
                    width={14} 
                    height={14} 
                    className="mx-[1.5px]" 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Main heading - clean and impactful */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center mb-4 leading-tight px-4 sm:px-0">
          <span className="text-black">AI </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7043] to-[#FFA726]">SVG Generator:</span>
          <br />
          <span className="text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">Effortless Text to SVG Conversion</span>
        </h1>
        <p className="text-center text-[#495057] text-lg md:text-xl max-w-2xl mx-auto mb-6">
          Effortlessly convert text to SVG with AI. Generate unique vector <Link href="/ai-icon-generator" className="text-[#FF7043] hover:underline" target="_blank" rel="noopener noreferrer">icons</Link>, logos, and illustrations instantly.
        </p>
        {/* Breadcrumbs for better SEO and navigation */}
        <nav aria-label="Breadcrumb" className="flex justify-center mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><span className="font-medium">SVG AI Home</span></li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1 h-3 w-3"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <Link href="/ai-icon-generator" className="hover:text-[#FF7043] hover:underline">AI Icon Generator</Link>
            </li>
            <li className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-1 h-3 w-3"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <Link href="/blog" className="hover:text-[#FF7043] hover:underline">SVG Tutorials</Link>
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Main input area - 3/5 width on desktop */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="relative">
                <Textarea
                  id="prompt-input"
                  className="w-full rounded-lg border border-gray-300 bg-[#FEFEFE] shadow-md py-4 px-4 text-base md:text-lg text-[#4E342E] placeholder-gray-400 caret-[#FF7043] focus:border-[#FF7043] focus:ring-2 focus:ring-[#FFA726]/50 focus:outline-none resize-none min-h-[100px] transition-all"
                  placeholder="Describe the SVG you want to create"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  aria-label="Enter text prompt for SVG generation"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xs"
                    aria-label="Clear prompt"
                  >
                    Clear
                  </button>
                )}
              </div>
              {/* Sample prompts */}
              <SamplePrompts onSelectPrompt={handlePromptSelect} />
              {/* Advanced Settings Toggle Button */}
              <button 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="mt-4 flex items-center justify-center text-sm font-medium text-[#495057] hover:text-[#FF7043] transition-colors"
              >
                <Settings size={16} className="mr-2" />
                Advanced Settings
              </button>
              {/* Collapsible Advanced Options Section */}
              {showAdvancedOptions && (
                <AdvancedOptions
                  style={style}
                  size={size}
                  aspectRatio={aspectRatio}
                  onStyleChange={handleStyleChange}
                  onSizeChange={handleSizeChange}
                  onAspectRatioChange={handleAspectRatioChange}
                />
              )}
              {/* Credit cost indicator - only show for signed-in users */}
              {userId && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Sparkles className="w-4 h-4 mr-1.5 text-[#FF7043]" />
                    <span>2 credits required</span>
                  </div>
                  {userGenerations && (
                    <div className="text-right">
                      <span className="text-gray-500">
                        {Math.max(0, userGenerations.limit - userGenerations.used)} credits remaining
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* Generate button */}
              {userGenerations && (userGenerations.limit - userGenerations.used) < 2 && !isGenerating ? (
                <Link
                  href="/pricing"
                  className="w-full mt-5 inline-block text-center py-3.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] !text-white hover:!text-white font-medium text-base rounded-lg hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all [&>*]:!text-white"
                >
                  <span className="flex items-center justify-center !text-white">
                    <Sparkles className="mr-2 h-5 w-5 !text-white" />
                    <span className="!text-white">Get More Credits</span>
                  </span>
                </Link>
              ) : (
                <button
                  className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-medium text-base rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      Creating your SVG (10-15 seconds)...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate SVG
                    </span>
                  )}
                </button>
              )}
              {/* 15-second progress bar */}
              {isGenerating && (
                <div className="w-full h-1 bg-gray-200 rounded mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] progress-animation" />
                </div>
              )}
              {/* Local styles for progress animation */}
              {isGenerating && (
                <style>{`
                  @keyframes progressBarFill {
                    0% { width: 0%; }
                    100% { width: 100%; }
                  }
                  .progress-animation {
                    animation: progressBarFill 15s linear forwards;
                  }
                `}</style>
              )}
              {/* Error message */}
              {(error || limitReachedError) && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error || limitReachedError}
                </div>
              )}
            </div>
          </div>
          {/* Example showcase - 2/5 width on desktop */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-base font-medium text-gray-800 mb-4">Example SVGs</h2>
              {/* Main image showcase with cleaner controls */}
              <div className="relative aspect-square bg-[#FAFAFA] rounded-lg mb-4 flex items-center justify-center border border-gray-100">
                <Image
                  src={featuredExamples[activeSlide].src}
                  alt={featuredExamples[activeSlide].alt}
                  width={400}
                  height={400}
                  className="object-contain max-w-[85%] max-h-[85%]"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="sans-serif" font-size="14"%3ELoading example...%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Navigation buttons - more subtle */}
                <button
                  className="absolute left-2 z-10 bg-white/90 hover:bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm border border-gray-200 transition-colors"
                  onClick={handlePrevSlide}
                  aria-label="Previous example"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="absolute right-2 z-10 bg-white/90 hover:bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm border border-gray-200 transition-colors"
                  onClick={handleNextSlide}
                  aria-label="Next example"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {/* Indicator dots - minimal style */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {featuredExamples.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeSlide === idx 
                        ? 'bg-[#FF7043]' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              {/* Example info */}
              <div className="text-center">
                <span className="inline-block text-xs font-medium text-[#4E342E] bg-[#FFF8F1] border border-[#FF7043] px-2 py-0.5 rounded-full mb-2">
                  {featuredExamples[activeSlide].type}
                </span>
                <p className="text-sm text-gray-600 leading-snug">
                  {featuredExamples[activeSlide].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* SEO enhanced feature links */}
        <div className="max-w-4xl mx-auto mt-10 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium text-base mb-2">Create Vector Icons</h3>
              <p className="text-sm text-gray-600 mb-2">Generate beautiful SVG icons from text descriptions</p>
              <Link href="/ai-icon-generator" className="text-[#FF7043] hover:underline text-sm inline-flex items-center">
                Try AI Icon Generator
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium text-base mb-2">AI Logo Creation</h3>
              <p className="text-sm text-gray-600 mb-2">Design professional SVG logos with artificial intelligence</p>
              <span className="text-[#FF7043] hover:underline text-sm inline-flex items-center cursor-pointer" onClick={() => setPrompt("Minimal eco logo 'TerraBloom' with sprouting seedling icon, fresh green and charcoal text, clean lines.")}>
                Try Logo Generator
                <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <h3 className="font-medium text-base mb-2">SVG Tutorials</h3>
              <p className="text-sm text-gray-600 mb-2">Learn how to create and use SVG graphics effectively</p>
              <Link href="/blog" className="text-[#FF7043] hover:underline text-sm inline-flex items-center">
                Read SVG Guides
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Signup Modal */}
      <GenerationSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        generationsUsed={userId ? (userGenerations?.used || 0) : 1}
        isSoftPrompt={isSoftPrompt}
        onContinueAsGuest={undefined}
        isAuthenticated={!!userId}
        isSubscribed={isSubscribed}
        preservePrompt={true}
        source="homepage"
      />
      {/* Upgrade Modal for authenticated users who hit their limit */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerDelay={0}
        generationType="svg"
        isOutOfCredits={true}
      />
    </section>
  );
}