import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JPG to WEBP Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JPG to WEBP instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jpg to webp', 'jpg to webp converter', 'convert jpg to webp', 'jpg2webp', 'free jpg to webp'],
  openGraph: {
    title: 'JPG to WEBP Converter - Free Online Tool',
    description: 'Convert JPG files to WEBP format instantly. Free, fast, and secure online converter.',
  }
}

export default function JPGtoWEBPPage() {
  return (
    <ConverterPage
      fromFormat="jpg"
      toFormat="webp"
      title="JPG to WEBP Converter"
      monthlySearches={1300}
    />
  )
}
