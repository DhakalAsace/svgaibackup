import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Providers } from "./providers-minimal"
import Footer from "@/components/footer"
import { NavbarWrapper } from '@/components/client-wrappers';

// Removed monitoring imports to improve performance

// Import CSS files
import './globals.css'
import '../styles/color-fixes.css'

// Initialize Montserrat font with performance optimizations
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'optional', // Use optional to eliminate font loading as render-blocking
  preload: false, // Don't preload to reduce initial load
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
})

// Define base URL for metadata
const siteUrl = process.env.SITE_URL || 'https://svgai.org';

export const metadata: Metadata = {
  // Base URL for resolving relative URLs in metadata
  metadataBase: new URL(siteUrl),
  
  // Title structure with template
  title: {
    template: '%s | SVG AI',
    default: 'SVG AI - Text to SVG Generator',
  },
  
  // Core metadata
  description: 'Transform your ideas into stunning SVG graphics with our AI-powered generator. Create logos, icons, and illustrations from simple text descriptions.',
  generator: 'SVG AI',
  applicationName: 'SVG AI',
  referrer: 'origin-when-cross-origin',
  keywords: ['svg generator', 'ai svg', 'text to svg', 'vector graphics', 'ai tools'],
  authors: [{ name: 'SVG AI Team' }],
  
  // Icons configuration
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [
      { url: '/favicon.svg' },
    ],
  },
  
  // Default OpenGraph properties
  openGraph: {
    type: 'website',
    siteName: 'SVG AI',
    locale: 'en_US',
    url: siteUrl,
  },
  
  // Default Twitter card properties
  twitter: {
    card: 'summary_large_image',
    site: '@svgai',
  },
  
  // Default robot directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        {/* Viewport meta tag for mobile responsiveness - CRITICAL FOR SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preconnect to font origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Inline critical CSS for zero render-blocking */}
        <style dangerouslySetInnerHTML={{ __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          :root { 
            --font-montserrat: Montserrat, system-ui, -apple-system, sans-serif;
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          html { font-family: var(--font-montserrat); }
          body { background: #fff; color: #111827; line-height: 1.5; }
          .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
          .text-center { text-align: center; }
          .font-bold { font-weight: 700; }
          /* Prevent FOUC - Use 0.01 to avoid Lighthouse NO_LCP bug */
          .opacity-0 { opacity: 0.01; }
          .opacity-100 { opacity: 1; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .bg-white { background: white; }
          /* Critical styles for hero section */
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .text-5xl { font-size: 3rem; line-height: 1; }
          .text-6xl { font-size: 3.75rem; line-height: 1; }
          .text-black { color: #000; }
          .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
          .from-\[\#FF7043\] { --tw-gradient-from: #FF7043; }
          .to-\[\#FFA726\] { --tw-gradient-to: #FFA726; }
          .text-transparent { color: transparent; }
          .bg-clip-text { -webkit-background-clip: text; background-clip: text; }
          .rounded-lg { border-radius: 0.5rem; }
          .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
          .border { border-width: 1px; }
          .border-gray-100 { border-color: #f3f4f6; }
          /* Ensure hero section is immediately visible */
          section { opacity: 1 !important; animation: none !important; }
          .rounded-lg { border-radius: 0.5rem; }
          .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
          .border { border: 1px solid #e5e7eb; }
          .border-gray-100 { border-color: #f3f4f6; }
          .text-gray-900 { color: #111827; }
          .text-gray-600 { color: #4b5563; }
          .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .min-h-screen { min-height: 100vh; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .flex-1 { flex: 1 1 0%; }
          @media (min-width: 768px) {
            .md\\:text-5xl { font-size: 3rem; line-height: 1; }
            .md\\:py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
          }
        ` }} />
        
        {/* Preconnect to external domains with priority */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Fonts are loaded through Next.js font optimization */}
        
        <link rel="preconnect" href="https://svgai.supabase.co" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        
        {/* Removed image preloads to reduce initial load */}

        {/* Font loading moved to metadata */}
        
        {/* Using Next.js metadata API for icons, but adding explicit link tags for maximum compatibility */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        
        {/* Modern favicon support */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph site_name for branding */}
        <meta property="og:site_name" content="SVG AI" />
        
        {/* Core Web Vitals optimization - disable FCP blocking content */}
        <meta name="theme-color" content="#FFFFFF" />
        
        {/* Removed prefetch to reduce initial requests */}
        
        
        {/* Next.js handles critical CSS and JS loading automatically */}
        
        {/* Removed structured data to improve initial load */}
      </head>
      <body className={`font-sans overflow-x-hidden`} suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavbarWrapper />
            <main className="flex-1 bg-background">
              {children}
            </main>
            <Footer />
          </div>
          {/* Removed monitoring components to improve performance */}
        </Providers>
      </body>
    </html>
  )
}
