import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'WEBP to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert WEBP to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['webp to svg', 'webp to svg converter', 'convert webp to svg', 'webp2svg', 'free webp to svg'],
  openGraph: {
    title: 'WEBP to SVG Converter - Free Online Tool',
    description: 'Convert WEBP files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function WEBPtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="webp"
      toFormat="svg"
      title="WEBP to SVG Converter"
      monthlySearches={1900}
    />
  )
}
