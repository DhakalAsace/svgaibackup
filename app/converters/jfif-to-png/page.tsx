import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JFIF to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JFIF to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jfif to png', 'jfif to png converter', 'convert jfif to png', 'jfif2png', 'free jfif to png'],
  openGraph: {
    title: 'JFIF to PNG Converter - Free Online Tool',
    description: 'Convert JFIF files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function JFIFtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="jfif"
      toFormat="png"
      title="JFIF to PNG Converter"
      monthlySearches={210}
    />
  )
}
