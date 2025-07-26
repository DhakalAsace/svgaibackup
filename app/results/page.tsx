"use client"

import { useEffect, useState, Suspense, useRef, useCallback } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, CheckCircle, XCircle, Loader2, Info, AlertTriangle, Sparkles, Shield, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SafeSvgDisplay } from "@/components/safe-svg-display"
import { sanitizeSvg } from "@/lib/svg-sanitizer"
import { UpgradeModal } from "@/components/generation-upsells"
import { GenerationSignupModal } from "@/components/auth/generation-signup-modal"
import { CreditsUpsellModal } from "@/components/dashboard/credits-upsell-modal"
import { createClientComponentClient } from '@/lib/supabase'
import { createLogger } from '@/lib/logger'

const logger = createLogger('results-page')

// SECURITY: Only allow SVGs from trusted domains
const ALLOWED_DOMAINS = [
  'replicate.delivery',
  'replicate.com',
  'replicate-api-prod-models.s3.amazonaws.com',
  'storage.googleapis.com',
];

// Helper to check if a string looks like a valid URL and comes from an allowed domain
const isValidHttpUrl = (string: string | undefined | null): boolean => {
  if (!string) return false
  try {
    const url = new URL(string)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    
    // SECURITY: Check if the domain is in our allowed list
    return ALLOWED_DOMAINS.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch (_) {
    return false
  }
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [svgUrl, setSvgUrl] = useState<string | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [remainingCount, setRemainingCount] = useState<number | null>(null)
  const [contentType, setContentType] = useState<string>("svg")
  const svgContainerRef = useRef<HTMLDivElement>(null)

  const [isClient, setIsClient] = useState(false)
  const [svgContent, setSvgContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // User subscription state
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClientComponentClient()
  
  // Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showTimedUpgradeModal, setShowTimedUpgradeModal] = useState(false)
  const [showCreditsUpsellModal, setShowCreditsUpsellModal] = useState(false)
  const [userCreditsInfo, setUserCreditsInfo] = useState<{total: number, used: number, remaining: number} | null>(null)
  const [isSoftPrompt, setIsSoftPrompt] = useState(false)
  const [isOutOfCredits, setIsOutOfCredits] = useState(false)
  const [isAnnual, setIsAnnual] = useState(true) // Default to annual for better value
  const [showCreditTooltip, setShowCreditTooltip] = useState<string | null>(null)
  
  // Handle click outside to close tooltips
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-tooltip-trigger]') && !target.closest('[data-tooltip-content]')) {
        setShowCreditTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Process SVG content to ensure it fits properly in the container and is secure
  const processSvgContent = (content: string): string => {
    // First sanitize the SVG content to remove any malicious scripts
    const sanitized = sanitizeSvg(content);
    // Add preserveAspectRatio to ensure SVG scales properly
    return sanitized.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
  };

  // Fetch the SVG content from the URL
  const fetchSvgContent = useCallback(async (url: string) => {
    try {
      setIsLoading(true)
      setError(null); // Clear previous errors

      if (!isValidHttpUrl(url)) {
        throw new Error(`Invalid SVG URL provided: ${url}`)
      }

      // SECURITY: Only log the domain, not the full URL to prevent accidental URL token leakage
      const urlObj = new URL(url);
      
      // Domain validation only, no logging in production
      
      // Use our proxy endpoint instead of fetching directly
      const proxyUrl = `/api/proxy-svg?url=${encodeURIComponent(url)}`;
      
      // SECURITY: Add additional headers to prevent credential exposure
      const response = await fetch(proxyUrl, {
        credentials: 'same-origin', // Only send credentials if same origin
        cache: 'no-store', // Prevent caching sensitive SVG content
      })

      if (!response.ok) {
        // Try to get error text from response body if available
        let errorText = `Failed to fetch SVG via proxy (Status: ${response.status})`;
        try {
          const bodyText = await response.text();
          errorText = `Failed to fetch SVG via proxy (Status: ${response.status}): ${bodyText}`;
        } catch (e) { /* Ignore error reading body */ }
        // SECURITY: Don't expose raw error response content to the client in prod
        throw new Error(process.env.NODE_ENV === 'production' ? `Failed to load SVG (Status: ${response.status})` : errorText);
      }

      const text = await response.text()
      
      // SECURITY: Don't log SVG content or preview which might contain embedded secrets
      // Verify SVG content with basic check but don't log it

      // Basic check for SVG content
      if (text.includes('<svg')) {
        setSvgContent(processSvgContent(text))
      } else {
        throw new Error('Proxy response did not contain recognizable SVG content.')
      }
    } catch (err) {
      // SECURITY: Log generic error message, not the full error which might contain sensitive info
      const errorMsg = err instanceof Error ? err.message : 'Unknown error during fetch';
      // Error handling without logging sensitive details
      
      // SECURITY: Use a generic error message in production to prevent information disclosure
      const displayError = process.env.NODE_ENV === 'production'
        ? 'Unable to load SVG. The resource might be unavailable or blocked.'
        : `Fetch Error: ${errorMsg}`; // Provide more detail in dev
      
      setError(displayError)
      setSvgContent('') // Clear content on error
    } finally {
      setIsLoading(false)
    }
  }, []);

  useEffect(() => {
    setIsClient(true)
    // Read other params from URL search params
    const remainingStr = searchParams.get('remaining')
    const promptStr = searchParams.get('prompt')
    const typeStr = searchParams.get('type')
    setContentType(typeStr || 'svg')
    setPrompt(promptStr);

    if (remainingStr !== null) {
      const count = parseInt(remainingStr, 10);
      if (!isNaN(count)) {
        setRemainingCount(count);
        // Don't show any modals for anonymous users - peaceful experience
      } else {
        // SECURITY: Only log in development, use safe output
        if (process.env.NODE_ENV === 'development') {
          logger.warn("Could not parse 'remaining' parameter");
        }
      }
    }

    // Read svgUrl from sessionStorage on the client
    let urlFromStorage: string | null = null;
    if (typeof window !== 'undefined') { // Check if on client
      urlFromStorage = sessionStorage.getItem('resultSvgUrl');
      // Retrieved SVG URL from sessionStorage
      
      // Remove automatic signup modal for anonymous users
    }
    setSvgUrl(urlFromStorage); // Set state regardless for potential display

    if (urlFromStorage && isValidHttpUrl(urlFromStorage)) {
       fetchSvgContent(urlFromStorage)
    } else if (urlFromStorage) { // URL exists but is invalid
        setError(`Invalid or disallowed SVG URL found: ${urlFromStorage.substring(0, 100)}...`);
        setIsLoading(false);
    } else { // No URL found in storage
        setError("No SVG URL found. Please try generating again.");
        setIsLoading(false);
    }

  }, [searchParams, fetchSvgContent]) // Re-run if searchParams change (e.g., prompt, remaining)
  
  // Fetch user profile for subscription status
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status, lifetime_credits_granted, lifetime_credits_used, monthly_credits, monthly_credits_used')
          .eq('id', user.id)
          .single();
        
        // Debug logging
        if (profile) {
          console.info('User profile data:', {
            subscription_status: profile.subscription_status,
            subscription_tier: profile.subscription_tier,
            monthly_credits: profile.monthly_credits,
            monthly_credits_used: profile.monthly_credits_used,
            lifetime_credits_granted: profile.lifetime_credits_granted,
            lifetime_credits_used: profile.lifetime_credits_used
          });
        }
        
        // Fix inconsistent data: Starter plan should have 100 monthly credits
        if (profile && profile.subscription_status === 'active' && profile.subscription_tier === 'starter' && profile.monthly_credits !== 100) {
          console.warn('Fixing inconsistent Starter plan credits:', profile.monthly_credits, '-> 100');
          profile.monthly_credits = 100;
        }
        // Fix inconsistent data: Pro plan should have 350 monthly credits  
        if (profile && profile.subscription_status === 'active' && profile.subscription_tier === 'pro' && profile.monthly_credits !== 350) {
          console.warn('Fixing inconsistent Pro plan credits:', profile.monthly_credits, '-> 350');
          profile.monthly_credits = 350;
        }
        
        setUserProfile(profile);
        
        // Calculate remaining credits for the user
        let userRemainingCredits = 0;
        let totalCredits = 0;
        let usedCredits = 0;
        
        if (profile) {
          if (profile.subscription_status === 'active') {
            // Subscribed users: monthly credits
            totalCredits = profile.monthly_credits || 0;
            usedCredits = profile.monthly_credits_used || 0;
            userRemainingCredits = totalCredits - usedCredits;
          } else {
            // Free users: lifetime credits
            totalCredits = profile.lifetime_credits_granted || 0;
            usedCredits = profile.lifetime_credits_used || 0;
            userRemainingCredits = totalCredits - usedCredits;
          }
          
          setUserCreditsInfo({
            total: totalCredits,
            used: usedCredits,
            remaining: userRemainingCredits
          });
        }
        
        // Determine if the free user is out of credits
        const userIsOutOfCredits =
          profile &&
          profile.subscription_status !== "active" &&
          profile.lifetime_credits_used !== null &&
          profile.lifetime_credits_granted !== null &&
          profile.lifetime_credits_used >= profile.lifetime_credits_granted;
        
        setIsOutOfCredits(userIsOutOfCredits || false);

        // Only show modals for logged-in users who haven't subscribed yet
        if (profile && profile.subscription_status !== "active") {
          // Show upgrade modal after 3 seconds for users with exactly 0 credits
          // Shows on BOTH mobile and desktop
          if (userRemainingCredits === 0) {
            // Showing upgrade modal - user has 0 credits
            setTimeout(() => {
              setShowUpgradeModal(true);
            }, 3000); // 3 seconds delay - gives them time to see the inline options first
          }
        }
        // For subscribed users or anonymous users - don't show any upgrade modals
      }
    };
    
    fetchUserProfile();
  }, [supabase, showSignupModal]);

  // SECURITY: Ensure SVG is sanitized before download
  const downloadSvg = () => {
    if (!svgContent || !prompt) return

    try {
      // SECURITY: Sanitize SVG content again before download to ensure it's safe
      const sanitizedContent = sanitizeSvg(svgContent);
      
      const blob = new Blob([sanitizedContent], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      
      // SECURITY: Sanitize filename to prevent directory traversal or malicious filenames
      // Create a filename from the prompt
      const safePrompt = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50) || 'generated';
      const filename = `${safePrompt}.svg`;
      
      link.href = url
      link.download = filename
      
      // SECURITY: Use safer download method
      link.rel = 'noopener noreferrer'; // Prevent potential opener attacks
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // SECURITY: Always clean up object URLs to prevent memory leaks
      URL.revokeObjectURL(url)
      
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (e) {
      // SECURITY: Use generic error message and only log in development
      if (process.env.NODE_ENV === 'development') {
        // Error downloading SVG
      }
      setError('Unable to download SVG. Please try again.');
    }  
  }

  if (!isClient) {
    return (
       <div className="flex justify-center items-center min-h-[300px]">
         <Loader2 className="h-6 w-6 animate-spin text-[#0084FF]" />
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto md:max-w-7xl md:grid md:grid-cols-[1fr,380px] md:gap-8 lg:gap-12">
        {/* Main content column */}
        <div>
          {/* Header with back button */}
          <div className="mb-6">
          <Link href={contentType === 'icon' ? "/ai-icon-generator?preservePrompt=true" : "/?preservePrompt=true"} className="inline-flex items-center text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to {contentType === 'icon' ? 'Icon Generator' : 'Generator'}
          </Link>
        </div>

        {/* Main page header */}
        <div className="mb-5">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-1.5">
            Your Generated {contentType === 'icon' ? 'Icon' : 'SVG'}
          </h1>
          {prompt && (
            <p className="text-sm text-gray-600">
              Result for prompt: <span className="font-medium italic">"{prompt}"</span>
            </p>
          )}
        </div>

        {/* Credit Usage Info - Only for logged-in unsubscribed users */}
        {userCreditsInfo && userProfile && userProfile.subscription_status !== 'active' && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                This {contentType} cost <span className="font-medium text-gray-900">{contentType === 'icon' ? '1' : '2'} credit{contentType === 'svg' ? 's' : ''}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-semibold text-gray-900">
                {userCreditsInfo.remaining === 0 
                  ? "You're out of credits!" 
                  : userCreditsInfo.remaining <= 3
                  ? `Only ${userCreditsInfo.remaining} credits left`
                  : `${userCreditsInfo.remaining} credits remaining`}
              </span>
              <Link 
                href="/pricing" 
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white text-sm font-medium rounded-full hover:from-[#FF5722] hover:to-[#FF9716] transition-all transform hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {contentType === 'icon' ? 'Get More Icon Credits' : 'Get More SVG Credits'}
              </Link>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] transition-all duration-500"
                style={{ width: `${(userCreditsInfo.remaining / userCreditsInfo.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Credit Usage Info - For subscribed users */}
        {userCreditsInfo && userProfile && userProfile.subscription_status === 'active' && (
          <div className="mb-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-gray-600">
                This {contentType} cost <span className="font-medium text-gray-900">{contentType === 'icon' ? '1' : '2'} credit{contentType === 'svg' ? 's' : ''}</span>
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium text-gray-900">
                {userCreditsInfo.remaining} of {userCreditsInfo.total} monthly credits remaining
              </span>
              <span className="text-sm text-slate-700 font-medium">
                {userProfile.subscription_tier === 'pro' ? 'Pro Plan' : 'Starter Plan'}
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-slate-600 transition-all duration-500"
                style={{ width: `${(userCreditsInfo.remaining / userCreditsInfo.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0 text-red-500" />
              <span>
                {error}
                {!isValidHttpUrl(svgUrl || '') && svgUrl && (
                  <span className="block mt-1 text-xs text-red-500">
                    For security reasons, we only load content from verified domains.
                  </span>
                )}
              </span>
            </p>
          </div>
        )}

        {/* SVG Preview Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
          {/* SVG Content */}
          <div className="p-6 flex items-center justify-center">
            {isLoading && (
              <div className="flex justify-center items-center border border-gray-100 rounded-md bg-gray-50 p-4" style={{ 
                width: '100%', 
                maxWidth: contentType === 'icon' ? '250px' : '350px',
                height: contentType === 'icon' ? '250px' : '350px',
                margin: '0 auto'
              }}>
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
                  <p className="text-gray-500 text-sm">Loading your {contentType === 'icon' ? 'icon' : 'SVG'}...</p>
                </div>
              </div>
            )} 
            {error ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <XCircle className="h-10 w-10 text-red-500 mb-3" />
                <p className="text-sm font-medium text-gray-800 mb-1.5">Error Loading SVG</p>
                <p className="text-xs text-gray-600 text-center max-w-md">{error}</p>
              </div>
            ) : (
              <div 
                ref={svgContainerRef}
                className="flex justify-center items-center border border-gray-100 rounded-md bg-gray-50 p-4"
                style={{ 
                  width: '100%', 
                  maxWidth: contentType === 'icon' ? '250px' : '350px',
                  height: contentType === 'icon' ? '250px' : '350px',
                  margin: '0 auto'
                }}
              >
                {svgContent && (
                  <div 
                    className="svg-container"
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <SafeSvgDisplay 
                      svgContent={svgContent}
                      className="max-w-full max-h-full"
                      alt={prompt || "Generated SVG"}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Action Buttons - show right after preview */}
          {!isLoading && !error && svgContent && (
            <div className="md:hidden px-6 pb-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={downloadSvg}
                  className={`flex items-center justify-center px-5 py-2.5 rounded-full text-sm ${downloadSuccess ? 'bg-success' : 'bg-primary'} text-white font-medium transition-all w-full`}
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1.5" />
                      Download SVG
                    </>
                  )}
                </button>
                
                {userProfile && userProfile.subscription_status !== 'active' && (
                  <Link 
                    href="/pricing"
                    className="flex items-center justify-center px-5 py-2.5 rounded-full text-sm bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-medium transition-all hover:shadow-md w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    {contentType === 'icon' ? 'Get More Icon Credits' : 'Get More SVG Credits'}
                  </Link>
                )}
                
                <Link 
                  href={contentType === 'icon' ? "/ai-icon-generator?preservePrompt=true" : "/?preservePrompt=true"}
                  className="flex items-center justify-center px-5 py-2 rounded-full text-sm text-gray-600 font-medium transition-all hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Create Another
                </Link>
              </div>
            </div>
          )}


          {/* Desktop Action Buttons - hidden on mobile */}
          {!isLoading && !error && svgContent && (
            <div className="hidden md:block px-6 pb-6 pt-1">
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <button
                  onClick={downloadSvg}
                  className={`flex items-center justify-center px-5 py-2 rounded-full text-sm ${downloadSuccess ? 'bg-success' : 'bg-primary'} text-white font-medium transition-all`}
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1.5" />
                      Download SVG
                    </>
                  )}
                </button>
                
                {userProfile && userProfile.subscription_status !== 'active' && (
                  <Link 
                    href="/pricing"
                    className="flex items-center justify-center px-5 py-2 rounded-full text-sm bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white font-medium transition-all hover:shadow-md"
                  >
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    {contentType === 'icon' ? 'Get More Icon Credits' : 'Get More SVG Credits'}
                  </Link>
                )}
              </div>
              
              <div className="flex justify-center">
                <Link 
                  href={contentType === 'icon' ? "/ai-icon-generator?preservePrompt=true" : "/?preservePrompt=true"}
                  className="flex items-center justify-center px-5 py-2 rounded-full text-sm text-gray-600 font-medium transition-all hover:text-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Create Another
                </Link>
              </div>
            </div>
          )}
        </div>
        </div>
        
        {/* Desktop Sidebar - Shows pricing for all non-subscribed users */}
        {userProfile && userProfile.subscription_status !== 'active' && (
          <div className="hidden md:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Brand header */}
                <div className="bg-gradient-to-r from-[#FF7043] to-[#FFA726] p-4 text-white text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Get More Credits</h3>
                  </div>
                  {(userCreditsInfo && userCreditsInfo.remaining <= 3) && (
                    <p className="text-sm text-white/90">
                      {userCreditsInfo.remaining === 0 
                        ? "You're out of credits" 
                        : `Only ${userCreditsInfo.remaining} ${userCreditsInfo.remaining === 1 ? 'credit' : 'credits'} remaining`}
                    </p>
                  )}
                </div>

                <div className="p-4">
                  {/* Billing toggle */}
                  <div className="flex justify-center mb-3">
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                      <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                          !isAnnual 
                            ? 'bg-[#FF7043] text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                          isAnnual 
                            ? 'bg-[#FF7043] text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Annual
                        <span className={`text-xs ${isAnnual ? 'text-white/90' : 'text-green-600'}`}>Save 3 months</span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing cards - stacked vertically in sidebar */}
                  <div className="space-y-3">
                    {/* Starter Plan */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3.5 hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Starter</h4>
                        {isAnnual && (
                          <span className="text-xs font-medium text-gray-500">$168/year</span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-gray-900">{isAnnual ? '$13.99' : '$19'}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      
                      <ul className="space-y-1.5 mb-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <div className="relative flex-1">
                            <button
                              onClick={() => setShowCreditTooltip(showCreditTooltip === 'starter' ? null : 'starter')}
                              className="flex items-center gap-1 hover:text-gray-700 transition-colors text-left"
                              data-tooltip-trigger
                            >
                              <span className="text-sm text-gray-700">100 credits/month</span>
                              <Info className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            {showCreditTooltip === 'starter' && (
                              <div 
                                className="absolute top-full left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-1 z-10"
                                data-tooltip-content
                              >
                                <p className="text-xs text-gray-600">
                                  100 credits allows you to create 50 SVGs or 100 <Link href="/ai-icon-generator" className="underline text-green-600" target="_blank" rel="noopener noreferrer">icons</Link> per month. Credits reset monthly.
                                </p>
                              </div>
                            )}
                          </div>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">7-day generation history</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Email support</span>
                        </li>
                      </ul>
                      
                      <Button 
                        onClick={async () => {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) {
                            router.push('/login?returnUrl=/pricing');
                            return;
                          }
                          try {
                            const response = await fetch('/api/create-checkout-session', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ tier: 'starter', interval: isAnnual ? 'annual' : 'monthly' }),
                            });
                            const { url } = await response.json();
                            window.location.href = url;
                          } catch (error) {
                            router.push('/pricing');
                          }
                        }}
                        className="w-full bg-white hover:bg-gray-50 border-gray-300"
                        variant="outline"
                      >
                        Choose Starter
                      </Button>
                    </div>
                  
                    {/* Pro Plan */}
                    <div className="relative bg-gradient-to-br from-[#FFF8F6] via-white to-[#FFF3E0] rounded-lg border-2 border-[#FF7043] p-3.5 shadow-md hover:shadow-lg transition-shadow">
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF7043] to-[#FFA726] text-white px-3 py-1">
                        MOST POPULAR
                      </Badge>
                      <div className="flex items-center justify-between mb-2 mt-1">
                        <h4 className="font-semibold text-gray-900">Pro</h4>
                        {isAnnual && (
                          <span className="text-xs font-medium text-gray-500">$360/year</span>
                        )}
                      </div>
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-gray-900">{isAnnual ? '$29.99' : '$39'}</span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      
                      <ul className="space-y-1.5 mb-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <div className="relative flex-1">
                            <button
                              onClick={() => setShowCreditTooltip(showCreditTooltip === 'pro' ? null : 'pro')}
                              className="flex items-center gap-1 hover:text-gray-700 transition-colors text-left"
                              data-tooltip-trigger
                            >
                              <span className="text-sm text-gray-700 font-medium">350 credits/month</span>
                              <Info className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            {showCreditTooltip === 'pro' && (
                              <div 
                                className="absolute top-full left-0 mt-1 w-64 p-3 bg-white rounded-lg shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-1 z-10"
                                data-tooltip-content
                              >
                                <p className="text-xs text-gray-600">
                                  350 credits allows you to create 175 SVGs or 350 <Link href="/ai-icon-generator" className="underline text-green-600" target="_blank" rel="noopener noreferrer">icons</Link> per month. Credits reset monthly.
                                </p>
                              </div>
                            )}
                          </div>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">30-day generation history</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">Priority support</span>
                        </li>
                      </ul>
                      
                      <Button 
                        onClick={async () => {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) {
                            router.push('/login?returnUrl=/pricing');
                            return;
                          }
                          try {
                            const response = await fetch('/api/create-checkout-session', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ tier: 'pro', interval: isAnnual ? 'annual' : 'monthly' }),
                            });
                            const { url } = await response.json();
                            window.location.href = url;
                          } catch (error) {
                            router.push('/pricing');
                          }
                        }}
                        className="w-full bg-gradient-to-r from-[#FF7043] to-[#FFA726] hover:from-[#FF5722] hover:to-[#FF9800] text-white shadow-sm hover:shadow-md transition-all"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get Pro Now
                      </Button>
                    </div>
                  </div>


                  {/* Trust indicators */}
                  <div className="flex items-center justify-center gap-4 mt-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs">Secure</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-xs">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Info className="h-3.5 w-3.5" />
                      <span className="text-xs">Cancel Anytime</span>
                    </div>
                  </div>

                  {/* Compact FAQs */}
                  <div className="mt-3">
                    <details className="group">
                      <summary className="cursor-pointer font-medium text-gray-700 hover:text-green-600 flex items-center justify-between text-sm">
                        <span>Common Questions</span>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">How do credits work?</p>
                          <p className="text-xs text-gray-600">Icons cost 1 credit, SVGs cost 2 credits. Credits reset monthly on your billing date.</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Can I cancel anytime?</p>
                          <p className="text-xs text-gray-600">Yes! Cancel future billing anytime and keep your credits until the end of your billing period.</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">What payment methods?</p>
                          <p className="text-xs text-gray-600">We accept all major credit cards through Stripe's secure payment system.</p>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section - Only for non-subscribed users */}
      {userProfile && userProfile.subscription_status !== 'active' && (
        <div className="mt-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {/* Most Important FAQs First */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">How much does SVG AI cost?</h3>
              <p className="text-gray-600">SVG AI offers transparent pricing with a free forever plan (6 credits), Starter plan at $13.99/month billed annually (3 months FREE) or $19/month (100 credits), and Pro plan at $29.99/month billed annually (3 months FREE) or $39/month (350 credits).</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">What's the difference between Starter and Pro pricing?</h3>
              <p className="text-gray-600">Starter ($13.99/month annually or $19/month) includes 100 credits and 7-day history. Pro ($29.99/month annually or $39/month) includes 350 credits, 30-day history, and priority support. Both include all 11 icon styles and 5 SVG styles.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">What does "Save 3 months" mean on annual plans?</h3>
              <p className="text-gray-600">Annual plans give you 12 months of service for less than the price of 10 months. Starter Annual costs $168/year instead of $228 (saving $60). Pro Annual costs $360/year instead of $468 (saving $108). You save the equivalent of 3 months of payments!</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">How do credits work?</h3>
              <p className="text-gray-600">Icons cost 1 credit each, while SVGs cost 2 credits. Your credits reset monthly on your billing date. Free users get 6 one-time credits (enough for 3 SVGs or 6 icons).</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes! You can cancel your plan at any time with no cancellation fees. Cancellation takes effect at the end of your current billing period. You'll retain access until then.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">Do unused AI generation credits roll over?</h3>
              <p className="text-gray-600">No, unused credits don't roll over to the next month. Your credit limit resets at the start of each billing cycle to ensure fair usage.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. No PayPal currently.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-2">Is SVG AI pricing worth it compared to competitors?</h3>
              <p className="text-gray-600">SVG AI offers the best value with transparent pricing, no hidden fees, 11 icon styles, 5 SVG styles, and both monthly/annual options. Most competitors charge more for fewer features.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerDelay={0} // No additional delay, we handle it above
        generationType={contentType as 'svg' | 'icon'}
        isOutOfCredits={isOutOfCredits}
      />
      
      <GenerationSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        generationsUsed={1}
        isSoftPrompt={isSoftPrompt}
        isAuthenticated={!!userProfile}
        isSubscribed={userProfile?.subscription_status === 'active'}
        preservePrompt={true}
        source="results"
      />
      
      <UpgradeModal
        isOpen={showTimedUpgradeModal}
        onClose={() => setShowTimedUpgradeModal(false)}
        triggerDelay={0} // No delay, show immediately when state is set
        generationType={contentType as 'svg' | 'icon'}
        isOutOfCredits={false}
      />
      
      {/* Credits Upsell Modal - Disabled, using visual credit bar instead */}
      {/* <CreditsUpsellModal
        isOpen={showCreditsUpsellModal}
        onClose={() => setShowCreditsUpsellModal(false)}
        remainingCredits={(() => {
          // Only for logged-in users
          if (!userProfile) return 0;
          if (userProfile.subscription_status === 'active') {
            return userProfile.monthly_credits - userProfile.monthly_credits_used;
          }
          return userProfile.lifetime_credits_granted - userProfile.lifetime_credits_used;
        })()}
      /> */}
    </div>
  );
}

// Wrap the component in Suspense for useSearchParams
export default function ResultsPage() {
  return (
    <>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-[#0084FF]" /></div>}>
        <ResultsContent />
      </Suspense>
      <style>{`
        .svg-container svg {
          max-width: 100%;
          max-height: 100%;
          width: auto !important;
          height: auto !important;
        }
      `}</style>
    </>
  );
}
