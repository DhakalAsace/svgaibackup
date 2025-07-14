import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'WEBP to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert WEBP to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['webp to png', 'webp to png converter', 'convert webp to png', 'webp2png', 'free webp to png'],
  openGraph: {
    title: 'WEBP to PNG Converter - Free Online Tool',
    description: 'Convert WEBP files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function WEBPtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="webp"
      toFormat="png"
      title="WEBP to PNG Converter"
      monthlySearches={2400}
    />
  )
}
