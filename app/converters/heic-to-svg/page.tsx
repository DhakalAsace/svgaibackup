import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'HEIC to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert HEIC to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['heic to svg', 'heic to svg converter', 'convert heic to svg', 'heic2svg', 'free heic to svg'],
  openGraph: {
    title: 'HEIC to SVG Converter - Free Online Tool',
    description: 'Convert HEIC files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function HEICtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="heic"
      toFormat="svg"
      title="HEIC to SVG Converter"
      monthlySearches={320}
    />
  )
}
