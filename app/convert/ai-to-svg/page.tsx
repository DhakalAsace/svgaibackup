import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'AI to SVG Converter - Adobe Illustrator to SVG | SVG AI',
  description: 'Convert Adobe Illustrator AI files to SVG format online. Preserve vector quality with our free AI to SVG converter. Supports artboards and maintains layer structure.',
  keywords: ['ai to svg', 'ai to svg converter', 'adobe illustrator to svg', 'convert ai to svg', 'illustrator svg export', 'ai file to svg', 'free ai to svg', 'ai svg conversion', 'vector ai to svg', 'illustrator to web format', 'ai to svg online', 'convert illustrator file'],
  openGraph: {
    title: 'AI to SVG Converter - Adobe Illustrator to SVG Free',
    description: 'Convert AI files to SVG format instantly. Free, fast, and secure online converter for Adobe Illustrator files.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI to SVG Converter - Adobe Illustrator to SVG',
    description: 'Convert AI files to SVG format instantly. Free online tool.',
  }
}

export default function AItoSVGPage() {
  return (
    <ConverterPage
      fromFormat="AI"
      toFormat="SVG"
      title="AI to SVG Converter"
      monthlySearches={1000}
    />
  )
}