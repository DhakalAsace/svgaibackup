import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SVG AI - Free Online Converters',
    default: 'Free Online Converters - Convert SVG, PNG, JPG & More | SVG AI'
  },
  description: 'Convert between SVG and 40+ image formats with our free online converters. Fast, secure, and no signup required. PNG to SVG, SVG to PNG, and more.',
  keywords: ['svg converter', 'image converter', 'free converter', 'online converter', 'png to svg', 'svg to png', 'jpg to svg', 'svg to jpg', 'convert svg', 'convert png'],
  openGraph: {
    title: 'Free Online Converters - Convert SVG, PNG, JPG & More',
    description: 'Convert between SVG and 40+ image formats with our free online tools. Fast, secure, and no signup required.',
    type: 'website',
    siteName: 'SVG AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Converters - Convert SVG, PNG, JPG & More',
    description: 'Convert between SVG and 40+ image formats with our free online tools.',
  },
}

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}