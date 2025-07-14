import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'JPG to SVG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert JPG to SVG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['jpg to svg', 'jpg to svg converter', 'convert jpg to svg', 'jpg2svg', 'free jpg to svg'],
  openGraph: {
    title: 'JPG to SVG Converter - Free Online Tool',
    description: 'Convert JPG files to SVG format instantly. Free, fast, and secure online converter.',
  }
}

export default function JPGtoSVGPage() {
  return (
    <ConverterPage
      fromFormat="jpg"
      toFormat="svg"
      title="JPG to SVG Converter"
      monthlySearches={8100}
    />
  )
}
