import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers"
import Footer from "@/components/footer"
import { NavbarWrapper } from '@/components/client-wrappers';
import { WebVitalsReporter } from '@/components/web-vitals-reporter';
import { ServiceWorkerProvider } from '@/components/service-worker-provider';
import { ErrorInterceptor } from '@/components/error-interceptor';

// Initialize Montserrat font
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
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
        
        {/* Critical CSS inline for faster FCP */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical CSS for above-the-fold content */
          *, ::before, ::after { box-sizing: border-box; border-width: 0; }
          html { line-height: 1.5; -webkit-text-size-adjust: 100%; font-family: var(--font-montserrat), ui-sans-serif, system-ui; visibility: visible; }
          body { margin: 0; line-height: inherit; font-family: inherit; background-color: rgba(14, 116, 144, 0.3); }
          .container { width: 100%; margin-right: auto; margin-left: auto; padding-right: 1rem; padding-left: 1rem; }
          @media (min-width: 1280px) { .container { max-width: 1280px; } }
          .text-center { text-align: center; }
          .font-bold { font-weight: 700; }
          .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          @media (min-width: 768px) { .md\\:text-5xl { font-size: 3rem; line-height: 1; } }
          @media (min-width: 1024px) { .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; } }
          img { max-width: 100%; height: auto; display: block; }
          .w-\\[156px\\] { width: 156px; }
          .h-\\[80px\\] { height: 80px; }
        ` }} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://svgai.supabase.co" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/laurel.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/star.svg" as="image" type="image/svg+xml" />

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
        
        {/* Prefetch critical resources */}
        <link rel="prefetch" href="/api/generate-svg" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/api/convert" as="fetch" crossOrigin="anonymous" />
        
        {/* Resource hints for critical CSS */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        
        {/* Module preload for critical JS */}
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
        <link rel="modulepreload" href="/_next/static/chunks/framework.js" />
        <link rel="modulepreload" href="/_next/static/chunks/main.js" />
        
        {/* WebSite and Organization structured data */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://svgai.org/#website",
                "name": "SVG AI",
                "alternateName": "SVGAI",
                "url": "https://svgai.org/",
                "description": "Transform your ideas into stunning SVG graphics instantly with our AI-powered generator. Create logos, icons, and illustrations from simple text descriptions.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://svgai.org/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://svgai.org/#organization",
                "name": "SVG AI",
                "url": "https://svgai.org/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://svgai.org/logo.svg",
                  "width": 156,
                  "height": 80
                },
                "sameAs": [
                  "https://twitter.com/svgai_app",
                  "https://github.com/svgai"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "email": "support@svgai.org",
                  "availableLanguage": ["English"]
                }
              }
            ]
          }
        `}</script>
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
          <WebVitalsReporter />
          <ServiceWorkerProvider />
          <ErrorInterceptor />
        </Providers>
      </body>
    </html>
  )
}
