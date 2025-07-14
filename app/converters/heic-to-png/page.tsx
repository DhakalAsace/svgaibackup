import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'HEIC to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert HEIC to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['heic to png', 'heic to png converter', 'convert heic to png', 'heic2png', 'free heic to png'],
  openGraph: {
    title: 'HEIC to PNG Converter - Free Online Tool',
    description: 'Convert HEIC files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function HEICtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="heic"
      toFormat="png"
      title="HEIC to PNG Converter"
      monthlySearches={590}
    />
  )
}
