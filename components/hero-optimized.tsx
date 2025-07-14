"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader, Settings, ArrowRight, ChevronDown, ChevronUp, Sparkles, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { useSVGExamples } from "./svg-examples"
import Link from "next/link"
import dynamic from 'next/dynamic'
import { usePromptRestoration } from '@/hooks/use-prompt-restoration'
import { useCredits } from '@/contexts/CreditContext'

// Dynamically import modals to reduce initial bundle size
const GenerationSignupModal = dynamic(
  () => import('@/components/auth/generation-signup-modal').then(mod => ({ default: mod.GenerationSignupModal })),
  { ssr: false }
)

const UpgradeModal = dynamic(
  () => import('@/components/generation-upsells').then(mod => ({ default: mod.UpgradeModal })),
  { ssr: false }
)

function formatStyleLabel(style: string) {
  return style
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Memoized sample prompts component
const SamplePrompts = memo(({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) => {
  const samplePrompts = [
    {
      label: "Cute Red Panda",
      prompt: "Cute cartoon red panda mascot waving, flat design, vibrant orange and brown, friendly expression."
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
  const styleOptions = ["any", "engraving", "line_art", "line_circuit", "linocut"];
  
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
        <label htmlFor="style-select" className="block text-sm font-medium text-gray-700 mb-1">Style</label>
        <select
          id="style-select"
          className="w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 py-1.5"
          value={style}
          onChange={e => onStyleChange(e.target.value)}
        >
          {styleOptions.map((option) => (
            <option key={option} value={option}>
              {option === 'any' ? 'Any Style' : formatStyleLabel(option)}
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
        src: "/svg-examples/cute-red-panda-mascot.svg",
        alt: "Cute red panda mascot SVG generated by AI",
        type: "Brand Mascot",
        description: "Charming red panda mascot, perfect for playful branding or apps. Instantly created by AI from text."
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

    // Check if user is signed in BEFORE generating
    if (!userId) {
      sessionStorage.setItem('pendingPrompt', prompt);
      sessionStorage.setItem('pendingStyle', style);
      sessionStorage.setItem('pendingSize', size);
      sessionStorage.setItem('pendingAspectRatio', aspectRatio);
      
      setIsSoftPrompt(false);
      setShowSignupModal(true);
      return;
    }

    // For authenticated users, check credit balance
    if (userGenerations) {
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
      })

      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        try {
          const textResponse = await response.text();
          console.error("Non-JSON response received:", textResponse);
          throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
        } catch (textError) {
          console.error("Failed to get response as text:", textError);
          throw new Error(`Failed to parse server response (Status: ${response.status})`);
        }
      }
      
      if (response.status === 429) {
        const errorMessage = responseData.error || "";
        
        if (errorMessage.includes("Sign up to get")) {
          setIsSoftPrompt(false);
          setShowSignupModal(true);
        } else if (errorMessage.includes("no credits remaining") || errorMessage.includes("lifetime credits")) {
          setShowUpgradeModal(true);
        } else if (errorMessage.includes("monthly credits")) {
          setError("You've used all your monthly credits. They'll refresh at the start of your next billing period.");
        }
        
        setIsGenerating(false)
        return
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to generate SVG (Status: ${response.status})`)
      }
      
      if (responseData.success) {
        console.log("API response:", responseData);
        
        const data = responseData.data || {};
        
        if (data.svgUrl) {
          const { svgUrl, remainingGenerations } = data;
          
          console.log('[Hero] Storing SVG URL in sessionStorage:', svgUrl);
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
            
            if (totalGenerations === 0) {
              setIsSoftPrompt(true);
              setShowSignupModal(true);
              sessionStorage.setItem('showSignupModal', 'true');
            }
          } else if (userGenerations) {
            setUserGenerations(prev => prev ? {...prev, used: prev.used + 2} : null)
            
            window.dispatchEvent(new Event('creditUsed'))
            refreshCredits()
          }
          
          const pushPath = `/results?${queryParams.toString()}`;
          console.log('[Hero] Pushing path:', pushPath);
          router.push(pushPath);
        } else {
          console.error("API response indicates success but SVG URL is missing:", responseData);
          setError("The SVG was generated but the URL was not returned correctly. Please try again.");
          setIsGenerating(false);
        }
      } else {
        console.error("API response indicates failure:", responseData);
        throw new Error(responseData.error || "Failed to generate SVG")
      }
    } catch (err) {
      console.error("Error in generation process:", err)
      if (!limitReachedError) {
        const errMsg = err instanceof Error ? err.message : "Failed to generate SVG";
        
        if (errMsg.includes("SVG URL")) {
          setError("The SVG was generated but couldn't be retrieved. Please try again.");
        } else if (errMsg.includes("fetch")) {
          setError("Network error while communicating with the server. Please check your connection and try again.");
        } else {
          setError(errMsg);
        }
        
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight">
          <span className="text-black">AI </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7043] to-[#FFA726]">SVG Generator:</span>
          <br />
          <span className="text-black">Effortless Text to SVG Conversion</span>
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
                  placeholder="Try: a futuristic cityscape, a minimal logo, an abstract wave pattern..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  aria-label="Enter text prompt for SVG generation"
                  autoFocus
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
              
              {/* Credit cost indicator */}
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
              
              {/* Generate button */}
              {userGenerations && (userGenerations.limit - userGenerations.used) < 2 ? (
                <div className="mt-5 space-y-3">
                  <button
                    className="w-full py-3.5 bg-gray-100 text-gray-400 font-medium text-base rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Insufficient Credits
                  </button>
                  <Link
                    href="/pricing"
                    className="w-full inline-block text-center py-3.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-medium text-base rounded-lg hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 transition-all"
                  >
                    <span className="flex items-center justify-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get More Credits
                    </span>
                  </Link>
                </div>
              ) : (
                <button
                  className="w-full mt-5 py-3.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-medium text-base rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF7043]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      Creating your SVG (usually 15-30 seconds)...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate My SVG Now
                    </span>
                  )}
                </button>
              )}
              
              {/* 20-second progress bar */}
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
                    animation: progressBarFill 20s linear forwards;
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
                  loading="eager"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
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
              
              {/* Indicator dots - minimal */}
              <div className="flex justify-center gap-1.5 mb-3">
                {featuredExamples.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSlideChange(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeSlide === idx ? 'bg-[#FF7043]' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-label={`View example ${idx + 1}`}
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