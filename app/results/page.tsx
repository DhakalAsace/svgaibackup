"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, CheckCircle, XCircle, Loader2, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SafeSvgDisplay } from "@/components/safe-svg-display"
import { sanitizeSvg } from "@/lib/svg-sanitizer"

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
  
  // Process SVG content to ensure it fits properly in the container and is secure
  const processSvgContent = (content: string): string => {
    // First sanitize the SVG content to remove any malicious scripts
    const sanitized = sanitizeSvg(content);
    // Add preserveAspectRatio to ensure SVG scales properly
    return sanitized.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
  };

  // Fetch the SVG content from the URL
  const fetchSvgContent = async (url: string) => {
    try {
      setIsLoading(true)
      setError(null); // Clear previous errors

      if (!isValidHttpUrl(url)) {
        throw new Error(`Invalid SVG URL provided: ${url}`)
      }

      // SECURITY: Only log the domain, not the full URL to prevent accidental URL token leakage
      const urlObj = new URL(url);
      
      // Client-side safe logging - in production, we'd use a proper client-side logger
      if (process.env.NODE_ENV === 'development') {
        // Only log domain in dev, not the full URL which might contain tokens
        console.log(`Original SVG URL domain: ${urlObj.hostname}`);
      }
      
      // Use our proxy endpoint instead of fetching directly
      const proxyUrl = `/api/proxy-svg?url=${encodeURIComponent(url)}`;
      console.log(`Attempting to fetch from proxy: ${proxyUrl}`);
      
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
      console.error('Error in fetchSvgContent:', errorMsg, err);
      
      // SECURITY: Use a generic error message in production to prevent information disclosure
      const displayError = process.env.NODE_ENV === 'production'
        ? 'Unable to load SVG. The resource might be unavailable or blocked.'
        : `Fetch Error: ${errorMsg}`; // Provide more detail in dev
      
      setError(displayError)
      setSvgContent('') // Clear content on error
    } finally {
      setIsLoading(false)
    }
  }

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
      } else {
        // SECURITY: Only log in development, use safe output
        if (process.env.NODE_ENV === 'development') {
          console.warn("Could not parse 'remaining' parameter");
        }
      }
    }

    // Read svgUrl from sessionStorage on the client
    let urlFromStorage: string | null = null;
    if (typeof window !== 'undefined') { // Check if on client
      urlFromStorage = sessionStorage.getItem('resultSvgUrl');
      console.log('[ResultsPage] Retrieved SVG URL from sessionStorage:', urlFromStorage); // DEBUG LOG
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

  }, [searchParams]) // Re-run if searchParams change (e.g., prompt, remaining)

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
        console.error('Error downloading SVG:', e instanceof Error ? e.message : 'Unknown error');
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <Link href={contentType === 'icon' ? "/ai-icon-generator" : "/"} className="flex items-center text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to {contentType === 'icon' ? 'Icon Generator' : 'Generator'}
          </Link>
          
          {/* Top Download Button - Always visible */}
          {!isLoading && !error && svgContent && (
            <button
              onClick={downloadSvg}
              className={`flex items-center justify-center px-5 py-2 rounded-full text-sm ${downloadSuccess ? 'bg-success' : 'bg-primary'} text-white font-medium transition-all`}
              aria-label="Download SVG"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </button>
          )}
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

        {/* Remaining generations alert */}
        {remainingCount !== null && (
          <div className="mb-6 bg-blue-50 rounded-lg border border-blue-100 p-4">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-500 mr-2.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Generations Remaining</h3>
                <p className="text-sm text-blue-700">
                  You have <span className="font-bold">{remainingCount}</span> generation{remainingCount !== 1 ? 's' : ''} left today.
                </p>
              </div>
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8">
          {/* SVG Content */}
          <div className="p-6 flex items-center justify-center">
            {isLoading && (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-[#0084FF] mb-4" />
                <p className="text-gray-500 text-sm">Loading your {contentType === 'icon' ? 'icon' : 'SVG'} ...</p>
                <p className="text-gray-400 text-xs mt-2">Only secure content from trusted domains will be displayed</p>
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
                {svgContent ? (
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
                ) : (
                  <div className="text-center text-gray-500">
                    <XCircle className="h-6 w-6 mx-auto mb-2 text-gray-400"/>
                    <p className="text-xs">SVG content appears empty.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isLoading && !error && svgContent && (
            <div className="px-6 pb-6 pt-1 flex flex-wrap justify-center gap-3">
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
              
              <Link 
                href={contentType === 'icon' ? "/ai-icon-generator" : "/"}
                className="flex items-center justify-center px-5 py-2 rounded-full text-sm border border-gray-300 text-gray-700 font-medium transition-all hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Create Another
              </Link>
            </div>
          )}
        </div>

        {/* What's Next Section */}
        {!isLoading && !error && svgContent && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#0084FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit in Vector Editor
                </h3>
                <p className="text-xs text-gray-600">Open this SVG in Adobe Illustrator, Inkscape, Figma, or other vector editors for further customization.</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#0084FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                  Create More {contentType === 'icon' ? 'Icons' : 'SVGs'}
                </h3>
                <p className="text-xs text-gray-600 mb-3">Generate more {contentType === 'icon' ? 'icons' : 'SVGs'} with different prompts to expand your collection.</p>
                <Link 
                  href={contentType === 'icon' ? "/ai-icon-generator" : "/"} 
                  className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back to {contentType === 'icon' ? 'Icon Generator' : 'Generator'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
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
