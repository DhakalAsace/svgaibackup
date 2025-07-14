import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Free Online File Converters - 40+ Format Conversions | SVG AI',
  description: 'Convert between 40+ file formats instantly. PNG to SVG, SVG to PNG, JPG to SVG, and more. All converters are free, fast, and work in your browser.',
  keywords: ['file converter', 'online converter', 'free converter', 'image converter', 'svg converter', 'png converter']
}

const converters = [
  {
    "from": "png",
    "to": "svg",
    "searches": 40500,
    "slug": "png-to-svg"
  },
  {
    "from": "png",
    "to": "jpg",
    "searches": 9900,
    "slug": "png-to-jpg"
  },
  {
    "from": "png",
    "to": "ico",
    "searches": 6600,
    "slug": "png-to-ico"
  },
  {
    "from": "png",
    "to": "pdf",
    "searches": 3650,
    "slug": "png-to-pdf"
  },
  {
    "from": "svg",
    "to": "png",
    "searches": 14800,
    "slug": "svg-to-png"
  },
  {
    "from": "svg",
    "to": "jpg",
    "searches": 5400,
    "slug": "svg-to-jpg"
  },
  {
    "from": "svg",
    "to": "pdf",
    "searches": 2220,
    "slug": "svg-to-pdf"
  },
  {
    "from": "svg",
    "to": "ai",
    "searches": 1900,
    "slug": "svg-to-ai"
  },
  {
    "from": "svg",
    "to": "eps",
    "searches": 1600,
    "slug": "svg-to-eps"
  },
  {
    "from": "svg",
    "to": "dxf",
    "searches": 880,
    "slug": "svg-to-dxf"
  },
  {
    "from": "svg",
    "to": "ico",
    "searches": 770,
    "slug": "svg-to-ico"
  },
  {
    "from": "jpg",
    "to": "svg",
    "searches": 8100,
    "slug": "jpg-to-svg"
  },
  {
    "from": "jpg",
    "to": "png",
    "searches": 8100,
    "slug": "jpg-to-png"
  },
  {
    "from": "jpg",
    "to": "pdf",
    "searches": 5400,
    "slug": "jpg-to-pdf"
  },
  {
    "from": "jpg",
    "to": "ico",
    "searches": 2220,
    "slug": "jpg-to-ico"
  },
  {
    "from": "jpg",
    "to": "webp",
    "searches": 1300,
    "slug": "jpg-to-webp"
  },
  {
    "from": "pdf",
    "to": "svg",
    "searches": 4400,
    "slug": "pdf-to-svg"
  },
  {
    "from": "eps",
    "to": "svg",
    "searches": 3350,
    "slug": "eps-to-svg"
  },
  {
    "from": "ai",
    "to": "svg",
    "searches": 2900,
    "slug": "ai-to-svg"
  },
  {
    "from": "webp",
    "to": "svg",
    "searches": 1900,
    "slug": "webp-to-svg"
  },
  {
    "from": "webp",
    "to": "png",
    "searches": 2400,
    "slug": "webp-to-png"
  },
  {
    "from": "webp",
    "to": "jpg",
    "searches": 1000,
    "slug": "webp-to-jpg"
  },
  {
    "from": "bmp",
    "to": "svg",
    "searches": 1300,
    "slug": "bmp-to-svg"
  },
  {
    "from": "ico",
    "to": "svg",
    "searches": 1000,
    "slug": "ico-to-svg"
  },
  {
    "from": "ico",
    "to": "png",
    "searches": 14800,
    "slug": "ico-to-png"
  },
  {
    "from": "ico",
    "to": "jpg",
    "searches": 590,
    "slug": "ico-to-jpg"
  },
  {
    "from": "gif",
    "to": "svg",
    "searches": 720,
    "slug": "gif-to-svg"
  },
  {
    "from": "tiff",
    "to": "svg",
    "searches": 590,
    "slug": "tiff-to-svg"
  },
  {
    "from": "psd",
    "to": "svg",
    "searches": 480,
    "slug": "psd-to-svg"
  },
  {
    "from": "dxf",
    "to": "svg",
    "searches": 390,
    "slug": "dxf-to-svg"
  },
  {
    "from": "heic",
    "to": "svg",
    "searches": 320,
    "slug": "heic-to-svg"
  },
  {
    "from": "heic",
    "to": "png",
    "searches": 590,
    "slug": "heic-to-png"
  },
  {
    "from": "heic",
    "to": "jpg",
    "searches": 880,
    "slug": "heic-to-jpg"
  },
  {
    "from": "avif",
    "to": "png",
    "searches": 210,
    "slug": "avif-to-png"
  },
  {
    "from": "avif",
    "to": "jpg",
    "searches": 170,
    "slug": "avif-to-jpg"
  },
  {
    "from": "jfif",
    "to": "png",
    "searches": 210,
    "slug": "jfif-to-png"
  },
  {
    "from": "jfif",
    "to": "jpg",
    "searches": 170,
    "slug": "jfif-to-jpg"
  }
]

export default function ConvertersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Free Online File Converters</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Convert between 40+ file formats instantly. All converters work directly in your browser - no uploads required.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {converters.map((converter) => (
          <Link key={converter.slug} href={`/converters/${converter.slug}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                {converter.from.toUpperCase()} to {converter.to.toUpperCase()}
              </h2>
              <p className="text-muted-foreground">
                Convert {converter.from.toUpperCase()} files to {converter.to.toUpperCase()} format
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {converter.searches.toLocaleString()} monthly searches
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
