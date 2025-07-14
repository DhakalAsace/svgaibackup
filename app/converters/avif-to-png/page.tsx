import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'AVIF to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert AVIF to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['avif to png', 'avif to png converter', 'convert avif to png', 'avif2png', 'free avif to png'],
  openGraph: {
    title: 'AVIF to PNG Converter - Free Online Tool',
    description: 'Convert AVIF files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function AVIFtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="avif"
      toFormat="png"
      title="AVIF to PNG Converter"
      monthlySearches={210}
    />
  )
}
