import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JPG to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JPG to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jpg to png', 'jpg to png converter', 'convert jpg to png', 'jpg2png', 'free jpg to png'],
  openGraph: {
    title: 'JPG to PNG Converter - Free Online Tool',
    description: 'Convert JPG files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function JPGtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="jpg"
      toFormat="png"
      title="JPG to PNG Converter"
      monthlySearches={8100}
    />
  )
}
