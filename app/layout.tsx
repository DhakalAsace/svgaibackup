import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from "./providers"
import Footer from "@/components/footer"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { NavbarWrapper } from '@/components/client-wrappers';

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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

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
        
        {/* WebSite structured data for Google site name */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": ["WebSite", "SoftwareApplication"],
            "name": "SVG AI",
            "url": "https://svgai.org/",
            "applicationCategory": "WebApplication",
            "operatingSystem": "All",
            "description": "Transform your ideas into stunning SVG graphics instantly with our AI-powered generator. Create logos, icons, and illustrations from simple text descriptions.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        `}</script>
      </head>
      <body className={`font-sans bg-brand/30`} suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavbarWrapper />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
