import { Metadata } from 'next'
import ConverterPage from '@/components/converters/converter-page'

export const metadata: Metadata = {
  title: 'SVG to PNG Converter - Free Online Conversion Tool | SVG AI',
  description: 'Convert SVG to PNG instantly with our free online converter. No signup required. High-quality conversions with advanced options.',
  keywords: ['svg to png', 'svg to png converter', 'convert svg to png', 'svg2png', 'free svg to png'],
  openGraph: {
    title: 'SVG to PNG Converter - Free Online Tool',
    description: 'Convert SVG files to PNG format instantly. Free, fast, and secure online converter.',
  }
}

export default function SVGtoPNGPage() {
  return (
    <ConverterPage
      fromFormat="svg"
      toFormat="png"
      title="SVG to PNG Converter"
      monthlySearches={14800}
    />
  )
}
